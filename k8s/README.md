# Alphacar Kubernetes Manifests

이 디렉토리는 Alphacar 프로젝트의 Kubernetes 매니페스트와 ArgoCD Application 정의를 포함합니다.

## 디렉토리 구조

```
k8s/
├── applications/          # ArgoCD Application 정의
│   ├── alphacar-main-backend.yaml
│   ├── alphacar-aichat-backend.yaml
│   ├── alphacar-community-backend.yaml
│   ├── alphacar-drive-backend.yaml
│   ├── alphacar-mypage-backend.yaml
│   ├── alphacar-quote-backend.yaml
│   ├── alphacar-search-backend.yaml
│   └── alphacar-frontend.yaml
├── services/             # 서비스별 Kubernetes 매니페스트
│   ├── main-backend/
│   ├── aichat-backend/
│   ├── community-backend/
│   ├── drive-backend/
│   ├── mypage-backend/
│   ├── quote-backend/
│   ├── search-backend/
│   └── frontend/
├── alphacar-backend.yaml  # (레거시) 기존 통합 매니페스트
└── alphacar-frontend.yaml # (레거시) 기존 통합 매니페스트
```

## 서비스별 ArgoCD Application

각 서비스는 독립적인 ArgoCD Application으로 관리됩니다:

### Backend Services
- **alphacar-main-backend**: 메인 백엔드 서비스 (포트: 3002)
- **alphacar-aichat-backend**: AI 채팅 백엔드 서비스 (포트: 4000)
- **alphacar-community-backend**: 커뮤니티 백엔드 서비스 (포트: 3005)
- **alphacar-drive-backend**: 드라이브 백엔드 서비스 (포트: 3008)
- **alphacar-mypage-backend**: 마이페이지 백엔드 서비스 (포트: 3006)
- **alphacar-quote-backend**: 견적 백엔드 서비스 (포트: 3003)
- **alphacar-search-backend**: 검색 백엔드 서비스 (포트: 3007)

### Frontend Service
- **alphacar-frontend**: 프론트엔드 서비스 (포트: 8000)

## ArgoCD Application 적용 방법

### 1. 기존 Application 삭제 (선택사항)

기존 통합 Application이 있다면 삭제:

```bash
kubectl delete application alphacar-services -n argocd
```

### 2. 새로운 Application 적용

각 서비스별 Application을 ArgoCD에 적용:

```bash
# 모든 Application 적용
kubectl apply -f k8s/applications/

# 또는 개별적으로 적용
kubectl apply -f k8s/applications/alphacar-main-backend.yaml
kubectl apply -f k8s/applications/alphacar-frontend.yaml
# ... 등
```

### 3. ArgoCD에서 확인

ArgoCD 웹 UI에서 각 Application의 상태를 확인할 수 있습니다:
- 접속: `https://192.168.56.200:30001` (또는 NodePort: 30954)
- 각 서비스별로 독립적으로 관리 및 모니터링 가능

## 매니페스트 구조

각 서비스 디렉토리에는 다음이 포함됩니다:
- `deployment.yaml`: Deployment와 Service 정의

### Deployment 주요 설정
- 네임스페이스: `alphacar`
- 이미지: `192.168.56.200:30002/alphacar/{service}:latest`
- 리소스 제한:
  - CPU: 200m-500m
  - Memory: 256Mi-512Mi
- Health Check: `/health` 엔드포인트

## GitOps 워크플로우

1. **코드 변경**: 소스 코드 및 매니페스트 수정
2. **커밋 & 푸시**: `release` 브랜치에 푸시
3. **Jenkins 빌드**: Docker 이미지 빌드 및 Harbor에 푸시
4. **ArgoCD 자동 동기화**: 
   - `syncPolicy.automated`가 활성화되어 있어 자동으로 동기화
   - 새로운 이미지 태그로 자동 업데이트

## 수동 동기화

필요시 ArgoCD CLI로 수동 동기화:

```bash
# 모든 Application 동기화
argocd app sync alphacar-main-backend
argocd app sync alphacar-frontend
# ... 등

# 또는 ArgoCD UI에서 Sync 버튼 클릭
```

## 문제 해결

### Application이 Sync되지 않는 경우

1. Git 저장소 연결 확인:
   ```bash
   kubectl get application {app-name} -n argocd -o yaml
   ```

2. 매니페스트 경로 확인:
   - 각 Application의 `spec.source.path`가 올바른지 확인

3. 네임스페이스 확인:
   - `alphacar` 네임스페이스가 존재하는지 확인
   - `syncOptions: CreateNamespace=true`로 자동 생성됨

### 이미지 Pull 실패

1. Harbor 인증 확인:
   ```bash
   kubectl get secret harbor-registry-secret -n alphacar
   ```

2. 이미지 태그 확인:
   - Harbor에 해당 이미지가 존재하는지 확인
   - 이미지 경로가 올바른지 확인 (`192.168.56.200:30002/alphacar/{service}:latest`)

## 참고사항

- 모든 서비스는 `alphacar` 네임스페이스에 배포됩니다
- 이미지는 Harbor 레지스트리 (`192.168.56.200:30002`)에서 가져옵니다
- 각 서비스는 독립적으로 배포 및 롤백 가능합니다

