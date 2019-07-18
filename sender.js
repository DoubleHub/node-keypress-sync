const ws = require("websocket");
const io = require('iohook');

const HOSTNAME = "or2.life:8080";
const PROTOCOL_NAME = "keypress-protocol";

const client = new ws.client();

client.on("connectFailed", (err) => {
    console.log((new Date()) + " Client connection error: " + err.toString());
});

client.on("connect", connection => {
    console.log((new Date()) + " WebSocket client connected! Have fun!");

    connection.on("error", (err) => {
        console.log((new Date()) + " Connection error: " + err.toString());
    });

    connection.on("close", () => {
        console.log((new Date()) + " Connection closed!");
    });

    io.on("keydown", event => {
        if (event.keycode === 57 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
            console.log((new Date()) + " Space pressed!");
            connection.sendUTF('S');
        }
    });
    io.start();
});

client.connect("ws://" + HOSTNAME, PROTOCOL_NAME);