// app/api/appointments/[id]/route.ts
import db from '@/drizzle';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { 
  appointments, 
  appointmentStatuses,
} from '@/drizzle/schema';
import { getAuth } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { statusId } = await request.json();
    
    if (!statusId) {
      return NextResponse.json(
        { error: 'Не указан новый статус' },
        { status: 400 }
      );
    }

    const result = await db
      .update(appointments)
      .set({ statusId })
      .where(eq(appointments.id, parseInt((await params).id)));

    const [updatedAppointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, parseInt((await params).id)));

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params:Promise<{ id: string }> }
) {
  try {
    const session = await getAuth(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const appointmentId = parseInt((await params).id);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: 'Неверный ID записи' },
        { status: 400 }
      );
    }

    const [appointment] = await db
      .select({
        id: appointments.id,
        serviceId: appointments.serviceId,
        clientId: appointments.clientId,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        statusId: appointments.statusId,
        statusName: appointmentStatuses.name,
      })
      .from(appointments)
      .leftJoin(
        appointmentStatuses,
        eq(appointments.statusId, appointmentStatuses.id)
      )
      .where(
        and(
          eq(appointments.id, appointmentId),
          eq(appointments.clientId, session.user.id)
        )
      )
      .limit(1);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params:Promise<{ id: string }> }
) {
  try {
    const updatedData = await request.json();
    await db
      .update(appointments)
      .set(updatedData)
      .where(eq(appointments.id, Number((await params).id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params:Promise<{ id: string }> }

) {
  try {
    await db
      .delete(appointments)
      .where(eq(appointments.id, Number((await params).id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}