import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  raceId: string;
  message: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
  };
}

interface UseChatProps {
  raceId: string;
  userId: string;
  userName: string;
}

let socket: Socket | null = null;

export const useChat = ({ raceId, userId, userName }: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection only if it doesn't exist
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
      socket = io(socketUrl, {
        path: '/api/socket',
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    function onConnect() {
      setIsConnected(true);
      setError(null);
    }

    function onDisconnect() {
      setIsConnected(false);
      setIsJoined(false);
    }

    function onError(err: Error) {
      setError(`Connection error: ${err.message}`);
    }

    // Register event handlers
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    // If socket is already connected, set state accordingly
    if (socket.connected) {
      setIsConnected(true);
    }

    // Cleanup on unmount
    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('connect_error', onError);
    };
  }, []);

  // Handle race-specific messages
  useEffect(() => {
    if (!socket) return;

    function onRaceMessage(message: ChatMessage) {
      setMessages((prev) => [...prev, message]);
    }

    function onRaceHistory(history: ChatMessage[]) {
      setMessages(history);
    }

    // Register race-specific event handlers
    socket.on(`race:${raceId}:message`, onRaceMessage);
    socket.on(`race:${raceId}:history`, onRaceHistory);

    // Cleanup on unmount or race change
    return () => {
      socket?.off(`race:${raceId}:message`, onRaceMessage);
      socket?.off(`race:${raceId}:history`, onRaceHistory);
    };
  }, [raceId]);

  // Join race chat room
  const joinRaceChat = useCallback(() => {
    if (!socket || !isConnected) return;

    socket.emit('race:join', { raceId, userId, userName }, (response: { success: boolean }) => {
      if (response.success) {
        setIsJoined(true);
        setError(null);
      } else {
        setError('Failed to join race chat');
      }
    });
  }, [raceId, userId, userName, isConnected]);

  // Leave race chat room
  const leaveRaceChat = useCallback(() => {
    if (!socket || !isConnected || !isJoined) return;

    socket.emit('race:leave', { raceId, userId }, (response: { success: boolean }) => {
      if (response.success) {
        setIsJoined(false);
      }
    });
  }, [raceId, userId, isConnected, isJoined]);

  // Send message to race chat
  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !isConnected || !isJoined) return;

      socket.emit(
        'race:message',
        {
          raceId,
          message,
          userId,
          userName,
        },
        (response: { success: boolean; error?: string }) => {
          if (!response.success && response.error) {
            setError(response.error);
          }
        }
      );
    },
    [raceId, userId, userName, isConnected, isJoined]
  );

  return {
    messages,
    isConnected,
    isJoined,
    error,
    joinRaceChat,
    leaveRaceChat,
    sendMessage,
  };
};
