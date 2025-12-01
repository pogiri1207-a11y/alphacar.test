"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 배너 데이터
const bannerItems = [
  {
    id: 1,
    img: "/banners/banner1.png",
    link: "/cashback",
  },
  { id: 2, img: "/banners/banner2.png" },
  { id: 3, img: "/banners/banner3.png" },
];

// TOP 10 이미지 (샘플)
const topCarImages = [
  {
    id: 1,
    name: "더 뉴 아이오닉 6 - E-LITE(롱레인지) 18인치",
    priceText: "50,640,843 원",
    img: "/topcars/new_ioniq6.png",
  },
  {
    id: 2,
    name: "넥쏘 수소 전기차",
    priceText: "70,000,000 원",
    img: "/topcars/new_nexo.png",
  },
  {
    id: 3,
    name: "아이오닉 6 (기본형)",
    priceText: "53,340,000 원",
    img: "/topcars/ioniq6.png",
  },
];

// 브랜드 탭
const brands = [
  "전체",
  "현대",
  "기아",
  "제네시스",
  "르노코리아",
  "KGM",
  "BMW",
  "벤츠",
  "아우디",
];

export default function HomePage() {
  const router = useRouter();

  const [bannerIndex, setBannerIndex] = useState(0);
  const [topCarIndex, setTopCarIndex] = useState(0);

  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [searchText, setSearchText] = useState("");

  // ✅ 페이지네이션 state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // 배너 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(
      () => setBannerIndex((prev) => (prev + 1) % bannerItems.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  // TOP10 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(
      () => setTopCarIndex((prev) => (prev + 1) % topCarImages.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  // DB에서 차량 목록 가져오기
  useEffect(() => {
    fetch("http://192.168.0.160:3007/cars")
      .then((res) => {
        if (!res.ok) throw new Error("백엔드 연결 실패");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCarList(data);
        } else {
          setCarList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch:", err);
        setErrorMsg(
          `서버와 연결할 수 없습니다. (백엔드가 켜져있는지 확인해주세요)`
        );
        setCarList([]);
        setLoading(false);
      });
  }, []);

  // 브랜드 바꾸면 항상 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand]);

  // 검색 버튼 / 엔터
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

  // 브랜드 필터 적용
  const filteredCars = carList.filter((car) => {
    if (!car) return false;
    const carBrand = car.manufacturer || car.brand || "기타";
    const matchBrand =
      selectedBrand === "전체" ? true : carBrand === selectedBrand;
    return matchBrand;
  });

  // ✅ 페이지네이션 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 배너 클릭 시 이동
  const handleBannerClick = () => {
    const current = bannerItems[bannerIndex];
    if (current.link) {
      router.push(current.link);
    }
  };

  return (
    <div className="page-wrapper">

      {errorMsg && (
        <div
          style={{
            backgroundColor: "#fff2f0",
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

      {/* 배너 */}
      <section className="banner-section">
        <div
          className="banner-slide"
          style={{ backgroundImage: `url(${bannerItems[bannerIndex].img})` }}
          onClick={handleBannerClick}
        />
        {/* 배너 점 ●●● */}
        <div className="banner-dots">
          {bannerItems.map((item, idx) => (
            <button
              key={item.id}
              className={idx === bannerIndex ? "dot active" : "dot"}
              onClick={() => setBannerIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* 검색창 */}
      <section
        style={{ maxWidth: "600px", margin: "30px auto", padding: "0 20px" }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "999px",
            border: "2px solid #0070f3",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "18px" }}>🔍</span>
          <input
            type="text"
            placeholder="찾는 차량을 검색해 주세요 (예: 그랜저)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ border: "none", outline: "none", flex: 1, fontSize: "16px" }}
          />
          <button
            type="submit"
            style={{
              border: "none",
              background: "#0070f3",
              color: "white",
              borderRadius: "20px",
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            검색
          </button>
        </form>
      </section>

      {/* TOP 10 */}
      <section className="topcar-section">
        <h3>ALPHACAR 추천 TOP 10</h3>

        {topCarImages.length > 0 && (
          <div
            className="topcar-slider"
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px 40px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              minHeight: "260px", // 전체 박스 높이 어느 정도 고정
            }}
          >
            {/* 왼쪽 큰 이미지 박스 */}
            <div
              className="topcar-image-wrap"
              style={{
                flex: 1.4,
                background: "#f2f2f2",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                height: "260px", // 이미지 영역 높이 고정
              }}
            >
              <img
                src={topCarImages[topCarIndex].img}
                alt={topCarImages[topCarIndex].name}
                className="topcar-image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* 오른쪽 텍스트 */}
            <div
              className="topcar-info"
              style={{
                flex: 1,
                paddingLeft: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                className="topcar-name"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                {topCarImages[topCarIndex].name}
              </p>
              <p
                className="topcar-sub"
                style={{
                  fontSize: "14px",
                  color: "#888",
                  marginBottom: "16px",
                }}
              >
                ALPHACAR 데이터 기반 인기 차량
              </p>
              <p
                className="topcar-price-title"
                style={{
                  fontSize: "14px",
                  color: "#999",
                  marginBottom: "4px",
                }}
              >
                세제 혜택 적용 후 차량 가격
              </p>
              <p
                className="topcar-price"
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                {topCarImages[topCarIndex].priceText}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 브랜드 탭 + 차량 리스트 */}
      <section className="brand-section">
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

        <div className="car-list">
          {loading && !errorMsg && (
            <p style={{ textAlign: "center", width: "100%" }}>
              데이터 로딩 중...
            </p>
          )}

          {!loading && filteredCars.length === 0 && (
            <p className="empty-text">
              {errorMsg
                ? "데이터를 불러올 수 없습니다."
                : "해당 브랜드의 차량이 없습니다."}
            </p>
          )}

          {paginatedCars.map((car) => (
            <div key={car._id || Math.random()} className="car-card">
              <div
                className="car-image-placeholder"
                style={{ overflow: "hidden", background: "#fff" }}
              >
                {car.photos?.representative_image?.url ? (
                  <img
                    src={car.photos.representative_image.url}
                    alt={car.vehicle_name || "차량"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ color: "#ccc" }}>이미지 없음</span>
                )}
              </div>
              <div className="car-info">
                <p className="car-name">
                  [{car.manufacturer || "미분류"}]{" "}
                  {car.vehicle_name || "이름 없음"}
                </p>
                <p className="car-price">
                  {formatPrice(car.summary?.price_range?.min)} ~
                </p>
                <button className="car-detail-btn">상세보기</button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 페이지네이션 버튼 */}
        {filteredCars.length > 0 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === currentPage
                      ? "page-btn page-btn-active"
                      : "page-btn"
                  }
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

