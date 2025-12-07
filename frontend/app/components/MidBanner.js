// app/components/MidBanner.js
"use client";

import { useState, useEffect } from "react";   // 🔹 useEffect 추가
import { useRouter } from "next/navigation";

// 🔹 자동 전환 간격 (ms)
const AUTO_INTERVAL = 4000; // 4초마다 다음 배너

// 🔹 중간 배너 이미지 + 링크 + 위치
const midBanners = [
  {
    id: 1,
    img: "/mid_banners/mid_banner1.png",
    link: "/event/recommend",  // 첫 번째 배너
    position: "center 40%",    // ⬆ 살짝 더 내려서(=아래쪽이 더 보이게) 조정
  },
  {
    id: 2,
    img: "/mid_banners/mid_banner2.jpg",
    link: "/event/blog-review", // 두 번째 배너
    position: "center",         // 기본 중앙
  },
];

export default function MidBanner() {
  const [index, setIndex] = useState(0);
  const current = midBanners[index];
  const router = useRouter();

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + midBanners.length) % midBanners.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % midBanners.length);
  };

  const handleClickBanner = () => {
    if (current.link) router.push(current.link);
  };

  // 🔹 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % midBanners.length);
    }, AUTO_INTERVAL);

    return () => clearInterval(timer); // 컴포넌트 사라질 때 정리
  }, []);

  return (
    <section
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)", // 양쪽 여백 없이 화면 꽉 채우기
        marginTop: "24px",
        marginBottom: "24px",
      }}
    >
      {/* 🔹 배너 전체 영역 */}
      <div
        onClick={handleClickBanner}
        style={{
          position: "relative",
          width: "100%",
          height: "240px", // ⬆ 배너 살짝 더 크게 (글씨 안 짤리게)
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* 배경 이미지 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${current.img}")`,
            backgroundSize: "cover",
            backgroundPosition: current.position || "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* 왼쪽 화살표 - 더 안쪽으로, 흰 동그라미 + 검정 화살표 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          style={{
            position: "absolute",
            left: "190px",              // ⬅ 예전보다 안쪽
            top: "50%",
            transform: "translateY(-50%)",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#ffffff",
            color: "#000000",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>

        {/* 오른쪽 화살표 - 더 안쪽으로 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          style={{
            position: "absolute",
            right: "190px",            // ⬅ 예전보다 안쪽
            top: "50%",
            transform: "translateY(-50%)",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#ffffff",
            color: "#000000",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>

        {/* 하단 슬라이드 점 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "14px",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "6px",
          }}
        >
          {midBanners.map((b, i) => (
            <span
              key={b.id}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor:
                  i === index ? "#000000" : "rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

