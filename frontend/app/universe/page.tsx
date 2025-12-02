'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function UniversePage() {
  // 예약 상태 관리 (true면 예약 마감)
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    // 예약 버튼 클릭 시 재미있는 인터랙션 알림
    alert('🚀 축하합니다! 대기번호 9,999,999번에 등록되었습니다. (연락이 올 때까지 숨 참으며 기다려주세요!)');
    // 버튼 비활성화 처리
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* 상단 네비게이션 (뒤로가기) */}
      <nav className="p-4 flex items-center max-w-2xl mx-auto sticky top-0 bg-slate-900/80 backdrop-blur z-10">
        <Link href="/" className="text-slate-400 hover:text-white transition flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          메인으로 돌아가기
        </Link>
      </nav>

      <main className="max-w-xl mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 mt-4">
        
        {/* 1. 히어로 이미지 영역 (수정된 이미지 경로 적용) */}
        {/* aspect-[2/3]는 원본 배너 비율에 맞춰 세로로 길게 설정했습니다. 필요시 수정하세요. */}
        <div className="relative w-full aspect-[2/3] md:aspect-[3/4]">
          <Image 
            src="/ad/space-trip-banner.png"  // <-- 경로가 수정되었습니다.
            alt="알파카 타고 우주 여행 광고 배너"
            fill
            className="object-cover"
            priority // 페이지 로드 시 가장 먼저 불러옵니다.
          />
          {/* 이미지 하단 그라데이션 오버레이 (텍스트 가독성용) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-800 via-slate-800/60 to-transparent h-32" />
        </div>

        {/* 2. 상품 상세 설명 영역 */}
        <div className="p-6 space-y-8 relative -mt-12 z-10">
          
          {/* 타이틀 및 가격 */}
          <div className="text-center space-y-3 bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700/50 shadow-lg">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-extrabold rounded-full animate-pulse">
              ⚡️ 선착순 마감 임박!
            </span>
            <h1 className="text-3xl font-extrabold leading-tight">
              알파카와 떠나는<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                초특급 우주 드라이브
              </span>
            </h1>
            <div className="flex justify-center items-end gap-3 mt-2">
              <span className="text-slate-500 text-lg line-through decoration-2">₩99억 9천만</span>
              <span className="text-4xl font-black text-yellow-400 tracking-tight">₩9,999</span>
              <span className="text-slate-300 text-sm pb-1">/ 1인</span>
            </div>
          </div>

          {/* 여행 코스 안내 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🌌</span> 스페셜 코스 안내
            </h2>
            
            <div className="space-y-3">
              {/* 코스 1 */}
              <div className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl border border-slate-700 hover:bg-slate-700/60 transition">
                <div className="bg-blue-500/20 p-3 rounded-full text-2xl">🚀</div>
                <div>
                  <h3 className="font-bold text-blue-300">Step 1. 지구 대기권 돌파</h3>
                  <p className="text-sm text-slate-300 mt-1">알파카 슈퍼카의 부스터ON! 중력을 거스르는 짜릿함을 느껴보세요.</p>
                </div>
              </div>
              {/* 코스 2 */}
              <div className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl border border-slate-700 hover:bg-slate-700/60 transition">
                <div className="bg-yellow-500/20 p-3 rounded-full text-2xl">🌕</div>
                <div>
                  <h3 className="font-bold text-yellow-300">Step 2. 달 표면 오프로드</h3>
                  <p className="text-sm text-slate-300 mt-1">울퉁불퉁 크레이터 사이를 누비는 무중력 드리프트 체험! (멀미약 제공 안 함)</p>
                </div>
              </div>
              {/* 코스 3 */}
              <div className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl border border-slate-700 hover:bg-slate-700/60 transition">
                <div className="bg-pink-500/20 p-3 rounded-full text-2xl">🦙</div>
                <div>
                  <h3 className="font-bold text-pink-300">Step 3. 알파카와 우주 셀카</h3>
                  <p className="text-sm text-slate-300 mt-1">지구가 보이는 명당에서 인생샷 찰칵. 알파카가 카메라를 잘 봅니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 유의사항 (재미 요소) */}
          <div className="bg-red-950/30 border border-red-900/50 p-5 rounded-xl text-sm text-red-200 space-y-2">
            <h3 className="font-bold text-red-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              필독! 유의사항
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-1 text-slate-300">
              <li>본 상품은 상상 속에서만 출발합니다. 실제 탑승 시 책임지지 않습니다.</li>
              <li>우주복은 개인 지참이며, 미지참 시 숨쉬기가 곤란할 수 있습니다.</li>
              <li>드라이버 알파카가 기분이 안 좋으면 침을 뱉을 수 있습니다. (세탁비 미지원)</li>
            </ul>
          </div>

        </div>
      </main>

      {/* 3. 하단 고정 예약 버튼 (모바일 친화적 UX) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-20">
        <div className="max-w-xl mx-auto flex gap-3">
          <button className="flex-1 py-4 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700">
            공유하기
          </button>
          <button 
            onClick={handleBooking}
            disabled={isBooked}
            className={`flex-[2] py-4 rounded-xl font-bold text-lg text-black shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
              ${isBooked 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400'}`}
          >
            {isBooked ? (
              <span>😭 마감되었습니다</span>
            ) : (
              <>
                <span>지금 바로 예약하기</span>
                <span className="animate-bounce">🚀</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
