// app/event/page.js
"use client";

import { useState } from "react";

const EVENTS_PER_PAGE = 3;

// 🔹 이벤트 데이터 (1,2번은 이미지 사용)
const events = [
  {
    id: 1,
    badge: "이벤트",
    dday: "27-day",
    title: "블로그 후기 쓰고, 네이버페이 받자!",
    desc: "여러분의 소중한 이야기를 기다립니다.",
    period: "2025-02-05 ~ 2025-12-31",
    image: "/event/event1.png", // public/event/event1.png
  },
  {
    id: 2,
    badge: "이벤트",
    dday: "27-day",
    title: "지인 추천하고 상품권 받자",
    desc: "알파카를 추천하면 5만원 주유상품권!",
    period: "2025-02-01 ~ 2025-12-31",
    image: "/event/event2.png", // public/event/event2.png
  },
  // 🔹 아래 3개는 샘플용 (이미지 없이 그라데이션 카드)
  {
    id: 3,
    badge: "이벤트",
    dday: "10-day",
    title: "ALPHACAR 견적 비교하면 30만원 할인!",
    desc: "견적 비교만 해도 추가 할인 쿠폰을 드립니다.",
    period: "2025-01-01 ~ 2025-12-31",
  },
  {
    id: 4,
    badge: "이벤트",
    dday: "D-3",
    title: "신규 가입 웰컴 포인트 지급",
    desc: "회원가입만 해도 웰컴 포인트를 지급합니다.",
    period: "2025-03-01 ~ 2025-03-31",
  },
  {
    id: 5,
    badge: "이벤트",
    dday: "D-1",
    title: "시승 후기 남기고 커피 기프티콘 받기",
    desc: "시승 후기를 남겨주신 분들께 선물을 드립니다.",
    period: "2025-04-01 ~ 2025-04-10",
  },
];

export default function EventPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(events.length / EVENTS_PER_PAGE)
  );
  const startIndex = (page - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(
    startIndex,
    startIndex + EVENTS_PER_PAGE
  );

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 16px 80px",
        }}
      >
        {/* 상단 하늘색 박스 */}
        <section
          style={{
            width: "100%",
            borderRadius: "24px",
            padding: "40px 24px 46px",
            marginBottom: "40px",
            background:
              "linear-gradient(135deg, #e4f0ff 0%, #f3f7ff 40%, #e4f3ff 100%)",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(15, 76, 129, 0.12)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              color: "#4b6cff",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <span role="img" aria-label="gift">
              🎁
            </span>
            <span>2025 ALPHACAR 특별 이벤트</span>
          </div>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: 1.25,
              margin: "0 0 10px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            특별한 혜택을
            <br />
            <span style={{ color: "#3055ff" }}>만나보세요</span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#4b5563",
              margin: 0,
            }}
          >
            견적 비교만 해도 받을 수 있는 다양한 혜택을 준비했어요.
          </p>
        </section>

        {/* 이벤트 타이틀 */}
        <section style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 800,
              margin: "0 0 8px",
              color: "#111827",
            }}
          >
            이벤트
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            ALPHACAR 회원님을 위한 다양한 이벤트를 만나보세요
          </p>
        </section>

        {/* 카드 리스트 (한 페이지 최대 3개) */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          {currentEvents.map((ev, index) => (
            <article
              key={ev.id}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
                display: "flex",
                flexDirection: "column",
                minHeight: "320px",
              }}
            >
              {/* 상단 이미지 / 그라데이션 */}
              <div
                style={{
                  height: "160px",
                  overflow: "hidden",
                  backgroundColor: "#111827",
                  position: "relative",
                }}
              >
                {ev.image ? (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        index % 2 === 0
                          ? "linear-gradient(135deg, #111827, #1f2937)"
                          : "linear-gradient(135deg, #ffedd5, #fb923c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 18px",
                      color: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "16px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        backgroundColor: "rgba(0,0,0,0.35)",
                        fontSize: "11px",
                      }}
                    >
                      SPECIAL EVENT
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.4,
                        textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                      }}
                    >
                      {ev.title}
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 텍스트 */}
              <div
                style={{
                  padding: "16px 18px 18px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      backgroundColor: "#eef2ff",
                      color: "#4f46e5",
                      fontWeight: 600,
                    }}
                  >
                    {ev.badge}
                  </span>
                  <span style={{ color: "#9ca3af" }}>{ev.dday}</span>
                </div>

                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: "0 0 8px",
                    color: "#111827",
                    lineHeight: 1.4,
                  }}
                >
                  {ev.title}
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#4b5563",
                    margin: "0 0 10px",
                  }}
                >
                  {ev.desc}
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginTop: "auto",
                  }}
                >
                  {ev.period}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* 하단 페이지네이션 */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* 이전 페이지 */}
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              border: "none",
              fontSize: "14px",
              cursor: page === 1 ? "default" : "pointer",
              backgroundColor: page === 1 ? "#e5e7eb" : "#ffffff",
              color: "#4b5563",
              boxShadow:
                page === 1 ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            ‹
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNumber = idx + 1;
            const isActive = pageNumber === page;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  minWidth: "28px",
                  height: "28px",
                  padding: "0 8px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#2563eb" : "#ffffff",
                  color: isActive ? "#ffffff" : "#4b5563",
                  fontWeight: isActive ? 700 : 400,
                  boxShadow: isActive
                    ? "0 4px 12px rgba(37, 99, 235, 0.45)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* 다음 페이지 */}
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              border: "none",
              fontSize: "14px",
              cursor: page === totalPages ? "default" : "pointer",
              backgroundColor:
                page === totalPages ? "#e5e7eb" : "#ffffff",
              color: "#4b5563",
              boxShadow:
                page === totalPages
                  ? "none"
                  : "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            ›
          </button>
        </section>
      </div>
    </main>
  );
}

