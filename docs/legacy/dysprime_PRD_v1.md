# dysprime: 제품 요구 명세서 (PRD)

**Product Requirements Document**  
**Version 1.1** | **2026-02-07** | **기반: BRD v4.0 · FSD v1.3 · IA v1.4 · ERD v1.1 · 시장 전략 보고서**

본 문서는 투자 유치(IR) 및 내부 공유용 피칭덱 구조를 벤치마크하여, 처음 보는 투자자·내부 이해관계자가 「dysprime이 무엇인지」「왜 필요한지」「어떤 효과가 기대되는지」를 한 번에 파악할 수 있도록 보고서 형식으로 정리한 최종 제품 요구 명세서이다.

---

## 0. 실행 요약 (IR·피칭 요약)

본 절은 SaaS IR·피칭덱에서 통상 다루는 항목을 표로 요약한다. 상세는 각 장에서 서술한다.

### 0.1 한 줄 요약

| 구분 | 내용 |
|------|------|
| **제품** | dysprime — AI 기반 미대 입시 평가·코칭 플랫폼 |
| **한 줄 정의** | Vision AI 작품 평가 + 입시 빅데이터 + 학원 MOU 데이터를 결합한, 미대 입시 수험생 전용 AI 코칭 플랫폼. 사교육 정보 비대칭을 해소합니다. |
| **타겟** | 기초디자인·기초소양 입시 수험생(연간 기초디자인 7만명, 기초소양 1만명; 핵심 타겟 학원 미이용 4만명) |
| **가치 제안** | "AI가 당신의 작품을 분석하고, 합격 가능한 대학을 알려드립니다" — 24/7, 전국 동일 서비스, 월 2~5만원 |

### 0.2 문제·솔루션·제품 요약

| 영역 | 요약 |
|------|------|
| **문제** | ① 실력 진단 불가 ② 대학 라인 추정 불가(실기 30~50% 암흑) ③ 개선 방향 모호. 지역·비용·실기 평가·평가 주관성의 사교육 정보 비대칭. |
| **솔루션** | 3-Layer 아키텍처: Layer 1 Vision AI(A~F 등급) → Layer 2 Theory Engine(합격 확률·TOP/HIGH/MID/LOW) → Layer 3 AI Insights(fixScope 기반 1:1 코칭). |
| **제품** | 모바일 앱(및 웹). 작품 업로드 → 8초 내 등급·합격 확률·AI 멘토 피드백. Free/Basic/Premium 구독. |
| **차별화** | 미대 실기 AI 평가는 완전 블루오션. 실기+수능 통합 분석을 제공하는 유일한 플레이어. 학원 MOU 데이터·입시 전용 프롬프트로 정확도 확보. |

### 0.3 시장·비즈니스 요약

| 구분 | 내용 |
|------|------|
| **TAM** | 168억원/년 (기초디자인 7만명 × 월 2만원 × 12개월) |
| **SAM** | 72억원/년 (디지털 수용 3만명 기준) |
| **SOM (Year 1)** | 7.2억원/년 (유료 3,000명 목표) |
| **수익 모델** | B2C 구독(Free/Basic/Premium/Family) + B2B 학원 MOU·레브쉐어 20% |
| **핵심 지표** | Year 1 MAU 3,000명, ARR 7.2억원, Gross Margin 65%. Year 3 ARR 180억원 목표. |

### 0.4 예상 기대효과 요약

| 주체 | 예상 기대효과 |
|------|----------------|
| **수험생** | 객관적 실력 진단(A~F)·합격 라인 파악·우선순위 명확한 개선 피드백; 24시간·전국 동일 품질; 학원 대비 97% 비용 절감. |
| **학원** | 보조툴로 재수생·지방생 관리 보강; MOU 시 데이터 제공 대가 브랜드·노하우 연계. |
| **사회·정책** | 사교육 정보 비대칭 완화, 지역 격차 완화; 정부 사교육 경감·예체능 지원 정책과 방향 일치. |
| **사업** | 미대 실기 AI First Mover; 유닛 이코노믹스(LTV:CAC 63:1 수준) 확보; 예창패 등 정부지원 IR 메시지 정합. |

### 0.5 IR·피칭 핵심 메시지 (한 페이지)

투자자·파트너 피칭 시 강조하는 메시지를 요약한다.

| 메시지 | 한 줄 요약 |
|--------|------------|
| 문제 | 미대 입시생은 실기 실력 진단·합격 라인·개선 우선순위를 알 수 없고, 지역·비용·실기 평가의 정보 비대칭이 심하다. |
| 솔루션 | Vision AI + 입시 DB + 학원 MOU를 결합한 3-Layer 파이프라인으로, 8초 내 A~F 등급·합격 확률·AI 코칭을 제공한다. |
| 시장 | 미대 실기 AI 평가는 블루오션(기존 AI 입시는 수능/교과 중심). TAM 168억원/년, SOM(Year 1) 7.2억원. |
| 차별화 | 실기+수능 통합 분석을 제공하는 유일한 플레이어; 학원 MOU 데이터로 정확도·정책 메시지 확보. |
| 비즈니스 | B2C 구독(Free/Basic/Premium) + B2B MOU·레브쉐어. Year 1 ARR 7.2억원, Year 3 180억원 목표. |
| 정책 정합 | "사교육 정보 비대칭 해소"로 예창패·교육부 사교육 경감 정책과 방향 일치. |

---

## 1. 문서 정보 및 목차

### 1.1 문서 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | dysprime: AI 기반 미대 입시 평가·코칭 플랫폼 |
| **문서 종류** | 제품 요구 명세서 (PRD) |
| **기반 문서** | dysprime BRD v4.0, FSD v1.3, IA v1.4, ERD v1.1 (순서: BRD → FSD → IA → ERD) |
| **작성 원칙** | 골든 서클(Why → How → What) + Who, When. DOCX 변환 전제, 표 형식 시각화만 사용 |
| **대상 독자** | PM, 개발팀, 디자이너, 이해관계자 (처음 보는 이도 부록으로 세부 이해 가능) |

### 1.2 목차

0. 실행 요약 (IR·피칭 요약)  
   0.1 한 줄 요약  
   0.2 문제·솔루션·제품 요약  
   0.3 시장·비즈니스 요약  
   0.4 예상 기대효과 요약  
1. 문서 정보 및 목차  
   1.1 문서 정보  
   1.2 목차  
2. Why — 문제 정의 및 시장·기획  
   2.1 핵심 문제 정의  
   2.2 사교육 정보 비대칭  
   2.3 골든 서클 Why 요약  
   2.4 3-Layer 아키텍처 요약  
   2.5 시장·기획 요약 (TAM-SAM-SOM, PEST, 경쟁, STP)  
3. Who — 대상과 역할  
   3.1 타겟 세그먼트  
   3.2 Actor 및 접근 권한  
   3.3 플랜별 권한 매트릭스  
   3.4 플랜별 크레딧·가격  
4. How — 방법과 과정  
   4.1 3-Layer 기술 요약  
   4.2 MVP 기능 스코프 및 선행 조건  
   4.3 기능 간 의존성  
   4.4 UX 원칙 요약  
   4.5 전역 에러 처리 원칙  
   4.6 기술 스택·인프라 요약  
   4.7 Unit Economics 요약  
5. What — 결과물(제품·기능·데이터)  
   5.0 제품 개요: dysprime이란 무엇인가  
   5.0.2 예상 기대효과  
   5.1 MVP 기능 I-P-O 요약  
   5.2 Out-of-Scope 및 예정 Phase  
   5.3 화면·플로우와 기능 매핑  
   5.4 핵심 엔티티 요약  
   5.5 평가 항목(기초디자인)  
   5.6 등급 매핑·fixScope·라인  
   5.7 경쟁 대비 제품 비교 요약  
6. When — 일정과 Phase  
   6.1 Phase 구분  
   6.2 재무 전망  
   6.3 Phase별 마일스톤·성공 지표  
7. 문서 이력·참조  
8. 리스크 및 대응(요약)  
8. 부록  
   8.1 부록 A: ERD 스키마 및 엔터티 전체  
   8.2 부록 B: 용어집  
   8.3 부록 C: 본문 주석·각주 정리  
   8.4 부록 D: 시장·정책 출처 및 참고자료  

---

## 2. Why — 문제 정의

### 2.1 핵심 문제 정의

미대 입시 수험생의 3대 페인포인트 (출처: BRD §2.1)

| 문제 | 현황 | 영향 |
|------|------|------|
| 실력 진단 불가 | "내 작품이 A급인지 C급인지?" 주관적 판단만 가능 | 성장 추적 어려움, 자신감 부족 |
| 대학 라인 추정 불가 | "이 정도 실기면 어느 대학?" 근거 없음, 실기 30~50%가 암흑 | 지원 전략 수립 불가, 학원 감에만 의존 |
| 개선 방향 모호 | 피드백이 추상적 ("완성도를 높이세요") | 우선순위 불명, 짧은 시간(4-10주) 비효율 |

