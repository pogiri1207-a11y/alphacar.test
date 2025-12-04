// app/RightSideBar.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RightSideBar() {
  const [hoverTarget, setHoverTarget] = useState(null);
  const [isChatHover, setIsChatHover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const renderTooltip = (label) => (
    <div
      style={{
        position: "absolute",
        right: "110%",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "#333",
        color: "#fff",
        fontSize: "11px",
        padding: "6px 10px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      }}
    >
      {label}
    </div>
  );

  return (
    <>
      {/* 🔳 오른쪽 사이드바 세트 */}
      <div
        style={{
          position: "fixed",
          right: "24px",
          bottom: "160px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* 흰색 세로 바 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "999px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* TOP */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              onMouseEnter={() => setHoverTarget("top")}
              onMouseLeave={() => setHoverTarget(null)}
              style={iconButtonStyle}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  lineHeight: 1.1,
                }}
              >
                <span style={{ fontSize: "14px" }}>↑</span>
                <span style={{ fontSize: "10px", marginTop: "1px" }}>TOP</span>
              </div>
            </button>
            {hoverTarget === "top" && renderTooltip("맨 위로")}
          </div>

          <div style={dividerStyle} />

          {/* 최근 본 차량 */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onMouseEnter={() => setHoverTarget("recent")}
              onMouseLeave={() => setHoverTarget(null)}
              style={iconButtonStyle}
            >
              <span style={{ fontSize: "16px" }}>🕒</span>
            </button>
            {hoverTarget === "recent" && renderTooltip("최근 본 차량")}
          </div>

          <div style={dividerStyle} />

          {/* 찜한 차량 */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onMouseEnter={() => setHoverTarget("favorite")}
              onMouseLeave={() => setHoverTarget(null)}
              style={iconButtonStyle}
            >
              <span style={{ fontSize: "16px" }}>♡</span>
            </button>
            {hoverTarget === "favorite" && renderTooltip("찜한 차량")}
          </div>

          <div style={dividerStyle} />

          {/* 차량 비교 */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onMouseEnter={() => setHoverTarget("compare")}
              onMouseLeave={() => setHoverTarget(null)}
              style={iconButtonStyle}
            >
              <div
                style={{
                  width: "22px",
                  height: "18px",
                  borderRadius: "4px",
                  border: "1.3px solid #555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                VS
              </div>
            </button>
            {hoverTarget === "compare" && renderTooltip("차량 비교")}
          </div>
        </div>

        {/* 동그라미 ... + 펼쳐지는 메뉴 */}
        <div style={{ position: "relative" }}>
          {/* ... 버튼 */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            onMouseEnter={() => setHoverTarget("menu")}
            onMouseLeave={() => setHoverTarget(null)}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ffffff",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "18px", letterSpacing: "2px" }}>•••</span>
          </button>
          {hoverTarget === "menu" && renderTooltip("메뉴")}

          {/* 메뉴 박스 */}
          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                right: "60px", // 동그라미 왼쪽에 박스
                top: "50%",
                transform: "translateY(-50%)",
                width: "150px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                padding: "10px 0",
                fontSize: "13px",
              }}
            >
              {/* 상단 X 닫기 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "0 14px 6px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 메뉴 항목들 */}
              <div
                style={{
                  borderTop: "1px solid #f1f1f1",
                  paddingTop: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/community");
                  }}
                  style={menuItemStyle}
                >
                  커뮤니티
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/mypage"); // 회원가입/로그인 페이지 쪽으로 연결
                  }}
                  style={menuItemStyle}
                >
                  회원가입
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // 이벤트 페이지 준비되면 경로만 바꿔줘 (예: /event)
                    alert("이벤트 페이지 준비 중입니다.");
                  }}
                  style={menuItemStyle}
                >
                  이벤트
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🔵 파란 상담 버튼 – 상담/문의 페이지 이동 */}
        <button
          type="button"
          onClick={() => router.push("/consult")}
          onMouseEnter={() => setIsChatHover(true)}
          onMouseLeave={() => setIsChatHover(false)}
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            backgroundColor: "#0F62FE",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        >
          {isChatHover ? (
            "상담하기"
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 11a6 6 0 0 1 12 0"
                stroke="#ffffff"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
              <rect
                x="4"
                y="11"
                width="3"
                height="6"
                rx="1.2"
                stroke="#ffffff"
                strokeWidth="1.6"
                fill="none"
              />
              <rect
                x="17"
                y="11"
                width="3"
                height="6"
                rx="1.2"
                stroke="#ffffff"
                strokeWidth="1.6"
                fill="none"
              />
              <path
                d="M9.5 18.5c.5 1.2 1.7 2 3.1 2h1.4"
                stroke="#ffffff"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

/* 공통 스타일 */
const iconButtonStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  border: "none",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#333333",
};

const dividerStyle = {
  width: "24px",
  height: "1px",
  backgroundColor: "#e5e5e5",
};

const menuItemStyle = {
  width: "100%",
  textAlign: "left",
  padding: "8px 16px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "13px",
  color: "#333",
};

