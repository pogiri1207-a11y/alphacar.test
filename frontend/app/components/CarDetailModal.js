"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const formatPrice = (price) => {
  if (!price) return "가격 문의";
  const numPrice = Number(price);
  if (isNaN(numPrice)) return price;
  return (numPrice / 10000).toLocaleString() + "만원";
};

export default function CarDetailModal({ car, onClose }) {
  const router = useRouter();

  // ✅ [수정 1] 데이터 필드 매핑 (DB 변경 대응)
  // 백엔드에서 변환해서 보내주더라도, 만약 원본 DB 데이터가 그대로 넘어올 경우를 대비해 OR(||) 처리
  const vehicleId = car._id || car.id; // MongoDB ObjectId가 _id일 확률이 높음
  const carName = car.name || car.vehicle_name; // 기존 name 또는 새 DB의 vehicle_name
  const brandName = car.manufacturer || car.brand_name; // 기존 manufacturer 또는 새 DB의 brand_name
  const imageUrl = car.imageUrl || car.main_image; // 기존 imageUrl 또는 새 DB의 main_image
  
  // 가격: minPrice가 없으면 trims 배열의 첫 번째 가격을 가져오거나 price 필드 사용
  const displayPrice = car.minPrice || (car.trims && car.trims[0]?.price) || car.base_price || car.price;

  // ✅ [수정 2] 모달 열릴 때 조회수 기록 (백엔드 API 주소 일치시킴)
  useEffect(() => {
    if (!car) return;

    const userId = localStorage.getItem("user_social_id") || localStorage.getItem("alphacar_user_id");

    if (userId && vehicleId) {
      // 🚨 기존 '/api/history' -> 수정된 백엔드 '/api/log-view/:id' 로 변경
      fetch(`/api/log-view/${vehicleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      .then((res) => {
        if (res.ok) {
          // 성공 시 이벤트 발생 (사이드바 갱신용)
          window.dispatchEvent(new Event("vehicleViewed"));
          console.log(`[History] 차량 조회 기록됨: ${vehicleId}`);
        } else {
            console.warn("[History] 기록 실패: API 응답 오류");
        }
      })
      .catch((err) => console.error("히스토리 저장 실패:", err));
    }
  }, []); // car가 바뀌면 다시 실행되어야 하므로 빈 배열보다는 vehicleId 의존성이 나을 수 있으나, 모달이므로 [] 유지 가능

  if (!car) return null;

  // 3. 견적 페이지 이동 처리 함수
  const handleGoToQuoteResult = async () => {
    if (!vehicleId) {
      console.error("차량 ID 정보가 누락되었습니다.");
      alert("차량 ID 정보가 없어 이동할 수 없습니다.");
      return;
    }

    try {
      // 트림 정보 가져오기 (만약 car 객체 안에 이미 trims가 있다면 fetch 안해도 됨)
      // 하지만 확실하게 하기 위해 fetch 유지. 단, 백엔드 경로 확인 필요.
      const res = await fetch(`/api/vehicles/trims?modelId=${vehicleId}`);

      if (!res.ok) {
        throw new Error("트림 정보를 가져오는데 실패했습니다.");
      }

      const trims = await res.json();

      if (Array.isArray(trims) && trims.length > 0) {
        // 첫 번째 트림 ID 추출 (새 DB 구조에서는 trims가 배열로 존재)
        // 만약 trims 안에 _id가 없다면 객체 구조 확인 필요. 보통은 있음.
        const targetTrimId = trims[0]._id || trims[0].trim_id;

        console.log(`차량 ID(${vehicleId}) -> 트림 ID(${targetTrimId}) 변환 성공`);

        router.push(`/quote/personal/result?trimId=${targetTrimId}`);
      } else {
        alert("해당 차량의 트림 정보가 없어 견적을 낼 수 없습니다.");
      }

    } catch (error) {
      console.error("이동 중 오류 발생:", error);
      // 만약 API 실패해도 car 객체 안에 trims가 있다면 그걸로 시도해볼 수 있음 (선택사항)
      if (car.trims && car.trims.length > 0) {
          const fallbackTrimId = car.trims[0]._id || car.trims[0].trim_id;
          router.push(`/quote/personal/result?trimId=${fallbackTrimId}`);
      } else {
          alert("상세 페이지로 이동하는 중 오류가 발생했습니다.");
      }
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
          {/* 1. 제조사 및 차량명 (수정된 변수 사용) */}
          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
            {carName}
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            {brandName}
          </p>

          {/* 2. 차량 이미지 (수정된 변수 사용) */}
          <div style={{ margin: "20px 0", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          </div>

          {/* 3. 가격 정보 (수정된 변수 사용) */}
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "5px" }}>예상 구매 가격</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0070f3" }}>
              {formatPrice(displayPrice)} ~
            </p>
          </div>

          {/* 4. 견적 버튼 */}
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
