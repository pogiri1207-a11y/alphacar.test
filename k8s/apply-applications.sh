#!/bin/bash

echo "=========================================="
echo "🚀 ArgoCD Application 적용 스크립트"
echo "=========================================="
echo ""

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "📁 작업 디렉토리: $SCRIPT_DIR"
echo ""

# 1단계: Application 파일 확인
echo "1️⃣  Application 파일 확인 중..."
if [ ! -d "applications" ]; then
    echo "❌ applications 디렉토리를 찾을 수 없습니다!"
    exit 1
fi

APPLICATION_COUNT=$(find applications -name "*.yaml" | wc -l)
echo "✅ 발견된 Application 파일: $APPLICATION_COUNT개"
echo ""

# 2단계: 새로운 Application 적용
echo "2️⃣  새로운 ArgoCD Application 적용 중..."
kubectl apply -f applications/

if [ $? -eq 0 ]; then
    echo "✅ Application 적용 완료!"
else
    echo "❌ Application 적용 실패!"
    exit 1
fi
echo ""

# 3단계: 적용된 Application 확인
echo "3️⃣  적용된 Application 확인 중..."
echo ""
kubectl get application -n argocd | grep alphacar
echo ""

# 4단계: 상태 확인 (10초 대기)
echo "4️⃣  Application 동기화 상태 확인 중 (10초 대기)..."
sleep 10

echo ""
echo "📊 Application 상태:"
kubectl get application -n argocd -o custom-columns=NAME:.metadata.name,SYNC:.status.sync.status,HEALTH:.status.health.status | grep alphacar
echo ""

# 5단계: 기존 Application 확인
echo "5️⃣  기존 alphacar-services Application 확인 중..."
if kubectl get application alphacar-services -n argocd >/dev/null 2>&1; then
    echo "⚠️  기존 alphacar-services Application이 존재합니다."
    echo ""
    echo "다음 명령어로 삭제할 수 있습니다:"
    echo "  kubectl delete application alphacar-services -n argocd"
    echo ""
    read -p "지금 삭제하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  기존 Application 삭제 중..."
        kubectl delete application alphacar-services -n argocd
        echo "✅ 삭제 완료!"
    else
        echo "ℹ️  기존 Application을 유지합니다. 나중에 수동으로 삭제하세요."
    fi
else
    echo "✅ 기존 Application이 없습니다."
fi

echo ""
echo "=========================================="
echo "✅ 모든 작업 완료!"
echo "=========================================="
echo ""
echo "📝 다음 단계:"
echo "1. ArgoCD 웹 UI에서 각 Application 상태 확인"
echo "2. 필요시 수동으로 Sync 실행"
echo "3. 각 서비스별로 독립적으로 관리 가능"
echo ""
echo "🌐 ArgoCD 웹 UI: https://192.168.56.200:30001"

