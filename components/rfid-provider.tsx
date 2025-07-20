"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { BookBorrowingDialog } from '@/components/book-borrowing-dialog';
import { ReturningBookDialog } from '@/components/returning-book-dialog';
import { BookTheftAlertDialog } from '@/components/book-theft-alert-dialog';

interface RFIDContextValue {
  isConnected: boolean;
  connectionError: string | null;
}

const RFIDContext = createContext<RFIDContextValue | undefined>(undefined);

export function useRFID() {
  const context = useContext(RFIDContext);
  if (!context) {
    throw new Error('useRFID must be used within an RFIDProvider');
  }
  return context;
}

interface RFIDProviderProps {
  children: React.ReactNode;
}

export function RFIDProvider({ children }: RFIDProviderProps) {
  const { isConnected, lastEvent, error } = useWebSocket();
  
  // Dialog states
  const [borrowingDialog, setBorrowingDialog] = useState<{
    open: boolean;
    bookId: string;
    bookTitle: string;
  }>({
    open: false,
    bookId: '',
    bookTitle: '',
  });

  const [returningDialog, setReturningDialog] = useState<{
    open: boolean;
    bookId: string;
    bookTitle: string;
    studentId: string;
  }>({
    open: false,
    bookId: '',
    bookTitle: '',
    studentId: '',
  });

  const [theftDialog, setTheftDialog] = useState<{
    open: boolean;
    bookId: string;
    bookTitle: string;
    theftTime: Date;
  }>({
    open: false,
    bookId: '',
    bookTitle: '',
    theftTime: new Date(),
  });

  // Handle incoming RFID events
  useEffect(() => {
    if (!lastEvent) return;

    console.log('Processing RFID event:', lastEvent);

    switch (lastEvent.type) {
      case 'borrowing':
        setBorrowingDialog({
          open: true,
          bookId: lastEvent.data.bookId,
          bookTitle: lastEvent.data.bookTitle,
        });
        break;

      case 'returning':
        if (lastEvent.data.studentId) {
          setReturningDialog({
            open: true,
            bookId: lastEvent.data.bookId,
            bookTitle: lastEvent.data.bookTitle,
            studentId: lastEvent.data.studentId,
          });
        }
        break;

      case 'theft':
        setTheftDialog({
          open: true,
          bookId: lastEvent.data.bookId,
          bookTitle: lastEvent.data.bookTitle,
          theftTime: new Date(lastEvent.data.timestamp),
        });
        break;

      default:
        console.warn('Unknown RFID event type:', lastEvent.type);
    }
  }, [lastEvent]);

  return (
    <RFIDContext.Provider value={{ isConnected, connectionError: error }}>
      {children}
      
      {/* RFID Event Dialogs */}
      <BookBorrowingDialog
        open={borrowingDialog.open}
        onOpenChange={(open) => setBorrowingDialog(prev => ({ ...prev, open }))}
        bookId={borrowingDialog.bookId}
        bookTitle={borrowingDialog.bookTitle}
      />

      <ReturningBookDialog
        open={returningDialog.open}
        onOpenChange={(open) => setReturningDialog(prev => ({ ...prev, open }))}
        bookId={returningDialog.bookId}
        bookTitle={returningDialog.bookTitle}
        studentId={returningDialog.studentId}
      />

      <BookTheftAlertDialog
        open={theftDialog.open}
        onOpenChange={(open) => setTheftDialog(prev => ({ ...prev, open }))}
        bookId={theftDialog.bookId}
        bookTitle={theftDialog.bookTitle}
        theftTime={theftDialog.theftTime}
      />
    </RFIDContext.Provider>
  );
}