### 2.2 사교육 정보 비대칭

출처: BRD §2.2

| 문제 | 현황 | dysprime 해결 |
|------|------|----------------|
| 지역 비대칭 | 서울 대형학원 vs 지방, 정보 격차 극심 | 온라인 24/7, 전국 동일 서비스 |
| 비용 비대칭 | 학원 월 50~150만원, 재수/3수생 누적 부담 | 월 2~5만원 (97% 저렴) |
| 실기 평가 암흑 | 수능 서비스는 많지만 실기 30~50%는 데이터 없음 | 실기+수능 통합 합격 확률 |
| 학원 평가 주관성 | 강사/원장별 편차, 교차검증 불가 | AI 기반 객관적 A~F 등급 |

### 2.3 골든 서클 Why 요약

| 구분 | 내용 |
|------|------|
| 목적  | 사교육 정보 비대칭을 해소하고, 미대 입시생이 실력 진단·합격 라인·개선 방향을 객관적으로 알 수 있게 한다 |
|  컨셉 | "AI가 당신의 작품을 분석하고, 합격 가능한 대학을 알려드립니다" — 기초디자인·기초소양 입시 수험생을 위한 24/7 AI 코치 |
| 핵심 가치 제안(원라이너) | Vision AI 작품 평가 + 입시 빅데이터 + 학원 MOU 데이터를 결합한, 미대 입시 수험생 전용 AI 코칭 플랫폼 — 사교육 정보 비대칭을 해소합니다 |

### 2.4 3-Layer 아키텍처 요약

출처: BRD §1.4, §3.1

| Layer | 기술 | 출력 |
|-------|------|------|
| Layer 1: Vision AI | Gemini 3 Pro Vision + 기초디자인 전용 프롬프트 | 밀도/형태력/완성도/정합성/사고력 → A~F 등급 |
| Layer 2: Theory Engine | Theory Engine v3.0 + BigQuery 입시 DB | 대학별 합격 확률 + TOP/HIGH/MID/LOW |
| Layer 3: AI Insights | fixScope 기반 Gemini 2.5 Flash | 우선순위 피드백 + 구체적 액션 플랜 |

### 2.5 시장·기획 요약 (TAM-SAM-SOM, PEST, 경쟁, STP)

본 절은 기획 및 시장 분석 요약을 제공한다. 수치·정책·경쟁사 관련 출처는 본문 주석으로 표기하였으며, 상세 출처는 부록 9.4에 정리하였다. 출처: dysprime 시장 전략 보고서.

#### 2.5.1 시장 규모 (TAM-SAM-SOM)

| 구분 | 모수 | 계산 | 연간 규모 |
|------|------|------|----------|
| TAM (전체 시장) | 기초디자인 준비생 70,000명 | 70,000명 × 월 2만원 × 12개월 | 168억원 |
| SAM (유효 시장) | 디지털 서비스 수용층 30,000명 | 30,000명 × 월 2만원 × 12개월 | 72억원 |
| SOM (1차연도 목표) | 초기 유료 전환 3,000명 | 3,000명 × 월 2만원 × 12개월 | 7.2억원 |

전체 미술 수능 응시 약 12만명/년, 기초소양 준비생 약 1만명/년 수준으로 추정된다. 2025학년도 일부 대학 실기전형 지원 규모 등으로 수요 기반이 확인된 바 있다[^62]. 사교육 시장 환경: 2024년 초·중·고 사교육비 총액 29조 2천억원(전년 대비 7.7% 증가, 4년 연속 최고치)[^76][^82]. 초등 예체능 사교육비만 약 4조 8,797억원, 예체능 비중 24% 증가 추세[^4][^7].

#### 2.5.2 외부 환경 (PEST)

| 영역 | 요인 | dysprime 영향 |
|------|------|----------------|
| 정치·법률 | 교육부 2023년 사교육 경감대책—공정 수능, 예체능 사교육 국가 책임 흡수[^34] | 긍정: 정보 비대칭 해소 메시지와 정책 방향 일치 |
| 정치·법률 | 서울시 서울런, 1,220만건 합불 데이터 기반 AI 진로·진학 코치[^21] | 긍정: 공공 플랫폼 보완재 포지셔닝 가능 |
| 정치·법률 | 예술분야 초기창업 지원(예창패)—초기창업 최대 7천만원, 창업도약 최대 1.5억원[^77][^80] | 긍정: IR·정부지원 연계 유리 |
| 경제 | 입시미술학원 비용: 서울 강남권 월 130~180만원, 고3 특강 시 200만원+[^51][^60] | 긍정: 월 2~5만원 대안 수요 |
| 경제 | 학령인구 감소(2024년 513만명, 전년 대비 8만명 감소)[^76] | 위험: 파이 축소, 1인당 지출로 상쇄 가능 |
| 사회·문화 | 지역 정보 격차(서울 대형학원 vs 지방) | 핵심 기회: 전국 동일 서비스 |
| 사회·문화 | AI 수용도 증가, 온라인 입시 준비 습관화[^49] | 긍정: AI·온라인 플랫폼 수용 기반 |
| 기술 | Vision AI 고도화(Gemini 등); 범용 AI의 입시 도메인 미스매치 | 차별화: 입시 특화 프롬프트+학원 데이터 |

#### 2.5.3 경쟁 구도 요약

| 유형 | 대표 서비스 | 강점 | 약점 | dysprime 대응 |
|------|-------------|------|------|----------------|
| 정시·입시 데이터 | 그리날다[^17][^20], 진학사[^32][^38] | 미대 정시 합격예측, 3개년 합격사례 | 실기 평가 없음 | 실기+입시 DB 통합, 미대 실기 특화 |
| AI 입시 | 스나이퍼AI[^18], 유니고[^19][^28], 서울런[^21] | 수능 분석, 생기부·면접, 공공 데이터 | 실기 미지원 | Vision AI로 실기 30~50% 정량화 |
| 학원 | 파라오(기초디자인)[^64][^66], 네오캣(기초소양) | 1:1 피드백, 합격 실적 | 고비용, 지역·시간 제약 | 학원 보조툴, MOU 협력 |

dysprime은 「실기 평가 역량」과 「입시 데이터 역량」을 동시에 갖춘 유일한 플레이어로 포지셔닝된다.

#### 2.5.4 STP 요약

| 구분 | 내용 |
|------|------|
| Primary Target | 학원 미이용 수험생 40,000명/년 — 정보 비대칭·멘토 부재, 대안 부재로 전환 장벽 낮음 |
| Secondary Target | 학원 이용 현역생 중 보조 도구 니즈, 기초소양 준비생(서울대/고려대/홍대 등) |
| 포지셔닝 | "학원을 대체하지 않고 보완"하는 AI 코칭. 서울 대형학원 수준의 객관적 실기 진단(A~F)과 대학별 합격 확률을 전국 어디서나 24시간 월 2만원으로 제공. |

#### 2.5.5 GTM 채널·촉진 요약

출처: 시장 전략 보고서 §3.1. 유통(Place)·촉진(Promotion) 요약이다.

| 채널 | 역할 | 월 비용(예시) | 예상 유입(예시) |
|------|------|---------------|-----------------|
| 네이버 카페(수만휘/오르비) | 커뮤니티 침투 | 100만원 | 500~800명 |
| 인스타그램 | Z세대 도달, 인플루언서 | 200만원 | 1,000~1,500명 |
| 학원 제휴(MOU) | 신뢰 기반 추천 | Rev Share 20% | 1,000~1,500명 |
| Google/네이버 Ads | 키워드 "미대 입시", "기초디자인" | 350만원 | 800~1,300명 |

| 시기 | 촉진 방향 |
|------|-----------|
| Pre-Launch(2026 Q1) | 미대입시 커뮤니티 바이럴, MOU 발표 PR, 예창패 선정 PR |
| Launch(2026 Q2) | Free 플랜 체험 오픈, 합격생 스토리 캠페인, 학부모 "객관적 진단" 메시지 |
| Growth(2026 Q3~) | 정시 D-30 모드 프로모션, 합격 후 후기 마케팅, B2B 학원 대시보드 시범 |

---

## 3. Who — 대상과 역할

### 3.1 타겟 세그먼트

출처: BRD §4.2

| Segment | 인원 | 특징 | ARPU |
|----------|------|------|------|
| 학원 미이용 재수/3수생 | 12,000명 | 비용 민감, 멘토 절실 | 월 3~5만원 |
| 지방 학생 | 15,000명 | 서울 학원 접근 불가, 정보 비대칭 | 월 2~3만원 |
| 학원 보조 현역생 | 10,000명 | 학원 외 개인 연습 피드백 필요 | 월 2만원 |
| 학부모 | - | 자녀 학습 모니터링, 결제자 | Family 8만원 |

