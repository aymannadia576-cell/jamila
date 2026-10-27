import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import ProductModel from '@/models/Product';

const ALLOWED_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

function isValidStatus(val: unknown): val is OrderStatus {
  return typeof val === 'string' && (ALLOWED_STATUSES as readonly string[]).includes(val);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;
    const nextStatus = body?.status;

    if (!isValidStatus(nextStatus)) {
      return NextResponse.json(
        { success: false, message: 'حالة الطلب غير صالحة' },
        { status: 400 }
      );
    }

    const existingOrder = await OrderModel.findOne({ id });
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    const previousStatus = existingOrder.status;

    // No-op if status is unchanged
    if (previousStatus === nextStatus) {
      return NextResponse.json({ success: true, order: existingOrder });
    }

    // Transition from 'cancelled' back to an active status:
    // Must atomically re-decrement product stock first so repeated toggling can never inflate stock.
    if (previousStatus === 'cancelled' && nextStatus !== 'cancelled') {
      const decremented: Array<{ productId: string; quantity: number }> = [];

      for (const item of existingOrder.items || []) {
        if (!item.productId || item.quantity <= 0) continue;

        const updatedProduct = await ProductModel.findOneAndUpdate(
          {
            id: item.productId,
            $or: [{ stock: { $gte: item.quantity } }, { stock: { $exists: false } }],
          },
          [
            {
              $set: {
                stock: {
                  $max: [0, { $subtract: [{ $ifNull: ['$stock', 10] }, item.quantity] }],
                },
              },
            },
          ],
          { new: true }
        );

        if (!updatedProduct) {
          // Roll back any partial stock decrements
          for (const dec of decremented) {
            await ProductModel.updateOne(
              { id: dec.productId },
              { $inc: { stock: dec.quantity } }
            );
          }
          return NextResponse.json(
            {
              success: false,
              message:
                'عذراً، لا يمكن إعادة تفعيل هذا الطلب الملغي نظراً لعدم توفر كمية كافية في المخزون',
            },
            { status: 400 }
          );
        }

        decremented.push({ productId: item.productId, quantity: item.quantity });
      }
    }

    existingOrder.status = nextStatus;
    await existingOrder.save();

    // Transition from an active status to 'cancelled': restore stock once
    if (previousStatus !== 'cancelled' && nextStatus === 'cancelled') {
      for (const item of existingOrder.items || []) {
        if (item.productId && item.quantity > 0) {
          await ProductModel.updateOne(
            { id: item.productId },
            { $inc: { stock: item.quantity } }
          );
        }
      }
    }

    return NextResponse.json({ success: true, order: existingOrder });
  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل تحديث حالة الطلب' },
      { status: 500 }
    );
  }
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
    await OrderModel.findOneAndDelete({ id });
    return NextResponse.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('DELETE /api/orders/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل حذف الطلب' },
      { status: 500 }
    );
  }
}
