// app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMainData } from "../lib/api";
import YouTubeSection from "./components/YouTubeSection";
import CarDetailModal from "./components/CarDetailModal";
import MidBanner from "./components/MidBanner";
import BrandTestDriveSection from "./components/BrandTestDriveSection";

// 백엔드 주소 (Next.js rewrites 설정에 따름)
const API_BASE_URL = "/api";

const bannerItems = [
  { id: 1, img: "/banners/banner1.png", link: "/cashback" },
  { id: 2, img: "/banners/banner2.png", link: "/benefit" },
  { id: 3, img: "/banners/banner3.png", link: "/quote" },
];

const domesticTop5 = [
  { rank: 1, name: "쏘렌토", sales: "10,047", share: "8.6%", prev: "6,788", total: "10,434" },
  { rank: 2, name: "스포티지", sales: "6,868", share: "5.9%", prev: "4,055", total: "4,100" },
  { rank: 3, name: "그랜저", sales: "6,499", share: "5.6%", prev: "5,074", total: "5,047" },
  { rank: 4, name: "쏘나타 더 엣지", sales: "5,897", share: "5.1%", prev: "4,603", total: "6,658" },
  { rank: 5, name: "투싼", sales: "5,384", share: "4.6%", prev: "3,909", total: "5,583" },
];

const foreignTop5 = [
  { rank: 1, name: "Model Y", sales: "3,712", share: "15.4%", prev: "8,361", total: "3,712" },
  { rank: 2, name: "E-Class", sales: "2,489", share: "10.3%", prev: "3,273", total: "2,543" },
  { rank: 3, name: "5 Series", sales: "1,783", share: "7.4%", prev: "2,196", total: "2,073" },
  { rank: 4, name: "GLE-Class", sales: "758", share: "3.2%", prev: "692", total: "343" },
  { rank: 5, name: "GLC-Class", sales: "752", share: "3.1%", prev: "900", total: "771" },
];

const brands = [
  "전체", "현대", "기아", "제네시스", "르노", "KGM", "쉐보레", "벤츠", "BMW", "아우디",
  "폭스바겐", "볼보", "렉서스", "토요타", "테슬라", "랜드로버", "포르쉐", "미니", "포드",
  "링컨", "지프", "푸조", "캐딜락", "폴스타", "마세라티", "혼다", "BYD",
];

