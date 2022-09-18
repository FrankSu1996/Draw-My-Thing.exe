import "./App.css";
import { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";

function App() {
  const [loadCanvasData, setLoadCanvasData] = useState(null);
  const saveableCanvas = useRef(null);
  const loadableCanvas = useRef(null);

  return (
    <div className="App">
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
      <button
        onClick={() => {
          console.log("saving canvas...");
          localStorage.setItem(
            "savedDrawing",
            saveableCanvas.current.getSaveData()
          );
        }}
      >
        Save Canvas
      </button>
      <button
        onClick={() => {
          setLoadCanvasData(localStorage.getItem("savedDrawing"));
        }}
      >
        Load Saved canvas
      </button>
      <CanvasDraw ref={saveableCanvas} canvasWidth={500} canvasHeight={500} />
      <CanvasDraw
        ref={loadableCanvas}
        canvasWidth={500}
        canvasHeight={500}
        saveData={loadCanvasData}
      />
    </div>
  );
}

export default App;
