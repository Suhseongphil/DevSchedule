# Third-Party Licenses

이 프로젝트에서 사용하는 오픈 소스 소프트웨어 및 데이터의 라이선스 고지입니다.  
상업적 이용을 포함한 사용 시 각 라이선스 조건을 준수해 주세요.

---

## 한국 공휴일 데이터

| 항목 | 내용 |
|------|------|
| **패키지** | `@kyungseopk1m/holidays-kr` |
| **라이선스** | MIT License |
| **저작자** | Kyungseop Kim (https://github.com/kyungseopk1m) |
| **데이터 출처** | 한국천문연구원 특일 정보 (공공데이터포털) |
| **용도** | 캘린더에 대한민국 공휴일 표시 (날짜 빨간색 표시) |

공휴일 데이터는 공공데이터포털의 한국천문연구원_특일 정보 API를 기반으로 하며, 해당 데이터의 이용허락 범위는 제한 없음(상업적 이용 가능)입니다.

---

## 주요 의존성 라이선스 요약

| 패키지 | 버전(대략) | 라이선스 | 비고 |
|--------|------------|----------|------|
| next | 16.x | MIT | Next.js 프레임워크 |
| react | 19.x | MIT | UI 라이브러리 |
| react-dom | 19.x | MIT | React DOM 렌더러 |
| @supabase/supabase-js | 2.x | MIT | Supabase 클라이언트 |
| @supabase/ssr | 0.x | MIT | Supabase SSR 유틸 |
| date-fns | 4.x | MIT | 날짜 유틸리티 |
| react-big-calendar | 1.x | MIT | 캘린더 컴포넌트 |
| react-day-picker | 9.x | MIT | 날짜 선택기 |
| next-themes | 0.x | MIT | 테마(다크모드) |
| lucide-react | 0.x | ISC | 아이콘 |
| tailwind-merge | 3.x | MIT | Tailwind 클래스 병합 |
| class-variance-authority | 0.x | MIT | CVA |
| clsx | 2.x | MIT | className 유틸 |
| radix-ui | 1.x | MIT | UI 프리미티브 (shadcn/ui 기반) |
| tailwindcss | 4.x | MIT | CSS 프레임워크 |
| typescript | 5.x | Apache-2.0 | 타입스크립트 |
| eslint | 9.x | MIT | 린터 |
| eslint-config-next | 16.x | MIT | Next.js ESLint 설정 |

---

## 라이선스 전문 확인

각 패키지의 라이선스 전문은 설치 경로의 `LICENSE` 또는 `LICENSE.*` 파일에서 확인할 수 있습니다.

```bash
# 예: 프로젝트 루트에서
cat node_modules/@kyungseopk1m/holidays-kr/LICENSE
cat node_modules/react/README.md
```

또는 [npm](https://www.npmjs.com/) 또는 [GitHub](https://github.com/) 해당 패키지 저장소에서 확인할 수 있습니다.

---

## MIT License 공통 문구 (요약)

MIT 라이선스를 따르는 패키지는 다음 조건을 충족해야 합니다:

- 저작권 및 라이선스 고지 유지
- 소프트웨어를 제한 없이 사용·복제·수정·배포 가능 (상업적 이용 포함)

본 문서는 위 조건 중 “라이선스 고지 유지”를 위한 것입니다.
