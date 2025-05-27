import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';

export function ServiceForm({ service, onSave }: { service?: any; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    id: service?.id || '',
    name: service?.name || '',
    categoryId: service?.categoryId || '',
    basePrice: service?.basePrice || '',
    duration: service?.duration || '',
    isActive: service?.isActive || true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'duration' || name === 'categoryId' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.id) {
        delete dataToSend.id;
      }

      console.log('Отправляемые данные:', dataToSend);

      const url = service?.id ? `/api/services/${service.id}` : '/api/services';
      const method = service?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success(`Услуга ${service ? 'обновлена' : 'добавлена'}`);
        onSave(formData);
      } else {
        toast.error('Ошибка при сохранении услуги');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Ошибка при сохранении услуги');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster />
      <div>
        <label className="block text-sm font-medium">Название</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Категория</label>
        <Input
          name="categoryId"
          type="number"
          value={formData.categoryId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Цена</label>
        <Input
          name="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Длительность (в минутах)</label>
        <Input
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Активна</label>
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
        />
      </div>
      <Button type="submit">{service ? 'Сохранить изменения' : 'Добавить услугу'}</Button>
    </form>
  );
}
