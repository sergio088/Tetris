"use client";

import { useState, useEffect, useRef } from "react";

export default function CampoTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peçaI = [
    [5, 0],
    [4, 0],
    [3, 0],
    [6, 0],
  ];
  const peçaO = [
    [4, 0],
    [5, 0],
    [4, 1],
    [5, 1],
  ];
  const peçaT = [
    [4, 0],
    [3, 0],
    [4, 1],
    [5, 0],
  ];
  const peçaL = [
    [4, 0],
    [3, 1],
    [3, 0],
    [5, 0],
  ];
  const peça7 = [
    [4, 0],
    [3, 0],
    [5, 0],
    [5, 1],
  ];
  const peçaZ = [
    [4, 1],
    [4, 0],
    [3, 0],
    [5, 1],
  ];
  const peçaS = [
    [4, 1],
    [3, 1],
    [4, 0],
    [5, 0],
  ];
  const [peças, setPosiçaoPeças] = useState<number[][][]>([
    peçaI,
    peçaO,
    peçaT,
    peçaL,
    peça7,
    peçaZ,
    peçaS,
  ]);
  const peçasRef = useRef<number[][][]>(peças);
  const [trocaPeça, setTrocaPeça] = useState(true);
  const nRef = useRef<number>(0);
  const [direçao, setDireçao] = useState("");
  const [peçasCampo, setPeçasCampo] = useState<number[][][]>([]);
  const peçasCampoRef = useRef<number[][][]>([]);

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
    const n = Math.floor(Math.random() * peças.length);
    return n;
  };

  useEffect(() => {
    nRef.current = peçaAtual();
  }, [nRef]);

  useEffect(() => {
    peçasRef.current = peças;
  }, [peças]);

  useEffect(() => {
    peçasCampoRef.current = peçasCampo;
  }, [peçasCampo]);

  function desenharPeças(ctx: CanvasRenderingContext2D | null | undefined) {
    if (trocaPeça) {
      const n = Math.floor(Math.random() * peças.length);
      const peça = peças[n];
      setPeçasCampo((pos) => {
        return [peça, ...pos];
      });
      setTrocaPeça(false);
    }
    for (let i = 0; i <= peçasCampoRef.current.length; i++) {
      peçasCampoRef.current[i].forEach(([x, y]) => {
        ctx!.fillStyle = "orange";
        ctx!.fillRect(x * 20, y * 20, 20, 20);
      });
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    desenharCampo(ctx);
    desenharPeças(ctx);
  }, [peçasCampo]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setDireçao("ArrowUp");
      if (e.key === "ArrowDown") setDireçao("ArrowDown");
      if (e.key === "ArrowRight") setDireçao("ArrowRight");
      if (e.key === "ArrowLeft") setDireçao("ArrowLeft");
    };

    document.addEventListener("keydown", keydown);
  }, []); //mudar direçao

  useEffect(() => {
    setPeçasCampo((pos) => {
      const peça = pos[0];
      let limiteB;
      peça.forEach(([x, y]) => {
        if (y >= 19) limiteB = true;
        if (x <= 0 || x >= 9) {
        }
      });
      if (limiteB) {
        // setTrocaPeça(true);
        peçaAtual();
        // return pos.map((p, i) => (i === nRef.current ? novaPeça : p));
        return pos;
      }

      if (direçao === "ArrowUp") {
        if (nRef.current === 1) return pos;
        const eixo = peça[0];
        const pivot = peça.map(([x, y]) => [x - eixo[0], y - eixo[1]]);
        const rotaçao = pivot.map(([x, y]) => [y, -x]);
        const novaPosiçao = rotaçao.map(([x, y]) => [x + eixo[0], y + eixo[1]]);
        setDireçao("");

        return [novaPosiçao];
      }
      if (direçao === "ArrowDown") {
      }
      if (direçao === "ArrowRight") {
        const novaPosiçao = peça.map(([x, y]) => [x + 1, y]);

        setDireçao("");
        return [novaPosiçao];
      }
      if (direçao === "ArrowLeft") {
        const novaPosiçao = peça.map(([x, y]) => [x - 1, y]);
        setDireçao("");
        return [novaPosiçao];
        // return pos.map((p, i) => (i === nRef.current ? novaPosiçao : p));
      }
      return pos;
    });
    const ctx = canvasRef.current?.getContext("2d");
    desenharCampo(ctx);
    desenharPeças(ctx);
  }, [direçao]); //controle das Arrow

  useEffect(() => {
    let ultimoTempo = 0;
    let acumulador = 0;
    const intervalo = 800;

    function gameloop(tempoAtual: number) {
      if (!ultimoTempo) ultimoTempo = tempoAtual;
      const delta = tempoAtual - ultimoTempo;
      ultimoTempo = tempoAtual;

      acumulador += delta;

      if (acumulador > intervalo) {
        acumulador -= intervalo;
        setPeçasCampo((pos) => {
          const peça = pos[0];
          if (!peça) return pos; // se não existe, não faz nada

          const novaPeça = peça.map(([x, y]): number[] => [x, y + 1]);
          const peçaEmCampo = [];

          let limiteB;
          peça.forEach(([x, y]) => {
            if (y >= 19) limiteB = true;
            if (x <= 0 || x >= 9) {
            }
          });

          if (limiteB) {
            setTrocaPeça(true);
            const ctx = canvasRef.current?.getContext("2d");
            desenharCampo(ctx);
            desenharPeças(ctx);
            setPeçasCampo((p) => {
              return pos;
            });
            peçaAtual();
            limiteB = false;
            return pos;
          }

          return pos.map((p, i) => (i === 0 ? novaPeça : p));
        });
      }
      requestAnimationFrame(gameloop);
    }
    requestAnimationFrame(gameloop);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas ref={canvasRef} width={200} height={400} />
    </div>
  );
}
