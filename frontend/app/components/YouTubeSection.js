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

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (videos.length <= 2) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 2) % videos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [videos.length]);

  const getVisibleVideos = () => {
    if (videos.length <= 2) return videos;
    const result = [];
    for (let i = 0; i < 2; i++) {
      const idx = (startIndex + i) % videos.length;
      result.push(videos[idx]);
    }
    return result;
  };

  const visibleVideos = getVisibleVideos();

  const handleNext = () => {
    if (videos.length <= 2) return;
    setStartIndex((prev) => (prev + 2) % videos.length);
  };

  return (
    <div style={{ width: "100%", padding: "32px 0" }}>
      {/* 타이틀 + 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          ALPHACAR 오늘의 추천 영상을 확인해 보세요
        </h2>

        <button
          onClick={handleNext}
          style={{
            border: "none",
            background: "none",
            color: "#555",
            fontSize: "14px",
            cursor: videos.length > 2 ? "pointer" : "default",
          }}
        >
          다른 영상 보기 &gt;
        </button>
      </div>

      {/* 썸네일 2개 */}
      <div style={{ display: "flex", gap: "16px" }}>
        {visibleVideos.map((v) => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              cursor: "pointer",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              style={{
                width: "100%",
                aspectRatio: "16/9",   // 16:9 비율 유지
                objectFit: "contain",   // 이미지 안 잘리게
                borderRadius: "12px",
                backgroundColor: "#000", // 위아래 여백 생길 때 깔끔하게
              }}
            />
            <p
              style={{
                fontSize: "14px",
                marginTop: "8px",
                fontWeight: "600",
                lineHeight: "1.4",
              }}
            >
              {v.title}
            </p>
            <p style={{ fontSize: "12px", color: "#777" }}>{v.channel}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

