import {
  users,
  devices,
  locations,
  calls,
  messages,
  photos,
  recordings,
  commands,
  settings,
  type UpsertUser,
  type User,
  type InsertDevice,
  type Device,
  type InsertLocation,
  type Location,
  type InsertCall,
  type Call,
  type InsertMessage,
  type Message,
  type InsertPhoto,
  type Photo,
  type InsertRecording,
  type Recording,
  type InsertCommand,
  type Command,
  type InsertSettings,
  type Settings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Device operations
  getDevices(userId: string): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  
  // Location operations
  getLocations(deviceId: number, limit?: number): Promise<Location[]>;
  getLocationsByDateRange(deviceId: number, startDate: Date, endDate: Date): Promise<Location[]>;
  addLocation(location: InsertLocation): Promise<Location>;
  
  // Call operations
  getCalls(deviceId: number, limit?: number): Promise<Call[]>;
  addCall(call: InsertCall): Promise<Call>;
  
  // Message operations
  getMessages(deviceId: number, limit?: number): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  
  // Photo operations
  getPhotos(deviceId: number, limit?: number): Promise<Photo[]>;
  addPhoto(photo: InsertPhoto): Promise<Photo>;
  
  // Recording operations
  getRecordings(deviceId: number, limit?: number): Promise<Recording[]>;
  addRecording(recording: InsertRecording): Promise<Recording>;
  
  // Command operations
  getCommands(deviceId: number, limit?: number): Promise<Command[]>;
  getCommandsByUser(userId: string, limit?: number): Promise<Command[]>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommandStatus(id: number, status: string, executedAt?: Date): Promise<Command | undefined>;
  
  // Settings operations
  getSettings(userId: string): Promise<Settings | undefined>;
  createOrUpdateSettings(userId: string, settings: Partial<InsertSettings>): Promise<Settings>;
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

  // Device operations
  async getDevices(userId: string): Promise<Device[]> {
    return await db
      .select()
      .from(devices)
      .where(eq(devices.userId, userId))
      .orderBy(desc(devices.lastActivity));
  }

  async getDevice(id: number): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const [newDevice] = await db.insert(devices).values(device).returning();
    return newDevice;
  }

  async updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device | undefined> {
    const [updatedDevice] = await db
      .update(devices)
      .set({ ...device, updatedAt: new Date() })
      .where(eq(devices.id, id))
      .returning();
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    const [deletedDevice] = await db
      .delete(devices)
      .where(eq(devices.id, id))
      .returning();
    return !!deletedDevice;
  }

  // Location operations
  async getLocations(deviceId: number, limit?: number): Promise<Location[]> {
    let query = db
      .select()
      .from(locations)
      .where(eq(locations.deviceId, deviceId))
      .orderBy(desc(locations.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getLocationsByDateRange(deviceId: number, startDate: Date, endDate: Date): Promise<Location[]> {
    return await db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.deviceId, deviceId),
          gte(locations.timestamp, startDate),
          lte(locations.timestamp, endDate)
        )
      )
      .orderBy(locations.timestamp);
  }

  async addLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  // Call operations
  async getCalls(deviceId: number, limit?: number): Promise<Call[]> {
    let query = db
      .select()
      .from(calls)
      .where(eq(calls.deviceId, deviceId))
      .orderBy(desc(calls.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async addCall(call: InsertCall): Promise<Call> {
    const [newCall] = await db.insert(calls).values(call).returning();
    return newCall;
  }

  // Message operations
  async getMessages(deviceId: number, limit?: number): Promise<Message[]> {
    let query = db
      .select()
      .from(messages)
      .where(eq(messages.deviceId, deviceId))
      .orderBy(desc(messages.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // Photo operations
  async getPhotos(deviceId: number, limit?: number): Promise<Photo[]> {
    let query = db
      .select()
      .from(photos)
      .where(eq(photos.deviceId, deviceId))
      .orderBy(desc(photos.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async addPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  // Recording operations
  async getRecordings(deviceId: number, limit?: number): Promise<Recording[]> {
    let query = db
      .select()
      .from(recordings)
      .where(eq(recordings.deviceId, deviceId))
      .orderBy(desc(recordings.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async addRecording(recording: InsertRecording): Promise<Recording> {
    const [newRecording] = await db.insert(recordings).values(recording).returning();
    return newRecording;
  }

  // Command operations
  async getCommands(deviceId: number, limit?: number): Promise<Command[]> {
    let query = db
      .select()
      .from(commands)
      .where(eq(commands.deviceId, deviceId))
      .orderBy(desc(commands.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getCommandsByUser(userId: string, limit?: number): Promise<Command[]> {
    let query = db
      .select({
        command: commands,
        device: {
          id: devices.id,
          name: devices.name
        }
      })
      .from(commands)
      .innerJoin(devices, eq(commands.deviceId, devices.id))
      .where(eq(devices.userId, userId))
      .orderBy(desc(commands.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const result = await query;
    return result.map(({ command }) => command);
  }

  async createCommand(command: InsertCommand): Promise<Command> {
    const [newCommand] = await db.insert(commands).values(command).returning();
    return newCommand;
  }

  async updateCommandStatus(id: number, status: string, executedAt?: Date): Promise<Command | undefined> {
    const [updatedCommand] = await db
      .update(commands)
      .set({ 
        status,
        executedAt: executedAt || (status === 'executed' ? new Date() : undefined),
      })
      .where(eq(commands.id, id))
      .returning();
    return updatedCommand;
  }

  // Settings operations
  async getSettings(userId: string): Promise<Settings | undefined> {
    const [userSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId));
    return userSettings;
  }

  async createOrUpdateSettings(userId: string, settingsData: Partial<InsertSettings>): Promise<Settings> {
    // First check if settings exist for this user
    const existingSettings = await this.getSettings(userId);
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(settings)
        .set({ 
          ...settingsData,
          updatedAt: new Date()
        })
        .where(eq(settings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings
      const [newSettings] = await db
        .insert(settings)
        .values({ 
          userId, 
          ...settingsData
        })
        .returning();
      return newSettings;
    }
  }
}

export const storage = new DatabaseStorage();
