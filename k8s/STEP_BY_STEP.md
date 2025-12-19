# ArgoCD Repository 연결 - 단계별 가이드

처음부터 끝까지 화면에서 보이는 그대로 따라하세요!

## 완전 단계별 가이드

### 1단계: ArgoCD 접속
- 브라우저에서: `https://192.168.56.200:30001`
- 로그인:
  - Username: `admin`
  - Password: `xmka8grMbrs6Xfji`

### 2단계: Repositories 메뉴로 이동
1. 왼쪽 사이드바에서 **"Settings"** (톱니바퀴 아이콘) 클릭
2. **"Repositories"** 클릭

### 3단계: Repository 연결 시작
1. **"+ CONNECT REPO"** 버튼 클릭

### 4단계: 연결 방법 선택
**⚠️ 중요: 이 부분이 핵심입니다!**

화면에 나타나는 폼에서:
1. 맨 위에 **"VIA SSH"** 또는 **"Choose your connection method"** 드롭다운이 보입니다
2. **이 드롭다운을 클릭**하세요
3. 드롭다운 메뉴에서 **"VIA HTTPS"** 선택
   - 또는 **"VIA HTTPS (WITH CREDENTIALS)"** 선택 가능

### 5단계: Repository 정보 입력
드롭다운을 HTTPS로 변경하면 입력 필드가 나타납니다:

#### 필수 입력 항목:

1. **Repository URL** (반드시 입력):
   ```
   https://github.com/pogiri1207-a11y/alphacar.git
   ```

2. **Project** (입력 또는 드롭다운에서 선택):
   ```
   default
   ```

#### 선택 입력 항목 (Public 저장소면 생략 가능):

3. **Name** (Helm 사용 시만 필요, 일반적으로 생략 가능)

4. **Username** (Private 저장소인 경우만):
   - GitHub 사용자명

5. **Password** (Private 저장소인 경우만):
   - GitHub Personal Access Token

### 6단계: 연결 완료
1. 모든 정보 입력 후 **"CONNECT"** 버튼 클릭
2. 연결이 성공하면 목록에 저장소가 나타납니다

---

## Public vs Private 저장소

### Public 저장소 (인증 불필요)
- Repository URL만 입력하면 됩니다
- Username과 Password는 **비워두세요**

### Private 저장소 (인증 필요)
- Repository URL 입력
- Username: GitHub 사용자명
- Password: GitHub Personal Access Token (비밀번호 아님!)

---

## Personal Access Token 생성 (Private 저장소인 경우)

1. GitHub 로그인
2. 우측 상단 프로필 아이콘 클릭 → **Settings**
3. 왼쪽 메뉴에서 **Developer settings** 클릭
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token (classic)** 클릭
6. 설정:
   - **Note**: `ArgoCD` (이름 아무거나)
   - **Expiration**: 원하는 기간 선택
   - **Select scopes**: `repo` 체크
7. 하단 **Generate token** 클릭
8. 생성된 토큰 복사 (한 번만 보여짐!)
9. ArgoCD의 Password 필드에 붙여넣기

---

## 연결 후 확인

연결이 완료되면:
1. **Settings** → **Repositories** 메뉴로 돌아가기
2. 연결한 저장소가 목록에 나타나는지 확인
3. 상태가 **"Successful"**인지 확인

---

## 문제 해결

### "VIA HTTPS" 옵션이 안 보여요
- 드롭다운 메뉴를 다시 클릭해보세요
- 페이지를 새로고침해보세요

### 연결이 실패해요
1. Repository URL이 정확한지 확인
2. Public 저장소라면 Username/Password 비워두기
3. Private 저장소라면 Personal Access Token 확인
4. 네트워크 연결 확인

### 저장소가 목록에 안 나타나요
1. CONNECT 버튼을 클릭했는지 확인
2. 에러 메시지가 있는지 확인
3. 페이지를 새로고침

