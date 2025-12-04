// frontend/app/mypage/page.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
// 🚨 [추가] API 호출 함수 임포트
import { fetchMypageInfo } from "@/lib/api"; 

// 🚨 [추가] 인증 정보를 삭제하는 함수 (handleLogout에서도 사용)
const clearAuthStorage = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("alphacarUser");
        localStorage.removeItem("user_social_id"); // 👈 [핵심] user_social_id 제거
    }
};


export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  // ✅ state 파라미터 (kakao / google)
  const state = searchParams.get("state");

  const [guestCode, setGuestCode] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  // 🔹 로그인 유저 정보
  const [user, setUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);


  // 🔹 소셜 로그인 & 마이페이지 데이터 로드
  useEffect(() => {
    const processAuth = async () => {
      setCheckedAuth(false);

      // Case 1: 소셜 로그인 후 리다이렉트 된 경우 (code 파라미터 존재)
      if (code) {
        try {
          let response;

          if (state === "google") {
            response = await axios.post(
              "https://192.168.0.160.nip.io:8000/auth/google-login",
              { code }
            );
          } else {
            response = await axios.post(
              "https://192.168.0.160.nip.io:8000/auth/kakao-login",
              { code }
            );
          }

          const { access_token, user: loggedInUser } = response.data;

          // 🚨 [핵심 수정]: user_social_id 저장 (api.ts가 사용하는 키)
          if (loggedInUser.socialId) {
             localStorage.setItem("user_social_id", loggedInUser.socialId); 
          } else {
             console.warn("로그인 응답에 socialId가 없습니다. 인증이 불안정할 수 있습니다.");
          }

          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("alphacarUser", JSON.stringify(loggedInUser));

          // 저장 후 ?code를 제거하여 URL 클린업
          router.replace("/mypage");
          return; // 이 단계에서 즉시 리로드되므로 함수 종료
          
        } catch (error) {
          console.error("로그인 실패:", error);
          clearAuthStorage();
          alert("로그인에 실패했습니다. 백엔드 연결을 확인해주세요.");
          router.replace("/mypage/login");
        } 
      }
      
      // Case 2: 일반 접속 또는 소셜 로그인 처리 후 (토큰 유무로 인증 상태 확인)
      try {
        const data = await fetchMypageInfo(); // 👈 [수정] 백엔드에 인증 헤더와 함께 정보 요청

        if (data.isLoggedIn && data.user) {
          // 서버에서 로그인 상태를 확인했고, 유저 정보가 있다면
          setUser(data.user);
          // 🚨 [주의] 이 시점에서 alphacarUser와 user_social_id가 localStorage에 있어야 합니다.
        } else {
          // 서버가 isLoggedIn: false를 반환하면 로그아웃 처리
          setUser(null);
          clearAuthStorage();
          // 로그인 페이지로 이동하여 사용자에게 로그인을 요청합니다.
          router.replace("/mypage/login");
        }
      } catch (error) {
        console.error("마이페이지 정보 불러오기 실패 (네트워크/서버 오류):", error);
        // 서버 연결 오류 시에도 로그아웃 처리 (토큰 유효성 확인 실패)
        clearAuthStorage();
        router.replace("/mypage/login");
      } finally {
        setCheckedAuth(true);
      }
    };

    processAuth();
  }, [code, router, state]);

  // 🔹 로그아웃
  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      clearAuthStorage(); // 👈 [수정] 모든 인증 정보 삭제
      setUser(null);
      alert("로그아웃 되었습니다.");
    }
  };

  const handleLoginClick = () => {
    router.push("/mypage/login");
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestCode.trim()) {
      alert("견적번호를 입력해주세요.");
      return;
    }
    alert(`비회원 견적 조회 준비 중입니다. (입력값: ${guestCode})`);
  };

  if (!checkedAuth) {
    return (
      <div style={{ padding: "60px 16px" }}>마이페이지 불러오는 중...</div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 16px 80px",
        display: "flex",
        gap: "40px",
        alignItems: "flex-start",
      }}
    >
      {/* 왼쪽 배너 */}
      <aside style={{ width: "220px", flexShrink: 0 }}>
        {showBanner && (
          <img
            src="/banners/alphacar-space.png"
            alt=""
            onError={() => setShowBanner(false)}
            style={{
              width: "100%",
              display: "block",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {user ? (
          /* ===========================
             ✅ 로그인 후 마이페이지 화면
             =========================== */
          <div style={{ width: "100%", maxWidth: "520px" }}>
            {/* 프로필 영역 */}
            <section
              style={{
                marginBottom: "32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* 왼쪽: 닉네임 및 정보 */}
              <div>
                <h1
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    lineHeight: "1.2",
                  }}
                >
                  {user.nickname || "플렉스하는 알파카"}
                </h1>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background:
                        user.provider === "kakao"
                          ? "#FEE500"
                          : user.provider === "google"
                          ? "#E8F0FE"
                          : "#f3f4f6",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {(user.provider || "email").toUpperCase()}
                  </span>
                  <span style={{ color: "#555" }}>
                    {user.email || "AlphaFlex123@naver.com"}
                  </span>
                </div>
              </div>

              {/* 오른쪽: 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                로그아웃
              </button>
            </section>

            {/* ✅ 견적함 / 포인트 카드 (숫자 영역 전체가 버튼) */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
                marginBottom: "24px",
                backgroundColor: "#fff",
              }}
            >
              {/* 견적함 버튼 */}
              <button
                type="button"
                onClick={() => router.push("/mypage/quotes")}
                style={{
                  padding: "20px",
                  border: "none",
                  borderRight: "1px solid #f3f4f6",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    marginBottom: "6px",
                  }}
                >
                  견적함
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {user.quoteCount ?? 0}건
                </div>
              </button>

              {/* 포인트 버튼 */}
              <button
                type="button"
                onClick={() => router.push("/mypage/points")}
                style={{
                  padding: "20px",
                  border: "none",
                  borderRight: "1px solid #f3f4f6",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    marginBottom: "6px",
                  }}
                >
                  포인트
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {user.point ?? 0}P
                </div>
              </button>
            </section>

            {/* 메뉴 카드 */}
            <section
              style={{
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              {[
                { label: "결제내역", href: "/mypage/payments" },
                { label: "알파카 소식", href: "/community" },
                { label: "설정", href: "/mypage/settings" },
              ].map((item, idx) => (
                <button
                  key={item.label}
                  type="button"
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    border: "none",
                    background: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderTop: idx === 0 ? "none" : "1px solid #f3f4f6",
                  }}
                  onClick={() => router.push(item.href)}
                >
                  <span>{item.label}</span>
                  <span style={{ fontSize: "18px" }}>›</span>
                </button>
              ))}
            </section>
          </div>
        ) : (
          /* ===========================
             👤 로그인 전 (기존 화면)
             =========================== */
          <>
            <section
              style={{
                textAlign: "center",
                marginBottom: "40px",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <h1
                style={{
                  fontSize: "40px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                신차 살 땐,{" "}
                <span style={{ color: "#0052FF" }}>ALPHACAR</span>
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  color: "#555",
                  marginBottom: "28px",
                }}
              >
                알파카 회원가입하면 1억포인트를 드려요
              </p>

              <button
                type="button"
                onClick={handleLoginClick}
                style={{
                  width: "340px",
                  height: "56px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "#111",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                로그인/회원가입
              </button>

              <div
                style={{
                  marginTop: "24px",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#111",
                }}
              />
            </section>

            <section style={{ width: "100%", maxWidth: "520px" }}>
              <div
                style={{
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  padding: "18px 22px",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  비회원 견적함
                </div>
                <form
                  onSubmit={handleGuestSubmit}
                  style={{ display: "flex", gap: "8px" }}
                >
                  <input
                    type="text"
                    placeholder="견적번호를 입력하세요 (예: 12345)"
                    value={guestCode}
                    onChange={(e) => setGuestCode(e.target.value)}
                    style={{
                      flex: 1,
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      padding: "0 12px",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: "72px",
                      height: "44px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#111827",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    조회
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
