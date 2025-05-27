"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export function AdminHeader() {
    const { avatar, name } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Панель управления</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={avatar || undefined} />
            <AvatarFallback>{name?.charAt(0) ?? ''}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
        <form>
          <Link href="/">
          <Button  variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
          </Link>
        </form>
      </div>
    </header>
  );
}