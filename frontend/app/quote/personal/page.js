"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

// 백엔드 API 주소
const API_BASE = "/api";

// [유틸] 견고한 HTTP 응답 처리
const handleApiResponse = async (res) => {
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (e) {
      errorData = { message: res.statusText || '서버 응답 오류', status: res.status };
    }
    throw new Error(errorData.message || `API 요청 실패 (Status: ${res.status})`);
  }
  return res.json();
};

// ---------------- [1] 공통 컴포넌트: 차량 선택 박스 ----------------
function CarSelector({ onSelectComplete, onReset }) {
  const [makerId, setMakerId] = useState("");
  const [modelId, setModelId] = useState("");
  const [trimId, setTrimId] = useState("");

  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);
  const [trims, setTrims] = useState([]);

  const [trimName, setTrimName] = useState("");

  // 1. 초기 로딩
  useEffect(() => {
    fetch(`${API_BASE}/vehicles/makers`)
      .then(handleApiResponse)
      .then((data) => { if (Array.isArray(data)) setMakers(data); })
      .catch((err) => { console.error("제조사 로딩 실패:", err); setMakers([]); });
  }, []);

  const handleReset = () => {
    setMakerId(""); setModelId(""); setTrimId("");
    setTrimName("");
    setModels([]); setTrims([]);
    if (onReset) onReset();
  };

  const handleMakerChange = (e) => {
    const newMakerId = e.target.value;
    setMakerId(newMakerId);
    setModelId(""); setTrimId(""); setTrimName("");
    setModels([]); setTrims([]);

    if (!newMakerId) return;

    fetch(`${API_BASE}/vehicles/models?makerId=${newMakerId}`)
      .then(handleApiResponse)
      .then((data) => {
        if (Array.isArray(data)) {
          const uniqueModels = Array.from(new Map(data.map(m => [m.model_name, m])).values());
          setModels(uniqueModels);
        } else setModels([]);
      })
      .catch((err) => console.error("모델 로딩 실패:", err));
  };

  const handleModelChange = (e) => {
    const newModelId = e.target.value;
    setModelId(newModelId);
    setTrimId(""); setTrimName(""); setTrims([]);

    if (!newModelId) return;

    fetch(`${API_BASE}/vehicles/trims?modelId=${newModelId}`)
      .then(handleApiResponse)
      .then((data) => {
        if (Array.isArray(data)) setTrims(data);
        else setTrims([]);
      })
      .catch((err) => console.error("트림 로딩 실패:", err));
  };

  const handleTrimChange = (e) => {
    const newTrimId = e.target.value;
    const index = e.target.selectedIndex;
    setTrimId(newTrimId);
    if (index >= 0) setTrimName(e.target.options[index].text);
    
    if (newTrimId && onSelectComplete) {
        onSelectComplete(newTrimId);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1e293b", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>차량 선택</span>
        <button onClick={handleReset} style={btnResetStyle}>초기화</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        
        {/* 제조사 */}
        <div style={{ minWidth: 0 }}>
          <div style={labelStyle}>제조사</div>
          <select size={10} value={makerId} onChange={handleMakerChange} style={selectStyle}>
            {makers.length === 0 && <option disabled>로딩중...</option>}
            {makers.map((m, idx) => (
              <option key={m._id || `m-${idx}`} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* 모델 */}
        <div style={{ minWidth: 0 }}>
          <div style={labelStyle}>모델</div>
          <select size={10} value={modelId} onChange={handleModelChange} style={selectStyle}>
            {models.length === 0 ? (
               <option value="" disabled style={{ color: "#ccc", padding: "12px" }}>{makerId ? "모델 없음" : "← 제조사를 선택하세요"}</option>
            ) : (
               models.map((m, idx) => (
                 <option key={m._id || `mo-${idx}`} value={m._id}>{m.model_name}</option>
               ))
            )}
          </select>
        </div>

        {/* 트림 */}
        <div style={{ minWidth: 0 }}>
          <div style={labelStyle}>트림</div>
          <select size={10} value={trimId} onChange={handleTrimChange} style={selectStyle}>
             {trims.length === 0 ? (
               <option value="" disabled style={{ color: "#ccc", padding: "12px" }}>{modelId ? "트림 없음" : "← 모델을 선택하세요"}</option>
            ) : (
               trims.map((t, idx) => {
                 const uniqueKey = t._id || `trim-${idx}`;
                 const val = t._id || t.trim_name || t.name; 
                 return <option key={uniqueKey} value={val}>{t.name || t.trim_name}</option>;
               })
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

// ---------------- [2] 차량 정보 카드 ----------------
function CarInfoCard({ data }) {
  if (!data) return null;
  const basePrice = data.base_price || 0;

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            {/* 이미지 */}
            <div style={{ width: "100%", maxWidth: "500px", height: "260px", borderRadius: "12px", backgroundColor: data.image_url ? "transparent" : "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {data.image_url ? (
                    <img src={data.image_url} alt={data.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                    <span style={{ color: "#aaa", fontSize: "14px" }}>이미지 준비중</span>
                )}
            </div>

            {/* 텍스트 정보 */}
            <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ fontSize: "16px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>
                    {data.manufacturer} {data.model_name}
                </div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#1e293b", marginBottom: "24px", lineHeight: "1.3" }}>
                    {data.name || data.trim_name}
                </div>
                
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", backgroundColor: "#f1f5f9", padding: "16px 32px", borderRadius: "99px" }}>
                    <span style={{ fontSize: "14px", color: "#475569", fontWeight: 600 }}>기본 차량가</span>
                    <span style={{ fontSize: "24px", fontWeight: 800, color: "#2563eb" }}>{basePrice.toLocaleString()}원</span>
                </div>
            </div>
        </div>
    </div>
  );
}

// ---------------- [3] 메인 페이지 ----------------
export default function PersonalQuotePage() {
  const router = useRouter();
  const [carData, setCarData] = useState(null);

  // 트림 상세 정보 조회
  const fetchCarDetail = async (trimId) => {
    try {
      const res = await fetch(`${API_BASE}/vehicles/detail?trimId=${trimId}`);
      if (!res.ok) {
          let errorMsg = `조회 실패`;
          try { const errJson = await res.json(); if (errJson.message) errorMsg = errJson.message; } catch(e) {}
          throw new Error(errorMsg);
      }
      return await res.json();
    } catch (err) {
      console.error(err);
      alert(`차량 정보를 불러오는데 실패했습니다.\n(${err.message})`);
      return null;
    }
  };

  const handleSelectComplete = async (trimId) => {
    const data = await fetchCarDetail(trimId);
    if (data) setCarData(data);
  };

  const handleReset = () => {
    setCarData(null);
  };

  const handleMoveToResult = () => {
    if (!carData) {
        alert("차량을 먼저 선택해주세요.");
        return;
    }
    const safeId = carData._id || carData.id;
    
    if (!safeId) {
        alert("차량 식별 정보를 찾을 수 없습니다. 다시 선택해주세요.");
        return;
    }
    
    router.push(`/quote/personal/result?trimId=${safeId}`);
  };

  return (
    <main style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 5% 80px" }}>
        
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1e293b", marginBottom: "12px" }}>나만의 견적 내기</h1>
            <p style={{ fontSize: "16px", color: "#64748b" }}>원하는 차량을 선택하고 상세 옵션을 구성해보세요.</p>
        </div>

        {/* ✅ [UI 수정] 상하(Vertical) 배치, 간격 축소 (gap: 16px) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* 1. 차량 선택기 */}
            <div style={{ width: "100%" }}>
                <CarSelector onSelectComplete={handleSelectComplete} onReset={handleReset} />
            </div>

            {/* 2. 차량 정보 및 버튼 (선택 시 아래에 바로 붙음) */}
            {carData && (
                // 🚨 [수정] 화살표 제거됨, 간격 축소됨
                <div style={{ animation: "slideUp 0.5s ease-out", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <CarInfoCard data={carData} />
                    
                    <button onClick={handleMoveToResult} style={btnResultStyle}>
                        상세 견적 확인하기 →
                    </button>
                </div>
            )}
        </div>

      </div>
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

// 스타일
const selectStyle = { width: "100%", height: "240px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "12px", fontSize: "14px", outline: "none", color: "#333", backgroundColor: "#f8fafc" };
const labelStyle = { fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px", paddingLeft: "4px" };
const btnResetStyle = { padding: "6px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#fff", color: "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "0.2s" };
const btnResultStyle = { width: "100%", maxWidth: "400px", margin: "0 auto", padding: "20px 0", borderRadius: "99px", border: "none", backgroundColor: "#0f172a", color: "#fff", fontSize: "18px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)", transition: "transform 0.2s" };