### 3.2 Actor 및 접근 권한

출처: FSD §2.1

| Actor | 설명 | 접근 권한 |
|-------|------|-----------|
| Guest | 미가입 방문자 | 랜딩 페이지, 회원가입 |
| Free User | 가입 후 무료 사용자 | 월 2회 평가 |
| Basic User | 19,900원/월 구독자 | 월 10회 평가 + AI 챗봇 무제한 |
| Premium User | 49,900원/월 구독자 | 무제한 평가 + 입시DB 상세 리포트 |
| Admin | 시스템 관리자 | 전체 데이터 조회/수정 |
| AI Agent | 시스템(자동) | Vision API 호출, Theory Engine 실행 |

### 3.3 플랜별 권한 매트릭스

출처: FSD §2.2

| 데이터/기능 | Guest | Free | Basic | Premium | Admin |
|-------------|-------|------|-------|---------|-------|
| 작품 업로드 | 불가 | 가능(2회/월) | 가능(10회/월) | 가능(무제한) | 가능 |
| 평가 결과 조회 | 불가 | 가능(본인만) | 가능(본인만) | 가능(본인만) | 가능(전체) |
| AI 챗봇 사용 | 불가 | 불가 | 가능 | 가능 | 가능 |
| 입시DB 상세 | 불가 | 불가 | 불가 | 가능 | 가능 |
| 구독 변경 | 불가 | 가능 | 가능 | 가능 | 가능 |
| 계정 삭제 | 불가 | 가능 | 가능 | 가능 | 가능 |

### 3.4 플랜별 크레딧·가격

출처: FSD §2.3, BRD §6.1

| 플랜 | 월 평가 횟수 | AI 챗봇 | 입시DB 상세 | 가격 |
|------|--------------|----------|-------------|------|
| Free | 2회 | 불가 | 불가 | 0원 |
| Basic | 10회 | 가능 무제한 | 불가 | 19,900원/월 |
| Premium | 무제한 | 가능 무제한 | 가능 | 49,900원/월 |

---

## 4. How — 방법과 과정

### 4.1 3-Layer 기술 요약

출처: BRD §5.1

| Layer | 기술 | 용도/출력 |
|-------|------|-----------|
| Vision AI | Gemini 3.0 Pro Preview | 작품 이미지 분석, 5개 지표 → A~F 등급 |
| Chat AI | Gemini 2.5 Flash | AI 멘토, fixScope 기반 개인화 피드백 |
| Embedding | multimodalembedding@001 | 작품 벡터화(1408-dim, Phase 4+ 활용) |
| 입시 엔진 | Theory Engine v3.0 | 합격 확률 계산 |
| 데이터베이스 | Firestore + BigQuery | 사용자·분석 데이터, 입시 DB |

### 4.2 MVP 기능 스코프 및 선행 조건

출처: FSD §1.2, §1.3

| 기능 ID | 기능명 | BRD 연결 | 우선순위 | 선행 조건 |
|---------|--------|----------|----------|-----------|
| F1 | 회원가입/로그인 | 모든 기능의 전제 | P0 | 없음 |
| F1.5 | 성적/프로필 입력(수능 등급) | Layer 2 입력 소스 | P1 | F1 로그인 |
| F2 | 작품 업로드 | Layer 1 입력 | P0 | F1 로그인 |
| F3 | Vision AI 작품 평가 | Layer 1: A~F 등급 | P0 | F2 업로드 완료 |
| F4 | 입시 DB 매칭 | Layer 2: 합격 확률 | P1 | F3 완료 + F1.5 성적 입력 시 실행 |
| F5 | AI 멘토 챗봇 | Layer 3: fixScope 기반 | P1 | F3 평가 완료 |
| F6 | 평가 결과 조회 | 히스토리 기본 | P0 | F1 로그인 |
| F7 | 구독 관리 | Free/Basic/Premium | P1 | F1 로그인 |

### 4.3 기능 간 의존성

선행 기능 → 후행 기능 (출처: FSD §1.3, §1.4)

| 선행 기능 | 후행 기능 | 비고 |
|-----------|-----------|------|
| F1 | F1.5, F2, F6, F7 | 로그인 후 프로필·업로드·결과·구독 가능 |
| F2 | F3 | 업로드 시 F3 자동 트리거 |
| F3 | F4, F5, F6 | Layer 1 완료 후 F4(성적 있으면), F5, F6 |
| F4 | F6 | Layer 2 완료 시 결과 화면에 합격 확률 표시 |
| F5 | - | 챗봇은 F3 완료 분석 기준으로 세션 생성 |

### 4.4 UX 원칙 요약

출처: IA §5

| 원칙 | 설명 |
|------|------|
| Zero Context Switching | 성적 입력 등은 Bottom Sheet로 처리, 페이지 이동 없이 몰입 유지 |
| Thumb-First Design | 모바일에서 엄지로 닿기 쉬운 영역에 주요 CTA 배치 |
| Zero Dead-End | 모든 단계에서 다음 액션(Layer 2, Chat) CTA 명확 제시 |
| Academic Tech | Deep Navy + Vivid Lime 디자인 컨셉, 터치 타겟·대비 준수 |

### 4.5 전역 에러 처리 원칙

출처: FSD §1.5, IA §5.6

| 상황 | 대응 |
|------|------|
| API 5xx·네트워크 오류 | 자동 3회 재시도 후, 실패 시 사용자에게 Retry 버튼 제공 |
| 크레딧 부족 | 구독 업그레이드 Bottom Sheet 유도 |
| 파일 용량 초과 | 에러 토스트 + 재시도 안내 |
| AI 타임아웃 | "잠시 후 결과를 알려드릴게요" + Retry 버튼 |

### 4.6 기술 스택·인프라 요약

출처: BRD §5.1. 구현 시 참조하는 기술·인프라를 요약한다.

| 레이어 | 기술 | 용도 |
|--------|------|------|
| Vision AI | Gemini 3.0 Pro Preview | 작품 이미지 분석, 5개 지표·등급·fixScope |
| Chat AI | Gemini 2.5 Flash | AI 멘토, fixScope 기반 개인화 응답 |
| Embedding | multimodalembedding@001 | 작품 벡터화(1408-dim, Phase 4+ 유사작 검색) |
| 입시 엔진 | Theory Engine v3.0 | 합격 확률·라인 산출 |
| App DB | Firestore | 사용자·분석·챗봇·결제 데이터 |
| 분석·입시 DB | BigQuery | 입시 DB, 집계·분석 쿼리 |
| 프론트엔드 | React Native, Next.js 14 + TypeScript | 모바일 앱, 웹 대시보드 |
| 인프라 | Firebase, GCP(Cloud Storage, Cloud Functions 등) | 서버리스·스토리지·백그라운드 처리 |

### 4.7 Unit Economics 요약

출처: BRD §6.3, 시장 전략 보고서. Basic 플랜 기준 유닛 이코노믹스 요약이다.

| 지표 | 값 | 비고 |
|------|-----|------|
| ARPU(월) | 19,900원 | Basic 기준 |
| COGS | 약 5,600원 | Vision 약 3,000원 + Chat 약 1,500원 + 인프라 약 1,100원 |
| Gross Margin | 약 72% | (19,900 − 5,600) / 19,900 |
| CAC | 약 3,000원 | 광고비/신규 유저 가정 |
| LTV(12개월) | 약 19만원 | Churn 20% 가정 |
| LTV:CAC | 약 63:1 | 건전한 유닛 이코노믹스 목표 |

---

## 5. What — 결과물(제품·기능·데이터)

### 5.0 제품 개요: dysprime이란 무엇인가

본 절은 처음 보는 투자자 및 내부 이해관계자를 위해, dysprime 제품이 무엇인지·어떤 사용자 경험을 제공하는지·어떤 결과물을 내는지를 보고서 형식으로 서술한다.

#### 5.0.1 제품 정의 및 포지션

dysprime은 **AI 기반 미대(미술대학) 입시 평가·코칭 플랫폼**이다. 구체적으로 다음 세 가지를 결합한 B2C SaaS이다.