export default function HomePage() {
  const router = useRouter();

  const [bannerIndex, setBannerIndex] = useState(0);
  const safeBannerIndex = bannerIndex; // 캐러셀 위치 계산용

  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // 유저 ID 생성
  useEffect(() => {
    let storedUserId = localStorage.getItem("alphacar_user_id");
    if (!storedUserId) {
      storedUserId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("alphacar_user_id", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // 배너 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(
      () => setBannerIndex((prev) => (prev + 1) % bannerItems.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  // 메인 데이터 로딩
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
        console.error("Failed to fetch:", err);
        setErrorMsg("데이터 로딩 실패");
        setCarList([]);
        setLoading(false);
      });
  }, []);

  // 브랜드 바꾸면 페이지 1로
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const keyword = searchText.trim();
    if (!keyword) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
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

  const handleBannerClick = (banner) => {
    const target = banner || bannerItems[safeBannerIndex];
    if (target.link) router.push(target.link);
  };

  const goPrevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  };

  const goNextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % bannerItems.length);
  };

  // 가운데 / 왼쪽 / 오른쪽 / 숨김 위치 계산
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

  const handleCarClick = async (car) => {
    console.log("👆 클릭된 차량 데이터:", car); // [체크포인트 1] 이게 콘솔에 뜨나요?
    setSelectedCar(car);
    setIsModalOpen(true);
    console.log("✅ 모달 상태 변경 완료: open=true"); // [체크포인트 2] 여기까지 오나요?
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  return (
    <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div className="page-wrapper">
        {errorMsg && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ffccc7",
              padding: "10px",
              textAlign: "center",
              color: "#ff4d4f",
              margin: "10px",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 🔻 배너 슬라이드 영역 (가운데 1장 + 양 옆 배너) */}
        <section style={bannerCarouselStyles.section}>
          {bannerItems.map((item, idx) => {
            const posStyle = getBannerPositionStyle(idx);
            return (
              <div
                key={item.id}
                style={{ ...bannerCarouselStyles.cardBase, ...posStyle }}
                onClick={() => handleBannerClick(item)}
              >
                <img
                  src={item.img}
                  alt={`banner-${item.id}`}
                  style={bannerCarouselStyles.image}
                />
              </div>
            );
          })}

          {/* 왼쪽 화살표 */}
          <button
            type="button"
            onClick={goPrevBanner}
            style={{ ...bannerCarouselStyles.arrowBtn, left: "3%" }}
          >
            ‹
          </button>

          {/* 오른쪽 화살표 */}
          <button
            type="button"
            onClick={goNextBanner}
            style={{ ...bannerCarouselStyles.arrowBtn, right: "3%" }}
          >
            ›
          </button>

          {/* 아래 점 인디케이터 */}
          <div style={bannerCarouselStyles.dots}>
            {bannerItems.map((item, idx) => (
              <span
                key={item.id}
                onClick={() => setBannerIndex(idx)}
                style={{
                  ...bannerCarouselStyles.dot,
                  opacity: idx === safeBannerIndex ? 1 : 0.3,
                  width: idx === safeBannerIndex ? 18 : 8,
                }}
              />
            ))}
          </div>
        </section>
        {/* 🔺 배너 끝 */}

        {/* 🔍 검색 영역 (문구 + 검색 UI) */}
        <section
          style={{
            margin: "50px auto 40px",
            padding: "0 40px",
            textAlign: "center",
          }}
        >
          {/* 파란색 큰 글씨 */}
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "700",
              color: "#2563eb",
              marginBottom: "10px",
            }}
          >
            고객님, 어떤 차를 찾으시나요?
          </h2>

          {/* 작은 설명 글씨 */}
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "22px",
            }}
          >
            차종이나 모델명으로 검색할 수 있어요
          </p>

          {/* 검색바 + 파란 동그라미 버튼 */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* 둥근 흰색 검색창 */}
            <div
              style={{
                position: "relative",
                width: "720px",
                maxWidth: "90vw",
              }}
            >
              <input
                type="text"
                placeholder="찾는 차량을 검색해 주세요 (예: 그랜저)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: "100%",
                  height: "56px",
                  padding: "0 22px",
                  borderRadius: "999px",
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: "17px",
                  boxShadow: "0 3px 8px rgba(15,23,42,0.15)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* 파란 동그라미 + 흰색 돋보기(SVG) */}
            <button
              type="submit"
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 8px rgba(37,99,235,0.5)",
                cursor: "pointer",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" />
                <line
                  x1="16.5"
                  y1="16.5"
                  x2="21"
                  y2="21"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </section>

        {/* TOP10 박스 */}
        <section style={{ margin: "30px auto 0", padding: "0 40px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "18px",
            }}
          >
            ALPHACAR 판매 순위 TOP 10
          </h3>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "24px 28px 28px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "320px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                국내 자동차 판매 순위 TOP 5
              </h4>
              {domesticTop5.map((car) => (
                <div
                  key={car.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f5f5f5",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#0070f3",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {car.rank}
                  </span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{car.name}</span>
                  <span style={{ width: "60px", textAlign: "right" }}>
                    {car.share}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: "320px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                외제 자동차 판매 순위 TOP 5
              </h4>
              {foreignTop5.map((car) => (
                <div
                  key={car.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f5f5f5",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#ff4d4f",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {car.rank}
                  </span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{car.name}</span>
                  <span style={{ width: "60px", textAlign: "right" }}>
                    {car.share}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔻 중간 배너 */}
        <MidBanner />

        {/* 브랜드 / 차량 리스트 */}
        <section
          className="brand-section"
          style={{ marginTop: "40px", padding: "0 40px 60px" }}
        >
          {/* 제목: 박스 밖 */}
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "#111111",
              marginBottom: "18px",
            }}
          >
            브랜드로 차량을 찾아보세요
          </h2>

          {/* 브랜드 버튼 영역 */}
          <div
            style={{
              backgroundColor: "#f5f5f7",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "24px",
            }}
          >
            <div className="brand-tabs">
              {brands.map((brand) => (
                <button
                  key={brand}
                  className={
                    brand === selectedBrand
                      ? "brand-btn brand-btn-active"
                      : "brand-btn"
                  }
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* 차량 카드 리스트 */}
          <div
            className="car-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "18px 20px",
            }}
          >
            {loading && !errorMsg && (
              <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                데이터 로딩 중...
              </p>
            )}

            {!loading && filteredCars.length === 0 && (
              <p
                className="empty-text"
                style={{ textAlign: "center", gridColumn: "1 / -1" }}
              >
                {errorMsg
                  ? "데이터를 불러올 수 없습니다."
                  : "해당 브랜드의 차량이 없습니다."}
              </p>
            )}

            {paginatedCars.map((car, idx) => (
              <div
                key={car._id || car.name || idx}
                onClick={() => handleCarClick(car)}
                style={{
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  padding: "18px 12px 16px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "10px",
                  transition:
                    "transform 0.12s ease-out, box-shadow 0.12s ease-out, border-color 0.12s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(15,23,42,0.10)";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(15,23,42,0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {/* 이미지 영역 */}
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#ccc", fontSize: "13px" }}>
                      이미지 없음
                    </span>
                  )}
                </div>

                {/* 차량 정보 */}
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    [{car.manufacturer || "미분류"}] {car.name || "이름 없음"}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#2563eb",
                      marginBottom: "6px",
                    }}
                  >
                    {formatPrice(car.minPrice)} ~
                  </p>
                  <button
                    className="car-detail-btn"
                    style={{
                      marginTop: "2px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      border: "none",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {filteredCars.length > 0 && (
            <div className="pagination" style={{ marginTop: "24px" }}>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={
                    idx + 1 === currentPage
                      ? "page-btn page-btn-active"
                      : "page-btn"
                  }
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 🔹 제조사별 시승 신청 섹션 */}
        <BrandTestDriveSection />

        {/* 유튜브 섹션 */}
        <YouTubeSection />
      </div>

      {isModalOpen && selectedCar && (
        <CarDetailModal car={selectedCar} onClose={handleCloseModal} />
      )}
    </main>
  );
}

const bannerCarouselStyles = {
  section: {
    position: "relative",
    width: "100%",
    height: "320px",
    marginTop: "30px",
    marginBottom: "20px",
  },
  cardBase: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "90%",
    maxWidth: "1450px",
    height: "100%",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.18)",
    backgroundColor: "#000",
    cursor: "pointer",
    transition: "all 0.5s ease",
  },
  center: {
    left: "50%",
    transform: "translate(-50%, -50%) scale(1)",
    zIndex: 3,
    opacity: 1,
    filter: "none",
  },
  left: {
    left: "16%",
    transform: "translate(-50%, -50%) scale(0.85)",
    zIndex: 2,
    opacity: 0.7,
    filter: "blur(1px) brightness(0.45)",
  },
  right: {
    left: "84%",
    transform: "translate(-50%, -50%) scale(0.85)",
    zIndex: 2,
    opacity: 0.7,
    filter: "blur(1px) brightness(0.45)",
  },
  hidden: {
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.8)",
    zIndex: 1,
    opacity: 0,
    pointerEvents: "none",
    filter: "blur(2px) brightness(0.3)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  arrowBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  dots: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 5,
  },
  dot: {
    height: "8px",
    borderRadius: "999px",
    backgroundColor: "#555",
    cursor: "pointer",
    transition: "all 0.3s",
  },
};

