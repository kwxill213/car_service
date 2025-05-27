import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { and, eq, or, desc, gte, lte } from 'drizzle-orm';
import { appointments, services, users, addresses, reviews } from '@/drizzle/schema';
import db from '@/drizzle';
import { addMinutes, isBefore, isAfter } from 'date-fns';

async function findAvailableMechanic(startTime: Date, endTime: Date) {
  const mechanics = await db
    .select()
    .from(users)
    .where(eq(users.roleId, 3));

  if (mechanics.length === 0) {
    return null;
  }

  for (const mechanic of mechanics) {
    const overlappingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.employeeId, mechanic.id),
          or(
            and(
              gte(appointments.startTime, startTime),
              lte(appointments.startTime, endTime)
            ),
            and(
              gte(appointments.endTime, startTime),
              lte(appointments.endTime, endTime)
            ),
            and(
              lte(appointments.startTime, startTime),
              gte(appointments.endTime, endTime)
            )
          )
        )
      );

    if (overlappingAppointments.length === 0) {
      return mechanic;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { serviceId, startTime, endTime, notes, addressId } = await request.json();

    if (!serviceId || !startTime || !endTime || !addressId) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }
    
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Неверный формат даты' },
        { status: 400 }
      );
    }

    const [address] = await db
      .select()
      .from(addresses)
      .where(
        and(
          eq(addresses.id, addressId),
          eq(addresses.isActive, true)
        )
      )
      .limit(1);

    if (!address) {
      return NextResponse.json(
        { error: 'Выбранный адрес не найден' },
        { status: 404 }
      );
    }

    const serviceResults = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));

    const service = serviceResults[0];

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    if (isBefore(startDate, new Date())) {
      return NextResponse.json(
        { error: 'Невозможно записаться на прошедшую дату' },
        { status: 400 }
      );
    }

    const hour = startDate.getHours();
    if (hour < 9 || hour >= 20) {
      return NextResponse.json(
        { error: 'Время работы сервиса с 09:00 до 20:00' },
        { status: 400 }
      );
    }

    if (endDate.getHours() >= 20) {
      return NextResponse.json(
        { error: 'Выбранное время выходит за пределы рабочего дня' },
        { status: 400 }
      );
    }

    const availableMechanic = await findAvailableMechanic(startDate, endDate);

    if (!availableMechanic) {
      return NextResponse.json(
        { error: 'Нет свободных мастеров на выбранное время' },
        { status: 400 }
      );
    }

    const overlappingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.employeeId, availableMechanic.id),
          or(
            and(
              gte(appointments.startTime, startDate),
              lte(appointments.startTime, endDate)
            ),
            and(
              gte(appointments.endTime, startDate),
              lte(appointments.endTime, endDate)
            ),
            and(
              lte(appointments.startTime, startDate),
              gte(appointments.endTime, endDate)
            )
          )
        )
      );

    if (overlappingAppointments.length > 0) {
      return NextResponse.json(
        { error: 'Выбранное время уже занято' },
        { status: 400 }
      );
    }

    const [newAppointment] = await db
      .insert(appointments)
      .values({
        clientId: auth.user.id,
        serviceId,
        employeeId: availableMechanic.id,
        addressId,
        statusId: 1,
        startTime: startDate,
        endTime: endDate,
        notes,
      })
      .$returningId();

    const appointmentWithDetails = {
      ...newAppointment,
      address
    };

    return NextResponse.json(appointmentWithDetails, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    return NextResponse.json(
      { error: 'Не удалось создать запись' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const userAppointments = await db
    .select({
      id: appointments.id,
      serviceId: appointments.serviceId,
      serviceName: services.name,
      employeeId: appointments.employeeId,
      employeeName: users.name,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      notes: appointments.notes,
      status: appointments.statusId,
      statusId: appointments.statusId,
      addressId: appointments.addressId,
      address: {
        id: addresses.id,
        name: addresses.name,
        address: addresses.address,
        city: addresses.city,
        phone: addresses.phone,
      },
      review: {
        rating: reviews.rating,
        comment: reviews.comment,
      },
    })
    .from(appointments)
    .leftJoin(services, eq(appointments.serviceId, services.id))
    .leftJoin(users, eq(appointments.employeeId, users.id))
    .leftJoin(addresses, eq(appointments.addressId, addresses.id))
    .leftJoin(reviews, eq(appointments.id, reviews.appointmentId))
    .where(eq(appointments.clientId, auth.user.id))
    .orderBy(desc(appointments.startTime));

    return NextResponse.json({ appointments: userAppointments });
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    return NextResponse.json(
      { error: 'Не удалось получить список записей' },
      { status: 500 }
    );
  }
}
