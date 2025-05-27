// app/api/admin/recent-appointments/route.ts
import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import db from '@/drizzle';
import { appointments, users, services, appointmentStatuses } from '@/drizzle/schema';

export async function GET() {
  try {
    const recentAppointments = await db
      .select({
        id: appointments.id,
        clientName: users.name,
        serviceName: services.name,
        startTime: appointments.startTime,
        statusId: appointments.statusId,
        statusName: appointmentStatuses.name,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.clientId, users.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(appointmentStatuses, eq(appointments.statusId, appointmentStatuses.id))
      .orderBy(desc(appointments.createdAt))
      .limit(5);

    return NextResponse.json(recentAppointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent appointments' },
      { status: 500 }
    );
  }
}