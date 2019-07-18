const ws = require("websocket");
const ks = require("node-key-sender");

const PROTOCOL_NAME = "keypress-protocol"

const client = new ws.client();

client.on("connectFailed", (err) => {
    console.log((new Date()) + " Client connection error: " + error.toString());
});

client.on("connect", connection => {
    console.log((new Date()) + " WebSocket client connected! Have fun!");

    connection.on("error", (err) => {
        console.log((new Date()) + " Connection error: " + err.toString());
    });

    connection.on("close", () => {
        console.log((new Date()) + " Connection closed!");
    });

    connection.on("message", message => {
        if (message.type === "utf8" && message.utf8Data === 'S') {
            ks.sendKey("space");
        }
    });
});

client.connect("ws://93.43.180.58:8080/", PROTOCOL_NAME);