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
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);
      
      // If this is a broadcast request, relay to all other clients
      if (data.type === 'broadcast' && data.event) {
        console.log('Broadcasting event to all clients:', data.event.type);
        
        wss.clients.forEach((client) => {
          // Don't send back to the sender, and only send to open connections
          if (client !== ws && client.readyState === 1) { // 1 = WebSocket.OPEN
            client.send(JSON.stringify(data.event));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
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
