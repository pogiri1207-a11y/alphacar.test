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
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        견적함
      </h1>
      <p style={{ fontSize: "14px", color: "#666" }}>
        여기에서 내가 저장한 차량 견적들을 보여주면 됩니다. (UI 뼈대)
      </p>
    </div>
  );
}

