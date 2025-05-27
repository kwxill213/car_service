import Link from 'next/link';
import { 
  Wrench, 
  Calendar, 
  Star, 
  Clock, 
  MessageSquare, 
  Settings,
  Home,
  User
} from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Alan SS Admin</h1>
      </div>
      <nav className="p-4 space-y-2">
        <Link href="/admin" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
          <Home className="w-5 h-5 mr-3" />
          <span>Главная</span>
        </Link>
        <Link href="/admin/services" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
          <Wrench className="w-5 h-5 mr-3" />
          <span>Услуги</span>
        </Link>
        <Link href="/admin/appointments" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
          <Calendar className="w-5 h-5 mr-3" />
          <span>Записи</span>
        </Link>
        <Link href="/admin/users" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
          <User className="w-5 h-5 mr-3" />
          <span>Пользователи</span>
        </Link>
        <Link href="/admin/support" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
          <MessageSquare className="w-5 h-5 mr-3" />
          <span>Поддержка</span>
        </Link>
      </nav>
    </div>
  );
}