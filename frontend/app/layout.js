// app/layout.js
import "./globals.css";
import Link from "next/link";
import AiChatButton from "./AICHAT/AiChatButton";
import RightSideBar from "./RightSideBar";
import LeftAdBanner from "./LeftAdBanner";
import Footer from "./components/Footer";

export const metadata = {
  title: "ALPHACAR",
  description: "Car price comparison & drive info",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* 상단 헤더 */}
        <header
          style={{
            borderBottom: "1px solid #ddd",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "black" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>ALPHACAR</h1>
          </Link>

          <nav style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
            <Link href="/quote">견적 비교</Link>
            <Link href="/drive">드라이브 코스</Link>
            <Link href="/community">커뮤니티</Link>
            <Link href="/mypage">마이페이지</Link>
          </nav>
        </header>

        {/* 페이지 내용 */}
        <main
          style={{
            padding: "24px 32px",
            minHeight: "calc(100vh - 80px)",
            backgroundColor: "#f7f7f7",
          }}
        >
          {children}
        </main>

        {/* 오른쪽 하단 AI 챗봇 */}
        <AiChatButton />

        {/* 오른쪽 사이드 퀵메뉴 + TOP 버튼 */}
        <RightSideBar />

        {/* 왼쪽 광고 배너 */}
        <LeftAdBanner />

        {/* ✅ 사이트 하단 Footer */}
        <Footer />
      </body>
    </html>
  );
}