1. **Vision AI 작품 평가**: 사용자가 업로드한 기초디자인·기초소양 실기 작품 이미지를 멀티모달 AI(Gemini 3 Pro Vision)로 분석하여, 입시 도메인에 정의된 5개 지표(밀도, 형태력, 완성도, 정합성, 사고력)에 대한 점수와 종합 A~F 등급을 산출한다. 처리 시간 목표 8초 이내이다.
2. **입시 빅데이터 연동**: 사용자의 수능·모의고사 등급(국어·영어·예체능)과 작품 점수를 Theory Engine v3.0 및 BigQuery 기반 입시 DB와 결합하여, 대학·학과별 합격 확률을 계산하고 TOP/HIGH/MID/LOW 라인으로 분류하여 제시한다.
3. **학원 MOU 데이터 연계**: 파라오(기초디자인), 네오캣(기초소양) 등 대형 학원과의 MOU를 통해 확보한 평가 기준·합격자 데이터를 프롬프트 및 확률 모델에 반영하여, 범용 AI가 갖는 입시 도메인 미스매치를 보완하고 정확도를 높인다.

제품 포지션은 **학원을 대체하는 것이 아니라 보완하는 AI 코칭 툴**이다. 서울 대형학원 수준의 객관적 실기 진단과 합격 확률 정보를 전국 어디서나 24시간 이용 가능하게 하며, 가격은 월 2~5만원 구간(학원 월 100만원 이상 대비 약 97% 저렴)으로 설정하여 사교육 정보 비대칭 해소에 기여한다는 메시지를 전달한다.

#### 5.0.2 사용자 경험 한 바퀴 (Core Loop)

| 단계 | 사용자 행동 | 시스템 동작 | 결과물(사용자에게 보이는 것) |
|------|-------------|-------------|-----------------------------|
| 1 | 앱 가입·로그인(이메일, 닉네임, 학년, 도메인 선택) | 계정 생성, Free 플랜·월 2회 크레딧 부여 | 대시보드(Home) 진입, 크레딧 표시 |
| 2 | (선택) 프로필에 국어·영어·예체능 등급 입력 | users 테이블에 등급 저장 | Layer 2 합격 확률 활용 가능 |
| 3 | 작품 이미지(JPG/PNG, 10MB 이하) 업로드, 필요 시 문제 텍스트·제한시간 입력 | 크레딧 차감, Cloud Storage 저장, 분석 레코드 생성, F3 트리거 | 업로드 완료, 분석 로딩 화면(약 8초) |
| 4 | 대기 | Layer 1: Vision AI → 5지표·등급·fixScope 계산. 성적 있으면 Layer 2: Theory Engine → 합격 확률·라인 산출 | — |
| 5 | 결과 화면 진입 | 분석 결과 조회(F6) | 등급 배지(A~F), 종합 점수, 5개 지표 레이더 차트, fixScope 배너(구조 재설계 필요/디테일 개선 권장), (성적 입력 시) 대학별 합격 확률 TOP/HIGH/MID/LOW |
| 6 | (Basic 이상) "AI 멘토에게 질문하기" 선택 | 챗봇 세션 생성, Layer 3 fixScope 기반 프롬프트로 응답 | 채팅 화면, 텍스트·액션 카드·퀵 리플라이 형태의 개인화 피드백 |

위 루프가 제품의 핵심 가치 전달 경로이다. 사용자는 **작품 업로드 한 번**으로 **객관적 등급·합격 라인·우선순위가 반영된 AI 코칭**까지 이어지는 경험을 얻는다.

#### 5.0.3 제공 형태·플랫폼

| 항목 | 내용 |
|------|------|
| 제공 형태 | 모바일 앱(iOS/Android, React Native) 우선; 웹 대시보드(Next.js) 보조. |
| 인증 | 이메일 회원가입·로그인, JWT 기반 세션. (Phase 2 이후 소셜 로그인 검토) |
| 결제 | B2C: Free(0원)·Basic(19,900원/월)·Premium(49,900원/월). Family(79,900원/월)는 Phase 3. 카드·카카오페이·네이버페이. B2B: 학원 MOU·레브쉐어 20%. |
| 데이터 저장 | Firestore(사용자·분석·챗봇·결제), BigQuery(입시 DB·분석 집계). |

#### 5.0.4 예상 기대효과

제품 도입 시 기대되는 효과를 주체별·지표별로 정리한다. 수치는 목표 또는 가정이며, 실제 효과는 런칭 후 검증이 필요하다.

| 주체 | 구분 | 예상 기대효과 |
|------|------|----------------|
| 수험생 | 실력 파악 | 주관이 아닌 AI 기반 A~F 등급으로 "내 수준"을 객관적으로 인지; 5개 지표별 점수로 강약 분석 가능. |
| 수험생 | 지원 전략 | 수능 등급+실기 점수 결합 합격 확률·라인(TOP/HIGH/MID/LOW)으로 지원 가능 대학·학과 범위 파악, 전략적 지원 설계. |
| 수험생 | 개선 효율 | fixScope(구조 재설계 vs 디테일 개선)로 우선순위가 명확한 피드백; AI 멘토로 24시간 질의·액션 플랜 수령. |
| 수험생 | 비용·접근성 | 학원 월 100만원 이상 대비 월 2~5만원 수준; 지역 무관 동일 품질, 24/7 이용. |
| 학원 | 보조 도구 | 재수·지방생 등 학원 미이용·저접근 수험생에 대한 관리 보조; MOU 시 데이터 제공 대가로 브랜드·커리큘럼 연계. |
| 사회·정책 | 정보 비대칭 | 서울 vs 지방, 고비용 vs 저비용 격차 완화; 실기 30~50%가 차지하는 "암흑 구간"을 정량화. |
| 사회·정책 | 정책 정합 | 교육부 사교육 경감대책, 예체능 사교육 국가 책임 흡수 방향과 부합; 예창패 등 창업지원 IR 메시지와 정합. |
| 사업 | 시장 포지션 | 미대 실기 AI 평가 블루오션 선점, First Mover Advantage; 실기+수능 통합 분석 유일 플레이어. |
| 사업 | 유닛 이코노믹스 | Basic 플랜 기준 LTV:CAC 63:1 수준 목표; Gross Margin 65→75% 단계적 개선. |
| 사업 | 재무 | Year 1 ARR 7.2억원, Year 3 ARR 180억원 목표; MAU 3,000→50,000명 성장 경로. |

위 효과는 BRD·시장 전략 보고서의 가정과 목표를 PRD 관점에서 재정리한 것이다. 세부 수치·전제는 해당 문서 및 부록 9.4를 참조한다.

---

### 5.1 MVP 기능 I-P-O 요약

출처: FSD §4.4

| 기능 ID | 기능명 | 핵심 입력 | 핵심 출력 |
|---------|--------|-----------|-----------|
| F1-1 | 이메일 회원가입 | email, password, nickname, grade, domain | 201, userId·token, /dashboard |
| F1-2 | 로그인 | email, password | 200, token·user, /dashboard |
| F1.5 | 성적/프로필 입력 | koreanGrade, englishGrade, artGrade (1~9) | 200, 성적 저장, 프로필 갱신 |
| F2 | 작품 업로드 | imageFile(JPG/PNG ≤10MB), problemText, timeLimit | 202, analysisId·status, 로딩→결과 |
| F3 | Vision AI 평가 (Layer 1) | analysisId, imageUrl, domain | grade·scores·fixScope, 결과 카드 |
| F4 | 입시 DB 매칭 (Layer 2) | analysisId, totalScore, 성적 3개 | universityPredictions, 합격 대학 섹션 |
| F5 | AI 멘토 챗봇 | analysisId, userMessage | sessionId·message, 채팅 응답 |
| F6 | 평가 결과 조회 | analysisId | 분석 결과 전체, 결과 페이지 |
| F7-1 | 플랜 업그레이드 | targetPlan, paymentMethod | 구독 정보, 업그레이드 완료 |
| F7-2 | 내 구독 조회 | JWT | subscriptionPlan·remainingCredits·nextBillingDate |

### 5.2 Out-of-Scope 및 예정 Phase

출처: FSD §5

| 기능 ID | 기능명 | 제외 이유 | 예정 Phase |
|---------|--------|-----------|------------|
| F8 | 성장 추적 그래프 | 최소 2개 작품 필요 | Phase 3 |
| F9 | 작품 비교 (A vs B) | F8과 동일 | Phase 3 |
| F10 | 유사 합격작 검색 | 학원 MOU 데이터 미확보, DIS 실패 경험 | Phase 4+ |
| F11 | Family 플랜 | B2C 검증 후 추가 | Phase 3 |
| F12 | 학원 대시보드 | B2B 파일럿 필요 | Phase 4 |
| F13 | PDF 리포트 다운로드 | Premium 전용, 우선순위 낮음 | Phase 3 |
| F14 | 소셜 로그인 (Google, Kakao) | 이메일 검증 후 | Phase 2 |
| F15 | 작품 공유 (SNS) | 커뮤니티 기능 | Phase 5+ |
| F16 | 정부지원 연계 안내 | 예창패/서울런 정보 제공 | Phase 3 |

### 5.3 화면·플로우와 기능 매핑

출처: IA §1

