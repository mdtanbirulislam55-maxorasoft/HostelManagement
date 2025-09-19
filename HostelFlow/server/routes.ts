import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Import the local authentication helpers instead of the Replit-specific ones.
import { setupAuth, isAuthenticated } from "./auth";
import {
  insertFloorSchema,
  insertRoomSchema,
  insertStudentSchema,
  insertPaymentSchema,
  insertExpenseSchema,
  insertActivityLogSchema,
  insertAlertSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let user;
      if (userId) {
        user = await storage.getUser(userId);
      }
      // If no user exists in the database (for example, when running
      // locally), return a default user object based on the claims set in
      // the authentication middleware.  This prevents errors when the
      // front-end requests the current user on a fresh database.
      if (!user) {
        return res.json({
          id: userId ?? 'local-user',
          firstName: req.user?.claims?.first_name ?? 'Local',
          lastName: req.user?.claims?.last_name ?? 'User',
          email: req.user?.claims?.email ?? 'local@hostel.dev',
          role: 'admin',
          profileImageUrl: req.user?.claims?.profile_image_url ?? '',
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Floor routes
  app.get('/api/floors', isAuthenticated, async (req, res) => {
    try {
      const floors = await storage.getFloors();
      res.json(floors);
    } catch (error) {
      console.error("Error fetching floors:", error);
      res.status(500).json({ message: "Failed to fetch floors" });
    }
  });

  app.post('/api/floors', isAuthenticated, async (req: any, res) => {
    try {
      const floorData = insertFloorSchema.parse(req.body);
      const floor = await storage.createFloor(floorData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'student_added',
        title: 'Floor Created',
        description: `Floor ${floor.name} was created`,
        userId: req.user.claims.sub,
        entityId: floor.id.toString(),
      });
      
      res.status(201).json(floor);
    } catch (error) {
      console.error("Error creating floor:", error);
      res.status(400).json({ message: "Failed to create floor" });
    }
  });

  // Room routes
  app.get('/api/rooms', isAuthenticated, async (req, res) => {
    try {
      const { floorId } = req.query;
      let rooms;
      
      if (floorId) {
        rooms = await storage.getRoomsByFloor(parseInt(floorId as string));
      } else {
        rooms = await storage.getRooms();
      }
      
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.get('/api/rooms/:id', isAuthenticated, async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  app.post('/api/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'room_assigned',
        title: 'Room Created',
        description: `Room ${room.number} was created`,
        userId: req.user.claims.sub,
        entityId: room.id,
      });
      
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(400).json({ message: "Failed to create room" });
    }
  });

  app.patch('/api/rooms/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(req.params.id, updates);
      
      // Log activity
      await storage.createActivityLog({
        type: 'room_assigned',
        title: 'Room Updated',
        description: `Room ${room.number} was updated`,
        userId: req.user.claims.sub,
        entityId: room.id,
      });
      
      res.json(room);
    } catch (error) {
      console.error("Error updating room:", error);
      res.status(400).json({ message: "Failed to update room" });
    }
  });

  // Student routes
  app.get('/api/students', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const result = await storage.getStudents(limit, offset);
      res.json(result);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get('/api/students/:id', isAuthenticated, async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'student_added',
        title: 'Student Added',
        description: `Student ${student.name} was added`,
        userId: req.user.claims.sub,
        entityId: student.id,
      });
      
      res.status(201).json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(400).json({ message: "Failed to create student" });
    }
  });

  app.patch('/api/students/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(req.params.id, updates);
      
      // Log activity
      await storage.createActivityLog({
        type: 'student_added',
        title: 'Student Updated',
        description: `Student ${student.name} was updated`,
        userId: req.user.claims.sub,
        entityId: student.id,
      });
      
      res.json(student);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(400).json({ message: "Failed to update student" });
    }
  });

  app.delete('/api/students/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteStudent(req.params.id);
      
      // Log activity
      await storage.createActivityLog({
        type: 'student_added',
        title: 'Student Deleted',
        description: `Student was deleted`,
        userId: req.user.claims.sub,
        entityId: req.params.id,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(400).json({ message: "Failed to delete student" });
    }
  });

  // Payment routes
  app.get('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const { studentId } = req.query;
      const payments = await storage.getPayments(studentId as string);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'payment_received',
        title: 'Payment Recorded',
        description: `Payment of ₹${payment.amount} was recorded`,
        userId: req.user.claims.sub,
        entityId: payment.id,
      });
      
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(400).json({ message: "Failed to create payment" });
    }
  });

  app.patch('/api/payments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(req.params.id, updates);
      
      // Log activity
      await storage.createActivityLog({
        type: 'payment_received',
        title: 'Payment Updated',
        description: `Payment of ₹${payment.amount} was updated`,
        userId: req.user.claims.sub,
        entityId: payment.id,
      });
      
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(400).json({ message: "Failed to update payment" });
    }
  });

  // Expense routes
  app.get('/api/expenses', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const result = await storage.getExpenses(limit, offset);
      res.json(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const expenseData = insertExpenseSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const expense = await storage.createExpense(expenseData);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(400).json({ message: "Failed to create expense" });
    }
  });

  // Activity log routes
  app.get('/api/activity-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Alert routes
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const unreadOnly = req.query.unreadOnly === 'true';
      const alerts = await storage.getAlerts(unreadOnly);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req: any, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'alert_created',
        title: 'Alert Created',
        description: `Alert: ${alert.title}`,
        userId: req.user.claims.sub,
        entityId: alert.id,
      });
      
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Failed to create alert" });
    }
  });

  app.patch('/api/alerts/:id/read', isAuthenticated, async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      res.json(alert);
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(400).json({ message: "Failed to mark alert as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
