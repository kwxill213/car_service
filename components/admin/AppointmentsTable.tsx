"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AppointmentsTable({ 
  appointments,
  statuses,
  onStatusChange
}: { 
  appointments: any[];
  statuses: { id: number; name: string; description: string }[];
  onStatusChange: (appointmentId: number, newStatusId: number) => void;
}) {
  const handleStatusChange = async (appointmentId: number, newStatusId: number) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusId: newStatusId }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса');
      }

      onStatusChange(appointmentId, newStatusId);
      toast.success('Статус записи успешно изменен');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Не удалось обновить статус записи');
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Клиент</TableHead>
            <TableHead>Услуга</TableHead>
            <TableHead>Дата и время</TableHead>
            <TableHead>Мастер</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Отзыв</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.clientName || 'Не указан'}</TableCell>
              <TableCell>{appointment.serviceName || 'Не указана'}</TableCell>
              <TableCell>
                {appointment.startTime
                  ? format(new Date(appointment.startTime), 'PPPp', { locale: ru })
                  : 'Не указано'}
              </TableCell>
              <TableCell>{appointment.employeeName || 'Не указан'}</TableCell>
              <TableCell>
                <Select
                  value={appointment.statusId?.toString()}
                  onValueChange={(value) => 
                    handleStatusChange(appointment.id, parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.description || status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {appointment.review ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < appointment.review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {appointment.review.comment || 'Без комментария'}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-muted-foreground text-sm">Нет отзыва</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}