import React, { useEffect, useRef, useState } from "react";

const SendCanvas = ({ height, width, socket }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawColor, setDrawColor] = useState("black");
  const [isDrawing, setIsDrawing] = useState(false);
  const [undo, setUndo] = useState(0);
  const [undoSteps, setUndoSteps] = useState({});
  const [redoStep, setRedoStep] = useState({});
  const [redo, setRedo] = useState(0);

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
    const temp = {
      ...undoSteps,
      [undo + 1]: [],
    };
    temp[undo + 1].push({ offsetX, offsetY });
    setUndoSteps(temp);
    setUndo((undo) => undo + 1);
    socket.emit("send-start-drawing", {
      x: offsetX,
      y: offsetY,
    });
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
    const temp = {
      ...undoSteps,
    };
    temp[undo].push({ offsetX, offsetY });
    setUndoSteps(temp);
    socket.emit("send-canvas-data", {
      x: offsetX,
      y: offsetY,
    });
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, width, height);
    socket.emit("send-clear-canvas");
    setUndo(0);
    setUndoSteps({});
  };

  const undoOperation = () => {
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
      const temp = {
        ...undoSteps,
        [undo]: [],
      };
      const te = {
        ...redoStep,
        [redo + 1]: [...data],
      };
      setUndo((undo) => undo - 1);
      setRedo((redo) => redo + 1);
      setRedoStep(te);
      setUndoSteps(temp);
    }
    socket.emit("send-canvas-undo", {
      undoSteps,
      undo,
    });
  };

  const redoOperation = () => {
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
      const temp = {
        ...redoStep,
        [redo]: [],
      };
      setUndo((undo) => undo + 1);
      setRedo((redo) => redo - 1);
      setRedoStep(temp);
      setUndoSteps({
        ...undoSteps,
        [undo + 1]: [...data],
      });
    }
    socket.emit("send-canvas-redo", {
      redoStep,
      redo,
    });
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
        <button
          type="button"
          className="button"
          disabled={undo === 0}
          onClick={undoOperation}
        >
          Undo
        </button>
        <button
          type="button"
          className="button"
          disabled={redo === 0}
          onClick={redoOperation}
        >
          Redo
        </button>
        <button type="button" className="button" onClick={clearCanvas}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SendCanvas;
