"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ServicesTable({ services, onEdit, setServices }: { services: any[]; onEdit: (service: any) => void; setServices: React.Dispatch<React.SetStateAction<any[]>> }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Услуга удалена');
        setServices((prevServices: any[]) => prevServices.filter((service: any) => service.id !== id));
      } else {
        toast.error('Ошибка при удалении услуги');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Ошибка при удалении услуги');
    }
  };

  return (
    <div className="border rounded-lg">
      <Toaster />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service, index) => (
            <TableRow key={`${service.id}-${index}`}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category?.name || '-'}</TableCell>
              <TableCell>{service.basePrice} ₽</TableCell>
              <TableCell>
                {Math.floor(service.duration / 60)} ч {service.duration % 60} мин
              </TableCell>
              <TableCell>
                <Badge variant={service.isActive ? 'default' : 'secondary'}>
                  {service.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}