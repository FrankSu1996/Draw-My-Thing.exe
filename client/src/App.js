import "./App.scss";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SendCanvas, ReceiveCanvas } from "./Components/Canvas";

let socketUrl = "http://localhost:3001";
// if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
//   socketUrl = "http://localhost:3001";
// } else {
//   socketUrl = "https://drawmything.herokuapp.com";
// }
const socket = io(socketUrl);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="App">
      <div>Is connected: {" " + isConnected}</div>
      <SendCanvas
        height={400}
        width={window.innerWidth - 60}
        socket={socket}
      ></SendCanvas>
      <ReceiveCanvas
        height={400}
        width={window.innerWidth - 60}
        socket={socket}
      ></ReceiveCanvas>
    </div>
  );
}

export default App;
