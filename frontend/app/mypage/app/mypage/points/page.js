"use client";

export default function MyPagePoints() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 24px 80px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
        포인트
      </h1>
      <p style={{ fontSize: "14px", color: "#666" }}>
        여기에서 적립/사용한 포인트 내역을 보여주면 됩니다. (UI 뼈대)
      </p>
    </div>
  );
}

