import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RoleService } from '../../services/role.service';

let mongoServer: MongoMemoryServer;

export async function setupTestDatabase(): Promise<void> {
  try {
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create and start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    await RoleService.setUpRolePermission();

    console.log('Connected to in-memory test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
}

export async function teardownTestDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from test database');
    }

    // Stop the MongoDB Memory Server
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
}

export const clearTestDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (key === 'roles' || key === 'permissions') {
      continue;
    } // Skip roles & permissions collection

    const collection = collections[key];
    await collection.deleteMany({});
  }
};
