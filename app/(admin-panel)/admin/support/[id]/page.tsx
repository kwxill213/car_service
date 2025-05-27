// app/admin/support/[id]/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Mail, Phone, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useParams } from 'next/navigation';

const statusOptions = [
  { value: 'new', label: 'Новый' },
  { value: 'in_progress', label: 'В обработке' },
  { value: 'resolved', label: 'Решен' },
  { value: 'rejected', label: 'Отклонен' },
];

export default function SupportTicketPage() {
  const params = useParams();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`/api/admin/contact-submissions/${params.id}`);
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error('Ошибка при загрузке обращения:', error);
        toast.error('Не удалось загрузить обращение');
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      fetchTicket();
    }
  }, [params]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/contact-submissions/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Ошибка обновления статуса');

      setTicket({ ...ticket, status: newStatus });
      toast.success('Статус обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      toast.error('Не удалось обновить статус');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return <div>Обращение не найдено</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        asChild
        className="mb-6"
      >
        <Link href="/admin/support">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку обращений
        </Link>
      </Button>

      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{ticket.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>{ticket.email}</span>
              </div>
              {ticket.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{ticket.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Сообщение</h2>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="whitespace-pre-line">{ticket.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-2">Информация</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Статус</p>
                  <p>
                    {statusOptions.find((s) => s.value === ticket.status)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата создания</p>
                  <p>
                    {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Последнее обновление</p>
                  <p>
                    {new Date(ticket.updatedAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>

            {ticket.userId && (
              <div>
                <h2 className="font-semibold mb-2">Пользователь</h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">ID пользователя</p>
                    <p>{ticket.userId}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}