import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { services } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const serviceId = parseInt((await params).id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);
    if (!service.length) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const serviceId = parseInt((await params).id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedData = await request.json();
    await db
      .update(services)
      .set(updatedData)
      .where(eq(services.id, serviceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const serviceId = parseInt((await params).id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await db.delete(services).where(eq(services.id, serviceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}