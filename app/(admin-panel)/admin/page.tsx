// app/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Wrench, Star, Mail, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    newAppointments: 0,
    employees: 0,
    services: 0,
    reviews: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          fetch('/api/admin/dashboard-stats').then(res => res.json()),
          fetch('/api/admin/recent-appointments').then(res => res.json()),
        ]);

        setStats(statsRes);
        setRecentAppointments(appointmentsRes);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Карточка записей */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Записи</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.appointments}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newAppointments} новых записей
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка сотрудников */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Сотрудники</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.employees}</div>
                <p className="text-xs text-muted-foreground">
                  Активные сотрудники
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка услуг */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Услуги</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.services}</div>
                <p className="text-xs text-muted-foreground">
                  Доступные услуги
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка отзывов */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Отзывы</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.reviews}</div>
                <p className="text-xs text-muted-foreground">
                  Всего отзывов
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка сообщений */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Сообщения</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.messages}</div>
                <p className="text-xs text-muted-foreground">
                  Новых сообщений
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка быстрых действий */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">

            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/services">
                <Wrench className="h-4 w-4 mr-2" />
                Управление услугами
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/support">
                <Mail className="h-4 w-4 mr-2" />
                Просмотр сообщений
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Последние записи */}
      <Card>
        <CardHeader>
          <CardTitle>Последние записи</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : recentAppointments.length > 0 ? (
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Услуга
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата и время
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(appointment.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.statusId === 1 ? 'bg-yellow-100 text-yellow-800' :
                          appointment.statusId === 4 ? 'bg-green-100 text-green-800' :
                          appointment.statusId === 5 ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.statusName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Нет последних записей</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}