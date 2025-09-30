import {
  setupTestDatabase,
  clearTestDatabase,
  teardownTestDatabase,
} from './utils/setupTestFunctions';

// This runs once before all tests in each test file
beforeAll(async () => {
  await setupTestDatabase();
}, 30000);

// This runs after each test to clean up data
afterEach(async () => {
  await clearTestDatabase();
});

// This runs once after all tests in each test file
afterAll(async () => {
  await teardownTestDatabase();
}, 30000);
