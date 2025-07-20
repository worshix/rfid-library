#!/usr/bin/env node

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Create HTTP server for WebSocket
const server = createServer();

// Create WebSocket server
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send welcome message
  ws.send(JSON.stringify({ type: 'connection', message: 'Connected to RFID Library WebSocket' }));
});

// Start the server on port 3001 (separate from Next.js)
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🔌 WebSocket server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  server.close(() => {
    process.exit(0);
  });
});
