"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, addMinutes, isBefore, isAfter } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { Loader2, CalendarIcon, Clock } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  duration: number;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
}

function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notes, setNotes] = useState('');
  const [service, setService] = useState<Service | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceId = searchParams.get('serviceId');

  useEffect(() => {
    if (!serviceId) {
      router.push('/services');
      return;
    }

const fetchData = async () => {
  try {
    const [serviceRes, addressesRes] = await Promise.all([
      fetch(`/api/services/${serviceId}`),
      fetch('/api/addresses')
    ]);

    if (!serviceRes.ok || !addressesRes.ok) {
      throw new Error('Не удалось загрузить данные');
    }

    const serviceData = await serviceRes.json();
    const addressesData = await addressesRes.json();
    
    console.log('Service data:', serviceData);
    console.log('Addresses data:', addressesData);
    
    if (serviceData) {
      const parsedService = {
        ...serviceData,
        id: Number(serviceData.id),
        basePrice: Number(serviceData.basePrice) || 0,
        duration: Number(serviceData.duration) || 60
      };
      
      console.log('Parsed service:', parsedService);
      setService(parsedService);
    }
    
    if (Array.isArray(addressesData)) {
      setAddresses(addressesData);
      if (addressesData.length > 0) {
        setAddressId(addressesData[0].id);
      }
    }
    
  } catch (error) {
    console.error('Error in fetchData:', error);
    toast.error('Ошибка загрузки данных');
  } finally {
    setIsLoading(false);
  }
};

    fetchData();
  }, [serviceId, router]);

  useEffect(() => {
    if (date && addressId) {
      fetchAvailableSlots();
    }
  }, [date, addressId]);

  const fetchAvailableSlots = async () => {
    if (!date || !addressId) {
      setAvailableSlots([]);
      return;
    }
  
    try {
      const response = await fetch(
        `/api/appointments/available-slots?date=${format(date, 'yyyy-MM-dd')}&serviceId=${serviceId}&addressId=${addressId}`
      );
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить доступное время');
      }
      
      const slots = await response.json();
      setAvailableSlots(Array.isArray(slots) ? slots : []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Ошибка загрузки доступного времени');
      setAvailableSlots([]);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking?serviceId=${serviceId}`);
      return;
    }
  
    if (!selectedTime || !date || !addressId) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
  
    try {
      setIsSubmitting(true);
      
    
    const timeParts = selectedTime.split(':');
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1] || '0', 10);
    
      
      const startDate = new Date(date);
      startDate.setHours(hours, minutes, 0, 0);
      
      if (isNaN(startDate.getTime())) {
        console.error('Invalid date:', {
          originalDate: date,
          startDate,
          hours,
          minutes
        });
        throw new Error('Неверный формат даты или времени');
      }
  
      const now = new Date();
      if (startDate < now) {
        throw new Error('Нельзя записаться на прошедшее время');
      }
  
      const endDate = new Date(startDate.getTime() + (service?.duration || 0) * 60000);
  
      const startTime = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
      const endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
  
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          startTime,
          endTime,
          notes,
          addressId
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось записаться');
      }
  
      toast.success('Вы успешно записались!');
      router.push('/profile');
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!service) {
    return <div>Услуга не найдена</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Запись на услугу</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {service && (
  <div>
    <h2 className="text-xl font-semibold mb-4">{service.name || 'Название не указано'}</h2>
    {service.description && (
      <p className="text-muted-foreground mb-4">{service.description}</p>
    )}
    <p className="text-lg font-medium">
      Цена: {Number(service.basePrice || 0).toLocaleString('ru-RU')} ₽
    </p>
    <p className="text-muted-foreground">
      Продолжительность: {Math.floor(Number(service.duration || 0) / 60)} ч {Number(service.duration || 0) % 60} мин
    </p>
  </div>
)}

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Выберите дату и время</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Адрес мастерской
              </label>
              <select
                value={addressId || ''}
                onChange={(e) => setAddressId(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                required
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.name} - {address.address}, {address.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Дата
              </label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  locale={ru}
                  initialFocus
                />
              </div>
            </div>

            <div className="space-y-2">
  <h2 className="text-xl font-semibold mb-4">Доступное время</h2>
  {availableSlots.length > 0 ? (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((slot) => {
        const slotTime = new Date(slot.start);
        const timeString = format(slotTime, 'HH:mm');
        
        return (
          <Button
            key={slot.start}
            type="button"
            variant={selectedTime === timeString ? 'default' : 'outline'}
            onClick={() => {
              setSelectedTime(timeString);
            }}
            className="h-14"
          >
            {timeString}
          </Button>
        );
      })}
    </div>
  ) : (
    <p>Нет доступных слотов на выбранную дату</p>
  )}
</div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Дополнительная информация</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Опишите проблему или оставьте комментарий"
                className="w-full p-3 border rounded-md min-h-[120px]"
              />
            </div>

            <div className="flex justify-end">
            <Button 
    type="submit" 
    disabled={isSubmitting || !selectedTime || !date || !addressId}
    className="w-full sm:w-auto"
  >
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Обработка...
      </>
    ) : (
      'Подтвердить запись'
    )}
  </Button>
  </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <BookingPage />
    </Suspense>
  );
}