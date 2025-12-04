// kevin@devserver:~/alphacar/frontend/app/components/YouTubeSection.js
"use client";

import { useState, useEffect } from "react";

export default function YouTubeSection() {
  const videos = [
    {
      id: "4kDcpiwbCzs",
      title: "자동차 추천 영상 1",
      channel: "ALPHACAR 추천",
      thumbnail: "https://img.youtube.com/vi/4kDcpiwbCzs/maxresdefault.jpg",
    },
    {
      id: "KLHeBwP0G3U",
      title: "자동차 추천 영상 2",
      channel: "ALPHACAR 추천",
      thumbnail: "https://img.youtube.com/vi/KLHeBwP0G3U/maxresdefault.jpg",
    },
    {
      id: "rK6309nVBpI",
      title: "자동차 추천 영상 3",
      channel: "ALPHACAR 추천",
      thumbnail: "https://img.youtube.com/vi/rK6309nVBpI/maxresdefault.jpg",
    },
    {
      id: "g8_ug3SyDrc",
      title: "자동차 추천 영상 4",
      channel: "ALPHACAR 추천",
      thumbnail: "https://img.youtube.com/vi/g8_ug3SyDrc/maxresdefault.jpg",
    },
  ];

  const [index, setIndex] = useState(0);

  // 5초마다 자동으로 다음 영상
  useEffect(() => {
    if (videos.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [videos.length]);

  const current = videos[index];

  const handleNext = () => {
    if (videos.length <= 1) return;
    setIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <div
      // 고정 크기 (반응형 X)
      style={{
        width: 340,
        height: 220,
      }}
    >
      {/* 상단 타이틀 + 다른 영상 보기 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 16,      // 🔺 글씨 조금 더 크게
            fontWeight: 700,
          }}
        >
          ALPHACAR 오늘의 추천 영상
        </span>
        <button
          onClick={handleNext}
          style={{
            border: "none",
            background: "none",
            color: "#777",
            fontSize: 11,
            cursor: videos.length > 1 ? "pointer" : "default",
          }}
        >
          다른 영상 보기 &gt;
        </button>
      </div>

      {/* 심플한 유튜브 카드 (빨간 배경 ❌) */}
      <a
        href={`https://www.youtube.com/watch?v=${current.id}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "block",
          width: "100%",
          textDecoration: "none",
          color: "#000",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 180,
            backgroundColor: "#ffffff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <img
            src={current.thumbnail}
            alt={current.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // 썸네일 안 잘리게
              backgroundColor: "#000",
            }}
          />
        </div>
        {/* 영상 아래 텍스트는 계속 숨김 (요청대로) */}
      </a>
    </div>
  );
}

