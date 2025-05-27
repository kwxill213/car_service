import db from "@/drizzle";
import { services } from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  
    try {
      const userAppointments = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(desc(services.id));
  
      return NextResponse.json(userAppointments);
    } catch (error) {
      console.error('Ошибка при получении записей:', error);
      return NextResponse.json(
        { error: 'Не удалось получить список записей' },
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
      const body = await request.json();
  

  
      const newService = await db.insert(services).values({
        name: body.name,
        description: body.description,
        basePrice: body.basePrice,
        duration: body.duration,
        isActive: true,
        categoryId: body.categoryId,
      });
  
      return NextResponse.json(newService, { status: 201 });
    } catch (error) {
      console.error('Error creating a new service:', error);
      return NextResponse.json(
        { error: 'Failed to create a new service' },
        { status: 500 }
      );
    }
  }
