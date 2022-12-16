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

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, width, height);
  };

  const undoOperation = (canvasData) => {
    const { undoSteps, undo } = canvasData;
    if (undo > 0) {
      const data = undoSteps[undo];
      contextRef.current.strokeStyle = "white";
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
      contextRef.current.strokeStyle = "black";
    }
  };

  const redoOperation = (canvasData) => {
    const { redoStep, redo } = canvasData;
    if (redo > 0) {
      const data = redoStep[redo];
      contextRef.current.strokeStyle = "black";
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
    }
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

    socket.on("receive-clear-canvas", () => {
      clearCanvas();
    });

    socket.on("receive-canvas-undo", (canvasData) => {
      undoOperation(canvasData);
    });
    socket.on("receive-canvas-redo", (canvasData) => {
      redoOperation(canvasData);
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
