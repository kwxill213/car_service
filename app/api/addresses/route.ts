import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { addresses } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.isActive, true));

    return NextResponse.json(allAddresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить адреса' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, address, city, phone } = await request.json();

    if (!name || !address || !city) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const [newAddress] = await db
      .insert(addresses)
      .values({
        name,
        address,
        city,
        phone,
        isActive: true,
      })
      .$returningId();

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Не удалось создать адрес' },
      { status: 500 }
    );
  }
}
