import React, { useEffect, useRef, useState } from "react";

const SendCanvas = ({ height, width, socket }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawColor, setDrawColor] = useState("black");
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = drawColor;
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("send-start-drawing", { x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    socket.emit("send-stop-drawing");
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit("send-canvas-data", { x: offsetX, y: offsetY });
  };

  return (
    <div className="field">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        id="canvas"
        ref={canvasRef}
        height={height}
        width={width}
      ></canvas>
      <div className="tools">
        <button type="button" className="button">
          Undo
        </button>
        <button type="button" className="button">
          Clear
        </button>

        <div className="color-field" style={{ background: "red" }}></div>
        <div className="color-field" style={{ background: "blue" }}></div>
        <div className="color-field" style={{ background: "green" }}></div>
        <div className="color-field" style={{ background: "yellow" }}></div>

        <input type="color" className="color-picker"></input>
        <input type="range" min={1} max={100} className="pen-range"></input>
      </div>
    </div>
  );
};

export default SendCanvas;
