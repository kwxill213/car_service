"use client";
import { ServiceForm } from '@/components/admin/ServiceForm';
import { Service } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function NewServicePage() {
  const router = useRouter();

  const handleSave = async (newService: Service) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        router.push('/admin/services');
      } else {
        console.error('Failed to create service');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <ServiceForm onSave={handleSave} />;
}