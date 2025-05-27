"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Service } from '@/lib/types';
import { useState, useEffect } from 'react';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { useRouter } from 'next/navigation';
import { ServicesTable } from '@/components/admin/ServicesTable';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | (Omit<Service, 'id'> & { id: null }) | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/data/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updatedService: Service) => {
    setServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === updatedService.id);
      if (existingIndex !== -1) {
        const updatedServices = [...prev];
        updatedServices[existingIndex] = updatedService;
        return updatedServices;
      }
      return [...prev, updatedService];
    });
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление услугами</h1>
        <Link href="/admin/services/new">
          <Button>Добавить услугу</Button>
        </Link>
      </div>

      {editingService && (
        <ServiceForm service={editingService} onSave={handleSave} />
      )}

      <ServicesTable
        services={services}
        onEdit={(service) => router.push(`/admin/services/${service.id}`)}
        setServices={setServices}
      />
    </div>
  );
}