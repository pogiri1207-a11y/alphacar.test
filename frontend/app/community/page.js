// app/community/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  { key: "all", label: "전체" },
  { key: "buy", label: "구매 고민" },
  { key: "review", label: "오너 리뷰" },
];

const SAMPLE_POSTS = [
  {
    id: 156,
    no: 156,
    type: "공지",
    category: "notice",
    title: "알파카 김포지점 GRAND OPEN 🔔",
    date: "2025-11-28",
  },
  {
    id: 155,
    no: 155,
    type: "공지",
    category: "notice",
    title: "알파카 연장보증 서비스 약관 개정 안내 (2025-12-01)",
    date: "2025-11-25",
  },
  {
    id: 154,
    no: 154,
    type: "공지",
    category: "notice",
    title: "알파카 연장보증 서비스 약관 개정 안내 (2025-12-01)",
    date: "2025-11-25",
  },
  {
    id: 153,
    no: 153,
    type: "일반",
    category: "buy",
    title: "그랜저 하이브리드 vs G80 중에 고민입니다",
    date: "2025-11-29",
  },
  {
    id: 152,
    no: 152,
    type: "일반",
    category: "review",
    title: "쏘나타 N라인 1년 탄 솔직 후기",
    date: "2025-11-20",
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const handleWriteClick = () => {
    router.push("/community/write");
  };

  const filtered = SAMPLE_POSTS.filter((post) => {
    if (activeTab === "buy" && post.category !== "buy") return false;
    if (activeTab === "review" && post.category !== "review") return false;
    if (searchText.trim()) {
      const keyword = searchText.trim();
      if (!post.title.includes(keyword)) return false;
    }
    return true;
  });

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 16px 80px",
      }}
    >
      <main>
        <div
          style={{
            borderRadius: "18px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
            padding: "28px 32px 32px",
          }}
        >
          {/* 상단 제목 영역 */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                커뮤니티
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                알파카의 최신 소식을 알려드려요
              </p>
            </div>

            {/* 글쓰기 버튼 */}
            <button
              type="button"
              onClick={handleWriteClick}
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#111827",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              글쓰기
            </button>
          </header>

          {/* 탭 메뉴 */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border:
                    activeTab === tab.key
                      ? "1px solid #111827"
                      : "1px solid #e5e7eb",
                  backgroundColor:
                    activeTab === tab.key ? "#111827" : "#ffffff",
                  color: activeTab === tab.key ? "#ffffff" : "#4b5563",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 상단: 총 건수 + 검색 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              fontSize: "13px",
            }}
          >
            <div>
              총{" "}
              <span style={{ fontWeight: 600 }}>{filtered.length}건</span>
            </div>

            {/* 검색창 */}
            <div
              style={{
                position: "relative",
                width: "260px",
                height: "32px",
              }}
            >
              <input
                type="text"
                placeholder="검색할 내용을 입력해 보세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  padding: "0 32px 0 10px",
                  fontSize: "12px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  color: "#9ca3af",
                }}
              >
                🔍
              </span>
            </div>
          </div>

          {/* 테이블 헤더 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 140px",
              padding: "10px 12px",
              borderTop: "2px solid #111827",
              borderBottom: "1px solid #e5e7eb",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#f9fafb",
            }}
          >
            <div>No.</div>
            <div>제목</div>
            <div>등록일</div>
          </div>

          {/* 게시글 목록 */}
          {filtered.map((post) => (
            <div
              key={post.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 140px",
                padding: "12px",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "13px",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => alert("상세페이지는 나중에 연결할게요")}
            >
              <div style={{ color: "#6b7280" }}>{post.no}</div>
              <div>
                {post.type === "공지" && (
                  <span
                    style={{
                      display: "inline-block",
                      marginRight: "6px",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      border: "1px solid #2563eb",
                      color: "#2563eb",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    공지
                  </span>
                )}
                <span>{post.title}</span>
              </div>
              <div style={{ color: "#6b7280" }}>{post.date}</div>
            </div>
          ))}

          {/* 페이지네이션 (mock) */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              fontSize: "13px",
            }}
          >
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  border:
                    page === 1 ? "1px solid #111827" : "1px solid #e5e7eb",
                  backgroundColor: page === 1 ? "#111827" : "#ffffff",
                  color: page === 1 ? "#ffffff" : "#4b5563",
                  cursor: "pointer",
                }}
                onClick={() => alert("페이지네이션은 나중에 백엔드 연동")}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

