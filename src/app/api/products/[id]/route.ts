import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';

export const dynamic = 'force-dynamic';

function normalizeImage(img?: unknown): string {
  if (!img || typeof img !== 'string') return '/products/product-1.png';
  const trimmed = img.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await ProductModel.findOne({ id });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, product: serializeProduct(product) },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب بيانات المنتج' },
      { status: 500 }
    );
  }
}

async function handleUpdate(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;

    const allowedUpdates: Record<string, unknown> = {};

    if (typeof body?.name === 'string' && body.name.trim()) {
      allowedUpdates.name = body.name.trim().slice(0, 150);
    }
    if (typeof body?.tag === 'string') {
      allowedUpdates.tag = body.tag.trim().slice(0, 100);
    }
    if (body?.price !== undefined && Number.isFinite(Number(body.price)) && Number(body.price) > 0) {
      allowedUpdates.price = Number(body.price);
    }
    if (body?.category === 'عبايات' || body?.category === 'إسدالات') {
      allowedUpdates.category = body.category;
    }
    if (typeof body?.image === 'string') {
      allowedUpdates.image = normalizeImage(body.image);
    }
    if (Array.isArray(body?.gallery) && body.gallery.length > 0) {
      allowedUpdates.gallery = body.gallery.slice(0, 10).map(normalizeImage);
    }
    if (typeof body?.fabric === 'string') {
      allowedUpdates.fabric = body.fabric.trim().slice(0, 200);
    }
    if (typeof body?.description === 'string') {
      allowedUpdates.description = body.description.trim().slice(0, 1500);
    }
    if (typeof body?.bestSeller === 'boolean') {
      allowedUpdates.bestSeller = body.bestSeller;
    }
    if (typeof body?.svgVariant === 'string') {
      allowedUpdates.svgVariant = body.svgVariant;
    }
    if (Array.isArray(body?.sizes) && body.sizes.length > 0) {
      allowedUpdates.sizes = body.sizes
        .map((s) => String(s).trim().slice(0, 20))
        .filter(Boolean);
    }
    if (Array.isArray(body?.features) && body.features.length > 0) {
      allowedUpdates.features = body.features
        .map((f) => String(f).trim().slice(0, 150))
        .filter(Boolean);
    }
    if (body?.stock !== undefined && body?.stock !== '' && !Number.isNaN(Number(body.stock))) {
      allowedUpdates.stock = Math.max(0, Math.floor(Number(body.stock)));
    }

    const updated = await ProductModel.findOneAndUpdate(
      { id },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: serializeProduct(updated) });
  } catch (error) {
    console.error('UPDATE /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل تحديث المنتج' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectToDatabase();
    const query = /^[0-9a-fA-F]{24}$/.test(id) ? { $or: [{ id }, { _id: id }] } : { id };
    await ProductModel.findOneAndDelete(query);
    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل حذف المنتج' },
      { status: 500 }
    );
  }
}
