




import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { localStorageService } from './localStorageService';
import useAddMessage from '../utils/useAddMessage';
import eventEmitter from './thunderEventsService';



var options = {
  broadcaster: 'pusher',
  key: import.meta.env.VITE_ECHO_KEY,
  cluster: import.meta.env.VITE_ECHO_CLUSTER,
  forceTLS: import.meta.env.VITE_ECHO_FORCE_TLS === 'true',

  // wsHost: import.meta.env.VITE_ECHO_WS_HOST,
  // wsPort: import.meta.env.VITE_ECHO_WS_PORT,
  // wssPort: import.meta.env.VITE_ECHO_WSS_PORT,
  authEndpoint: 'https://api.thunder.webify.pro/api' + '/broadcasting/auth',
  auth: {
    headers: {
      Authorization: 'Bearer ' + localStorageService.getUserToken(),
    },
  },
};

const channelListener = () => {
  // const addMessage = useAddMessage
  const pusher = new Pusher(import.meta.env.VITE_ECHO_KEY, options);
  const echo = new Echo(options);
  // console.log("WebSocket URL:", echo.connector.options);
  const computeEvents = (data: any) => {

    switch (data.type_event) {
      case 'PROGRESSING_COMMAND':
        break;
      case 'COMMAND_ASSIGNED':
        break;
      case 'NEW_ADMIN_MESSAGE':
        eventEmitter.emit('NEW_ADMIN_MESSAGE', data.message);
        break;
        case 'HOME_DATA_CHANGED':
          break;
          case 'COMMAND_UPDATED':
        eventEmitter.emit('COMMAND_UPDATED', data.message);
        break;
      case 'BONUS_UPDATED':
        break;

    }
  }
  const ClientChannel = echo.private('.client.' + localStorageService.getUserId());
  const PublicChannel = echo.channel('public');

  ClientChannel.listen('.action', (data: any) => {
    computeEvents(data);
  });

  PublicChannel.listen('.action', (data: any) => {
    computeEvents(data);
  });

}

export default channelListener

