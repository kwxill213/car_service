import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';
import { appointments, services, users } from '@/drizzle/schema';
import db from '@/drizzle';

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const user = auth.user;

  try {
    const userAppointments = await db
      .select({
        id: appointments.id,
        serviceId: services.id,
        serviceName: services.name,
        employeeId: users.id,
        employeeName: users.name,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        statusId: appointments.statusId,
        notes: appointments.notes,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(users, eq(appointments.employeeId, users.id))
      // добавьте нужные соединения
      .where(eq(appointments.clientId, user.id))
      .orderBy(desc(appointments.startTime));

    return NextResponse.json(userAppointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
