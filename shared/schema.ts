import {
  pgTable,
  text,
  serial,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Devices table
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  deviceType: text("device_type").notNull(), // e.g., 'smartphone', 'tablet', 'laptop'
  platform: text("platform").notNull(), // e.g., 'iOS', 'Android', 'Windows'
  status: text("status").default("offline"), // 'online', 'offline', 'idle'
  lastActivity: timestamp("last_activity"),
  battery: integer("battery"), // Battery percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  address: text("address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Calls table
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  phoneNumber: text("phone_number").notNull(),
  callType: text("call_type").notNull(), // 'incoming', 'outgoing', 'missed'
  duration: integer("duration"), // in seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

// SMS messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  phoneNumber: text("phone_number").notNull(),
  messageType: text("message_type").notNull(), // 'incoming', 'outgoing'
  content: text("content"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Photos table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  photoUrl: text("photo_url").notNull(),
  source: text("source"), // 'front_camera', 'back_camera'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Audio recordings table
export const recordings = pgTable("recordings", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  recordingUrl: text("recording_url").notNull(),
  duration: integer("duration"), // in seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

// Commands table
export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  commandType: text("command_type").notNull(), // 'alarm', 'lock', 'wipe', 'photo', 'recording'
  status: text("status").default("pending"), // 'pending', 'executed', 'failed'
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stealthMode: boolean("stealth_mode").default(false),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  trackingInterval: integer("tracking_interval").default(15), // in minutes
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  timestamp: true,
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  timestamp: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  timestamp: true,
});

export const insertRecordingSchema = createInsertSchema(recordings).omit({
  id: true,
  timestamp: true,
});

export const insertCommandSchema = createInsertSchema(commands).omit({
  id: true,
  status: true,
  executedAt: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertRecording = z.infer<typeof insertRecordingSchema>;
export type Recording = typeof recordings.$inferSelect;

export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type Command = typeof commands.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
