// app/LeftAdBanner.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 현재 주소 확인용

// 👉 여기 숫자만 바꾸면 배너 숨기는 기준 가로폭을 조절할 수 있음
const HIDE_WIDTH = 1400; // 1400px 미만이면 배너 숨김 (원래는 1200이었음)

export default function LeftAdBanner() {
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  // 화면 크기 체크
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        // 👇 기준 폭을 1400으로 변경
        setIsHidden(window.innerWidth < HIDE_WIDTH);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 숨김 조건:
  // 1) 화면 가로폭이 HIDE_WIDTH 미만일 때
  // 2) 현재 페이지가 '/universe' 일 때 (우주 페이지에서는 배너 숨김)
  if (isHidden || pathname === "/universe") return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "60px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
      }}
    >
      <Link
        href="/universe"
        style={{ display: "block", textDecoration: "none" }}
      >
        <div
          style={{
            width: "210px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            cursor: "pointer",
            fontSize: "0",
          }}
        >
          <img
            src="/ad/space-trip-banner.png"
            alt="알파카 타고 우주 여행"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </Link>
    </div>
  );
}

