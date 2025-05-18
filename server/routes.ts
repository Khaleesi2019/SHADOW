import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDeviceSchema, insertCommandSchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Device routes
  app.get('/api/devices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const devices = await storage.getDevices(userId);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.get('/api/devices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device" });
      }

      res.json(device);
    } catch (error) {
      console.error("Error fetching device:", error);
      res.status(500).json({ message: "Failed to fetch device" });
    }
  });

  app.post('/api/devices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deviceData = insertDeviceSchema.parse({ ...req.body, userId });
      const newDevice = await storage.createDevice(deviceData);
      res.status(201).json(newDevice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      console.error("Error creating device:", error);
      res.status(500).json({ message: "Failed to create device" });
    }
  });

  app.put('/api/devices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to update this device" });
      }

      const updatedDevice = await storage.updateDevice(deviceId, req.body);
      res.json(updatedDevice);
    } catch (error) {
      console.error("Error updating device:", error);
      res.status(500).json({ message: "Failed to update device" });
    }
  });

  app.delete('/api/devices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to delete this device" });
      }

      const deleted = await storage.deleteDevice(deviceId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete device" });
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      res.status(500).json({ message: "Failed to delete device" });
    }
  });

  // Location routes
  app.get('/api/devices/:id/locations', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's locations" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const locations = await storage.getLocations(deviceId, limit);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Date range locations
  app.get('/api/devices/:id/locations/range', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Both startDate and endDate parameters are required" });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's locations" });
      }

      const locations = await storage.getLocationsByDateRange(deviceId, start, end);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations by date range:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Call and SMS routes
  app.get('/api/devices/:id/calls', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's calls" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const calls = await storage.getCalls(deviceId, limit);
      res.json(calls);
    } catch (error) {
      console.error("Error fetching calls:", error);
      res.status(500).json({ message: "Failed to fetch calls" });
    }
  });

  app.get('/api/devices/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's messages" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const messages = await storage.getMessages(deviceId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Photo and recording routes
  app.get('/api/devices/:id/photos', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's photos" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const photos = await storage.getPhotos(deviceId, limit);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get('/api/devices/:id/recordings', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's recordings" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const recordings = await storage.getRecordings(deviceId, limit);
      res.json(recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  // Command routes
  app.get('/api/devices/:id/commands', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to access this device's commands" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const commands = await storage.getCommands(deviceId, limit);
      res.json(commands);
    } catch (error) {
      console.error("Error fetching commands:", error);
      res.status(500).json({ message: "Failed to fetch commands" });
    }
  });

  app.get('/api/commands', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const commands = await storage.getCommandsByUser(userId, limit);
      res.json(commands);
    } catch (error) {
      console.error("Error fetching user commands:", error);
      res.status(500).json({ message: "Failed to fetch commands" });
    }
  });

  app.post('/api/devices/:id/commands', isAuthenticated, async (req: any, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Check if user owns this device
      if (device.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to send commands to this device" });
      }

      const commandData = insertCommandSchema.parse({ ...req.body, deviceId });
      const newCommand = await storage.createCommand(commandData);
      
      // In a real application, this would send the command to the actual device
      // For this demo, we'll just mark it as executed after a short delay
      setTimeout(async () => {
        await storage.updateCommandStatus(newCommand.id, 'executed');
      }, 2000);
      
      res.status(201).json(newCommand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid command data", errors: error.errors });
      }
      console.error("Error creating command:", error);
      res.status(500).json({ message: "Failed to create command" });
    }
  });

  // Settings routes
  app.get('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userSettings = await storage.getSettings(userId);
      
      if (!userSettings) {
        // Create default settings if none exist
        const defaultSettings = await storage.createOrUpdateSettings(userId, {});
        return res.json(defaultSettings);
      }
      
      res.json(userSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = req.body;
      
      // Validate settings data
      const validatedData = insertSettingsSchema.partial().parse(settingsData);
      
      const updatedSettings = await storage.createOrUpdateSettings(userId, validatedData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
