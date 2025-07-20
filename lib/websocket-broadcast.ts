import WebSocket from 'ws';

let wsClient: WebSocket | null = null;

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

export async function broadcastToClients(event: RFIDEvent) {
  try {
    // Connect to the standalone WebSocket server
    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
      wsClient = new WebSocket('ws://localhost:3001/ws');
      
      // Wait for connection
      await new Promise((resolve, reject) => {
        if (!wsClient) return reject(new Error('WebSocket client not initialized'));
        
        wsClient.onopen = () => resolve(void 0);
        wsClient.onerror = (error) => reject(error);
        
        setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
      });
    }

    // Send the event to the WebSocket server, which will broadcast to all connected clients
    const message = JSON.stringify({ type: 'broadcast', event });
    wsClient.send(message);
    
    console.log('Sent broadcast request:', event.type);
  } catch (error) {
    console.error('Failed to broadcast to WebSocket server:', error);
  }
}
