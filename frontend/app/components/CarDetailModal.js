// app/components/CarDetailModal.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formatPrice = (price) => {
  if (!price) return "가격 문의";
  const numPrice = Number(price);
  if (isNaN(numPrice)) return price;
  return (numPrice / 10000).toLocaleString() + "만원";
};

// 💖 하트 아이콘 컴포넌트 (SVG)
const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill={filled ? "#ff4d4f" : "rgba(0,0,0,0.5)"} // 채워지면 빨강, 아니면 반투명 검정
    stroke={filled ? "#ff4d4f" : "#ffffff"} // 테두리: 채워지면 빨강, 아니면 흰색
    strokeWidth="2"
    style={{ transition: "all 0.2s ease" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function CarDetailModal({ car, onClose }) {
  const router = useRouter();

  // 🔹 찜 상태 관리 state
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  // 데이터 필드 매핑
  const vehicleId = car._id || car.id;
  const carName = car.name || car.vehicle_name;
  const brandName = car.manufacturer || car.brand_name;
  const imageUrl = car.imageUrl || car.main_image;

  const displayPrice = car.minPrice || (car.trims && car.trims[0]?.price) || car.base_price || car.price;

  useEffect(() => {
    if (!car) return;

    // 유저 ID 확보
    const storedUserId = localStorage.getItem("user_social_id") || localStorage.getItem("alphacar_user_id");
    setUserId(storedUserId);

    if (storedUserId && vehicleId) {
      // 1. 조회수 기록
      fetch(`/api/log-view/${vehicleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: storedUserId })
      })
      .then((res) => {
        if (res.ok) {
          window.dispatchEvent(new Event("vehicleViewed"));
          console.log(`[History] 차량 조회 기록됨: ${vehicleId}`);
        }
      })
      .catch((err) => console.error("히스토리 저장 실패:", err));

      // 2. 찜 상태 확인
      fetch(`/api/favorites/status?userId=${storedUserId}&vehicleId=${vehicleId}`)
        .then(res => res.json())
        .then(data => setIsLiked(data.isLiked))
        .catch(err => console.error("찜 상태 확인 실패:", err));
    }
  }, []);

  // 하트 클릭 핸들러
  const handleToggleLike = async (e) => {
    e.stopPropagation(); // 모달 닫힘 방지
    if (!userId) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    // 낙관적 업데이트
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);

    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, vehicleId })
      });

      if (!res.ok) {
        throw new Error("API 오류");
      }

      const result = await res.json();
      console.log("찜 토글 결과:", result.status);
    } catch (err) {
      console.error("찜하기 실패:", err);
      setIsLiked(prevLiked); // 실패 시 원복
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (!car) return null;

  // 🔹 [수정됨] 견적 페이지 이동 처리 함수 (undefined 오류 방지 로직 추가)
  const handleGoToQuoteResult = async () => {
    if (!vehicleId) {
      alert("차량 ID 정보가 없어 이동할 수 없습니다.");
      return;
    }

    try {
      // 트림 정보 가져오기 시도
      const res = await fetch(`/api/vehicles/trims?modelId=${vehicleId}`);
      
      let targetTrimId = null;

      if (res.ok) {
        const trims = await res.json();
        if (Array.isArray(trims) && trims.length > 0) {
          // 트림 ID 우선 사용
          targetTrimId = trims[0]._id || trims[0].trim_id;
        }
      }

      // 만약 트림 ID를 못 찾았다면, 차량 ID(vehicleId)를 대체값으로 사용 (안전장치)
      if (!targetTrimId) {
        console.warn("트림 ID를 찾을 수 없어 차량 ID로 대체합니다.");
        targetTrimId = vehicleId;
      }

      console.log(`이동: vehicleId(${vehicleId}) -> trimId(${targetTrimId})`);
      router.push(`/quote/personal/result?trimId=${targetTrimId}`);

    } catch (error) {
      console.error("이동 중 오류 발생:", error);
      // API 에러 발생 시에도 차량 ID로 강제 이동 시도
      router.push(`/quote/personal/result?trimId=${vehicleId}`);
    }
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff", width: "90%", maxWidth: "500px",
          borderRadius: "16px", padding: "40px 30px", position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "15px", right: "15px",
            background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#888"
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
            {carName}
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            {brandName}
          </p>

          <div style={{ margin: "20px 0", height: "200px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={carName}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#f5f5f5", borderRadius: "10px", display:"flex", alignItems:"center", justifyContent:"center", color: "#aaa"}}>
                이미지 준비중
              </div>
            )}
            
            {/* 하트 버튼 */}
            <button
              onClick={handleToggleLike}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 10
              }}
            >
              <HeartIcon filled={isLiked} />
            </button>
          </div>

          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "5px" }}>예상 구매 가격</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0070f3" }}>
              {formatPrice(displayPrice)} ~
            </p>
          </div>

          <button
            style={{
              marginTop: "25px", width: "100%", padding: "15px 0",
              backgroundColor: "#0070f3", color: "white", border: "none",
              borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer",
            }}
            onClick={handleGoToQuoteResult}
          >
            상세 견적 확인하기
          </button>
        </div>
      </div>
    </div>
  );
}
