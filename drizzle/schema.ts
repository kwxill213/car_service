// schema.ts
import { mysqlTable, varchar, int, text, datetime, boolean, decimal, time, primaryKey, timestamp } from 'drizzle-orm/mysql-core';

// Роли пользователей
export const roles = mysqlTable('roles', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'client', 'admin', 'mechanic'
  description: text('description'),
});

// Пользователи системы
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull().default("Пользователь"),
  phone: varchar('phone', { length: 20 }),
  roleId: int('role_id').notNull().references(() => roles.id).default(3),
  createdAt: timestamp('created_at').defaultNow(),
  avatar: varchar('avatar', { length: 255 })
});

// Категории услуг
export const serviceCategories = mysqlTable('service_categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
});

// Услуги автосервиса
export const services = mysqlTable('services', {
  id: int('id').autoincrement().primaryKey(),
  categoryId: int('category_id').notNull().references(() => serviceCategories.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  duration: int('duration').notNull(), // в минутах
  isActive: boolean('is_active').notNull().default(true),
});

// Статусы записей
export const appointmentStatuses = mysqlTable('appointment_statuses', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'pending', 'confirmed', etc.
  description: text('description'),
});

// Адреса мастерских
export const addresses = mysqlTable('addresses', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Записи клиентов
export const appointments = mysqlTable('appointments', {
  id: int('id').autoincrement().primaryKey(),
  clientId: int('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceId: int('service_id').notNull().references(() => services.id),
  employeeId: int('employee_id').notNull().references(() => users.id),
  addressId: int('address_id').notNull().references(() => addresses.id),
  statusId: int('status_id').notNull().references(() => appointmentStatuses.id).default(1), // 1 = pending
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  notes: text('notes'),
  createdAt: datetime('created_at').notNull().default(new Date()),
});

// Отзывы
export const reviews = mysqlTable('reviews', {
  id: int('id').autoincrement().primaryKey(),
  appointmentId: int('appointment_id').notNull().references(() => appointments.id).unique(),
  rating: int('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: datetime('created_at').notNull().default(new Date()),
});

// // Производители запчастей
// export const partManufacturers = mysqlTable('part_manufacturers', {
//   id: int('id').autoincrement().primaryKey(),
//   name: varchar('name', { length: 100 }).notNull().unique(),
//   country: varchar('country', { length: 100 }),
// });

// // Категории запчастей
// export const partCategories = mysqlTable('part_categories', {
//   id: int('id').autoincrement().primaryKey(),
//   name: varchar('name', { length: 100 }).notNull().unique(),
//   description: text('description'),
// });

// // Запчасти
// export const parts = mysqlTable('parts', {
//   id: int('id').autoincrement().primaryKey(),
//   manufacturerId: int('manufacturer_id').references(() => partManufacturers.id),
//   categoryId: int('category_id').notNull().references(() => partCategories.id),
//   partNumber: varchar('part_number', { length: 50 }).notNull().unique(),
//   name: varchar('name', { length: 100 }).notNull(),
//   description: text('description'),
//   price: decimal('price', { precision: 10, scale: 2 }).notNull(),
//   quantityInStock: int('quantity_in_stock').notNull().default(0),
// });

// // Использованные запчасти в заказах
// export const usedParts = mysqlTable('used_parts', {
//   id: int('id').autoincrement().primaryKey(),
//   appointmentId: int('appointment_id').notNull().references(() => appointments.id),
//   partId: int('part_id').notNull().references(() => parts.id),
//   quantity: int('quantity').notNull().default(1),
//   priceAtTimeOfService: decimal('price_at_time_of_service', { precision: 10, scale: 2 }).notNull(),
// });


export const contactSubmissions = mysqlTable('contact_submissions', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  message: text('message').notNull(),
  userId: int('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
