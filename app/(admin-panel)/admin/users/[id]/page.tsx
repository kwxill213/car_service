// app/admin/users/[id]/page.tsx
"use client";
import { UserForm } from '@/components/admin/UserForm';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user:', error));
  }, [id]);

  const handleSave = async (updatedUser: any) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return <UserForm user={user} onSave={handleSave} />;
}