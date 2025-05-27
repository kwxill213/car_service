// app/api/admin/contact-submissions/[id]/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { contactSubmissions } from '@/drizzle/schema';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt((await params).id)))
      .limit(1);

    if (!submission) {
      return NextResponse.json(
        { error: 'Обращение не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    
    await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, parseInt((await params).id)));

    const [updatedSubmission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt((await params).id)))
      .limit(1);

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    );
  }
}