'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit, Save, X, Star, Clock, CheckCircle, AlertCircle, Image as ImageIcon, Search, CalendarDays, Check } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Appointment = {
  id: number;
  serviceId: number;
  serviceName: string;
  employeeId: number;
  employeeName: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: string;
  statusId?: number;
  statusName?: string;
  addressId?: number;
  address?: {
    id: number;
    name: string;
    address: string;
    city: string;
    phone?: string;
  };
  review?: {
    rating: number;
    comment?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newReview, setNewReview] = useState<Record<number, { rating: number; comment: string }>>({});
  
  const { 
    id,
    name,
    email,
    phone,
    avatar,
    setUser,
    isAuthenticated
  } = useAuth();

  const [editData, setEditData] = useState({
    name: name || '',
    phone: phone || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(avatar || '');

  useEffect(() => {
    setEditData({
      name: name || '',
      phone: phone || '',
    });
    setAvatarPreview(avatar || '');
  }, [name, phone, avatar]);

  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Не удалось загрузить записи');
        
        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (error) {
        toast.error('Ошибка при загрузке записей');
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, router]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await api.patch('/auth/update', {
        ...editData,
        avatar: avatarPreview
      });
      setUser(res.data);
      setIsEditing(false);
      toast.success('Данные успешно обновлены');
    } catch (error) {
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarPreview(`${res.data.imageUrl}?t=${Date.now()}`);
      toast.success('Аватар успешно обновлён');
    } catch (error) {
      setAvatarPreview(avatar || '');
      toast.error('Ошибка при загрузке аватара');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: name || '',
      phone: phone || '',
    });
    setAvatarPreview(avatar || '');
  };

const handleReviewSubmit = async (appointmentId: number) => {
  if (!newReview[appointmentId]?.rating) {
    toast.error('Пожалуйста, поставьте оценку');
    return;
  }

  try {
    setIsLoading(true);
    const response = await api.post('/reviews', {
      appointmentId,
      rating: newReview[appointmentId].rating,
      comment: newReview[appointmentId].comment
    });

    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { 
            ...app, 
            review: {
              rating: newReview[appointmentId].rating,
              comment: newReview[appointmentId].comment
            } 
          } 
        : app
    ));

    setNewReview(prev => ({ ...prev, [appointmentId]: { rating: 0, comment: '' } }));
    toast.success('Отзыв успешно сохранён');
  } catch (error) {
    console.error('Ошибка при сохранении отзыва:', error);
    toast.error('Ошибка при сохранении отзыва');
  } finally {
    setIsLoading(false);
  }
};

  const getStatusIcon = (statusId?: number) => {
    if (!statusId) return <AlertCircle className="h-5 w-5 text-gray-500" />;
    
    switch (statusId) {
      case 1:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 2:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 3:
        return <Clock className="h-5 w-5 text-red-500" />;
      case 4:
        return <Check className="h-5 w-5 text-green-500" />;
      case 5:
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusName = (statusId?: number) => {
    if (!statusId) return 'Не указан';
    
    switch (statusId) {
      case 1: return 'Новый заказ';
      case 2: return 'В обработке';
      case 3: return 'В процессе';
      case 4: return 'Завершено';
      case 5: return 'Отменено';
      default: return 'Запланировано';
    }
  };

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredAppointments = (appointments || [])
  .filter(appointment => {
    const matchesSearch = appointment.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesFilter = filter === 'all' || 
      (filter === 'upcoming' && (appointment.statusId === 2 || appointment.statusId === 3 || appointment.statusId === 1)) || // В обработке
      (filter === 'completed' && appointment.statusId === 4) || // Завершено
      (filter === 'cancelled' && appointment.statusId === 5);  // Отменено
    
    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm('Вы уверены, что хотите отменить запись?')) return;
    
    setIsCancelling(appointmentId);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId: 5 }) // 5 = Отменено
      });
      
      if (!response.ok) throw new Error('Не удалось отменить запись');
      
      // Refresh appointments
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, statusId: 5, statusName: 'Отменено' } : apt
      );
      setAppointments(updatedAppointments);
      toast.success('Запись успешно отменена');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsCancelling(null);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Профиль пользователя */}
        <div className="lg:col-span-1 bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-4">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Аватар" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {isEditing && (
                <>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Edit className="h-6 w-6 text-white" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            
            <h2 className="text-2xl font-bold">{isEditing ? editData.name : name}</h2>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Личные данные</h3>
            {isEditing ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                </button>
                <button 
                  onClick={handleCancel}
                  className="p-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <p className="p-2 bg-background rounded">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Имя</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 bg-background border border-input rounded"
                />
              ) : (
                <p className="p-2 bg-background rounded">{name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Телефон</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  className="w-full p-2 bg-background border border-input rounded"
                />
              ) : (
                <p className="p-2 bg-background rounded">{phone || 'Не указан'}</p>
              )}
            </div>
          </div>
        </div>

        {/* История заказов */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold">Мои записи</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск по услугам..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все записи</SelectItem>
                  <SelectItem value="upcoming">Предстоящие</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="cancelled">Отмененные</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="oldest">Сначала старые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="bg-card rounded-lg shadow-md p-6 border border-border text-center">
              <p>Записей не найдено</p>
              <Link 
                href="/services" 
                className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
              >
                Записаться на услугу
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.startTime);
                const isUpcoming = appointment.status === 'scheduled' && new Date(appointment.startTime) > new Date();
                
                return (
                  <div key={appointment.id} className="bg-card rounded-lg shadow-md p-6 border border-border">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{appointment.serviceName}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{date}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center px-3 py-1 rounded-full bg-secondary text-sm">
                          {getStatusIcon(appointment.statusId)}
                          <span className="ml-1">
                            {getStatusName(appointment.statusId)}
                          </span>
                        </div>
                        
                        {appointment.statusId === 1 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={isCancelling === appointment.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {isCancelling === appointment.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Отмена...
                              </>
                            ) : (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Отменить запись
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Мастер</p>
                        <p>{appointment.employeeName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Адрес мастерской</p>
                        <p>{appointment.address?.name || 'Не указан'}</p>
                        <p className="text-sm">{appointment.address?.address}, {appointment.address?.city}</p>
                        {appointment.address?.phone && (
                          <p className="text-sm">Тел: {appointment.address.phone}</p>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Примечания</p>
                          <p>{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    {appointment.statusId === 4 && ( // 4 = Завершено
  <div className="mt-4 pt-4 border-t">
    {appointment.review ? (
      <div className="bg-secondary p-4 rounded-lg">
        <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-5 w-5 ${appointment.review && i < appointment.review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
            />
            ))}
        </div>
        {appointment.review.comment && (
          <p className="text-sm mt-2">{appointment.review.comment}</p>
        )}
      </div>
    ) : (
      <>
        <h4 className="font-medium mb-2">Оставить отзыв</h4>
        <div className="flex items-center mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReview(prev => ({
                ...prev,
                [appointment.id]: {
                  ...prev[appointment.id],
                  rating: star
                }
              }))}
              className="mr-1 focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 ${star <= (newReview[appointment.id]?.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ваш отзыв (необязательно)"
            value={newReview[appointment.id]?.comment || ''}
            onChange={(e) => setNewReview(prev => ({
              ...prev,
              [appointment.id]: {
                ...prev[appointment.id],
                comment: e.target.value
              }
            }))}
            className="flex-1"
          />
          <Button
            onClick={() => handleReviewSubmit(appointment.id)}
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Отправить
          </Button>
        </div>
      </>
    )}
  </div>
)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}