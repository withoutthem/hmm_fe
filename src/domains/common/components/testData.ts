// testData.ts
// 다양한/장문/엣지 케이스를 아우르는 마크다운 & HTML 테스트 데이터 6종
// - MD_TEST_1/2/3: Markdown
// - HTML_TEST_1/2/3: HTML
// 각 문자열은 "덩어리 텍스트"로 MDHTMLAnimator에 바로 투입할 수 있습니다.

export const WS_TEST_01 = [
  '# ',
  '안내서: ',
  '네오루멘 ',
  '도시 ',
  '여행 ✨',
  '\n',
  '> ',
  '“빛은 ',
  '도시의 ',
  '언어다.” ',
  '— ',
  '무명 ',
  '여행자',
  '\n',
  '---',
  '\n',
  '## ',
  '1. ',
  '개요',
  '\n',
  '네오루멘(Neo ',
  'Lumen)은 ',
  '**가상의 ',
  '궤도식민지** ',
  '내부에 ',
  '지어진 ',
  '도시입니다.',
  '\n',
  '언어: ',
  '한국어/English/日本語/中文/عربي ',
  '(자동 ',
  '번역 ',
  '제공)',
  '\n',
  '### ',
  '핵심 ',
  '포인트',
  '\n',
  '- ',
  '24시간 ',
  '**인공 ',
  '태양** ',
  '운용',
  '\n',
  '- ',
  '에너지: ',
  '광섬유 ',
  '기반',
  '\n',
  '- ',
  '시민 ',
  'ID: ',
  '`NL-${연도}-${일련번호}`',
  '\n',
  '### ',
  '체크리스트 ',
  '(Task ',
  'List)',
  '\n',
  '- ',
  '[x] ',
  '입장권 ',
  '구매',
  '\n',
  '- ',
  '[x] ',
  '광역 ',
  '패스 ',
  '발급',
  '\n',
  '- ',
  '[ ] ',
  '어둠 ',
  '박물관 ',
  '예약',
  '\n',
  '- ',
  '[ ] ',
  '라디언트 ',
  '광장 ',
  '콘서트 ',
  '🎵',
  '\n',
  '---',
  '\n',
  '## ',
  '2. ',
  '명소',
  '\n',
  '### ',
  '2.1 ',
  '루멘 ',
  '다리',
  '\n',
  '걸을 ',
  '때마다 ',
  '밟은 ',
  '패널이 ',
  '**파도처럼 ',
  '발광**합니다. ',
  '\n',
  '이미지 ',
  '예시: ',
  '![bridge](https://picsum.photos/seed/bridge/600/200)',
  '\n',
  '### ',
  '2.2 ',
  '빛의 ',
  '도서관',
  '\n',
  '책 ',
  '대신 ',
  '**광필사 ',
  '두루마리**를 ',
  '대여합니다. ',
  '반납은 ',
  '무접촉.',
  '\n',
  '```json',
  '\n',
  '{',
  '\n',
  '  "library": ',
  '"Lumen Archive",',
  '\n',
  '  "device": ',
  '["holo-scroll", ',
  '"memory-card"],',
  '\n',
  '  "open": ',
  '"09:00-22:00"',
  '\n',
  '}',
  '\n',
  '```',
  '\n',
  '### ',
  '2.3 ',
  '별빛 ',
  '열차',
  '\n',
  '경로: ',
  '돔 ',
  '밖 ',
  '저궤도 ',
  '— ',
  '무중력 ',
  '체험 ',
  '— ',
  '귀환.',
  '\n',
  '---',
  '\n',
  '## ',
  '3. ',
  '표/데이터',
  '\n',
  '| ',
  '구분 ',
  '| ',
  '평균 ',
  '| ',
  '단위 ',
  '| ',
  '비고 ',
  '|',
  '\n',
  '|---|---:|:---:|---|',
  '\n',
  '| ',
  '기온 ',
  '| ',
  '20.5 ',
  '| ',
  '℃ ',
  '| ',
  '인공 ',
  '기후 ',
  '|',
  '\n',
  '| ',
  '조도 ',
  '| ',
  '820 ',
  '| ',
  'lux ',
  '| ',
  '주간 ',
  '평균 ',
  '|',
  '\n',
  '| ',
  '소음 ',
  '| ',
  '28 ',
  '| ',
  'dB ',
  '| ',
  '야간 ',
  '공연 ',
  '제외 ',
  '|',
  '\n',
  '---',
  '\n',
  '## ',
  '4. ',
  '다국어/RTL/이모지',
  '\n',
  '- ',
  '한국어: ',
  '안녕하세요, ',
  '빛의 ',
  '도시로 ',
  '오세요.',
  '\n',
  '- ',
  'English: ',
  'Welcome ',
  'to ',
  'the ',
  'city ',
  'of ',
  'light.',
  '\n',
  '- ',
  '日本語: ',
  '光の都市へようこそ。',
  '\n',
  '- ',
  '简体中文: ',
  '欢迎来到光之城。',
  '\n',
  '- ',
  'العربية ',
  '(RTL): ',
  'مرحبًا ',
  'بكم ',
  'في ',
  'مدينة ',
  'النور ',
  '⭐️',
  '\n',
  '---',
  '\n',
  '## ',
  '5. ',
  '참조/각주',
  '\n',
  '참고 ',
  '링크는 ',
  '[공식 ',
  '포털](/guide/getting-started)',
  '과 ',
  '[외부 ',
  '문서](https://example.com/docs) ',
  '및 ',
  '섹션 ',
  '링크 ',
  '[보안 ',
  '정책](#보안-정책)을 ',
  '확인하세요.',
  '\n',
  '### ',
  '보안 ',
  '정책',
  '\n',
  'HTML ',
  '내 ',
  '`/인라인 ',
  '이벤트/스타일은 ',
  '**허용되지 ',
  '않습니다**.',
  '\n',
  '---',
  '\n',
  '## ',
  '6. ',
  '중첩 ',
  '목록(복합)',
  '\n',
  '1. ',
  '투어',
  '\n',
  '1. ',
  '자전거',
  '\n',
  '- ',
  '경로 ',
  'A',
  '\n',
  '- ',
  '경로 ',
  'B',
  '\n',
  '2. ',
  '도보',
  '\n',
  '- ',
  '야경',
  '\n',

  '- ',
  '브릿지',
  '\n',

  '- ',
  '라디언트 ',
  '광장',
  '\n',
  '2. ',
  '먹거리',
  '\n',
  '- ',
  '빛 ',
  '쿠키',
  '\n',
  '- ',
  '루멘 ',
  '티 ',
  '☕',
  '\n',
  '---',
  '\n',
  '## ',
  '부록: ',
  '코드블록 ',
  '(길이 ',
  '테스트)',
  '\n',
  '```ts',
  '\n',
  'type ',
  'Ticket ',
  '= ',
  '{ ',
  'id: ',
  'string; ',
  'issuedAt: ',
  'number; ',
  'used: ',
  'boolean ',
  '};',
  '\n',
  'const ',
  'book ',
  '= ',
  'async ',
  '(userId: ',
  'string): ',
  '=> ',
  '{',
  '\n',

  'return ',
  '{ ',
  'id: ',
  '"NL-2025-0001", ',
  'issuedAt: ',
  'Date.now(), ',
  'used: ',
  'false ',
  '};',
  '\n',
  '};',
  '\n',
  '// ',
  '긴 ',
  '주석: ',
  '특수문자 ',
  '테스트 ',
  '~!@#$%^&*()_+[]{}|;\':",./<>? ',
  '以及中文混排 ',
  '길이가',
  ' 아주',
  ' 길어지면',
  ' 코드에',
  ' 스크롤이',
  ' 생김',
  '테스트 ',
  '끝',
  '\n',
  '```',
]