| 화면/플로우 | 대응 기능 ID | 비고 |
|-------------|--------------|------|
| Splash, Onboarding | - | 진입 후 회원가입/로그인 선택 |
| 회원가입 | F1-1 | 이메일, 비밀번호, 닉네임, 학년, 도메인 |
| 로그인 | F1-2 | 이메일, 비밀번호 |
| Home Tab | F2, F6 | Hero Upload CTA, Recent Analysis Feed → Result Detail |
| History Tab | F6 | Analysis Card List → Result Detail |
| AI Mentor Tab | F5 | Chat Session List → Chat Room, Plan Gate(Free) |
| Profile Tab | F1.5, F7 | 성적 입력, 구독 카드, 설정 |
| Upload Flow | F2, F3 | 이미지 선택 → 크레딧 확인 → 분석 로딩 → Result Detail |
| Result Detail | F6, F4, F5 | 등급·레이더·fixScope·합격 확률(성적 있으면)·AI 멘토 CTA |
| Grade Input (Bottom Sheet) | F1.5 | 국어/영어/예체능 등급 → F4에서 활용 |
| Subscription Upgrade (Bottom Sheet) | F7-1 | 플랜 비교, 결제 |
| Chat Room | F5 | 분석 컨텍스트 카드, 메시지 목록, Input Bar |

### 5.4 핵심 엔티티 요약

출처: ERD §2. 상세 스키마는 부록 9.1 참조.

| 테이블명 | 설명 | 핵심 필드 |
|----------|------|-----------|
| users | 사용자 계정, 프로필, 성적, 구독 | user_id, email, nickname, grade, domain, subscription_plan, remaining_credits |
| analyses | 작품 분석 결과 (Layer 1+2) | analysis_id, user_id, image_url, status, scores, total_score, grade, fix_scope, university_predictions |
| chat_sessions | AI 멘토 챗봇 세션 | session_id, analysis_id, user_id |
| chat_messages | 챗봇 대화 메시지 | message_id, session_id, role, content |
| payments | 결제 이력 | payment_id, user_id, amount, plan, payment_method, status |

### 5.5 평가 항목(기초디자인)

출처: BRD Appendix A

| 항목 | 설명 | 가중치 |
|------|------|--------|
| 밀도 (Density) | 오브젝트 수, 배치 균형, 공간 효율 | 20% |
| 형태력 (Shape Power) | 투시, 비례, 구조 안정성, 예각 활용 | 25% |
| 완성도 (Completion) | 마감, 디테일, 묘사력, 양감 | 20% |
| 정합성 (Coherence) | 문제 이해, 주제 해석, 조건 충족 | 20% |
| 사고력 (Thinking) | 발상, 창의성, 시각적 스토리텔링 | 15% |

### 5.6 등급 매핑·fixScope·라인

출처: BRD Appendix C, C-2, B

| 종합 점수 | 등급 | 설명 |
|-----------|------|------|
| 90~100 | A | 최상위, TOP 라인 가능 |
| 80~89 | B | 상위, HIGH 라인 적정 |
| 70~79 | C | 중상위, HIGH-MID 경계 |
| 60~69 | D | 중위, MID 라인 |
| 50~59 | E | 중하위, MID-LOW 경계 |
| 0~49 | F | 하위, 기초 보완 필요 |

| 구조 점수 (밀도×0.3 + 형태력×0.4 + 정합성×0.3) | fixScope | UI 표기 |
|------------------------------------------------|----------|---------|
| &lt; 70 | StructureRebuild | 구조 재설계 필요 |
| ≥ 70 | DetailTuning | 디테일 개선 권장 |

| 합격 확률 | 라인 |
|-----------|------|
| ≥ 70% | TOP |
| 50% ≤ 확률 &lt; 70% | HIGH |
| 30% ≤ 확률 &lt; 50% | MID |
| &lt; 30% | LOW |

### 5.7 경쟁 대비 제품 비교 요약

투자자·내부자가 「기존 대안과 dysprime의 차이」를 한눈에 보기 위해 비교 요약을 제시한다. 출처: BRD §7, 시장 전략 보고서 §2.2.

| 구분 | 학원(오프라인) | 기존 AI 입시(스나이퍼·유니고·진학사 등) | dysprime |
|------|----------------|----------------------------------------|----------|
| 실기 평가 | 있음(강사 주관) | 없음(수능·교과 전용) | 있음(AI 객관 A~F) |
| 24시간 이용 | 불가 | 가능 | 가능 |
| 비용 | 서울 강남 월 130~180만원, 지방 50~90만원 | 무료~10만원/회 | 월 2~5만원 구독 |
| 실기+수능 통합 | 감에 의존 | 수능만 지원 | 실기+수능 통합 분석 |
| 교차 검증 | 어려움 | 해당 없음 | 동일 작품·동일 기준 재현 가능 |
| 타겟 | 전 연령·지역 제한 | 수능·수시·정시 교과 중심 | 기초디자인·기초소양 입시 집중 |

dysprime은 「실기 평가」와 「입시 데이터(합격 확률)」를 모두 제공하는 유일한 플레이어로 포지셔닝된다.

---

## 6. When — 일정과 Phase

### 6.1 Phase 구분

출처: BRD §11.1

| Phase | 기간 | 목표 | 핵심 산출물 |
|-------|------|------|-------------|
| Phase 1: MVP | 2026 Q1 | Layer 1 + 부분 Layer 3 | A~F 평가 + 간단 피드백 |
| Phase 2: 입시 DB 연동 | 2026 Q2 | Layer 2 완성 | 합격 확률 + 대학 추천 |
| Phase 3: 성장 추적 | 2026 Q3 | 히스토리 + 성장 곡선 | 락인 기능 완성 |
| Phase 4: B2B 확장 | 2026 Q4 | 학원 대시보드 | MOU 학원 파일럿 |
| Phase 5: 정시특강 모드 | 2027 Q1 | D-30 집중 모드 | 정시 시즌 매출 극대화 |

### 6.2 재무 전망

출처: BRD §11.2

| 지표 | Year 1 | Year 2 | Year 3 |
|------|--------|--------|--------|
| MAU | 3,000명 | 15,000명 | 50,000명 |
| ARPU (월) | 2.0만원 | 2.5만원 | 3.0만원 |
| ARR | 7.2억원 | 45억원 | 180억원 |
| Gross Margin | 65% | 70% | 75% |

### 6.3 Phase별 마일스톤·성공 지표

출처: BRD §11, 시장 전략 보고서 실행 우선순위. 각 Phase 완료 시 점검하는 대표 성공 지표를 정리한다.

| Phase | 기간 | 핵심 마일스톤 | 성공 지표(예시) |
|-------|------|---------------|-----------------|
| Phase 1: MVP | 2026 Q1 | Layer 1 Vision AI·간단 Layer 3 출시, Free/Basic 오픈 | A~F 등급 정확도 80% 이상, 첫 분석 완료율 70%, MAU 1,000명 |
| Phase 2: 입시 DB 연동 | 2026 Q2 | Layer 2 완성, 합격 확률·라인 UI 정식 제공 | 유료 전환율 15%, M2 리텐션 40%, MAU 3,000명 |
| Phase 3: 성장 추적 | 2026 Q3 | 히스토리·성장 곡선, Family 플랜 검토 | MRR 6,000만원, 성장 추적 기능 사용률 30% |
| Phase 4: B2B 확장 | 2026 Q4 | 학원 대시보드, MOU 학원 파일럿 | MOU 학원 2곳 이상, B2B 매출 비중 10% |
| Phase 5: 정시특강 | 2027 Q1 | D-30 집중 모드, 정시 시즌 캠페인 | 정시 시즌 MRR 3,000만원, CAC 5,000원 이하 유지 |

---

## 7. 문서 이력·참조

### 7.1 문서 변경 이력

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-07 | BRD·FSD·IA·ERD 기반 PRD 초안. 골든 서클(Why/Who/How/What/When), 부록 A/B/C 반영 |
| 1.1 | 2026-02-07 | 최종 디벨롭: §0 실행 요약(IR·피칭), §2.5 시장·기획(TAM-SAM-SOM·PEST·경쟁·STP·출처 주석), §5.0 제품 개요·예상 기대효과, §5.7 경쟁 대비 비교, §6.3 Phase별 마일스톤, 부록 D 출처·참고자료. 보고서·공식문서 문체 정리. |

### 7.2 참조 문서

| 문서명 | 버전 | 비고 |
|--------|------|------|
| dysprime BRD | v4.0 | 비즈니스 요구사항, 시장·로드맵 |
| dysprime FSD | v1.3 | 기능 명세, I-P-O-E |
| dysprime IA (Sitemap) | v1.4 | 화면 구조, UX 원칙 |
| dysprime ERD | v1.1 | 데이터 스키마, 제약·인덱스 |
| dysprime 시장 전략 보고서 | — | 환경·시장 규모·PEST·경쟁·STP·GTM·KPI·출처 |

