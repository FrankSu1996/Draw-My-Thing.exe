import "./App.css";
import { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const saveableCanvas = useRef(null);
  const loadableCanvas = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("receive-canvas-data", (canvasData) => {
      if (loadableCanvas) {
        loadableCanvas.current.loadSaveData(canvasData, true);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ping");
    };
  }, []);

  return (
    <div className="App">
      <div>
        <p>Connected: {"" + isConnected}</p>
      </div>
      <button
        onClick={() => {
          saveableCanvas.current.undo();
        }}
      >
        Undo
      </button>
      <button
        onClick={() => {
          saveableCanvas.current.eraseAll();
        }}
      >
        Erase
      </button>
      <CanvasDraw
        ref={saveableCanvas}
        canvasWidth={500}
        canvasHeight={500}
        onChange={() => {
          socket.emit("send-canvas-data", saveableCanvas.current.getSaveData());
        }}
      />
      <CanvasDraw ref={loadableCanvas} canvasWidth={500} canvasHeight={500} />
    </div>
  );
}

export default App;
