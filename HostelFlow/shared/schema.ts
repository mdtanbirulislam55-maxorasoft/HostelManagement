import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums
export const roomStatusEnum = pgEnum('room_status', ['occupied', 'vacant', 'maintenance']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'pending', 'overdue']);
export const activityTypeEnum = pgEnum('activity_type', ['student_added', 'payment_received', 'room_assigned', 'maintenance_scheduled', 'alert_created']);

// Floors table
export const floors = pgTable("floors", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  totalRooms: integer("total_rooms").notNull().default(20),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rooms table
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: varchar("number", { length: 10 }).notNull().unique(),
  floorId: integer("floor_id").notNull().references(() => floors.id),
  capacity: integer("capacity").notNull().default(2),
  currentOccupancy: integer("current_occupancy").notNull().default(0),
  status: roomStatusEnum("status").notNull().default('vacant'),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  roomId: varchar("room_id").references(() => rooms.id),
  admissionDate: timestamp("admission_date").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: paymentStatusEnum("status").notNull().default('pending'),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM format
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expenses table
export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  date: timestamp("date").notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: activityTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id),
  entityId: varchar("entity_id"), // ID of related entity (student, room, etc.)
  metadata: jsonb("metadata"), // Additional data
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(), // 'payment_overdue', 'maintenance_required', 'high_occupancy'
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  severity: varchar("severity", { length: 20 }).notNull().default('medium'), // 'low', 'medium', 'high'
  isRead: boolean("is_read").notNull().default(false),
  entityId: varchar("entity_id"), // Related entity ID
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const floorsRelations = relations(floors, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  floor: one(floors, {
    fields: [rooms.floorId],
    references: [floors.id],
  }),
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  room: one(rooms, {
    fields: [students.roomId],
    references: [rooms.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  createdByUser: one(users, {
    fields: [expenses.createdBy],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertFloorSchema = createInsertSchema(floors).omit({
  createdAt: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Floor = typeof floors.$inferSelect;
export type InsertFloor = z.infer<typeof insertFloorSchema>;
export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
