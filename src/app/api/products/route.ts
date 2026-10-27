import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';
import { products as initialProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

const VALID_STUDIO_IMAGES = [
  '/products/product-1.png',
  '/products/product-2.png',
  '/products/product-3.png',
  '/products/abaya-1.png',
  '/products/abaya-2.png',
  '/products/abaya-3.png',
];

function normalizeImage(img?: unknown): string {
  if (!img || typeof img !== 'string') return '/products/product-1.png';
  const trimmed = img.trim();
  if (
    VALID_STUDIO_IMAGES.includes(trimmed) ||
    /^\/(products|images)\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(trimmed) ||
    trimmed.startsWith('https://res.cloudinary.com/') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }
  if (trimmed.includes('2')) return '/products/product-2.png';
  if (trimmed.includes('3')) return '/products/product-3.png';
  return '/products/product-1.png';
}

interface RawProductLike {
  toObject?: () => Record<string, unknown>;
  id?: string;
  name?: string;
  tag?: string;
  price?: number;
  category?: string;
  image?: string;
  gallery?: unknown[];
  fabric?: string;
  description?: string;
  bestSeller?: boolean;
  svgVariant?: string;
  sizes?: unknown[];
  features?: unknown[];
  stock?: number;
}

function serializeProduct(doc: IProduct | RawProductLike) {
  const obj = typeof doc.toObject === 'function' ? (doc.toObject() as RawProductLike) : doc;
  const image = normalizeImage(obj.image);
  const rawGallery =
    Array.isArray(obj.gallery) && obj.gallery.length > 0
      ? obj.gallery.map(normalizeImage)
      : [image];
  const gallery = Array.from(new Set([image, ...rawGallery]));

  return {
    id: String(obj.id || ''),
    name: String(obj.name || ''),
    tag: obj.tag || 'حرير فاخر',
    price: Number(obj.price) || 1850,
    category: obj.category === 'إسدالات' ? 'إسدالات' : 'عبايات',
    image,
    gallery,
    fabric: obj.fabric || 'حرير طبيعي ١٠٠٪',
    description: obj.description || '',
    bestSeller: Boolean(obj.bestSeller),
    svgVariant: obj.svgVariant || 'qamar',
    sizes:
      Array.isArray(obj.sizes) && obj.sizes.length > 0
        ? obj.sizes.map((s) => String(s).trim()).filter(Boolean)
        : ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features:
      Array.isArray(obj.features) && obj.features.length > 0
        ? obj.features.map((f) => String(f).trim()).filter(Boolean)
        : ['قصة انسيابية راقية', 'تأتي مع طرحة متناسقة'],
    stock:
      typeof obj.stock === 'number' && !Number.isNaN(obj.stock)
        ? Math.max(0, obj.stock)
        : 10,
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    let docs = await ProductModel.find({}).sort({ createdAt: -1 });

    if (!docs || docs.length === 0) {
      try {
        await ProductModel.insertMany(initialProducts, { ordered: false });
      } catch (seedErr: unknown) {
        const code = (seedErr as { code?: number })?.code;
        if (code !== 11000) {
          console.warn('Initial products seed warning in GET /api/products:', seedErr);
        }
      }
      docs = await ProductModel.find({}).sort({ createdAt: -1 });
    }

    const products = docs.map(serializeProduct);

    return NextResponse.json(
      { success: true, products },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب المنتجات' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;

    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 150) : '';
    const price = Number(body?.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال اسم المنتج وسعر صالح' },
        { status: 400 }
      );
    }

    const productId =
      typeof body?.id === 'string' && /^[a-zA-Z0-9_-]{2,40}$/.test(body.id)
        ? body.id
        : `jm-${Date.now().toString().slice(-4)}`;

    const rawGallery =
      Array.isArray(body?.gallery) && body.gallery.length > 0
        ? body.gallery.slice(0, 10).map(normalizeImage)
        : [normalizeImage(body?.image)];
    const image = normalizeImage(body?.image || rawGallery[0]);
    const gallery = Array.from(new Set([image, ...rawGallery]));

    const newProduct = await ProductModel.create({
      id: productId,
      name,
      tag: typeof body?.tag === 'string' && body.tag.trim() ? body.tag.trim().slice(0, 100) : 'حرير فاخر',
      price,
      category: body?.category === 'إسدالات' ? 'إسدالات' : 'عبايات',
      image,
      gallery,
      fabric:
        typeof body?.fabric === 'string' && body.fabric.trim()
          ? body.fabric.trim().slice(0, 200)
          : 'حرير طبيعي ١٠٠٪',
      description:
        typeof body?.description === 'string' ? body.description.trim().slice(0, 1500) : '',
      bestSeller: Boolean(body?.bestSeller),
      svgVariant: typeof body?.svgVariant === 'string' ? body.svgVariant : 'qamar',
      sizes:
        Array.isArray(body?.sizes) && body.sizes.length > 0
          ? body.sizes.map((s) => String(s).trim().slice(0, 20)).filter(Boolean)
          : ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      features:
        Array.isArray(body?.features) && body.features.length > 0
          ? body.features.map((f) => String(f).trim().slice(0, 150)).filter(Boolean)
          : ['قصة انسيابية راقية', 'تأتي مع طرحة متناسقة'],
      stock:
        body?.stock !== undefined && body?.stock !== '' && !Number.isNaN(Number(body.stock))
          ? Math.max(0, Math.floor(Number(body.stock)))
          : 10,
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      product: serializeProduct(newProduct),
    });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل إضافة المنتج' },
      { status: 500 }
    );
  }
}
