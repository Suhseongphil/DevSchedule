# DevSchedule

개발일정 캘린더와 업무일지를 관리하는 Next.js 앱입니다.

## 기능

- **개발일정**: 일정 등록·수정·삭제, 캘린더 보기, 일정별 색상 지정
- **업무목록**: 업무일지 작성 및 목록 조회·삭제

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

## 로그인

- 회원가입 기능 없음. DB에 유저를 직접 추가하여 사용
- 새 유저 추가: Supabase 대시보드 SQL Editor에서 실행

```sql
insert into public.users (username, password) values ('아이디', '비밀번호');
```

- 기본 테스트 계정: `admin` / `1234` (비밀번호는 배포 전 변경 권장)

## 필요 조건

- [Node.js](https://nodejs.org/)
- [Supabase](https://supabase.com) 프로젝트 (백엔드 DB)
- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AUTH_SECRET`(32자 이상)

## 기술 스택

- [Next.js](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com/) / shadcn/ui
- [react-big-calendar](https://github.com/jquense/react-big-calendar)

## 참고

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
