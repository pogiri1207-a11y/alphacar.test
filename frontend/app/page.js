// app/page.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchMainData } from "../lib/api";
import YouTubeSection from "./components/YouTubeSection";
import CarDetailModal from "./components/CarDetailModal";
import MidBanner from "./components/MidBanner";
import BrandTestDriveSection from "./components/BrandTestDriveSection";

// 백엔드 주소
const API_RANKING_URL = "/api/sales/rankings";

const bannerItems = [
  { id: 1, img: "/banners/banner1.png", link: "/cashback" },
  { id: 2, img: "/banners/banner2.png", link: "/benefit" },
  { id: 3, img: "/banners/banner3.png", link: "/quote" },
];

const brands = [
  "전체", "현대", "기아", "제네시스", "르노", "KGM", "쉐보레", "벤츠", "BMW", "아우디",
  "폭스바겐", "볼보", "렉서스", "토요타", "테슬라", "랜드로버", "포르쉐", "미니", "포드",
  "링컨", "지프", "푸조", "캐딜락", "폴스타", "마세라티", "혼다", "BYD",
];

// 💖 하트 아이콘 컴포넌트
const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill={filled ? "#ff4d4f" : "rgba(0,0,0,0.3)"} 
    stroke={filled ? "#ff4d4f" : "#ffffff"} 
    strokeWidth="2"
    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))", transition: "all 0.2s" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();

  const [bannerIndex, setBannerIndex] = useState(0);
  const safeBannerIndex = bannerIndex;

  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [domesticTop5, setDomesticTop5] = useState([]);
  const [foreignTop5, setForeignTop5] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [likedVehicleIds, setLikedVehicleIds] = useState(new Set());

  useEffect(() => {
    let storedUserId = localStorage.getItem("user_social_id") || localStorage.getItem("alphacar_user_id");
    if (!storedUserId) {
      storedUserId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("alphacar_user_id", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const fetchMyFavorites = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const res = await fetch(`/api/favorites/list?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        const ids = new Set(data.map(item => item.vehicleId ? item.vehicleId._id : null).filter(id => id));
        setLikedVehicleIds(ids);
      }
    } catch (err) {
      console.error("찜 목록 로딩 에러:", err);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMyFavorites(userId);
    }
  }, [userId, fetchMyFavorites]);

  useEffect(() => {
    const timer = setInterval(() => setBannerIndex((prev) => (prev + 1) % bannerItems.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const res = await fetch(API_RANKING_URL);
        if (!res.ok) throw new Error("Load Fail");
        const data = await res.json();
        const formatRanking = (list) => {
          if (!list || !Array.isArray(list)) return [];
          return list.slice(0, 5).map((item) => ({
            rank: item.rank,
            name: item.model_name,
            sales: item.sales_volume ? item.sales_volume.toLocaleString() : "-",
            share: item.market_share ? `${item.market_share}%` : "-",
            prev: item.previous_month && item.previous_month.sales ? item.previous_month.sales.toLocaleString() : "-",
            total: item.previous_year && item.previous_year.sales ? item.previous_year.sales.toLocaleString() : "-"
          }));
        };
        setDomesticTop5(formatRanking(data.domestic));
        setForeignTop5(formatRanking(data.foreign));
      } catch (err) { console.error(err); }
    }
    fetchRankings();
  }, []);

  useEffect(() => {
    fetchMainData()
      .then((data) => {
        let cars = [];
        if (data.carList && Array.isArray(data.carList)) cars = data.carList;
        else if (data.cars && Array.isArray(data.cars)) cars = data.cars;
        else if (Array.isArray(data)) cars = data;
        setCarList(cars);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("데이터 로딩 실패");
        setLoading(false);
      });
  }, []);

  useEffect(() => { setCurrentPage(1); }, [selectedBrand]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
  };

  const formatPrice = (price) => {
    if (!price) return "가격 정보 없음";
    return (Number(price) / 10000).toLocaleString() + "만원";
  };

  const filteredCars = carList.filter((car) => {
    if (!car) return false;
    const carBrand = car.manufacturer || car.brand || "기타";
    return selectedBrand === "전체" ? true : carBrand === selectedBrand;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleBannerClick = (item) => {
    const target = item || bannerItems[safeBannerIndex];
    if (target.link) router.push(target.link);
  };
  const goPrevBanner = () => setBannerIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  const goNextBanner = () => setBannerIndex((prev) => (prev + 1) % bannerItems.length);
  const getBannerPositionStyle = (idx) => {
    const len = bannerItems.length;
    let diff = idx - safeBannerIndex;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    if (diff === 0) return bannerCarouselStyles.center;
    if (diff === -1 || diff === len - 1) return bannerCarouselStyles.left;
    if (diff === 1 || diff === -len + 1) return bannerCarouselStyles.right;
    return bannerCarouselStyles.hidden;
  };

  const handleCarClick = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
    if (userId) fetchMyFavorites(userId);
  };

  const handleHeartClick = async (e, car) => {
    e.stopPropagation();
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const vehicleId = car._id || car.id;
    if (!vehicleId) return;

    const nextLikedIds = new Set(likedVehicleIds);
    if (nextLikedIds.has(vehicleId)) {
      nextLikedIds.delete(vehicleId);
    } else {
      nextLikedIds.add(vehicleId);
    }
    setLikedVehicleIds(nextLikedIds);

    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, vehicleId })
      });
      if (!res.ok) throw new Error("API Fail");
    } catch (err) {
      console.error("찜 토글 실패:", err);
      fetchMyFavorites(userId);
    }
  };

  return (
    <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div className="page-wrapper">
        {errorMsg && <div style={{ border: "1px solid #ffccc7", padding: "10px", textAlign: "center", color: "#ff4d4f", margin: "10px" }}>⚠️ {errorMsg}</div>}

        <section style={bannerCarouselStyles.section}>
          {bannerItems.map((item, idx) => (
            <div key={item.id} style={{ ...bannerCarouselStyles.cardBase, ...getBannerPositionStyle(idx) }} onClick={() => handleBannerClick(item)}>
              <img src={item.img} alt={`banner-${item.id}`} style={bannerCarouselStyles.image} />
            </div>
          ))}
          <button onClick={goPrevBanner} style={{ ...bannerCarouselStyles.arrowBtn, left: "3%" }}>‹</button>
          <button onClick={goNextBanner} style={{ ...bannerCarouselStyles.arrowBtn, right: "3%" }}>›</button>
          <div style={bannerCarouselStyles.dots}>
            {bannerItems.map((item, idx) => <span key={item.id} onClick={() => setBannerIndex(idx)} style={{ ...bannerCarouselStyles.dot, opacity: idx === safeBannerIndex ? 1 : 0.3, width: idx === safeBannerIndex ? 18 : 8 }} />)}
          </div>
        </section>

        <section style={{ margin: "50px auto 40px", padding: "0 40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#2563eb", marginBottom: "10px" }}>고객님, 어떤 차를 찾으시나요?</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "22px" }}>차종이나 모델명으로 검색할 수 있어요</p>
          <form onSubmit={handleSearchSubmit} style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative", width: "720px", maxWidth: "90vw" }}>
              <input type="text" placeholder="검색 (예: 그랜저)" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: "100%", height: "56px", padding: "0 22px", borderRadius: "999px", border: "1px solid #e5e7eb", fontSize: "17px", outline: "none" }} />
            </div>
            <button type="submit" style={{ width: "54px", height: "54px", borderRadius: "50%", border: "none", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          </form>
        </section>

        <section style={{ margin: "30px auto 0", padding: "0 40px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "18px" }}>ALPHACAR 판매 순위 TOP 10</h3>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "24px 28px 28px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)", display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "320px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>국내 자동차 판매 순위 TOP 5</h4>
              {domesticTop5.map((car) => <div key={car.rank} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}><span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0070f3", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", fontWeight: "700" }}>{car.rank}</span><span style={{ flex: 1, fontWeight: 500 }}>{car.name}</span><span style={{ width: "60px", textAlign: "right" }}>{car.share}</span></div>)}
            </div>
            <div style={{ flex: 1, minWidth: "320px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>외제 자동차 판매 순위 TOP 5</h4>
              {foreignTop5.map((car) => <div key={car.rank} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}><span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#ff4d4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", fontWeight: "700" }}>{car.rank}</span><span style={{ flex: 1, fontWeight: 500 }}>{car.name}</span><span style={{ width: "60px", textAlign: "right" }}>{car.share}</span></div>)}
            </div>
          </div>
        </section>

        <MidBanner />

        <section className="brand-section" style={{ marginTop: "40px", padding: "0 40px 60px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#111111", marginBottom: "18px" }}>브랜드로 차량을 찾아보세요</h2>
          <div style={{ backgroundColor: "#f5f5f7", borderRadius: "14px", padding: "14px 18px", marginBottom: "24px" }}>
            <div className="brand-tabs">{brands.map((b) => <button key={b} className={b === selectedBrand ? "brand-btn brand-btn-active" : "brand-btn"} onClick={() => setSelectedBrand(b)}>{b}</button>)}</div>
          </div>

          <div className="car-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px 20px" }}>
            {loading && <p style={{ gridColumn: "1/-1", textAlign: "center" }}>로딩 중...</p>}
            {!loading && filteredCars.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center" }}>차량이 없습니다.</p>}

            {paginatedCars.map((car, idx) => {
              const vehicleId = car._id || car.id;
              const isLiked = likedVehicleIds.has(vehicleId);

              return (
                <div
                  key={vehicleId || idx}
                  onClick={() => handleCarClick(car)}
                  style={{
                    borderRadius: "14px", border: "1px solid #e5e7eb", padding: "18px 12px 16px",
                    backgroundColor: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                    display: "flex", flexDirection: "column", gap: "10px", transition: "all 0.12s",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(15,23,42,0.10)"; e.currentTarget.style.borderColor = "#2563eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.04)"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  <div style={{ width: "100%", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {car.imageUrl ? <img src={car.imageUrl} alt={car.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ color: "#ccc", fontSize: "13px" }}>이미지 없음</span>}
                    
                    {/* 💖 메인 화면 하트 버튼 (위치: 이미지 우측 하단 여백) */}
                    <button
                      onClick={(e) => handleHeartClick(e, car)}
                      style={{
                        position: "absolute", 
                        bottom: "-15px", // 🔹 수정: 빨간 네모 위치에 맞게 더 아래로 이동
                        right: "5px",
                        zIndex: 10,
                        background: "none", border: "none", cursor: "pointer", padding: "5px"
                      }}
                    >
                      <HeartIcon filled={isLiked} />
                    </button>
                  </div>

                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>[{car.manufacturer || "미분류"}] {car.name}</p>
                    <p style={{ fontSize: "13px", color: "#2563eb", marginBottom: "6px" }}>{formatPrice(car.minPrice)} ~</p>
                    <button className="car-detail-btn" style={{ marginTop: "2px", padding: "6px 12px", borderRadius: "999px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "12px", cursor: "pointer" }}>상세보기</button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCars.length > 0 && <div className="pagination" style={{ marginTop: "24px" }}>{Array.from({ length: totalPages }, (_, i) => <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={i + 1 === currentPage ? "page-btn page-btn-active" : "page-btn"}>{i + 1}</button>)}</div>}
        </section>

        <BrandTestDriveSection />
        <YouTubeSection />
      </div>

      {isModalOpen && selectedCar && <CarDetailModal car={selectedCar} onClose={handleCloseModal} />}
    </main>
  );
}

const bannerCarouselStyles = {
  section: { position: "relative", width: "100%", height: "320px", marginTop: "30px", marginBottom: "20px" },
  cardBase: { position: "absolute", top: "50%", transform: "translateY(-50%)", width: "90%", maxWidth: "1450px", height: "100%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.18)", backgroundColor: "#000", cursor: "pointer", transition: "all 0.5s ease" },
  center: { left: "50%", transform: "translate(-50%, -50%) scale(1)", zIndex: 3, opacity: 1, filter: "none" },
  left: { left: "16%", transform: "translate(-50%, -50%) scale(0.85)", zIndex: 2, opacity: 0.7, filter: "blur(1px) brightness(0.45)" },
  right: { left: "84%", transform: "translate(-50%, -50%) scale(0.85)", zIndex: 2, opacity: 0.7, filter: "blur(1px) brightness(0.45)" },
  hidden: { left: "50%", transform: "translate(-50%, -50%) scale(0.8)", zIndex: 1, opacity: 0, pointerEvents: "none", filter: "blur(2px) brightness(0.3)" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  arrowBtn: { position: "absolute", top: "50%", transform: "translateY(-50%)", width: "32px", height: "32px", borderRadius: "50%", border: "none", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", cursor: "pointer", fontSize: "20px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 },
  dots: { position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 5 },
  dot: { height: "8px", borderRadius: "999px", backgroundColor: "#555", cursor: "pointer", transition: "all 0.3s" },
};
