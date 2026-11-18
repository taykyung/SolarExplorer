Solar Explorer — PWA 앱 패키지
================================

구성
  index.html      타이틀(허브) 화면 — Origin / Minigame / Memory 로 이동
  origin.html     Solar Explorer : Origin
  minigame.html   Solar Explorer : Minigame
  memory.html     Solar Explorer : Memory
  manifest.webmanifest, sw.js   PWA 설정 (설치 + 오프라인 실행)
  icons/          앱 아이콘
  music/          Memory 배경음악 (5분, memory15.mp3 + 녹화용 music-data.js)
  ※ 3D 엔진(three.js 0.160.0)은 origin.html / minigame.html 안에 들어 있습니다.

각 게임 화면 위쪽 "사용법" 버튼 옆의 집 모양 버튼을 누르면 타이틀 화면으로 돌아옵니다.

설치하려면
  PWA는 HTTPS 주소에서 열어야 "앱으로 설치"가 가능합니다.
  이 폴더를 통째로 아래 중 한 곳에 올리면 됩니다.
   - Netlify Drop (app.netlify.com/drop): 압축을 푼 폴더를 끌어다 놓기
   - GitHub Pages: 저장소에 올리고 Settings → Pages 켜기
   - Cloudflare Pages, Vercel 등

  올린 주소를 열고
   - Android/PC Chrome·Edge: 주소창의 "설치" 아이콘 또는 메뉴 → "앱 설치"
   - iPhone/iPad Safari: 공유 → "홈 화면에 추가"

  한 번 열고 나면 인터넷 없이도 실행됩니다 (글꼴은 첫 실행 때 저장).

PC에서 바로 실행하려면
  index.html 을 더블클릭해서 브라우저로 열면 됩니다. (설치·오프라인 기능은 웹에 올렸을 때만)

참고
  Memory의 클라우드 저장(Claude 계정 연동) 기능은 Claude 안에서만 동작합니다.
  앱에서는 사진·기록이 그 기기의 브라우저 저장소에 보관됩니다.
