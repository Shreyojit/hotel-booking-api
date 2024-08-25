import Redis from 'ioredis';

// Connect to Redis using the REDIS_URL environment variable
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = new Redis(redisUrl);

// Test the connection
client.on('connect', () => {
  console.log('Connected to Redis server');
});

// Handle connection errors
client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default client;
