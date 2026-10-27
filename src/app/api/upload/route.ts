import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILES_PER_REQUEST = 6;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_SHARP_FORMATS = new Set(['jpeg', 'png', 'webp']);

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }
  return { cloudName, apiKey, apiSecret };
}

async function uploadToCloudinary(
  dataUri: string,
  config: { cloudName: string; apiKey: string; apiSecret: string }
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'jamila/products';
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const form = new FormData();
  form.append('file', dataUri);
  form.append('api_key', config.apiKey);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: 'POST',
      body: form,
    }
  );

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed with status ${res.status}`);
  }

  const data = (await res.json()) as { secure_url?: unknown };
  if (typeof data?.secure_url !== 'string' || !data.secure_url) {
    throw new Error('Cloudinary response did not include a valid secure_url');
  }

  return data.secure_url;
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const cloudinaryConfig = getCloudinaryConfig();

  // In production / Vercel, Cloudinary MUST be configured — never fall back to Base64 in MongoDB.
  if (isProduction && !cloudinaryConfig) {
    return NextResponse.json(
      {
        success: false,
        message:
          'خدمة رفع الصور السحابية (Cloudinary) غير مهيأة في بيئة الإنتاج. يرجى ضبط متغيرات البيئة الخاصة بـ Cloudinary.',
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
              'صيغة الملف غير مدعومة، يرجى رفع صور بصيغة JPG أو PNG أو WebP فقط',
          },
          { status: 400 }
        );
      }

      if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message:
              'حجم الصورة يتجاوز الحد المسموح (٥ ميجابايت كحد أقصى لكل صورة)',
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Verify actual image header & dimensions using sharp
      const metadata = await sharp(buffer)
        .metadata()
        .catch(() => null);
      if (
        !metadata ||
        !metadata.format ||
        !ALLOWED_SHARP_FORMATS.has(metadata.format) ||
        !metadata.width ||
        !metadata.height ||
        metadata.width > 8000 ||
        metadata.height > 8000
      ) {
        return NextResponse.json(
          { success: false, message: 'ملف الصورة غير صالح أو تالف' },
          { status: 400 }
        );
      }

      const webpBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1000, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const dataUrl = `data:image/webp;base64,${webpBuffer.toString('base64')}`;

      if (cloudinaryConfig) {
        // When Cloudinary is configured (and always in production), upload to Cloudinary or fail with 502/500
        const cloudinaryUrl = await uploadToCloudinary(dataUrl, cloudinaryConfig);
        urls.push(cloudinaryUrl);
      } else {
        // Local development fallback only (when NODE_ENV !== 'production' and Cloudinary is not configured)
        urls.push(dataUrl);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصور بنجاح',
      urls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'فشل رفع الصور إلى الخدمة السحابية، يرجى المحاولة مرة أخرى',
      },
      { status: 500 }
    );
  }
}
