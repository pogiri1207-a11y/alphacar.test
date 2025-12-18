# ArgoCD 마이그레이션 가이드

기존 통합 Application에서 서비스별 Application으로 마이그레이션하는 방법입니다.

## 마이그레이션 전 준비사항

1. 현재 배포 상태 확인:
   ```bash
   kubectl get deployment -n alphacar
   kubectl get svc -n alphacar
   ```

2. ArgoCD Application 상태 확인:
   ```bash
   kubectl get application -n argocd
   kubectl get application alphacar-services -n argocd -o yaml
   ```

## 마이그레이션 단계

### 1단계: 새로운 Application 적용

새로운 서비스별 Application을 먼저 적용 (기존 Application은 유지):

```bash
# 모든 새로운 Application 적용
kubectl apply -f k8s/applications/

# 적용 확인
kubectl get application -n argocd | grep alphacar
```

### 2단계: 동기화 상태 확인

각 Application이 정상적으로 동기화되는지 확인:

```bash
# ArgoCD CLI 사용 (또는 웹 UI 확인)
argocd app list | grep alphacar

# 각 Application 상태 확인
argocd app get alphacar-main-backend
argocd app get alphacar-frontend
```

### 3단계: 기존 Application 삭제 (선택사항)

모든 새 Application이 정상적으로 동기화된 후, 기존 통합 Application 삭제:

```bash
# 주의: 이 작업은 기존 리소스를 삭제할 수 있습니다
# syncPolicy.prune이 활성화되어 있다면 리소스가 삭제될 수 있음

# 방법 1: Application만 삭제 (리소스는 유지)
kubectl patch application alphacar-services -n argocd \
  -p '{"metadata":{"finalizers":null}}' \
  --type=merge
kubectl delete application alphacar-services -n argocd

# 방법 2: Application과 관리하는 리소스 모두 삭제
# (주의: 이 방법은 모든 리소스를 삭제합니다)
kubectl delete application alphacar-services -n argocd
```

### 4단계: 최종 확인

모든 서비스가 정상적으로 배포되었는지 확인:

```bash
# Deployment 상태 확인
kubectl get deployment -n alphacar

# Pod 상태 확인
kubectl get pods -n alphacar

# Service 확인
kubectl get svc -n alphacar

# ArgoCD Application 상태 확인
kubectl get application -n argocd | grep alphacar
```

## 롤백 방법

문제가 발생하면 다음 방법으로 롤백할 수 있습니다:

### 1. 새 Application 삭제

```bash
# 모든 새 Application 삭제
kubectl delete application -n argocd \
  -l app.kubernetes.io/name=alphacar
```

### 2. 기존 Application 복구

기존 `alphacar-services` Application을 다시 생성:

```bash
# 기존 매니페스트 사용
kubectl apply -f k8s/alphacar-backend.yaml
kubectl apply -f k8s/alphacar-frontend.yaml

# ArgoCD Application 재생성 (필요시)
```

## 주의사항

1. **데이터 손실 방지**:
   - 마이그레이션 전에 중요한 데이터 백업
   - StatefulSet이나 PVC를 사용하는 경우 특히 주의

2. **다운타임**:
   - `syncPolicy.prune`이 활성화되어 있으면 일시적인 다운타임이 발생할 수 있음
   - 가능하면 트래픽이 적은 시간대에 마이그레이션 수행

3. **리소스 중복**:
   - 기존 Application과 새 Application이 동시에 존재하면 리소스가 중복될 수 있음
   - 신중하게 마이그레이션 진행

4. **네임스페이스**:
   - 모든 서비스는 `alphacar` 네임스페이스에 배포됩니다
   - 네임스페이스가 존재하는지 확인하거나 `CreateNamespace=true` 옵션 사용

## 문제 해결

### Application이 동기화되지 않는 경우

```bash
# Application 이벤트 확인
kubectl describe application {app-name} -n argocd

# 로그 확인
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

### 리소스 충돌

두 Application이 같은 리소스를 관리하려고 하면 충돌 발생:

```bash
# 충돌하는 리소스 확인
kubectl get deployment -n alphacar --show-labels

# 기존 Application에서 해당 리소스 제거 후 새 Application 적용
```

### 이미지 Pull 실패

```bash
# Secret 확인
kubectl get secret harbor-registry-secret -n alphacar

# Pod 이벤트 확인
kubectl describe pod {pod-name} -n alphacar
```