export const WS_TEST_02 = [
  '<sub>sub ',
  '1.4s</sub>',
  '<div>이게되?</div>',
  '<p>이게되?</p>',
  '<p>',
  '이게되?',
  '</p>',
  '<strong>',
  '이게되?',
  '</strong>',
  '\n',
  'checkbox <input type="checkbox"/>',
  'radio <input type="radio">',
  '\n',
  '// ',
  '긴 ',
  '주석: ',
  '특수문자 ',
  '테스트 ',
]

export const MD_TEST_1 = `
# 안내서: 네오루멘 도시 여행 ✨

> “빛은 도시의 언어다.” — 무명 여행자

---

## 1. 개요
네오루멘(Neo Lumen)은 **가상의 궤도식민지** 내부에 지어진 도시입니다.  
언어: 한국어/English/日本語/中文/عربي (자동 번역 제공)

### 핵심 포인트
- 24시간 **인공 태양** 운용
- 에너지: 광섬유 기반
- 시민 ID: \`NL-\${연도}-\${일련번호}\`

### 체크리스트 (Task List)
- [x] 입장권 구매
- [x] 광역 패스 발급
- [ ] 어둠 박물관 예약
- [ ] 라디언트 광장 콘서트 🎵

---

## 2. 명소
### 2.1 루멘 다리
걸을 때마다 밟은 패널이 **파도처럼 발광**합니다. <sub>발광 주기 1.4s</sub><sup>±0.2</sup>  
이미지 예시: ![bridge](https://picsum.photos/seed/bridge/600/200)

### 2.2 빛의 도서관
책 대신 **광필사 두루마리**를 대여합니다. 반납은 무접촉.

\`\`\`json
{
  "library": "Lumen Archive",
  "device": ["holo-scroll", "memory-card"],
  "open": "09:00-22:00"
}
\`\`\`

### 2.3 별빛 열차
경로: 돔 밖 저궤도 — 무중력 체험 — 귀환.

---

## 3. 표/데이터
| 구분 | 평균 | 단위 | 비고 |
|---|---:|:---:|---|
| 기온 | 20.5 | ℃ | 인공 기후 |
| 조도 | 820 | lux | 주간 평균 |
| 소음 | 28 | dB | 야간 공연 제외 |

---

## 4. 다국어/RTL/이모지
- 한국어: 안녕하세요, 빛의 도시로 오세요.
- English: Welcome to the city of light.
- 日本語: 光の都市へようこそ。
- 简体中文: 欢迎来到光之城。
- العربية (RTL): مرحبًا بكم في مدينة النور ⭐️

---

## 5. 참조/각주
참고 링크는 [공식 포털](/guide/getting-started)과 [외부 문서](https://example.com/docs) 및 섹션 링크 [보안 정책](#보안-정책)을 확인하세요.

### 보안 정책
HTML 내 \`<script>\`/인라인 이벤트/스타일은 **허용되지 않습니다**.

---

## 6. 중첩 목록(복합)
1. 투어
   1. 자전거
      - 경로 A
      - 경로 B
   2. 도보
      - 야경
         - 브릿지
         - 라디언트 광장
2. 먹거리
   - 빛 쿠키
   - 루멘 티 ☕

---

## 부록: 코드블록 (길이 테스트)
\`\`\`ts
type Ticket = { id: string; issuedAt: number; used: boolean };
const book = async (userId: string): Promise<Ticket> => {
  return { id: "NL-2025-0001", issuedAt: Date.now(), used: false };
};
// 긴 주석: 특수문자 테스트 ~!@#$%^&*()_+[]{}|;':",./<>? 以及中文混排 테스트 끝
\`\`\`
`

