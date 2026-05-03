import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: Socket;

  public static getInstance(): Socket {
    if (!SocketService.instance) {
      SocketService.instance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost', {
        path: '/socket.io',
        transports: ['websocket'],
      });
    }
    return SocketService.instance;
  }
}

export default SocketService;
