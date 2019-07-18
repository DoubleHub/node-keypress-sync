const ws = require("websocket");
const http = require("http");
const io = require('iohook');

const PROTOCOL_NAME = "keypress-protocol"

const server = http.createServer((req, res) => {
    console.log((new Date()) + " Got request for " + req.url);
    res.writeHead(404);
    res.end();
});

const wsServer = new ws.server({
    httpServer: server,
    autoAcceptConnections: false,
});

// List of clients connected
const connections = [];

function isOriginAllowed(origin) {
    // Logic to allow origin
    return true;
}

wsServer.on("request", req => {
    if (!isOriginAllowed(req.origin)) {
        req.reject();
        console.log((new Date()) + " Connection from origin " + req.origin + " rejected");
        return;
    }

    const connection = req.accept(PROTOCOL_NAME, req.origin);
    console.log((new Date()) + " Connection request accepted");
    connections.push(connection);

    connection.on("close", () => {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected");
        connections.splice(connections.findIndex(c => c.remoteAddress === connection.remoteAddress), 1);
    });
});

io.on("keydown", event => {
    if (event.keycode === 57 &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey) {
        console.log((new Date()) + " Space pressed!");
        connections.forEach(conn => conn.sendUTF('S'));
    }
});
io.start();

server.listen(8080, () => {
    console.log((new Date()) + " Server is listening on port 8080");
});