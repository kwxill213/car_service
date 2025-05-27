import db from '@/drizzle';
import { contactSubmissions } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, userId } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        name,
        email,
        phone: phone || null,
        message,
        userId: userId || null,
        status: 'new',
      })
      .$returningId();

    return NextResponse.json({ 
      success: true, 
      submission,
      message: 'Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.'
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
}
