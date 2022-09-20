import React, { useEffect, useRef, useState } from "react";

const ReceiveCanvas = ({ height, width, socket }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawColor, setDrawColor] = useState("black");

  const draw = (canvasData) => {
    const { x, y } = canvasData;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const startDrawing = (canvasData) => {
    const { x, y } = canvasData;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = drawColor;
    context.lineWidth = 5;
    contextRef.current = context;
    socket.on("receive-canvas-data", (canvasData) => {
      draw(canvasData);
    });

    socket.on("receive-stop-drawing", () => {
      finishDrawing();
    });

    socket.on("receive-start-drawing", (canvasData) => {
      startDrawing(canvasData);
    });
  }, []);

  return (
    <div className="field">
      <canvas
        id="canvas"
        ref={canvasRef}
        height={height}
        width={width}
      ></canvas>
    </div>
  );
};

export default ReceiveCanvas;
