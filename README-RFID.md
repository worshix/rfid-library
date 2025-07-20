# RFID Library Management System

A real-time RFID-enabled library management system built with Next.js, Prisma, and WebSockets.

## Features

- 📚 **Real-time Book Management**: Track borrowing, returning, and theft detection
- 🏷️ **RFID Integration**: Receive RFID scan events from microcontrollers
- 🔌 **WebSocket Communication**: Real-time dialog popups without polling
- 🚨 **Theft Detection**: Automatic alerts when books are scanned at exit without being borrowed
- 📊 **Dashboard**: Overview of library statistics and activity

## System Architecture

### Components

1. **Next.js Frontend** (Port 3000)
   - Dashboard and UI
   - Real-time dialog components
   - WebSocket client integration

2. **WebSocket Server** (Port 3001) 
   - Real-time communication hub
   - Broadcasts RFID events to connected clients

3. **API Routes**
   - `/api/microcontroller` - Receives RFID scans from hardware
   - `/api/borrowings` - Handle book borrowing/returning
   - `/api/books` - Book management
   - `/api/theft` - Theft alert management

4. **Database** (SQLite with Prisma)
   - Books, Borrowings, Theft Alerts

## Hardware Integration

The system expects RFID microcontrollers to send HTTP POST requests to `/api/microcontroller` with:

```json
{
  "rfidTag": "RFID001",
  "position": "desk" // or "door"
}
```

### Position Logic

- **`desk`**: Borrowing/returning station
  - If book is available → Show borrowing dialog
  - If book is borrowed → Show return dialog
  
- **`door`**: Exit monitoring
  - If book not borrowed → Create theft alert dialog
  - If book properly borrowed → Allow exit

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data
npm run db:seed
```

### 3. Development

Run both servers simultaneously:

```bash
npm run dev:full
```

Or run them separately:

```bash
# Terminal 1: WebSocket Server
npm run ws

# Terminal 2: Next.js Development Server  
npm run dev
```

## Testing

### Simulate RFID Scans

Use the test script to simulate microcontroller requests:

```bash
# Simulate borrowing/returning at desk
node scripts/test-rfid.mjs RFID001 desk

# Simulate theft detection at door  
node scripts/test-rfid.mjs RFID001 door
```

### Test Books Available

The seed script creates these test books:
- `RFID001` - The Great Gatsby
- `RFID002` - To Kill a Mockingbird  
- `RFID003` - 1984
- `RFID004` - Pride and Prejudice
- `RFID005` - The Catcher in the Rye

## Usage Flow

### 1. Borrowing a Book

1. Student scans book at desk (`position: "desk"`)
2. System checks book availability
3. If available → Borrowing dialog appears
4. Staff enters student ID and confirms
5. Book status updated to borrowed

### 2. Returning a Book

1. Student scans borrowed book at desk
2. System detects active borrowing
3. Return dialog appears with pre-filled student info
4. Staff confirms return
5. Book status updated to available

### 3. Theft Detection

1. Book scanned at door (`position: "door"`)  
2. System checks if book is properly borrowed
3. If not borrowed → Theft alert dialog appears
4. Security can acknowledge and investigate

## API Reference

### POST /api/microcontroller

Receives RFID scan from hardware controllers.

**Request:**
```json
{
  "rfidTag": "RFID001",
  "position": "desk"
}
```

**Response:**
```json
{
  "message": "RFID tag RFID001 processed successfully",
  "action": "borrowing",
  "book": "The Great Gatsby"
}
```

### POST /api/borrowings

Create new borrowing record.

**Request:**
```json
{
  "bookId": "RFID001", 
  "studentId": "S12345"
}
```

### PATCH /api/borrowings

Process book return.

**Request:**
```json
{
  "bookId": "RFID001",
  "studentId": "S12345"  
}
```

## WebSocket Events

The system broadcasts these events to connected clients:

### Borrowing Event
```json
{
  "type": "borrowing",
  "data": {
    "bookId": "RFID001",
    "bookTitle": "The Great Gatsby", 
    "position": "desk",
    "timestamp": "2025-07-20T21:30:00.000Z"
  }
}
```

### Returning Event  
```json
{
  "type": "returning",
  "data": {
    "bookId": "RFID001",
    "bookTitle": "The Great Gatsby",
    "studentId": "S12345",
    "position": "desk", 
    "timestamp": "2025-07-20T21:30:00.000Z"
  }
}
```

### Theft Event
```json
{
  "type": "theft", 
  "data": {
    "bookId": "RFID001",
    "bookTitle": "The Great Gatsby",
    "position": "door",
    "timestamp": "2025-07-20T21:30:00.000Z"
  }
}
```

## Database Schema

### Book
- `bookId` (String, Primary Key) - RFID tag identifier
- `title` (String) - Book title
- `isAvailable` (Boolean) - Availability status

### Borrowing  
- `id` (String, Primary Key)
- `bookId` (String, Foreign Key)
- `studentId` (String) - Student identifier
- `borrowedAt` (DateTime) - Borrow timestamp
- `dueDate` (DateTime) - Due date (2 weeks from borrow)
- `returnedAt` (DateTime?) - Return timestamp
- `status` (Enum) - active, returned, overdue

### TheftAlert
- `id` (String, Primary Key)  
- `bookId` (String, Foreign Key)
- `timeStolen` (DateTime) - Alert timestamp

## Deployment

For production deployment:

1. Set up environment variables
2. Configure production database
3. Build the application: `npm run build`
4. Start production servers
5. Configure reverse proxy for WebSocket server

## Troubleshooting

### WebSocket Connection Issues
- Ensure WebSocket server is running on port 3001
- Check firewall settings
- Verify client connection URL

### Database Issues  
- Run `npx prisma generate` after schema changes
- Check database file permissions
- Verify migration status: `npx prisma migrate status`

### RFID Hardware Issues
- Confirm POST requests reach `/api/microcontroller`
- Check request payload format
- Verify network connectivity

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details.
