import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server } from 'http';

// Global WebSocket server instance
let wssInstance: WebSocketServer | null = null;
let server: Server | null = null;

export interface RFIDEvent {
  type: 'borrowing' | 'returning' | 'theft';
  data: {
    bookId: string;
    bookTitle: string;
    studentId?: string;
    position: 'desk' | 'door';
    timestamp: string;
  };
}

export function initializeWebSocketServer() {
  if (wssInstance) {
    return wssInstance;
  }

  // Create HTTP server for WebSocket
  server = createServer();
  
  // Create WebSocket server
  wssInstance = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wssInstance.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message: Buffer) => {
      console.log('Received message:', message.toString());
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to RFID Library WebSocket' }));
  });

  // Start the server on port 3001 (separate from Next.js)
  const PORT = process.env.WS_PORT || 3001;
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });

  return wssInstance;
}

export function broadcastToClients(event: RFIDEvent) {
  if (!wssInstance) {
    console.error('WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify(event);
  
  wssInstance.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log('Broadcasted event:', event.type, 'to', wssInstance.clients.size, 'clients');
}

export function getWebSocketServer() {
  return wssInstance;
}
