import React from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
console.log(socket);

const App = () => <div className="App" />;

export default App;
