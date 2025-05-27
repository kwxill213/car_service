import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { contactSubmissions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

const result = await db
.update(contactSubmissions)
.set({ 
  status: 'viewed',
  updatedAt: new Date() 
})
.where(eq(contactSubmissions.id, parseInt(id)));

const [updated] = await db
.select()
.from(contactSubmissions)
.where(eq(contactSubmissions.id, parseInt(id)));

if (!updated) {
return NextResponse.json(
  { error: 'Обращение не найдено' },
  { status: 404 }
);
}

return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении обращения' },
      { status: 500 }
    );
  }
}
