#!/usr/bin/env node

/**
 * Standalone WebSocket server for RFID Library
 * This script starts the WebSocket server on port 3001
 * Run this before starting your Next.js development server
 */

import { initializeWebSocketServer } from '../lib/websocket-server.js';

console.log('Starting RFID Library WebSocket Server...');
console.log('Make sure to run this before starting your Next.js app with npm run dev');

initializeWebSocketServer();

console.log('WebSocket server is ready to receive connections!');
console.log('Next.js app should connect to ws://localhost:3001/ws');