export const MD_TEST_2 = `
# 긴 문단/예상외 문자/하이브리드 구조 Stress Test

**긴 문단**입니다. 이 문단은 줄바꿈 없이 매우 길게 이어져 랜더러가 줄바꿈, 공백, 단어 토큰화를 어떻게 처리하는지 검증합니다. 공백    이   여러   개 들어가도 유지되어야 하며, \`non-breaking space&nbsp;\` 같은 HTML 엔티티가 섞여도 문제가 없어야 합니다. 또한 이모지 😅🔥🚀, 합성 문자(🇰🇷), 악센트(élève), 전각(Ｈｅｌｌｏ) 등이 함께 들어갑니다. 또한 URL 처리는 https://example.com/path?q=a&b=c 와 같이 다양한 쿼리 파라미터도 포함합니다. 상대 링크(../relative), 해시 링크(#section), 메일 링크(mailto:support@example.com)는 마크다운 수준에서는 표기되지만, 실제 렌더러의 링크 보안 정책에 따라 필터링 혹은 허용이 달라질 수 있습니다.

---

## 혼합 요소
> 블록 인용문 안에 **굵은 텍스트**와 *기울임*, \`코드\`, 리스트:
> - 아이템 1  
> - 아이템 2  
>   - 하위 2-1

\`\`\`html
<!-- HTML 코드블럭 (이건 렌더된 HTML이 아니라 코드표시) -->
<div class="danger" onclick="alert('xss')">should not run</div>
\`\`\`

### 표 (넓은 테이블)
| Key | Value | Desc |
|-----|------:|------|
| alpha | 1 | 첫번째 |
| beta | 2 | 두번째 |
| gamma | 3 | 세번째 |
| delta | 4 | 네번째 |
| epsilon | 5 | 다섯번째 |

---

### 인라인 HTML (화이트리스트 내)
문장 중에 <kbd>Ctrl</kbd> + <kbd>K</kbd> 를 눌러보세요.  
<mark>강조 텍스트</mark>와 <code>inline-code</code> 예시.  
숨겨진 요소: <span style="color:red">style은 제거되어야 함</span>

---

### 매우 긴 목록
- 항목1
- 항목2
- 항목3
- 항목4
- 항목5
- 항목6
  - 하위-1
  - 하위-2
  - 하위-3
- 항목7
- 항목8
- 항목9
- 항목10

---

### 이미지(상대/절대/데이터)
![ok-http](https://picsum.photos/seed/pic1/480/120)
![relative](/assets/cover.png)
![data-uri](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA)
`