---

## 8. 리스크 및 대응(요약)

본 절은 제품·사업 실행 과정에서 예상되는 주요 리스크와 대응 방향을 요약한다. 상세는 BRD 및 시장 전략 보고서를 참조한다.

| 리스크 | 설명 | 대응 방안 |
|--------|------|-----------|
| Vision AI 정확도 한계 | 입시 도메인에서 등급·지표가 실제 채점과 불일치할 수 있음 | 학원 MOU 데이터로 프롬프트·기준 지속 튜닝; 사용자 피드백 수렴; A/B 테스트로 임계치 조정 |
| 학원 반발 | 학원 매출을 빼앗는 인식 | "보조툴" 포지셔닝 명확화; MOU·레브쉐어로 인센티브 정렬; 학원 내 추천 시 수익 공유 |
| 경쟁사 진입 | 대형 업체의 미대 실기 AI 진입 | 학원 MOU 데이터 독점·선점; 브랜드·커뮤니티 선점; First Mover로 사용자 데이터 축적 |
| 타겟 시장 규모 검증 | 기초디자인·기초소양 수험생 수·유료 전환율 불확실 | MVP 단계에서 빠른 실증(MAU·전환율·리텐션); 필요 시 세그먼트·가격 피벗 |
| 데이터·개인정보 | 작품 이미지·성적 등 민감 데이터 저장·이용 | 개인정보처리방침·이용약관 명시; 저장 최소화·암호화; 학원 MOU 데이터 이용 범위 계약 명문화 |

---

## 9. 부록

부록은 본문에서 간략히 다룬 내용을 **처음 보는 독자도 이해할 수 있도록** 상세히 서술한 부분이다. 본문의 용어·스키마·각주가 궁금할 시 다음을 참조하면 된다.

---

### 9.1 부록 A: ERD 스키마 및 엔터티 전체

본문 §5.4에서는 핵심 엔터티 요약만 제시하였다. 여기서는 **실제 DB 설계에 필요한 스키마·필드·제약·접근 패턴**을 표로 정리한다. 출처: dysprime_ERD_v1.md §2~§5.

#### 9.1.1 테이블: users

사용자 계정, 프로필(학년·도메인), 수능/모의고사 등급, 구독 플랜·크레딧을 저장합니다. 로그인·결제·작품 소유자 식별에 사용됩니다.

| Field Name | Type | Nullable | Default | Constraint | 설명(비즈니스 의미) |
|------------|------|----------|---------|------------|---------------------|
| user_id | STRING | N | Auto | PK | 사용자 고유 ID (예: usr_abc123) |
| email | STRING | N | - | UNIQUE | 로그인 이메일 |
| password_hash | STRING | N | - | - | bcrypt 해시 비밀번호 |
| nickname | STRING | N | - | UNIQUE, 2~10자 | 표시용 닉네임 |
| grade | ENUM | N | - | - | 학년: 고1, 고2, 고3, 재수, N수 |
| domain | ENUM | N | - | - | 입시 도메인: 기초디자인, 기초소양 |
| korean_grade | INTEGER | Y | NULL | 1~9 | 국어 수능/모의 등급. 미입력 시 Layer 2 스킵 |
| english_grade | INTEGER | Y | NULL | 1~9 | 영어 수능/모의 등급 |
| art_grade | INTEGER | Y | NULL | 1~9 | 예체능 수능/모의 등급 |
| subscription_plan | ENUM | N | Free | - | 구독: Free, Basic, Premium |
| remaining_credits | INTEGER | N | 2 | ≥0 | **매월 사용 가능한 작품 평가 횟수**. 동시 요청 시 트랜잭션 필수 |
| subscription_started_at | TIMESTAMP | Y | NULL | - | 유료 구독 시작 시각 |
| next_billing_date | TIMESTAMP | Y | NULL | - | 다음 결제 예정일 |
| last_credit_reset_at | TIMESTAMP | Y | NULL | - | 마지막 크레딧 리셋 시각(월간/갱신일 리셋 추적) |
| created_at | TIMESTAMP | N | Auto | - | 계정 생성 시각 |
| updated_at | TIMESTAMP | N | Auto | - | 최종 수정 시각 |

**인덱스**: PK user_id. UNIQUE email, nickname. Composite (subscription_plan ASC, created_at DESC) — 구독별 가입자 조회.

#### 9.1.2 테이블: analyses

한 건의 "작품 업로드 → Vision AI 평가 → 입시 DB 매칭" 결과를 담습니다. 사용자별 작품 목록·결과 상세·챗봇 컨텍스트에서 참조됩니다.

| Field Name | Type | Nullable | Default | Constraint | 설명(비즈니스 의미) |
|------------|------|----------|---------|------------|---------------------|
| analysis_id | STRING | N | Auto | PK | 분석 고유 ID (예: anl_xyz789) |
| user_id | STRING | N | - | FK→users.user_id | 작품 소유자 |
| image_url | STRING | N | - | - | Cloud Storage Signed URL(작품 이미지) |
| problem_text | STRING | Y | NULL | Max 500자 | 사용자 입력 문제 텍스트 |
| problem_image_url | STRING | Y | NULL | - | 문제 지문 이미지 URL |
| time_limit | ENUM | Y | NULL | - | 제한없음, 3시간, 4시간 |
| status | ENUM | N | pending | - | pending → layer1_complete → layer2_complete |
| scores | JSON | Y | NULL | - | **Layer 1 결과**: 5개 지표 0~100 (구조 §9.1.4) |
| total_score | FLOAT | Y | NULL | 0~100 | 가중 평균 종합 점수, 등급 매핑에 사용 |
| grade | ENUM | Y | NULL | - | A~F 등급 |
| fix_scope | ENUM | Y | NULL | - | StructureRebuild 또는 DetailTuning, AI 멘토 포커스 결정 |
| embedding | ARRAY(FLOAT) | Y | NULL | 1408-dim | Phase 4+ 유사 작품 검색용 |
| university_predictions | JSON | Y | NULL | - | **Layer 2 결과**: 대학별 합격 확률 배열 (구조 §9.1.5) |
| layer1_completed_at | TIMESTAMP | Y | NULL | - | Layer 1 완료 시각 |
| layer2_completed_at | TIMESTAMP | Y | NULL | - | Layer 2 완료 시각 |
| created_at | TIMESTAMP | N | Auto | - | 업로드(생성) 시각 |

**인덱스**: PK analysis_id. FK user_id. Composite (user_id ASC, created_at DESC), (user_id ASC, status ASC, created_at DESC).

#### 9.1.3 엔터티 관계·카디널리티

| 관계 | 카디널리티 | 설명 |
|------|------------|------|
| USERS → ANALYSES | 1:N | 한 사용자가 여러 작품 업로드 가능 |
| USERS → CHAT_SESSIONS | 1:N | 한 사용자가 여러 챗봇 세션 생성 가능 |
| USERS → PAYMENTS | 1:N | 한 사용자가 여러 결제 이력 보유 |
| ANALYSES → CHAT_SESSIONS | 1:N | 한 분석당 여러 챗봇 세션(재질문) 가능 |
| CHAT_SESSIONS → CHAT_MESSAGES | 1:N | 한 세션당 여러 메시지(대화 히스토리) |

#### 9.1.4 JSON 필드: analyses.scores

Layer 1 Vision AI가 산출하는 5개 지표입니다. 0~100 정수, 가중치 적용해 total_score와 등급·fixScope 계산에 사용됩니다.

| 키 | 타입 | 범위 | 설명 |
|----|------|------|------|
| density | number | 0~100 | 밀도 |
| shapePower | number | 0~100 | 형태력 |
| completion | number | 0~100 | 완성도 |
| coherence | number | 0~100 | 정합성 |
| thinking | number | 0~100 | 사고력 |

#### 9.1.5 JSON 필드: analyses.university_predictions

Layer 2 Theory Engine이 산출하는 대학별 합격 확률 배열입니다. 성적 미입력 또는 Layer 2 미실행 시 NULL입니다.

| 키 | 타입 | 설명 |
|----|------|------|
| universityName | string | 대학명 |
| department | string | 학과명 |
| line | string | TOP, HIGH, MID, LOW |
| probability | integer | 0~100 합격 확률 |
| similarStudentsCount | integer | (선택) 유사 합격자 수 |

#### 9.1.6 테이블: chat_sessions

한 건의 분석(analyses)에 대해 사용자가 AI 멘토와 나누는 대화 세션입니다. 같은 작품이라도 재질문 시 새 세션을 만들 수 있습니다.

