"use client";

export default function MyPageQuotes() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 24px 80px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
        견적함
      </h1>
      <p style={{ fontSize: "14px", color: "#666" }}>
        여기는 견적함 페이지입니다.  
        나중에 백엔드 데이터 넣으면 견적 리스트가 보여질 자리입니다.
      </p>
    </div>
  );
}

