import app from '../app';

app.io.on('connection', (socket) => {
  console.log(socket);
});

console.log('This file is accessed');
