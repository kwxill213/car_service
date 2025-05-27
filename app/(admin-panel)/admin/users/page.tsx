// app/admin/users/page.tsx
"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/components/admin/UserForm';
import { UsersTable } from '@/components/admin/UsersTable';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | (Omit<User, 'id'> & { id: null }) | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/data/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updatedUser: User | null) => {
    if (!updatedUser) {
      setEditingUser(null);
      return;
    }
    setUsers(prev => {
      const existingIndex = prev.findIndex(u => u.id === updatedUser.id);
      if (existingIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingIndex] = updatedUser;
        return updatedUsers;
      }
      return [...prev, updatedUser];
    });
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>

      </div>

      {editingUser && (
        <UserForm user={editingUser} onSave={handleSave} />
      )}

      <UsersTable
        users={users}
        onEdit={(user) => router.push(`/admin/users/${user.id}`)}
        setUsers={setUsers}
      />
    </div>
  );
}