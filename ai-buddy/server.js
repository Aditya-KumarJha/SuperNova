require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { initSocketServer } = require('./src/sockets/socket.server');

const httpServer = http.createServer(app);

initSocketServer(httpServer);

httpServer.listen(4005, () => {
    console.log("AI Buddy service is running on port 4005");
});
