// app/api/admin/dashboard-stats/route.ts
import { and, count, gt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import db from '@/drizzle/index';
import { appointments, users, services, reviews, contactSubmissions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const [
      totalAppointments,
      newAppointments,
      totalEmployees,
      totalServices,
      totalReviews,
      newMessages
    ] = await Promise.all([
      db.select({ count: count() })
        .from(appointments),
      
      db.select({ count: count() })
        .from(appointments)
        .where(eq(appointments.statusId, 1)),
      
      db.select({ count: count() })
        .from(users)
        .where(eq(users.roleId, 3)),
      
      db.select({ count: count() })
        .from(services)
        .where(eq(services.isActive, true)),
      
      db.select({ count: count() })
        .from(reviews),
      
      db.select({ count: count() })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.status, 'new'))
    ]);

    return NextResponse.json({
      appointments: totalAppointments[0].count,
      newAppointments: newAppointments[0].count,
      employees: totalEmployees[0].count,
      services: totalServices[0].count,
      reviews: totalReviews[0].count,
      messages: newMessages[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}