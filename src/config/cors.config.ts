import cors from 'cors';

const appCors = cors({
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3001',
  ],
  credentials: true,
});

export default appCors;
