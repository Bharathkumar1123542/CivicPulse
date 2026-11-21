import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  User,
  Department,
  Category,
  Report,
  Comment,
  Notification,
  AuditLog,
} from './types.js';
import {
  seedDepartments,
  seedCategories,
  seedUsers,
  seedReports,
  seedComments,
  seedNotifications,
  seedAuditLogs,
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'civicpulse_db.json');

export interface DatabaseSchema {
  users: User[];
  departments: Department[];
  categories: Category[];
  reports: Report[];
  comments: Comment[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.init();
  }

  private init(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing with seeds:', err);
    }

    const initialData: DatabaseSchema = {
      users: [...seedUsers],
      departments: [...seedDepartments],
      categories: [...seedCategories],
      reports: [...seedReports],
      comments: [...seedComments],
      notifications: [...seedNotifications],
      auditLogs: [...seedAuditLogs],
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  public resetToSeeds() {
    this.data = {
      users: JSON.parse(JSON.stringify(seedUsers)),
      departments: JSON.parse(JSON.stringify(seedDepartments)),
      categories: JSON.parse(JSON.stringify(seedCategories)),
      reports: JSON.parse(JSON.stringify(seedReports)),
      comments: JSON.parse(JSON.stringify(seedComments)),
      notifications: JSON.parse(JSON.stringify(seedNotifications)),
      auditLogs: JSON.parse(JSON.stringify(seedAuditLogs)),
    };
    this.save();
    return this.data;
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- Departments ---
  public getDepartments(): Department[] {
    return this.data.departments;
  }

  public findDepartmentById(id: string): Department | undefined {
    return this.data.departments.find((d) => d.id === id);
  }

  public createDepartment(dept: Department): Department {
    this.data.departments.push(dept);
    this.save();
    return dept;
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const idx = this.data.departments.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.departments[idx] = { ...this.data.departments[idx], ...updates };
    this.save();
    return this.data.departments[idx];
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public findCategoryById(id: string): Category | undefined {
    return this.data.categories.find((c) => c.id === id);
  }

  // --- Reports ---
  public getReports(): Report[] {
    return this.data.reports;
  }

  public findReportById(id: string): Report | undefined {
    return this.data.reports.find((r) => r.id === id);
  }

  public createReport(report: Report): Report {
    this.data.reports.unshift(report);

    // Update department active count
    if (report.departmentId) {
      const dept = this.findDepartmentById(report.departmentId);
      if (dept) {
        dept.activeIssuesCount += 1;
      }
    }

    this.save();
    return report;
  }

  public updateReport(id: string, updates: Partial<Report>): Report | null {
    const idx = this.data.reports.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const oldReport = this.data.reports[idx];
    const updated = {
      ...oldReport,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If status changed to Resolved/Verified
    if (
      (oldReport.status !== 'Resolved' && updated.status === 'Resolved') ||
      (oldReport.status !== 'Verified' && updated.status === 'Verified')
    ) {
      if (updated.departmentId) {
        const dept = this.findDepartmentById(updated.departmentId);
        if (dept && dept.activeIssuesCount > 0) {
          dept.activeIssuesCount -= 1;
          dept.resolvedIssuesCount += 1;
        }
      }
    }

    this.data.reports[idx] = updated;
    this.save();
    return updated;
  }

  public deleteReport(id: string): boolean {
    const idx = this.data.reports.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.data.reports.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Comments ---
  public getCommentsByReportId(reportId: string): Comment[] {
    return this.data.comments
      .filter((c) => c.reportId === reportId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public addComment(comment: Comment): Comment {
    this.data.comments.push(comment);
    this.save();
    return comment;
  }

  // --- Notifications ---
  public getNotificationsByUserId(userId: string): Notification[] {
    return this.data.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: Notification): Notification {
    this.data.notifications.unshift(notification);
    this.save();
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): boolean {
    let changed = false;
    this.data.notifications.forEach((n) => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) this.save();
    return true;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }
}

export const db = new Database();

// Helper: Haversine distance in meters
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