| Field Name | Type | Nullable | Default | Constraint | 설명(비즈니스 의미) |
|------------|------|----------|---------|------------|---------------------|
| session_id | STRING | N | Auto | PK | 세션 고유 ID (예: chat_abc123) |
| analysis_id | STRING | N | - | FK→analyses.analysis_id | 대화가 참조하는 작품 분석 |
| user_id | STRING | N | - | FK→users.user_id | 세션 소유자 |
| created_at | TIMESTAMP | N | Auto | - | 세션 생성 시각 |
| updated_at | TIMESTAMP | N | Auto | - | 최종 메시지 시각 |

**인덱스**: PK session_id. FK analysis_id, user_id. Composite (analysis_id ASC, created_at DESC).

#### 9.1.7 테이블: chat_messages

챗봇 세션 안의 개별 메시지입니다. role이 user(사용자) 또는 assistant(AI)이며, 시간순으로 조회해 대화 히스토리를 만듭니다.

| Field Name | Type | Nullable | Default | Constraint | 설명(비즈니스 의미) |
|------------|------|----------|---------|------------|---------------------|
| message_id | STRING | N | Auto | PK | 메시지 고유 ID |
| session_id | STRING | N | - | FK→chat_sessions.session_id | 소속 세션 |
| role | ENUM | N | - | - | user 또는 assistant |
| content | TEXT | N | - | Max 2000자 | 메시지 내용 |
| created_at | TIMESTAMP | N | Auto | - | 메시지 생성 시각 |

**인덱스**: PK message_id. FK session_id. Composite (session_id ASC, created_at ASC). Firestore 구현 시 chat_sessions 하위 컬렉션으로 두면 세션별 그룹화·쿼리 효율 확보.

#### 9.1.8 테이블: payments

유료 플랜(Basic, Premium) 결제 이력입니다. Free 사용자는 레코드가 없을 수 있습니다.

| Field Name | Type | Nullable | Default | Constraint | 설명(비즈니스 의미) |
|------------|------|----------|---------|------------|---------------------|
| payment_id | STRING | N | Auto | PK | 결제 고유 ID |
| user_id | STRING | N | - | FK→users.user_id | 결제한 사용자 |
| amount | INTEGER | N | - | >0, 원 단위 | 결제 금액 |
| plan | ENUM | N | - | - | Basic 또는 Premium |
| payment_method | ENUM | N | - | - | card, kakaopay, naverpay |
| status | ENUM | N | success | - | success, failed, refund |
| paid_at | TIMESTAMP | N | Auto | - | 결제 완료 시각 |

**인덱스**: PK payment_id. FK user_id. Composite (user_id ASC, paid_at DESC).

#### 9.1.9 Enum 일람

출처: ERD §3

| Enum Type | 값 | 설명 |
|------------|-----|------|
| GradeEnum | 고1, 고2, 고3, 재수, N수 | 학년 |
| DomainEnum | 기초디자인, 기초소양 | 입시 도메인 |
| PlanType | Free, Basic, Premium | 구독 플랜 |
| AnalysisStatus | pending, layer1_complete, layer2_complete | 분석 진행 상태 |
| TimeLimitEnum | 제한없음, 3시간, 4시간 | 작품 제작 시간 |
| GradeType | A, B, C, D, E, F | 작품 등급 |
| FixScopeType | StructureRebuild, DetailTuning | 우선순위 유형 |
| UniversityLineType | TOP, HIGH, MID, LOW | 대학 라인 |
| MessageRole | user, assistant | 메시지 발신자 |
| PaymentPlanType | Basic, Premium | 결제 플랜(Free 제외) |
| PaymentMethod | card, kakaopay, naverpay | 결제 수단 |
| PaymentStatus | success, failed, refund | 결제 상태 |

#### 9.1.10 논리적 제약 및 접근 패턴

**제약 (애플리케이션/Cloud Functions에서 보장)**

| Rule | 제약 내용 | 보장 방법 |
|------|-----------|-----------|
| Rule 1 | users.remaining_credits ≥ 0 | 크레딧 차감 시 트랜잭션(Atomic Decrement 또는 Optimistic Locking) 사용 |
| Rule 2 | Free 사용자는 payments 레코드 없을 수 있음 | F7 결제 플로우에서만 payments INSERT |
| Rule 3 | analyses 상태–데이터 정합성: pending이면 scores·university_predictions NULL; layer1_complete이면 scores NOT NULL, university_predictions NULL; layer2_complete이면 둘 다 NOT NULL | F3/F4 상태 전이 시 위 조건만 허용, F4 진입 시 성적·status 검사 |

**접근 패턴 (Firestore 복합 인덱스)**

| Use Case | Query 요약 | 인덱스 |
|----------|------------|--------|
| 내 작품 목록 최신순 | user_id = ? ORDER BY created_at DESC | user_id ASC, created_at DESC |
| 완료된 분석만 조회 | user_id = ? AND status = layer2_complete ORDER BY created_at DESC | user_id ASC, status ASC, created_at DESC |
| 분석별 챗봇 세션 | analysis_id = ? ORDER BY created_at DESC | analysis_id ASC, created_at DESC |
| 세션 내 대화 시간순 | session_id = ? ORDER BY created_at ASC | session_id ASC, created_at ASC |
| 사용자 결제 이력 | user_id = ? ORDER BY paid_at DESC | user_id ASC, paid_at DESC |

---

### 9.2 부록 B: 용어집

FSD/ERD/IA/BRD에서 사용된 전문 용어를 정의합니다. 문서를 처음 읽는 참여자나 비개발 이해관계자가 참조할 수 있습니다.

| 용어(한글/영문) | 정의 | 문맥·사용처 | 참조 |
|----------------|------|-------------|------|
| Actor | 시스템과 상호작용하는 역할(사람 또는 시스템). Guest, Free User, Basic, Premium, Admin, AI Agent 등 | 권한 매트릭스, 접근 제어 | FSD §2.1 |
| 크레딧(credits) | 매월 사용 가능한 작품 평가 횟수. Free 2회, Basic 10회, Premium 무제한. 업로드 시 1회 차감 | remaining_credits 필드, 구독 플랜 | ERD users, FSD §2.3 |
| 도메인(domain) | 입시 유형: 기초디자인(기디), 기초소양(기소). 가입 시 선택, Vision 프롬프트·입시 DB 필터에 사용 | users.domain, 분석 도메인별 처리 | ERD, FSD F3 |
| DetailTuning | fixScope 유형 중 하나. 구조 점수 ≥70일 때 적용. "디테일 개선 권장" UI 표기, AI 멘토가 마감·밀도·톤 개선에 집중 | analyses.fix_scope, Layer 3 프롬프트 | BRD Appendix B, IA §5.4 |
| fixScope | Layer 1 결과로 계산되는 우선순위 유형. StructureRebuild(구조 재설계) 또는 DetailTuning(디테일 개선). AI 멘토 응답 포커스 결정 | analyses.fix_scope, Result Detail 배너 | FSD F3, IA §5.4 |
| I-P-O-E | Input(입력), Process(처리), Output(출력), Exception(예외). 기능 명세에서 각 기능의 입출력·처리 단계·에러를 정리한 구조 | FSD 각 기능 절 | FSD §3, §4.4 |
| Layer 1 | Vision AI 단계. 작품 이미지 → 5개 지표 → A~F 등급·fixScope. UI에는 "AI 평가 완료" 등으로 노출 가능 | F3, analyses.scores·grade·fix_scope | BRD §3, FSD F3 |
| Layer 2 | Theory Engine 단계. 성적+작품 점수 → 대학별 합격 확률·TOP/HIGH/MID/LOW. UI에는 "합격 확률 계산 완료" 등 | F4, analyses.university_predictions | BRD §3, FSD F4 |
| Layer 3 | AI Insights 단계. fixScope 기반 AI 멘토 챗봇. UI에는 "AI 멘토", "1:1 코칭" | F5, Chat Room | BRD §3, IA §5.4 |
| 등급 매핑 | total_score(0~100)를 A~F 등급으로 변환하는 규칙. 90~100=A, 80~89=B, … 0~49=F | analyses.grade, Result Detail 배지 | BRD Appendix C, §5.6 |
| Theory Engine | 입시 DB(NeoPrime/BigQuery)와 작품·성적 데이터를 이용해 대학별 합격 확률을 계산하는 엔진. v3.0 | Layer 2, F4 | BRD §5.1, FSD F4 |
| TOP/HIGH/MID/LOW | 대학 합격 라인 분류. 확률 ≥70% TOP, 50~69% HIGH, 30~49% MID, &lt;30% LOW | university_predictions.line, Result Detail 섹션 | BRD Appendix C-2, §5.6 |
| StructureRebuild | fixScope 유형 중 하나. 구조 점수 &lt;70일 때 적용. "구조 재설계 필요" UI 표기, AI 멘토가 구도·주제 해석에 집중 | analyses.fix_scope, Layer 3 | BRD Appendix B, IA §5.4 |
| status(분석) | analyses 테이블의 진행 상태: pending(업로드 직후), layer1_complete(Layer 1 완료), layer2_complete(Layer 2 완료) | F3/F4 상태 전이, 조회 필터 | ERD §2.2, §4 Rule 3 |

