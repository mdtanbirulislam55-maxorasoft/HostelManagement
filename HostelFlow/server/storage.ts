import {
  users,
  floors,
  rooms,
  students,
  payments,
  expenses,
  activityLogs,
  alerts,
  type User,
  type UpsertUser,
  type Floor,
  type InsertFloor,
  type Room,
  type InsertRoom,
  type Student,
  type InsertStudent,
  type Payment,
  type InsertPayment,
  type Expense,
  type InsertExpense,
  type ActivityLog,
  type InsertActivityLog,
  type Alert,
  type InsertAlert,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Floor operations
  getFloors(): Promise<Floor[]>;
  createFloor(floor: InsertFloor): Promise<Floor>;

  // Room operations
  getRooms(): Promise<Room[]>;
  getRoomsByFloor(floorId: number): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, updates: Partial<InsertRoom>): Promise<Room>;

  // Student operations
  getStudents(limit?: number, offset?: number): Promise<{ students: Student[]; total: number }>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;

  // Payment operations
  getPayments(studentId?: string): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment>;

  // Expense operations
  getExpenses(limit?: number, offset?: number): Promise<{ expenses: Expense[]; total: number }>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Activity log operations
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(activity: InsertActivityLog): Promise<ActivityLog>;

  // Alert operations
  getAlerts(unreadOnly?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalStudents: number;
    totalRooms: number;
    availableBeds: number;
    monthlyRevenue: number;
    occupancyRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Floor operations
  async getFloors(): Promise<Floor[]> {
    return await db.select().from(floors).orderBy(floors.id);
  }

  async createFloor(floor: InsertFloor): Promise<Floor> {
    const [newFloor] = await db.insert(floors).values(floor).returning();
    return newFloor;
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return await db.select().from(rooms).orderBy(rooms.number);
  }

  async getRoomsByFloor(floorId: number): Promise<Room[]> {
    return await db
      .select()
      .from(rooms)
      .where(eq(rooms.floorId, floorId))
      .orderBy(rooms.number);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [newRoom] = await db.insert(rooms).values(room).returning();
    return newRoom;
  }

  async updateRoom(id: string, updates: Partial<InsertRoom>): Promise<Room> {
    const [updatedRoom] = await db
      .update(rooms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom;
  }

  // Student operations
  async getStudents(limit = 10, offset = 0): Promise<{ students: Student[]; total: number }> {
    const [studentsResult, totalResult] = await Promise.all([
      db.select().from(students).limit(limit).offset(offset).orderBy(desc(students.createdAt)),
      db.select({ count: count() }).from(students),
    ]);

    return {
      students: studentsResult,
      total: totalResult[0].count,
    };
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.studentId, studentId));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    
    // Update room occupancy if room is assigned
    if (student.roomId) {
      await db
        .update(rooms)
        .set({
          currentOccupancy: sql`${rooms.currentOccupancy} + 1`,
          status: sql`CASE WHEN ${rooms.currentOccupancy} + 1 >= ${rooms.capacity} THEN 'occupied'::"room_status" ELSE ${rooms.status} END`,
        })
        .where(eq(rooms.id, student.roomId));
    }

    return newStudent;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
    const existingStudent = await this.getStudent(id);
    
    const [updatedStudent] = await db
      .update(students)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();

    // Handle room changes
    if (updates.roomId !== undefined && existingStudent?.roomId !== updates.roomId) {
      // Decrease occupancy in old room
      if (existingStudent?.roomId) {
        await db
          .update(rooms)
          .set({
            currentOccupancy: sql`${rooms.currentOccupancy} - 1`,
            status: sql`CASE WHEN ${rooms.currentOccupancy} - 1 = 0 THEN 'vacant'::"room_status" ELSE ${rooms.status} END`,
          })
          .where(eq(rooms.id, existingStudent.roomId));
      }

      // Increase occupancy in new room
      if (updates.roomId) {
        await db
          .update(rooms)
          .set({
            currentOccupancy: sql`${rooms.currentOccupancy} + 1`,
            status: sql`CASE WHEN ${rooms.currentOccupancy} + 1 >= ${rooms.capacity} THEN 'occupied'::"room_status" ELSE ${rooms.status} END`,
          })
          .where(eq(rooms.id, updates.roomId));
      }
    }

    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.getStudent(id);
    
    await db.delete(students).where(eq(students.id, id));
    
    // Update room occupancy
    if (student?.roomId) {
      await db
        .update(rooms)
        .set({
          currentOccupancy: sql`${rooms.currentOccupancy} - 1`,
          status: sql`CASE WHEN ${rooms.currentOccupancy} - 1 = 0 THEN 'vacant'::"room_status" ELSE ${rooms.status} END`,
        })
        .where(eq(rooms.id, student.roomId));
    }
  }

  // Payment operations
  async getPayments(studentId?: string): Promise<Payment[]> {
    const query = db.select().from(payments);
    
    if (studentId) {
      return await query.where(eq(payments.studentId, studentId)).orderBy(desc(payments.createdAt));
    }
    
    return await query.orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Expense operations
  async getExpenses(limit = 10, offset = 0): Promise<{ expenses: Expense[]; total: number }> {
    const [expensesResult, totalResult] = await Promise.all([
      db.select().from(expenses).limit(limit).offset(offset).orderBy(desc(expenses.date)),
      db.select({ count: count() }).from(expenses),
    ]);

    return {
      expenses: expensesResult,
      total: totalResult[0].count,
    };
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  // Activity log operations
  async getActivityLogs(limit = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .limit(limit)
      .orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(activity: InsertActivityLog): Promise<ActivityLog> {
    const [newActivity] = await db.insert(activityLogs).values(activity).returning();
    return newActivity;
  }

  // Alert operations
  async getAlerts(unreadOnly = false): Promise<Alert[]> {
    const query = db.select().from(alerts);
    
    if (unreadOnly) {
      return await query.where(eq(alerts.isRead, false)).orderBy(desc(alerts.createdAt));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async markAlertAsRead(id: string): Promise<Alert> {
    const [updatedAlert] = await db
      .update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalStudents: number;
    totalRooms: number;
    availableBeds: number;
    monthlyRevenue: number;
    occupancyRate: number;
  }> {
    const [totalStudentsResult] = await db
      .select({ count: count() })
      .from(students)
      .where(eq(students.isActive, true));

    const [totalRoomsResult] = await db
      .select({ count: count() })
      .from(rooms);

    const [availableBedsResult] = await db
      .select({ 
        available: sql<number>`SUM(${rooms.capacity} - ${rooms.currentOccupancy})` 
      })
      .from(rooms);

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [monthlyRevenueResult] = await db
      .select({ 
        revenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)` 
      })
      .from(payments)
      .where(and(
        eq(payments.month, currentMonth),
        eq(payments.status, 'paid')
      ));

    const [occupancyResult] = await db
      .select({
        totalCapacity: sql<number>`SUM(${rooms.capacity})`,
        totalOccupied: sql<number>`SUM(${rooms.currentOccupancy})`,
      })
      .from(rooms);

    const totalCapacity = occupancyResult?.[0]?.totalCapacity || 0;
    const totalOccupied = occupancyResult?.[0]?.totalOccupied || 0;
    const occupancyRate = totalCapacity > 0 
      ? (totalOccupied / totalCapacity) * 100 
      : 0;

    return {
      totalStudents: totalStudentsResult.count,
      totalRooms: totalRoomsResult.count,
      availableBeds: availableBedsResult?.[0]?.available || 0,
      monthlyRevenue: Number(monthlyRevenueResult?.[0]?.revenue || 0),
      occupancyRate: Math.round(occupancyRate * 100) / 100,
    };
  }
}

export const storage = new DatabaseStorage();
