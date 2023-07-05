import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import eventEmitter from './thunderEventsService';

class WebSocket {
  private static instance: WebSocket;
  private echo: Echo;
  private clientChannel: any;
  private publicChannel: any;
  pusher: Pusher;

  private constructor() {
    const options = {
      broadcaster: 'pusher',
      key: import.meta.env.VITE_ECHO_KEY,
      cluster: import.meta.env.VITE_ECHO_CLUSTER,
      forceTLS: import.meta.env.VITE_ECHO_FORCE_TLS === 'true',
      authEndpoint: 'https://api.thunder.webify.pro/api' + '/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          Accept: 'application/json',
        },
      },
    };

    this.pusher = new Pusher(import.meta.env.VITE_ECHO_KEY, options);
    this.echo = new Echo(options);
    this.clientChannel = this.echo.private(
      '.client.' + localStorage.getItem('userId')
    );
    this.publicChannel = this.echo.channel('public');

    this.clientChannel.listen('.action', (data: any) => {
      this.computeEvents(data);
    });

    this.publicChannel.listen('.action', (data: any) => {
      this.computeEvents(data);
    });
  }

  public static getInstance(): WebSocket {
    if (!WebSocket.instance) {
      WebSocket.instance = new WebSocket();
    }

    return WebSocket.instance;
  }
  public computeEvents(data: any): void {
    switch (data.type_event) {
      case 'PROGRESSING_COMMAND':
        // eventEmitter.emit('commandProgressing');
        // Handle PROGRESSING_COMMAND event
        console.log(data);

        break;
      case 'COMMAND_ASSIGNED':
        // Handle COMMAND_ASSIGNED event
        // eventEmitter.emit('commandAssigned');
        console.log(data);
        break;
      case 'NEW_ADMIN_MESSAGE':
        // Handle NEW_ADMIN_MESSAGE event
        console.log(data);
        break;
      case 'HOME_DATA_CHANGED':
        // Handle HOME_DATA_CHANGED event
        eventEmitter.emit('homeDataChanged');
        break;
      case 'COMMAND_UPDATED':
        // Handle COMMAND_UPDATED event
        eventEmitter.emit('commandUpdated');
        console.log(data);
        break;
      default:
        break;
    }
  }
}

export default WebSocket;