export const MD_TEST_3 = `
# 계층/길이/혼합 언어 풀 스택 테스트

## 섹션 A
- \`<script>\`는 제거되어야 합니다.
- \`onmouseover="..." style="..." data-*\` 등은 필터 대상.
- 링크: [JS 스킴](javascript:alert(1)) [상대](/safe/path) [해시](#섹션-b) [절대](https://example.org)

## 섹션 B
1. 깊은 목록
   1. 레벨2
      1. 레벨3
         - 아이템 A
         - 아이템 B
2. 테이블
   | A | B | C |
   |---|---|---|
   | 1 | 2 | 3 |
   | 4 | 5 | 6 |

> 한/영/중/일 섞기: 안녕 Hello 你好 こんにちは  
> RTL: العربية تجربة اتجاه نص من اليمين إلى اليسار

---

### 코드 & 수식 텍스트 (Plain)
\`E=mc^2\` 는 인라인 코드로만 표시됩니다.  
\`\`\`python
def fib(n):
  a,b=0,1
  for _ in range(n):
    a,b=b,a+b
  return a
\`\`\`

### 대형 문단 2개 (길이성 테스트)
(1) 로렘 입숨 문단 — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae proin sagittis nisl rhoncus mattis rhoncus. Ullamcorper malesuada proin libero nunc consequat interdum varius sit amet.  
(2) 추가 문단 — 커다란 문자열이 연속 등장할 때 스트리밍 단어 단위 출력이 자연스러운지 점검합니다.
`

// --------------------------------------------------------------------
// HTML 데이터 (의도적 위험 요소 + 깊은 계층/긴 컨텐트/다국어)
// --------------------------------------------------------------------

