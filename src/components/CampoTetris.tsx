"use client";

import { useState, useEffect, useRef } from "react";

export default function CampoTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peçaI = [
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
  ];
  const peçaO = [
    [4, 0],
    [5, 0],
    [4, 1],
    [5, 1],
  ];
  const peçaT = [
    [3, 0],
    [4, 0],
    [4, 1],
    [5, 0],
  ];
  const peçaL = [
    [3, 0],
    [3, 1],
    [4, 0],
    [5, 0],
  ];
  const peça7 = [
    [3, 0],
    [4, 0],
    [5, 0],
    [5, 1],
  ];
  const peçaZ = [
    [3, 0],
    [4, 0],
    [4, 1],
    [5, 1],
  ];
  const peçaS = [
    [3, 1],
    [4, 1],
    [4, 0],
    [5, 0],
  ];
  const [peças] = useState<number[][][]>([
    peçaI,
    peçaO,
    peçaT,
    peçaL,
    peça7,
    peçaZ,
    peçaS,
  ]);

  function desenharCampo(ctx: CanvasRenderingContext2D | null | undefined) {
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        ctx!.fillRect(x * 20, y * 20, 20, 20);
        ctx!.fillStyle = "black";
        ctx!.strokeStyle = "white";
        ctx!.lineWidth = 1;
        ctx!.strokeRect(x * 20, y * 20, 20, 20);
      }
    }
  }

  const peçaAtual = () => {
    const n = Math.floor(Math.random() * 8);
    return n;
  };

  let n = peçaAtual();

  function desenharPeças(ctx: CanvasRenderingContext2D | null | undefined) {
    peças[n].forEach((p) => {
      ctx!.fillStyle = "orange";
      ctx!.fillRect(p[0] * 20, p[1] * 20, 20, 20);
    });
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    desenharCampo(ctx);
    peçaAtual();
    desenharPeças(ctx);
  });

  useEffect(() => {
    function gameloop() {
      requestAnimationFrame(gameloop);
    }
    requestAnimationFrame(gameloop);
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas ref={canvasRef} width={200} height={400} />
    </div>
  );
}
