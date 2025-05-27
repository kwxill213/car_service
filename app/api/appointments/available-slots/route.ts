import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from '@/lib/auth';
import { and, eq, gte, lte } from 'drizzle-orm';
import { appointments, services, addresses, users } from '@/drizzle/schema';
import db from '@/drizzle';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';

interface EmployeeAddress {
  employeeId: number;
  addressId: number;
}

export async function GET(request: NextRequest) {
  const auth = await getAuth(request);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const addressId = searchParams.get('addressId');

    if (!date || !serviceId || !addressId) {
      return NextResponse.json(
        { error: 'Необходимо указать дату, ID услуги и ID адреса' },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: 'Неверный формат даты' },
        { status: 400 }
      );
    }

    const serviceIdNum = parseInt(serviceId);
    const addressIdNum = parseInt(addressId);
    
    if (isNaN(serviceIdNum) || isNaN(addressIdNum)) {
      return NextResponse.json(
        { error: 'Неверный ID услуги или адреса' },
        { status: 400 }
      );
    }

    const [address] = await db
      .select()
      .from(addresses)
      .where(
        and(
          eq(addresses.id, addressIdNum),
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

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceIdNum));

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    const availableMechanics = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.roleId, 2));

    if (availableMechanics.length === 0) {
      return NextResponse.json(
        { error: 'На выбранном адресе нет доступных мастеров' },
        { status: 400 }
      );
    }

    const startOfSelectedDay = startOfDay(selectedDate);
    const endOfSelectedDay = endOfDay(selectedDate);

    const appointmentsForDay = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.startTime, startOfSelectedDay),
          lte(appointments.startTime, endOfSelectedDay)
        )
      );

    const slots: Array<{ start: string; end: string }> = [];
    const startHour = 9; 
    const endHour = 20;
    const slotDuration = 30; 


    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const start = new Date(selectedDate);
        start.setHours(hour, minute, 0, 0);
        
        const end = addMinutes(start, service.duration);

        if (end.getHours() >= endHour) continue;
  
        const isSlotAvailable = !appointmentsForDay.some((apt) => {
          const aptStart = new Date(apt.startTime);
          const aptEnd = new Date(apt.endTime);
          
          return (
            (start >= aptStart && start < aptEnd) ||
            (end > aptStart && end <= aptEnd) ||
            (start <= aptStart && end >= aptEnd)
          );
        });

        if (isSlotAvailable) {
          slots.push({
            start: start.toISOString(),
            end: end.toISOString(),
          });
        }
      }
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Ошибка при получении доступных слотов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
