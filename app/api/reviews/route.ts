// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { reviews, appointments } from '@/drizzle/schema';
import db from '@/drizzle';
import { and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { appointmentId, rating, comment } = await request.json();

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.id, appointmentId),
          eq(appointments.statusId, 4) // 4 = Завершено
        )
      );

    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись не найдена или не завершена' },
        { status: 404 }
      );
    }

    if (appointment.clientId !== auth.user.id) {
      return NextResponse.json(
        { error: 'Вы не можете оставить отзыв на эту запись' },
        { status: 403 }
      );
    }

    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.appointmentId, appointmentId));

    if (existingReview.length > 0) {
      await db
        .update(reviews)
        .set({ rating, comment })
        .where(eq(reviews.appointmentId, appointmentId));

      const [updatedReview] = await db
        .select()
        .from(reviews)
        .where(eq(reviews.appointmentId, appointmentId));

      return NextResponse.json(updatedReview);
    } else {
      const [newReview] = await db
        .insert(reviews)
        .values({
          appointmentId,
          rating,
          comment
        })
        .$returningId();

      return NextResponse.json(newReview, { status: 201 });
    }
  } catch (error) {
    console.error('Ошибка при сохранении отзыва:', error);
    return NextResponse.json(
      { error: 'Не удалось сохранить отзыв' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Не указан ID записи' },
        { status: 400 }
      );
    }

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, parseInt(appointmentId)));

    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    if (appointment.clientId !== auth.user.id && auth.user.roleId !== 2) {
      return NextResponse.json(
        { error: 'У вас нет прав для удаления этого отзыва' },
        { status: 403 }
      );
    }

    await db
      .delete(reviews)
      .where(eq(reviews.appointmentId, parseInt(appointmentId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить отзыв' },
      { status: 500 }
    );
  }
}