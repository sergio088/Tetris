"use client";

import { useState, useEffect, useRef } from "react";

export default function CampoTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type Bloco = [number, number, string];
  type Peça = Bloco[];

  const peçaI: Peça = [
    [5, 0, "cyan"],
    [4, 0, "cyan"],
    [3, 0, "cyan"],
    [6, 0, "cyan"],
  ];

  const peçaO: Peça = [
    [4, 0, "yellow"],
    [5, 0, "yellow"],
    [4, 1, "yellow"],
    [5, 1, "yellow"],
  ];

  const peçaT: Peça = [
    [4, 0, "purple"],
    [3, 0, "purple"],
    [4, 1, "purple"],
    [5, 0, "purple"],
  ];

  const peçaL: Peça = [
    [4, 0, "orange"],
    [3, 1, "orange"],
    [3, 0, "orange"],
    [5, 0, "orange"],
  ];

  const peça7: Peça = [
    [4, 0, "blue"], // o J
    [3, 0, "blue"],
    [5, 0, "blue"],
    [5, 1, "blue"],
  ];

  const peçaZ: Peça = [
    [4, 1, "red"],
    [4, 0, "red"],
    [3, 0, "red"],
    [5, 1, "red"],
  ];

  const peçaS: Peça = [
    [4, 1, "green"],
    [3, 1, "green"],
    [4, 0, "green"],
    [5, 0, "green"],
  ];

  const [peças] = useState<Peça[]>([
    peçaI,
    peçaO,
    peçaT,
    peçaL,
    peça7,
    peçaZ,
    peçaS,
  ]);

  const nRef = useRef<number>(0);
  const [direçao, setDireçao] = useState("");
  const [peçasCampo, setPeçasCampo] = useState<Peça[]>([]);
  const peçasCampoRef = useRef<Peça[]>([]);
  const [num, setNum] = useState(Number);

  // Func que desenha o campo
  function desenharCampo(ctx: CanvasRenderingContext2D | null | undefined) {
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        ctx!.fillRect(x * 20, y * 20, 20, 20);
        ctx!.fillStyle = "black";
        // ctx!.strokeStyle = "white";
        // ctx!.lineWidth = 1;
        // // ctx!.strokeRect(x * 20, y * 20, 20, 20);
      }
    }
  }

  const peçaAtual = () => {
    const n = Math.floor(Math.random() * peças.length);
    setNum(n);
  }; // Func que decide a peça atual

  useEffect(() => {
    nRef.current = num;
  }, [num]); // nRef bem util

  useEffect(() => {
    setPeçasCampo((pos) => {
      return [peças[nRef.current].map(([x, y, cor]) => [x, y, cor]), ...pos];
    });
  }, []); // Primeiro setPeçasCampo do load

  // Retirar isso

  // const peçasRef = useRef<Peça[]>(peças);
  // useEffect(() => {
  //   peçasRef.current = peças;
  // }, [peças]); // Ref Peças

  useEffect(() => {
    peçasCampoRef.current = peçasCampo;
  }, [peçasCampo]); // Ref peçasCampo

  // Desenha as peças em campo
  function desenharPeças(ctx: CanvasRenderingContext2D | null | undefined) {
    peçasCampoRef.current.forEach((p) => {
      for (let i = 0; i < p.length; i++) {
        const [x, y, cor] = p[i];
        ctx!.fillStyle = cor;
        ctx!.fillRect(x * 20, y * 20, 20, 20);
        ctx!.strokeStyle = "black";
        ctx!.lineWidth = 2;
        ctx!.strokeRect(x * 20, y * 20, 20, 20);
      }
    });
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    desenharCampo(ctx);
    desenharPeças(ctx);
  }, [peçasCampo]); // puxa o desenhar campa e desenhar peças

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setDireçao("ArrowUp");
      if (e.key === "ArrowDown") setDireçao("ArrowDown");
      if (e.key === "ArrowRight") setDireçao("ArrowRight");
      if (e.key === "ArrowLeft") setDireçao("ArrowLeft");
      if (e.key === " ") setDireçao("Space");
    };

    document.addEventListener("keydown", keydown);
  }, []); //mudar direçao

  useEffect(() => {
    setPeçasCampo((pos): Peça[] => {
      const peça = pos[0];

      if (direçao === "ArrowUp") {
        for (let i = 0; i < peça.length; i++) {
          if (peça[i][0] === peças[1][i][0] && peça[i][1] === peças[1][i][1]) {
            setDireçao("");
            return pos;
          }
        }

        const eixo: Bloco = peça[0];
        const pivot = peça.map(
          ([x, y, cor]): Bloco => [x - eixo[0], y - eixo[1], cor]
        );
        const rotaçao = pivot.map(([x, y, cor]): Bloco => [y, -x, cor]);
        const novaPosiçao = rotaçao.map(
          ([x, y, cor]): Bloco => [x + eixo[0], y + eixo[1], cor]
        );
        for (let i = 0; i < novaPosiçao.length; i++) {
          setDireçao("");
          if (novaPosiçao[i][0] > 9 || novaPosiçao[i][0] < 0) {
            setDireçao("");
            return pos;
          }
          if (novaPosiçao[i][1] < 0 || novaPosiçao[i][1] > 19) {
            setDireçao("");
            return pos;
          }
        }

        setDireçao("");

        return pos.map((p, i): Peça => (i === 0 ? novaPosiçao : p));
      }
      if (direçao === "ArrowDown") {
        const novaPosiçao = peça.map(([x, y, cor]): Bloco => [x, y + 1, cor]);
        for (let i = 0; i < novaPosiçao.length; i++) {
          if (novaPosiçao[i][1] > 19) {
            setDireçao("");
            return pos;
          }
        }

        for (let i = 1; i < pos.length; i++) {
          for (let p = 0; p < pos[i].length; p++) {
            for (let n = 0; n < novaPosiçao.length; n++) {
              if (
                novaPosiçao[n][0] === pos[i][p][0] &&
                novaPosiçao[n][1] === pos[i][p][1]
              ) {
                setDireçao("");
                return pos;
              }
            }
          }
        }

        setDireçao("");
        return pos.map((p, i): Peça => (i === 0 ? novaPosiçao : p));
      }
      if (direçao === "ArrowRight") {
        const novaPosiçao = peça.map(([x, y, cor]): Bloco => [x + 1, y, cor]);

        for (let i = 0; i < novaPosiçao.length; i++) {
          if (novaPosiçao[i][0] > 9) {
            setDireçao("");
            return pos;
          }
        }
        for (let i = 1; i < pos.length; i++) {
          for (let p = 0; p < pos[i].length; p++) {
            for (let n = 0; n < novaPosiçao.length; n++) {
              if (
                novaPosiçao[n][0] === pos[i][p][0] &&
                novaPosiçao[n][1] === pos[i][p][1]
              ) {
                setDireçao("");
                return pos;
              }
            }
          }
        }
        setDireçao("");
        return pos.map((p, i): Peça => (i === 0 ? novaPosiçao : p));
      }
      if (direçao === "ArrowLeft") {
        const novaPosiçao = peça.map(([x, y, cor]): Bloco => [x - 1, y, cor]);

        for (let i = 0; i < novaPosiçao.length; i++) {
          if (novaPosiçao[i][0] < 0) {
            setDireçao("");
            return pos;
          }
        }
        for (let i = 1; i < pos.length; i++) {
          for (let p = 0; p < pos[i].length; p++) {
            for (let n = 0; n < novaPosiçao.length; n++) {
              if (
                novaPosiçao[n][0] === pos[i][p][0] &&
                novaPosiçao[n][1] === pos[i][p][1]
              ) {
                setDireçao("");
                return pos;
              }
            }
          }
        }
        setDireçao("");
        return pos.map((p, i): Peça => (i === 0 ? novaPosiçao : p));
      } else {
        return pos;
      }
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
        setPeçasCampo((pos): Peça[] => {
          const peça = pos[0];
          if (!peça) return pos; // se não existe, não faz nada

          // Proximo movimento da peça dela caindo
          const novaPeça = peça.map(([x, y, cor]): Bloco => [x, y + 1, cor]);

          for (let p = 1; p < pos.length; p++) {
            for (let b = 0; b < pos[p].length; b++) {
              for (let i = 0; i < novaPeça.length; i++) {
                const peçaNova = peças[nRef.current];
                // perdeu, peça passou da altura(arrumar isso)
                if (
                  peçaNova[i][0] === pos[p][b][0] &&
                  peçaNova[i][1] === pos[p][b][1]
                ) {
                  alert("Perdeu");
                  return [peçaNova];
                }
                // bateu em outra peça na queda automatica
                if (
                  novaPeça[i][0] === pos[p][b][0] &&
                  novaPeça[i][1] === pos[p][b][1]
                ) {
                  const ctx = canvasRef.current?.getContext("2d");
                  desenharCampo(ctx);
                  desenharPeças(ctx);
                  peçaAtual();

                  return [
                    peçaNova.map(([x, y, cor]): Bloco => [x, y, cor]),
                    ...pos,
                  ];
                }
              }
            }
          }

          // Retira a linha
          let blocosL: number[][];
          let l: number;
          for (let y = 0; y < 20; y++) {
            blocosL = [];
            l = 0;
            for (let x = 0; x < 10; x++) {
              for (let p = 0; p < pos.length; p++) {
                for (let b = 0; b < pos[p].length; b++) {
                  if (pos[p][b][0] === x && pos[p][b][1] === y) {
                    l += 1;
                    blocosL.push([x, y]);
                  }

                  if (l >= 10) {
                    const novoPeçasCampo = pos.map((peça) =>
                      peça.filter(
                        ([x, y]) =>
                          !blocosL.some(([lx, ly]) => x === lx && ly === y)
                      )
                    );
                    return novoPeçasCampo;
                  }
                }
              }
            }
          }

          // bateu no chao
          for (let i = 0; i < peça.length; i++) {
            if (novaPeça[i][1] > 19) {
              const ctx = canvasRef.current?.getContext("2d");
              desenharCampo(ctx);
              desenharPeças(ctx);
              peçaAtual();
              const peçaNova = peças[nRef.current];

              return [
                peçaNova.map(([x, y, cor]): Bloco => [x, y, cor]),
                ...pos,
              ];
            }
          }

          //queda da peça
          return pos.map((p, i): Peça => (i === 0 ? novaPeça : p));
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
