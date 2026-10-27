import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ZoneModel from '@/models/Zone';

export const dynamic = 'force-dynamic';

async function handleUpdateZone(
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
      allowedUpdates.name = body.name.trim().slice(0, 120);
    }
    if (typeof body?.governorates === 'string' && body.governorates.trim()) {
      allowedUpdates.governorates = body.governorates.trim().slice(0, 500);
    }
    if (
      body?.shippingFee !== undefined &&
      Number.isFinite(Number(body.shippingFee)) &&
      Number(body.shippingFee) >= 0
    ) {
      allowedUpdates.shippingFee = Number(body.shippingFee);
    }
    if (typeof body?.estimatedDays === 'string' && body.estimatedDays.trim()) {
      allowedUpdates.estimatedDays = body.estimatedDays.trim().slice(0, 60);
    }
    if (typeof body?.isActive === 'boolean') {
      allowedUpdates.isActive = body.isActive;
    }

    const updated = await ZoneModel.findOneAndUpdate(
      { id },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'المنطقة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, zone: updated });
  } catch (error) {
    console.error('UPDATE /api/zones/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل تحديث منطقة التوصيل' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleUpdateZone(req, ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleUpdateZone(req, ctx);
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
    await ZoneModel.findOneAndDelete({ id });
    return NextResponse.json({ success: true, message: 'تم حذف منطقة التوصيل بنجاح' });
  } catch (error) {
    console.error('DELETE /api/zones/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل حذف منطقة التوصيل' },
      { status: 500 }
    );
  }
}
