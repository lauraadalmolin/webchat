import socketClient from 'socket.io-client';

const SERVER = 'http://192.168.0.115:8080';

export const socket = socketClient(SERVER);
