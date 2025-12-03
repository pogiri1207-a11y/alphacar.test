"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CompareVsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터 읽기
  const idsParam = searchParams.get("ids");
  const opts1Param = searchParams.get("opts1"); // 차량 1 선택 옵션
  const opts2Param = searchParams.get("opts2"); // 차량 2 선택 옵션

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // 가격 포맷팅 (예: 35,000,000원)
  const formatPrice = (price) => {
    return Number(price).toLocaleString() + "원";
  };

  useEffect(() => {
    if (!idsParam) {
      setLoading(false);
      return;
    }

    const fetchCompareData = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_QUOTE_API_URL || "http://192.168.0.160:3003";
        
        // 차량 데이터 가져오기
        const res = await fetch(`${baseUrl}/quote/compare-data?ids=${idsParam}`);
        if (!res.ok) throw new Error("비교 데이터 로딩 실패");
        
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("에러 발생:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [idsParam]);

  if (loading) {
    return (
      <main style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "100px", textAlign: "center" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>결과를 불러오는 중입니다...</p>
      </main>
    );
  }

  if (cars.length < 2) {
    return (
      <main style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "100px", textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>데이터가 부족합니다.</div>
        <button onClick={() => router.push('/quote/compare')} style={{ padding: "10px 20px", cursor: "pointer" }}>돌아가기</button>
      </main>
    );
  }

  // --- 데이터 가공 로직 ---
  
  const selectedOpts1 = new Set(opts1Param ? opts1Param.split(",") : []);
  const selectedOpts2 = new Set(opts2Param ? opts2Param.split(",") : []);

  const processCarData = (carData, selectedSet) => {
    const basePrice = Number(carData.base_price || 0);
    const allOptions = carData.options || [];
    
    // 선택된 옵션만 필터링
    const selectedOptions = allOptions.filter(opt => selectedSet.has(opt._id));
    
    // 옵션 가격 합계
    const optionTotal = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0);
    
    // 최종 출고가
    const totalPrice = basePrice + optionTotal;
    
    // 할인가 및 월 납입금 (샘플 계산)
    const discountPrice = Math.floor(totalPrice * 0.95);
    const monthly = Math.floor(discountPrice / 60 / 10000); // 만원 단위

    return {
      ...carData,
      manufacturer: carData.manufacturer || "제조사",
      model_name: carData.model_name || "모델명",
      trim_name: carData.name || carData.trim_name || "트림",
      image: carData.image_url || "/car/sample-left.png",
      basePrice,
      selectedOptions,
      optionTotal,
      totalPrice,
      discountPrice,
      monthly,
    };
  };

  const car1 = processCarData(cars[0], selectedOpts1);
  const car2 = processCarData(cars[1], selectedOpts2);

  // [핵심 수정] 가격 비교 데이터 구조 (비교를 위해 숫자값 rawValue 포함)
  const priceRows = [
    { 
      label: "출고가 (옵션포함)", 
      leftText: formatPrice(car1.totalPrice), 
      rightText: formatPrice(car2.totalPrice),
      leftVal: car1.totalPrice,
      rightVal: car2.totalPrice
    },
    { 
      label: "할인가 (예상)", 
      leftText: formatPrice(car1.discountPrice), 
      rightText: formatPrice(car2.discountPrice),
      leftVal: car1.discountPrice,
      rightVal: car2.discountPrice
    },
    { 
      label: "월 납입금 (60개월)", 
      leftText: `월 ${car1.monthly}만원`, 
      rightText: `월 ${car2.monthly}만원`,
      leftVal: car1.monthly,
      rightVal: car2.monthly
    },
  ];

  return (
    <main style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px 60px" }}>
        
        {/* 상단 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => router.back()} style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "#555" }}>← 다시 선택하기</button>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333" }}>비교 견적 결과</h1>
          <div style={{ width: "100px" }}></div>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          
          {/* 1. 차량 기본 정보 비교 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
            {[car1, car2].map((car, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", backgroundColor: "#f9f9f9", borderRadius: "16px" }}>
                  <img src={car.image} alt={car.trim_name} style={{ maxWidth: "80%", maxHeight: "140px", objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>{car.manufacturer} {car.model_name}</div>
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>{car.trim_name}</div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#1d4ed8" }}>{formatPrice(car.totalPrice)}</div>
              </div>
            ))}
          </div>

          {/* 2. 선택 옵션 내역 */}
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>선택 옵션 내역</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              {[car1, car2].map((car, idx) => (
                <div key={idx} style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", padding: "16px", minHeight: "100px" }}>
                  {car.selectedOptions.length > 0 ? (
                    car.selectedOptions.map((opt, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px", borderBottom: "1px dashed #eee", paddingBottom: "4px" }}>
                        <span>{opt.name}</span>
                        <span style={{ fontWeight: "bold", color: "#555" }}>+{formatPrice(opt.price)}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", color: "#999", fontSize: "13px", padding: "20px" }}>선택된 옵션 없음</div>
                  )}
                  {car.selectedOptions.length > 0 && (
                    <div style={{ marginTop: "12px", textAlign: "right", fontSize: "14px", fontWeight: "bold", color: "#0052ff" }}>
                      옵션 합계: +{formatPrice(car.optionTotal)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. 가격 비교 테이블 (수정된 레이아웃: 좌측가격 - 중앙라벨 - 우측가격) */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px", textAlign: "center" }}>가격 비교</h3>
            <div style={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
              {priceRows.map((row, idx) => {
                // 더 높은 금액인지 판별
                const isLeftHigher = row.leftVal > row.rightVal;
                const isRightHigher = row.rightVal > row.leftVal;

                return (
                  <div key={idx} style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 140px 1fr", // [수정] 좌 - 중앙(고정폭) - 우 비율 조정
                    alignItems: "center", 
                    padding: "16px 20px", 
                    borderBottom: idx === priceRows.length - 1 ? "none" : "1px solid #f0f0f0",
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                    fontSize: "14px"
                  }}>
                    
                    {/* 왼쪽 차량 가격 */}
                    <div style={{ 
                      textAlign: "center", 
                      fontWeight: "700", 
                      fontSize: "15px",
                      color: isLeftHigher ? "#d32f2f" : "#333" // [수정] 더 비싸면 빨간색
                    }}>
                      {row.leftText}
                    </div>

                    {/* 중앙 라벨 */}
                    <div style={{ 
                      textAlign: "center", 
                      color: "#777", 
                      fontSize: "13px",
                      fontWeight: "normal"
                    }}>
                      {row.label}
                    </div>
                    
                    {/* 오른쪽 차량 가격 */}
                    <div style={{ 
                      textAlign: "center", 
                      fontWeight: "700",
                      fontSize: "15px",
                      color: isRightHigher ? "#d32f2f" : "#333" // [수정] 더 비싸면 빨간색
                    }}>
                      {row.rightText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div style={{ marginTop: "30px" }}>
            <button style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: "#111", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }} onClick={() => alert("견적이 저장되었습니다.")}>
              견적 저장
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CompareVsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareVsContent />
    </Suspense>
  );
}
