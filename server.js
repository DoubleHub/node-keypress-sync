const ws = require("websocket");
const http = require("http");

const PROTOCOL_NAME = "keypress-protocol"

const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

const wsServer = new ws.server({
    httpServer: server,
    autoAcceptConnections: false,
});

// Map of clients connected
const connections = {}

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
    connections = {
        ...connections,
        [connection.remoteAddress]: connection
    };

    connection.on("message", message => {
        if (message.type === "utf8" && message.utf8Data === 'S') {
            console.log((new Date()) + " Relaying space request");
            Object.entries(connections).forEach(
                ([address, connection]) => connection.sendUTF('S')
            );
        }
    });

    connection.on("close", () => {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected");
        delete connections[connection.remoteAddress];
    });
});

server.listen(8080, () => {
    console.log((new Date()) + " Server is listening on port 80");
});