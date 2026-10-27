import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILES_PER_REQUEST = 6;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
]);
const ALLOWED_SHARP_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif', 'heif']);

function cleanEnvValue(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPreset?: string;
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  let cloudName = cleanEnvValue(
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_NAME
  );
  let apiKey = cleanEnvValue(
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  );
  let apiSecret = cleanEnvValue(
    process.env.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_SECRET
  );
  const uploadPreset = cleanEnvValue(
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  // If individual variables are missing, attempt to parse CLOUDINARY_URL
  // Standard format: cloudinary://<api_key>:<api_secret>@<cloud_name>
  const cloudinaryUrl = cleanEnvValue(process.env.CLOUDINARY_URL);
  if ((!cloudName || !apiKey || !apiSecret) && cloudinaryUrl) {
    try {
      const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        apiKey = apiKey || match[1];
        apiSecret = apiSecret || match[2];
        cloudName = cloudName || match[3].split('/')[0];
      }
    } catch (e) {
      console.warn('Could not parse CLOUDINARY_URL:', e);
    }
  }

  // Must have a cloud name and either (apiKey + apiSecret) or uploadPreset
  if (!cloudName || ((!apiKey || !apiSecret) && !uploadPreset)) {
    return null;
  }

  return { cloudName, apiKey, apiSecret, uploadPreset };
}

async function uploadToCloudinary(
  webpBuffer: Buffer,
  config: CloudinaryConfig
): Promise<string> {
  const form = new FormData();
  const blob = new Blob([new Uint8Array(webpBuffer)], { type: 'image/webp' });
  form.append('file', blob, 'product.webp');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'jamila/products';

  if (config.uploadPreset) {
    form.append('upload_preset', config.uploadPreset);
  }

  if (config.apiKey && config.apiSecret) {
    // Cloudinary signature parameters must be sorted alphabetically: folder, timestamp
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${config.apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    form.append('api_key', config.apiKey);
    form.append('timestamp', timestamp);
    form.append('folder', folder);
    form.append('signature', signature);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    {
      method: 'POST',
      body: form,
    }
  );

  if (!res.ok) {
    const errorJson = (await res.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    const errorMsg =
      errorJson?.error?.message ||
      (await res.text().catch(() => '')) ||
      `HTTP status ${res.status}`;
    console.error('Cloudinary API upload error details:', res.status, errorMsg);
    throw new Error(`Cloudinary (${res.status}): ${errorMsg}`);
  }

  const data = (await res.json()) as { secure_url?: unknown; url?: unknown };
  const secureUrl =
    typeof data?.secure_url === 'string' && data.secure_url
      ? data.secure_url
      : typeof data?.url === 'string' && data.url
      ? data.url
      : null;

  if (!secureUrl) {
    throw new Error('Cloudinary response did not include a valid image URL');
  }

  return secureUrl;
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const cloudinaryConfig = getCloudinaryConfig();

  // In production / Vercel, Cloudinary MUST be configured — never fall back to local/Base64.
  if (isProduction && !cloudinaryConfig) {
    return NextResponse.json(
      {
        success: false,
        message:
          'خدمة Cloudinary غير مهيأة في بيئة Vercel. يرجى إضافة CLOUDINARY_CLOUD_NAME و CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET (أو CLOUDINARY_URL) في إعدادات البيئة بـ Vercel.',
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لم يتم اختيار أي صور للرفع' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        {
          success: false,
          message: `الحد الأقصى للرفع هو ${MAX_FILES_PER_REQUEST} صور في المرة الواحدة`,
        },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== 'function') {
        continue;
      }

      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              'صيغة الملف غير مدعومة، يرجى رفع صور بصيغة JPG أو PNG أو WebP أو AVIF فقط',
          },
          { status: 400 }
        );
      }

      if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message:
              'حجم الصورة يتجاوز الحد المسموح (١٠ ميجابايت كحد أقصى لكل صورة)',
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Verify image header & dimensions using sharp
      const metadata = await sharp(buffer)
        .metadata()
        .catch(() => null);
      if (
        !metadata ||
        !metadata.format ||
        !ALLOWED_SHARP_FORMATS.has(metadata.format) ||
        !metadata.width ||
        !metadata.height ||
        metadata.width > 9000 ||
        metadata.height > 9000
      ) {
        return NextResponse.json(
          { success: false, message: 'ملف الصورة غير صالح أو تالف' },
          { status: 400 }
        );
      }

      // Optimize and resize image to WebP with sensible resolution
      const webpBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toBuffer();

      if (cloudinaryConfig) {
        // Upload binary buffer directly to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(webpBuffer, cloudinaryConfig);
        urls.push(cloudinaryUrl);
      } else {
        // Development fallback only
        const dataUrl = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
        urls.push(dataUrl);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصور بنجاح',
      urls,
    });
  } catch (error) {
    console.error('Upload error in POST /api/upload:', error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: `فشل رفع الصور إلى الخدمة السحابية: ${detail}`,
      },
      { status: 500 }
    );
  }
}
