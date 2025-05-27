// components/admin/AppointmentReviews.tsx
"use client";

import { useState } from 'react';
import { Star, Loader2, Check, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

export function AppointmentReviews({ 
  appointment,
  onReviewUpdate 
}: { 
  appointment: any;
  onReviewUpdate: (updatedAppointment: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(appointment.review?.rating || 0);
  const [comment, setComment] = useState(appointment.review?.comment || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Пожалуйста, поставьте оценку');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/reviews', {
        appointmentId: appointment.id,
        rating,
        comment
      });

      onReviewUpdate({
        ...appointment,
        review: { rating, comment }
      });
      
      setIsEditing(false);
      toast.success('Отзыв сохранен');
    } catch (error) {
      console.error('Ошибка при сохранении отзыва:', error);
      toast.error('Ошибка при сохранении отзыва');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/reviews/${appointment.id}`);
      
      onReviewUpdate({
        ...appointment,
        review: null
      });
      
      toast.success('Отзыв удален');
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      toast.error('Ошибка при удалении отзыва');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-medium mb-3">Отзыв клиента</h4>
      
      {appointment.review ? (
        <>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="mr-1 focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                    />
                  </button>
                ))}
              </div>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : <Check className="h-4 w-4 mr-2" />}
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < appointment.review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : <Trash2 className="h-4 w-4 text-destructive" />}
                  </Button>
                </div>
              </div>
              {appointment.review.comment && (
                <p className="text-sm mt-2">{appointment.review.comment}</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-muted-foreground text-sm">
          Клиент еще не оставил отзыв
        </div>
      )}
    </div>
  );
}