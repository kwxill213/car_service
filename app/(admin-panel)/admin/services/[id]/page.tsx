"use client";
import { ServiceForm } from '@/components/admin/ServiceForm';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => setService(data))
      .catch((error) => console.error('Error fetching service:', error));
  }, [id]);

  const handleSave = async (updatedService: any) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });

      if (response.ok) {
        router.push('/admin/services');
      } else {
        console.error('Failed to update service');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!service) return <div>Loading...</div>;

  return <ServiceForm service={service} onSave={handleSave} />;
}