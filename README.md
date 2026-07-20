# Hulk Page

여자친구 생일 축하용 정적 홈페이지입니다.

## 구성

- `index.html`: 메인 페이지
- `style.css`: 반응형 디자인
- `script.js`: 미니게임과 메모 저장 기능
- `assets/sora.gif`: 메인 GIF
- `assets/birthday-cake.png`: 케이크 이미지

## 실행

`index.html` 파일을 브라우저에서 열면 바로 실행됩니다. 메모와 게임 최고 점수는 브라우저의 localStorage에 저장됩니다.

## 방문 기록 설정

GitHub Pages는 정적 호스팅이므로 방문 기록을 직접 저장할 수 없습니다. 실제 배포 후 방문자 수, 방문 시간, 대략적인 위치를 관리자 창에서 보려면 Supabase를 연결합니다.

1. Supabase 프로젝트를 만듭니다.
2. Supabase SQL Editor에서 `supabase-visitor-logs.sql` 내용을 실행합니다.
3. Supabase Edge Functions 두 개를 배포합니다.

```bash
npx supabase functions deploy visitor-track
npx supabase functions deploy visitor-admin-stats
```

4. Supabase Function secret을 설정합니다.

```bash
npx supabase secrets set ADMIN_PASSWORD=940618
```

Windows PowerShell에서 `npm.ps1` 실행 정책 오류가 나면 `npx.cmd`를 사용합니다.

```powershell
npx.cmd supabase login
npx.cmd supabase functions deploy visitor-track --project-ref sdxubxgrucablahubyue
npx.cmd supabase functions deploy visitor-admin-stats --project-ref sdxubxgrucablahubyue
npx.cmd supabase secrets set ADMIN_PASSWORD=940618 --project-ref sdxubxgrucablahubyue
```

5. `script.js`의 `visitorAnalyticsConfig.functionsBaseUrl`에 Function URL을 넣습니다.
   `visitor-admin-stats`를 JWT 검증 기본값으로 배포하는 경우 `supabaseAnonKey`도 함께 넣습니다.

```js
const visitorAnalyticsConfig = {
  supabaseUrl: 'https://sdxubxgrucablahubyue.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  tableName: 'visitor_logs',
  functionsBaseUrl: 'https://sdxubxgrucablahubyue.supabase.co/functions/v1',
  trackFunctionName: 'visitor-track',
  adminStatsFunctionName: 'visitor-admin-stats'
};
```

위치는 IP 기반의 국가/지역/도시 수준 근사값입니다. 방문자에게 분석 목적의 접속 정보가 기록될 수 있음을 안내하는 문구를 사이트에 추가하는 것을 권장합니다.