export const HTML_TEST_1 = `
<div class="doc">
  <h1>HTML 데모 1 — 안전/위험 요소 혼합</h1>
  <p>이 문서는 <strong>깊은 하이어라키</strong>와 <em>보안 필터</em> 검증을 위해 만들어졌습니다.</p>

  <!-- 위험 태그: 제거되어야 함 -->
  <script>alert('xss')</script>
  <style>body{background:red}</style>
<!--  <iframe src="https://example.com"></iframe>-->

  <h2>링크/이미지</h2>
  <ul>
    <li><a href="https://example.com">절대 링크</a></li>
    <li><a href="/relative/path">상대 링크</a></li>
    <li><a href="#hash">해시 링크</a></li>
    <li><a href="javascript:alert(1)" onclick="alert(2)">JS 스킴 (차단 대상)</a></li>
  </ul>

  <figure>
    <img src="https://picsum.photos/seed/html1/400/160" alt="pic"/>
    <figcaption>설명 캡션</figcaption>
  </figure>

  <h2>테이블(중첩)</h2>
  <table>
    <thead><tr><th>ColA</th><th>ColB</th><th>ColC</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>2</td><td>
        <table>
          <tr><td>내부-1</td></tr>
          <tr><td>내부-2</td></tr>
        </table>
      </td></tr>
      <tr><td>4</td><td>5</td><td>6</td></tr>
    </tbody>
  </table>

  <h2>코드</h2>
  <pre><code class="language-js">const x = 1; function add(a,b){return a+b}</code></pre>

  <p>
    <span title="팁" style="color:red" onclick="alert(3)">style/onclick은 제거</span>되어야 하며,
    <b data-x="1">data-*</b>도 기본 정책상 제거됩니다.
  </p>

  <blockquote>
    인용문 — 한국어/English/日本語/العربية ⭐️
  </blockquote>
  
</div>
`

export const HTML_TEST_2 = `
<div class="long">
  <h1>HTML 데모 2 — 아주 긴 문단 & 리스트 & 혼합 스크립트</h1>
  <p>
    이 문단은 매우 길게 작성되어, 스크롤, 토큰 예산, 단어 단위 스트리밍 출력이
    긴 텍스트에서도 끊김 없이 자연스럽게 동작하는지 검증합니다. 공백     여러 개,
    특수문자 ~!@#$%^&*()_+{}|:"&lt;&gt;?[], 이모지 😄🎉, 합성문자(🇰🇷), RTL العربية
    등이 함께 포함되어 있습니다.
  </p>

  <ul>
    <li>항목 1
      <ul>
        <li>하위 1-1</li>
        <li>하위 1-2
          <ul><li>하위 1-2-1</li></ul>
        </li>
      </ul>
    </li>
    <li>항목 2</li>
    <li>항목 3</li>
  </ul>

  <p>상대 링크 <a href="../up/one">../up/one</a>, 해시 <a href="#section">#section</a>,
  잘못된 상대 <a href="foo">foo (차단되어야 함)</a></p>

  <h2 id="section">섹션</h2>
  <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" alt="tiny"/></p>

  <div>
    <p><span>깊은 <em>중첩</em> <strong>테스트</strong></span> 입니다.</p>
    <pre><code>&lt;div&gt;inline code-like text&lt;/div&gt;</code></pre>
  </div>
</div>
`

export const HTML_TEST_3 = `
<div class="mixed">
  <h1>HTML 데모 3 — 테이블/코드/이미지/양방향</h1>
  <p dir="rtl">النص العربي من اليمين إلى اليسار — العربية تجربة.</p>
  <p>한국어 문장과 English sentence가 교차합니다. <a href="mailto:help@example.com">mailto</a> (정책상 차단/허용 선택)</p>

  <table>
    <thead><tr><th>#</th><th>Name</th><th>Desc</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Alpha</td><td>첫번째</td></tr>
      <tr><td>2</td><td>Beta</td><td>두번째</td></tr>
      <tr><td>3</td><td>Gamma</td><td>세번째</td></tr>
    </tbody>
  </table>

  <p><img src="http://example.org/img.png" width="320" height="180" alt="external"/></p>

  <blockquote>
    <p>“장문 인용문은 스트리밍 시 줄바꿈/공백 처리가 중요합니다.”</p>
  </blockquote>

  <!-- 위험 속성들 -->
  <a href="javascript:alert(9)" onmouseover="alert(9)">bad link</a>
  <span style="position:fixed;top:0;left:0">style 제거 대상</span>

  <pre><code class="language-python">def f(x): return x*x</code></pre>

  <p>#해시만 있는 링크 <a href="#top">#top</a> 과 절대 <a href="https://example.org">https://example.org</a></p>
</div>
`
