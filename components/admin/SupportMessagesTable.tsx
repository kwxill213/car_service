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
import { Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function SupportMessagesTable({ messages }: { messages: any[] }) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge variant="default">Новое</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">В работе</Badge>;
      case 'resolved':
        return <Badge variant="default">Решено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Отправитель</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell>
                {format(new Date(message.createdAt), 'PPPp', { locale: ru })}
              </TableCell>
              <TableCell>
                {getStatusBadge(message.status)}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/support/${message.id}`}>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}