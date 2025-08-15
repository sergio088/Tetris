"use client";

import { useState, useEffect, useRef } from "react";

export default function CampoTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    desenharCampo(ctx);
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas ref={canvasRef} width={200} height={400} />
    </div>
  );
}
