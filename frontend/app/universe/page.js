"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UniverseGamePage() {
  const router = useRouter();
  
  // 게임 상태 관리
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // 게임 루프 참조 변수 (리렌더링 방지용)
  const requestRef = useRef();
  const scoreRef = useRef(0);
  // 플레이어(자동차) 설정
  const playerRef = useRef({ x: 0, y: 0, width: 50, height: 50, dx: 0 });
  const asteroidsRef = useRef([]);
  const frameCountRef = useRef(0);

  // 초기화 및 이벤트 리스너 등록
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // 플레이어 초기 위치: 화면 하단 중앙
        playerRef.current.x = window.innerWidth / 2 - 25;
        playerRef.current.y = window.innerHeight - 100;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 실행

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 키보드 조작
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") playerRef.current.dx = -7;
      if (e.key === "ArrowRight") playerRef.current.dx = 7;
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") playerRef.current.dx = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 게임 루프 (Start 시 실행)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      frameCountRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 지우기

      // 1. 플레이어 이동 및 그리기
      const player = playerRef.current;
      player.x += player.dx;

      // 화면 밖으로 못 나가게 막기
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      // 플레이어 그리기 (자동차 이모지 🚗)
      ctx.font = "40px Arial";
      ctx.fillStyle = "white"; // 텍스트 색상 흰색으로 고정
      ctx.fillText("🚗", player.x, player.y + 40);

      // 2. 운석 생성 (난이도 조절: 점수가 높을수록 더 자주 나옴)
      // 기본 40프레임마다 생성, 점수 100점당 1프레임씩 빨라짐 (최소 10프레임)
      const spawnRate = Math.max(10, 40 - Math.floor(scoreRef.current / 100));
      
      if (frameCountRef.current % spawnRate === 0) {
        const size = Math.random() * 30 + 30; // 크기 30~60
        asteroidsRef.current.push({
          x: Math.random() * (canvas.width - size),
          y: -60, // 화면 위에서 시작
          size: size,
          speed: Math.random() * 3 + 3 + (scoreRef.current * 0.01), // 속도도 점점 빨라짐
        });
      }

      // 3. 운석 이동 및 충돌 체크
      asteroidsRef.current.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;

        // [수정] 운석을 도형으로 그리기 (확실히 보이게!)
        ctx.beginPath();
        const radius = asteroid.size / 2;
        // 사각형 좌표 기준으로 원 중심점 계산
        ctx.arc(asteroid.x + radius, asteroid.y + radius, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#888888"; // 밝은 회색
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff"; // 흰색 테두리
        ctx.stroke();
        ctx.closePath();

        // 충돌 체크 (사각형 기준 단순 충돌)
        if (
          player.x < asteroid.x + asteroid.size &&
          player.x + player.width > asteroid.x &&
          player.y < asteroid.y + asteroid.size &&
          player.y + player.height > asteroid.y
        ) {
          setGameOver(true);
          cancelAnimationFrame(requestRef.current);
        }

        // 화면 밖으로 나간 운석 제거 & 점수 증가
        if (asteroid.y > canvas.height) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          asteroidsRef.current.splice(index, 1);
        }
      });

      if (!gameOver) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, gameOver]);

  // 게임 시작 함수
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    scoreRef.current = 0;
    asteroidsRef.current = [];
    frameCountRef.current = 0;
    if (canvasRef.current) {
        playerRef.current.x = canvasRef.current.width / 2 - 25;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#111", // 우주 배경색
        zIndex: 9999,
        overflow: "hidden",
        color: "#fff",
        fontFamily: "sans-serif",
        userSelect: "none", // 드래그 방지
      }}
    >
      {/* 별 배경 효과 (단순 CSS) */}
      <div style={{ position: "absolute", top: "10px", left: "20px", zIndex: 10 }}>
        <h1 style={{ fontSize: "20px", color: "#ffd84d", margin: 0 }}>🚀 SPACE ALPHACAR</h1>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#ccc" }}>운석을 피하세요! (키보드 ←, →)</p>
        <h2 style={{ fontSize: "24px", margin: "10px 0" }}>Score: {score}</h2>
      </div>

      {/* 캔버스 (게임 화면) */}
      <canvas ref={canvasRef} style={{ display: "block" }} />

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          background: "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          color: "#fff",
          borderRadius: "20px",
          cursor: "pointer",
          zIndex: 20,
        }}
      >
        지구로 귀환
      </button>

      {/* 게임 오버 / 시작 화면 */}
      {(!gameStarted || gameOver) && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 30,
          }}
        >
          {gameOver ? (
            <>
              <h1 style={{ fontSize: "50px", color: "#ff4b4b", marginBottom: "20px" }}>GAME OVER</h1>
              <p style={{ fontSize: "24px", marginBottom: "40px" }}>최종 점수: {score}</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "40px", marginBottom: "10px", color: "#fff" }}>우주 운전 연습 🪐</h1>
              <p style={{ fontSize: "16px", marginBottom: "40px", color: "#ccc" }}>운석을 피해 오래 생존하세요!</p>
            </>
          )}

          <button
            onClick={startGame}
            style={{
              padding: "15px 40px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#0070f3",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0,112,243,0.5)",
            }}
          >
            {gameOver ? "다시 도전하기" : "게임 시작"}
          </button>
        </div>
      )}
    </div>
  );
}
