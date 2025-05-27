import { users, roles, serviceCategories, services, appointmentStatuses, appointments, reviews, contactSubmissions } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';

// Пользователи
export type User = InferSelectModel<typeof users>;

// Роли
export type Role = InferSelectModel<typeof roles>;

// Категории услуг
export type ServiceCategory = InferSelectModel<typeof serviceCategories>;

// Услуги
export type Service = InferSelectModel<typeof services>;

// Статусы записей
export type AppointmentStatus = InferSelectModel<typeof appointmentStatuses>;

// Записи
export type Appointment = InferSelectModel<typeof appointments>;

// Отзывы
export type Review = InferSelectModel<typeof reviews>;

// // Производители запчастей
// export type PartManufacturer = InferSelectModel<typeof partManufacturers>;

// // Категории запчастей
// export type PartCategory = InferSelectModel<typeof partCategories>;

// // Запчасти
// export type Part = InferSelectModel<typeof parts>;

// // Использованные запчасти
// export type UsedPart = InferSelectModel<typeof usedParts>;


export type ContactSubmission = InferSelectModel<typeof contactSubmissions>;


export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  roleId: number;
  avatar?: string | null;
  phone?: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  submission?: ContactSubmission;
  error?: string;
}