---

### 9.3 부록 C: 본문 주석·각주 정리

본문에서 "출처: BRD §n", "FSD §n 참조" 등으로 인용한 내용과, 본문에 각주로 뺐을 수 있는 예외·정책을 여기 한곳에 모았습니다. **본문 위치**, **요약 내용**, **결정 배경**을 함께 적어 처음 보는 이도 맥락을 이해할 수 있도록 했습니다.

| 본문 위치 | 인용 문서·절 | 요약 내용 | 비고(결정 배경 등) |
|-----------|--------------|-----------|-------------------|
| §2.1 | BRD §2.1 | 미대 입시 3대 페인포인트: 실력 진단 불가, 대학 라인 추정 불가, 개선 방향 모호 | 문제 정의의 근거 |
| §2.2 | BRD §2.2 | 사교육 정보 비대칭 4가지: 지역·비용·실기 암흑·평가 주관성 | dysprime 해결 포지셔닝 |
| §2.4 | BRD §1.4, §3.1 | 3-Layer 아키텍처: Vision AI → Theory Engine → AI Insights | 솔루션 핵심 구조 |
| §3.1 | BRD §4.2 | 타겟 세그먼트 4종, ARPU | GTM·수익화 대상 |
| §3.2, §3.3 | FSD §2.1, §2.2 | Actor 6종, 플랜별 권한 매트릭스 | 접근 제어·플랜 설계 근거 |
| §4.2, §4.3 | FSD §1.2, §1.3 | MVP In-Scope 8개 기능, 선행 조건·의존성 | 범위·일정 협의 근거 |
| §4.4 | IA §5 | Zero Context Switching, Thumb-First, Zero Dead-End, Academic Tech | UX 원칙 출처 |
| §4.5 | FSD §1.5, IA §5.6 | API/네트워크 오류 3회 재시도, Retry 버튼 | 에러 처리 정책 |
| §5.1 | FSD §4.4 | 기능별 I-P-O 요약표 | 상세는 FSD §3 각 절 참조 |
| §5.2 | FSD §5 | F8~F16 Out-of-Scope, 예정 Phase | 유사 합격작은 학원 MOU·DIS 경험으로 Phase 4+; Family는 B2C 검증 후 Phase 3 |
| §5.4 | ERD §2 | users, analyses, chat_sessions, chat_messages, payments 요약 | 전체 스키마는 부록 9.1 |
| §5.5, §5.6 | BRD Appendix A, B, C, C-2 | 평가 5지표 가중치, 등급 매핑, fixScope 식, 라인별 확률 구간 | 기초디자인 기준; 기초소양 MVP에서는 동일 적용, Phase 2에서 차이 반영 예정 |
| §6.1, §6.2 | BRD §11 | Phase 1~5, 재무 전망(MAU·ARPU·ARR·Gross Margin) | 로드맵·재무 가정 |

**정책·예외 관련 각주 요약**

| 항목 | 설명 | 결정 배경 |
|------|------|-----------|
| 합격작 공개 데이터 미사용 | 유사 합격작 검색(F10)은 학원 MOU 내부 데이터 확보 후 검토. 공개 합격작은 신뢰 문제로 사용 금지 | 1차 사업 토론: "합격작 공개 데이터는 거짓일 수 있어 역효과 리스크" (BRD §9.3) |
| MVP 기초소양 평가 | 기초소양도 MVP에서는 기초디자인과 동일 5지표·가중치 적용. 항목 차이는 Phase 2에서 반영 예정 | FSD F3 Process 비고 |
| 크레딧 리셋 | 매월 1일 00:00 KST 또는 구독 갱신일 기준 리셋. 구현 시 정책 확정 | FSD §2.3 |
| 크레딧 환불 | F3 실패(작품 미검출·API 에러 등) 시 해당 analysisId에 대해 remaining_credits += 1 보상 트랜잭션 | FSD F2 롤백 정책, F3 Exception |

---

### 9.4 부록 D: 시장·정책 출처 및 참고자료

본 PRD §2.5(시장·기획 요약)에서 사용한 주석 [^n]의 실제 출처를 정리한다. 수치·정책·경쟁사 서술은 아래 참고자료 및 dysprime 시장 전략 보고서를 기반으로 하였으며, 정확한 인용·확인은 원문을 참조하여야 한다.

| 주석 | 구분 | 출처 요약 | 비고 |
|------|------|-----------|------|
| [^1] | 범용 AI 한계 | 1차 사업 토론 회의록 등 내부 논의 | 도메인 미스매치 |
| [^4] | 예체능 사교육비 | 한국경제 등 보도, 통계청 사교육비 조사 연계 | 초등 예체능 비용 |
| [^7] | 예체능 비중 24% | 이데일리 등, 사교육비 역대 최대 29조원 | 시장 전략 보고서 References |
| [^17] | 그리날다 | 2024 그리날다 온라인 정시 합격예측 이용안내 (YouTube) | 미대전문 정시 합격예측 |
| [^18] | 스나이퍼AI | sniperai.co.kr — 수능 성적 분석, AI 컨설턴트, 실기 미지원 | AI 입시 |
| [^19] | 유니고 | 토마토스쿨·전일학원 AI 합격 진단, 생기부·면접 코칭 | 미대 실기 미지원 |
| [^20] | 그리날다 | grinalda.co.kr — 미대정시 온라인 합격예측 | 대학별 환산점수 |
| [^21] | 서울런 | 서울시 AI 대입 지원, 1,220만건 데이터, 경기일보 등 보도 | 예체능 실기 미지원 |
| [^24] | 오르비 | 입시원 스나이퍼 정시 컨설팅 연계 | 유입 채널 |
| [^28] | 유니고 | unigo.kr AI 소개 — 수시·정시 합격진단, 면접 | 교과 중심 |
| [^32] | 진학사 | 2024학년도 수시 서비스 오픈 블로그 등 | 합격예측 |
| [^33] | 수만휘 | 나무위키 등 — 네이버 카페, 일방문 104만명 | 커뮤니티 |
| [^34] | 사교육 경감대책 | 국회도서관 NSP 국가전략정보 — 교육부 정책 | 정책 방향 |
| [^38] | 진학사 | jinhak.com — 합격예측, 입시정보 | 실기 미지원 |
| [^43] | 저출생·사교육비 | 인구전략 공동포럼, betterfuture.go.kr | 가계 부담 |
| [^49] | AI 교수학습 플랫폼 | 서울시교육청 AI 플랫폼, 호랑이 등 | AI 교육 수용 |
| [^51] | 입시미술학원 가격 | 2025 기준 입시미술학원 가격·미대 준비 비용 (티스토리 등) | 강남권 130~180만원 |
| [^60] | 학원비 200만원 | 클리앙 등 — 고3 특강 한달 200만원 안내 | 사교육비 부담 |
| [^62] | 미대 실기 지원 규모 | 2025학년도 주요 미대 수시 원서 접수·경쟁률 (네이버 블로그 등) | 덕성여대·한성대 등 |
| [^64][^66] | 파라오 미술학원 | 미대입시닷컴 합격생 인터뷰 — 파라오, 건국대·단국대 합격 | 기초디자인 |
| [^76] | 사교육비·학령인구 | 국회도서관 NSP 2024 초중고사교육비조사 결과 | 29조, 513만명 |
| [^77][^80] | 예창패 | 예술분야 초기창업 지원사업 공고, bizinfo 등 — 최대 7천만원·1.5억원 | 창업지원 |
| [^81] | AI 교육 시장 | Emergen Research 등 — 2028년 256억 달러 전망 | 글로벌 시장 |
| [^82] | 2024 사교육비 조사 | korea.kr 정책뉴스 — 통계청 복지통계과 발표 | 7.7% 증가 |

**참조 문서**

| 문서명 | 용도 |
|--------|------|
| dysprime 시장 전략 보고서 | 환경분석, TAM-SAM-SOM, PEST, 경쟁사, STP, GTM, KPI, 출처 References |
| dysprime BRD v4.0 | 비즈니스 요구사항, 시장 기회, 로드맵, Appendix 평가 항목·등급·fixScope |
| 통계청·교육부·국회도서관 NSP | 사교육비, 학령인구, 정책 공식 수치 |
| 그리날다·진학사·스나이퍼AI·유니고·서울런 등 | 경쟁사 기능·포지션 확인 |

---

*© 2026 dysprime. All rights reserved.*
