// app/consult/page.js
"use client";

import { useState } from "react";

export default function ConsultPage() {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePersonal, setAgreePersonal] = useState(false); // 필수
  const [agreeMarketing, setAgreeMarketing] = useState(false); // 선택

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!agreePersonal) {
      alert("개인정보 수집 및 이용(필수)에 동의해 주세요.");
      return;
    }

    alert("상담접수가 완료되었습니다.");
    form.reset();
    setAgreeAll(false);
    setAgreePersonal(false);
    setAgreeMarketing(false);
  };

  const handleCancel = () => {
    alert("취소되었습니다.");
  };

  const handleAllChange = (checked) => {
    setAgreeAll(checked);
    setAgreePersonal(checked);
    setAgreeMarketing(checked);
  };

  const handlePersonalChange = (checked) => {
    const nextPersonal = checked;
    setAgreePersonal(nextPersonal);
    setAgreeAll(nextPersonal && agreeMarketing);
  };

  const handleMarketingChange = (checked) => {
    const nextMarketing = checked;
    setAgreeMarketing(nextMarketing);
    setAgreeAll(agreePersonal && nextMarketing);
  };

  return (
    <div
      style={{
        maxWidth: "920px",
        margin: "40px auto 80px",
        padding: "0 16px 80px",
      }}
    >
      {/* 상단 타이틀 영역 (리본카 첫 번째 캡처 느낌) */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          1:1 상담/문의
        </h1>
        <p style={{ fontSize: "13px", color: "#666" }}>
          상담을 남겨주시면 빠르게 확인해서 연락드릴게요.
        </p>
      </div>

      {/* 전화 안내 박스 */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px 20px",
          backgroundColor: "#f7f9ff",
          borderRadius: "10px",
          border: "1px solid #e0e7ff",
          fontSize: "13px",
          color: "#333",
        }}
      >
        <div style={{ marginBottom: "6px", fontWeight: 600 }}>
          전화 상담이 필요하신가요?
        </div>
        <div>
          ALPHACAR 고객센터{" "}
          <span style={{ fontWeight: 700 }}>1588-0000</span> (평일 09:00 ~
          18:00)
        </div>
      </div>

      {/* 폼 전체: 구분선 넣어서 플랫한 느낌 */}
      <form onSubmit={handleSubmit}>
        {/* 상담 유형 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            상담 유형<span style={requiredMark}>*</span>
          </label>
          <select name="type" required style={inputStyle}>
            <option value="">상담 유형을 선택해 주세요.</option>
            <option>차량 상담</option>
            <option>회원 정보</option>
            <option>이벤트 문의</option>
            <option>앱 이용문의</option>
            <option>기타</option>
          </select>
        </div>

        {/* 상담 가능 시간 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            상담 가능 시간<span style={requiredMark}>*</span>
          </label>
          <select name="time" required style={inputStyle}>
            <option value="">상담 가능한 시간을 선택해 주세요.</option>
            <option>상시 가능 (09:00~18:00)</option>
            <option>09:00~10:00</option>
            <option>10:00~11:00</option>
            <option>11:00~12:00</option>
            <option>12:00~13:00</option>
            <option>13:00~14:00</option>
            <option>14:00~15:00</option>
            <option>15:00~16:00</option>
            <option>16:00~17:00</option>
            <option>17:00~18:00</option>
          </select>
        </div>

        {/* 이름 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            이름<span style={requiredMark}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="이름을 입력해 주세요."
            required
            style={inputStyle}
            spellCheck={false}
          />
        </div>

        {/* 휴대폰 번호 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            휴대폰 번호<span style={requiredMark}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="- 없이 숫자만 입력해 주세요."
            required
            style={inputStyle}
            spellCheck={false}
          />
        </div>

        {/* 회신 방법 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            회신 방법<span style={requiredMark}>*</span>
          </label>
          <div style={{ display: "flex", gap: "20px", fontSize: "13px" }}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="reply"
                value="call"
                required
                style={{ cursor: "pointer" }}
              />
              전화 통화
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="reply"
                value="sms"
                required
                style={{ cursor: "pointer" }}
              />
              문자 메시지
            </label>
          </div>
        </div>

        {/* 상담 내용 */}
        <div style={fieldWrapStyle}>
          <label style={labelStyle}>
            상담 내용<span style={requiredMark}>*</span>
          </label>
          <textarea
            name="content"
            placeholder="상담 내용을 입력해 주세요."
            required
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.5,
            }}
            spellCheck={false} // 빨간 물결 밑줄 방지
          ></textarea>
        </div>

        {/* 구분선 */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "28px 0 20px",
          }}
        />

        {/* 서비스 이용 약관 영역 – 깔끔하게 재구성 */}
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            서비스 이용 약관에 동의해 주세요.
          </h2>

          {/* 전체 동의 */}
          <label style={checkRowStyle}>
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => handleAllChange(e.target.checked)}
            />
            <span>전체 약관에 동의합니다.</span>
          </label>

          {/* 개인정보 수집 및 이용 동의 (필수) */}
          <div style={termsBoxStyle}>
            <label style={checkRowStyle}>
              <input
                type="checkbox"
                checked={agreePersonal}
                onChange={(e) => handlePersonalChange(e.target.checked)}
              />
              <span>
                개인정보 수집 및 이용에 동의합니다.{" "}
                <span style={{ color: "#ff4d4f" }}>(필수)</span>
              </span>
            </label>

            <div style={termsInnerStyle}>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>수집 항목</span>
                <span style={termsTdStyle}>이름, 휴대폰 번호</span>
              </div>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>수집 및 이용 목적</span>
                <span style={termsTdStyle}>
                  ALPHACAR 서비스 이용 관련 상담 및 문의사항에 대한 답변 제공, 상담
                  진행 상태 안내
                </span>
              </div>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>보유 및 이용 기간</span>
                <span style={termsTdStyle}>
                  상담 종료 후 3개월간 보관 후 파기
                </span>
              </div>
            </div>
          </div>

          {/* 마케팅 활용 동의 (선택) */}
          <div style={termsBoxStyle}>
            <label style={checkRowStyle}>
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) => handleMarketingChange(e.target.checked)}
              />
              <span>
                마케팅 활용에 동의합니다.{" "}
                <span style={{ color: "#999" }}>(선택)</span>
              </span>
            </label>

            <div style={termsInnerStyle}>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>활용하는 개인정보 항목</span>
                <span style={termsTdStyle}>이름, 휴대폰 번호</span>
              </div>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>활용 목적</span>
                <span style={termsTdStyle}>
                  신규 서비스/이벤트 안내, 혜택 정보 제공, 고객 만족도 조사 등
                </span>
              </div>
              <div style={termsRowStyle}>
                <span style={termsThStyle}>보유 및 활용 기간</span>
                <span style={termsTdStyle}>
                  동의일로부터 1년간 보관 후 파기 또는 동의 철회 시까지
                </span>
              </div>
            </div>
          </div>

          <p
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#777",
            }}
          >
            고객은 동의를 거부할 권리가 있으며, 동의를 거부하는 경우 일부 서비스
            이용에 제한이 있을 수 있습니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div
          style={{
            marginTop: "28px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              minWidth: "96px",
              height: "40px",
              borderRadius: "4px",
              border: "1px solid #d0d0d0",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              minWidth: "120px",
              height: "40px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#0F62FE",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            상담 접수
          </button>
        </div>
      </form>
    </div>
  );
}

/* 공통 스타일 */
const fieldWrapStyle = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "6px",
};

const requiredMark = {
  color: "#ff4d4f",
  marginLeft: "3px",
  fontSize: "12px",
};

const inputStyle = {
  width: "100%",
  borderRadius: "4px",
  border: "1px solid #d9d9d9",
  padding: "9px 10px",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

/* 약관 박스 스타일 */
const checkRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  marginBottom: "6px",
};

const termsBoxStyle = {
  marginTop: "10px",
  padding: "10px 12px 8px",
  borderRadius: "8px",
  border: "1px solid #e1e1e1",
  backgroundColor: "#fafafa",
};

const termsInnerStyle = {
  marginTop: "6px",
  padding: "8px 10px",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  fontSize: "12px",
  lineHeight: 1.5,
};

const termsRowStyle = {
  display: "flex",
  marginBottom: "4px",
};

const termsThStyle = {
  width: "90px",
  fontWeight: 600,
  color: "#555",
};

const termsTdStyle = {
  flex: 1,
  color: "#666",
};

