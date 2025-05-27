"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Appointment } from '@/lib/types';
import { useState, useEffect } from 'react';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statuses, setStatuses] = useState<{id: number, name: string, description: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appointmentsRes, clientsRes, servicesRes, employeesRes, statusesRes, reviewsRes] = await Promise.all([
          fetch('/api/admin/data/appointments').then(res => res.json()),
          fetch('/api/admin/data/users').then(res => res.json()),
          fetch('/api/admin/data/services').then(res => res.json()),
          fetch('/api/admin/data/users').then(res => res.json()),
          fetch('/api/admin/data/appointmentStatuses').then(res => res.json()),
          fetch('/api/admin/data/reviews').then(res => res.json()),
        ]);

        const clientsMap = Object.fromEntries(clientsRes.map((client: any) => [client.id, client.name]));
        const servicesMap = Object.fromEntries(servicesRes.map((service: any) => [service.id, service.name]));
        const employeesMap = Object.fromEntries(employeesRes.map((employee: any) => [employee.id, employee.name]));
        const statusesArray = Array.isArray(statusesRes) ? statusesRes : Object.values(statusesRes || {});
        const statusesMap = Object.fromEntries(statusesArray.map((status: any) => [status.id, status.name]));
        
        const reviewsMap = Object.fromEntries(
          (Array.isArray(reviewsRes) ? reviewsRes : Object.values(reviewsRes || {})).map((review: any) => 
            [review.appointmentId, review]
          )
        );

        const enrichedAppointments = appointmentsRes.map((appointment: any) => ({
          ...appointment,
          clientName: clientsMap[appointment.clientId] || 'Не указан',
          serviceName: servicesMap[appointment.serviceId] || 'Не указана',
          employeeName: employeesMap[appointment.employeeId] || 'Не указан',
          statusName: statusesMap[appointment.statusId] || 'Неизвестно',
          review: reviewsMap[appointment.id] || null
        }));

        setAppointments(enrichedAppointments);
        setStatuses(statusesArray);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleStatusUpdate = (appointmentId: number, newStatusId: number) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { 
            ...app, 
            statusId: newStatusId, 
            statusName: statuses.find(s => s.id === newStatusId)?.name || 'Неизвестно' 
          }
        : app
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Управление записями</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <AppointmentsTable 
          appointments={appointments} 
          statuses={statuses}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  );
}