// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { users } from '@/drizzle/schema';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt((await params).id)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }

) {
  try {
    const { name, email, phone, roleId } = await request.json();
    
    await db
      .update(users)
      .set({ name, email, phone, roleId })
      .where(eq(users.id, parseInt((await params).id)));

    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt((await params).id)))
      .limit(1);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db
      .delete(users)
      .where(eq(users.id, parseInt((await params).id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}