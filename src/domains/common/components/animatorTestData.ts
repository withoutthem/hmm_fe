/**
 * MDHTMLAnimator 컴포넌트를 위한 종합 테스트 데이터
 *
 * 1.  Markdown Test Data (3개)
 * - markdownTestData1: 매우 길고 복잡한 'Kitchen Sink' 데이터
 * - markdownTestData2: 엣지 케이스 및 비정상 구조 테스트 데이터
 * - markdownTestData3: 짧고 일반적인 기본 사용례 데이터
 *
 * 2.  HTML Test Data (3개)
 * - htmlTestData1: 깊은 계층 구조를 가진 안전한 HTML 데이터
 * - htmlTestData2: 악의적인 스크립트 및 스타일을 포함한 'Dirty' HTML 데이터 (Sanitizer 테스트용)
 * - htmlTestData3: 실제 웹에서 복사했을 법한 일반적인 HTML 데이터
 */

// ======================================================================================
// Markdown Test Data
// ======================================================================================

/**
 * [마크다운 #1] Kitchen Sink: 길고 복잡하며 다양한 요소 포함
 * - 모든 종류의 헤더, 리스트(중첩), 테이블, 코드 블록, 인용문 등을 테스트합니다.
 * - 긴 문장과 문단으로 'word', 'sentence' 분리 로직을 검증합니다.
 */
export const markdownTestData1 = `
# 제목 H1: 컴포넌트 종합 테스트

## H2: 소개 및 기본 텍스트d

이 문서는 \`MDHTMLAnimator\` 컴포넌트의 렌더링 능력을 시험하기 위한 종합 테스트 데이터입니다. **굵은 텍스트**, *기울임꼴*, ~~취소선~~, 그리고 \`인라인 코드\`가 포함된 문단을 자연스럽게 표시해야 합니다. 이모지(😄👍)와 특수 문자( ©®™ ) 처리도 중요합니다.

> 이것은 첫 번째 인용문입니다.
> > 이것은 내부에 중첩된 인용문입니다.
> > > 더 깊은 인용문도 가능합니다.
>
> 다시 첫 번째 레벨로 돌아옵니다.

---

## H2: 리스트 구조 테스트

### H3: 순서 없는 리스트 (중첩)

* 항목 1
    * 항목 1-1: React와 TypeScript
        * 항목 1-1-1: Hooks (useState, useEffect)
    * 항목 1-2: Motion 라이브러리
* 항목 2
    -   항목 2-1 (다른 마커 사용)
    +   항목 2-2 (또 다른 마커)
* 항목 3: 마지막 아이템

### H3: 순서 있는 리스트 (중첩)

1.  첫 번째 할 일
    1.  요구사항 분석
    2.  설계 및 API 디자인
        1.  Props 정의
        2.  상태 관리 전략
2.  두 번째 할 일1
3.  세 번째 할 일

### H3: 할 일 목록 (Task List)

- [x] 컴포넌트 기본 기능 구현
- [x] 마크다운 파싱 기능 추가
- [ ] HTML Sanitizer 보안 강화
- [ ] 배포 및 문서화 작업

---

## H2: 테이블 및 코드 블록

### H3: 복잡한 테이블

| 헤더 1 (왼쪽 정렬) | 헤더 2 (중앙 정렬) | 헤더 3 (오른쪽 정렬) |
| :----------------- | :----------------: | ------------------: |
| 값 1-1             |      값 1-2        |          1000       |
| 긴 텍스트 값 1-2-1 |    *Markdown* |        **200** |
| 값 3               |      \`code\`      |                 3.14|

### H3: 코드 블록 (TypeScript)

\`\`\`typescript
import React, { useEffect } from 'react';

function Greet({ name }: { name: string }) {
  useEffect(() => {
    console.log(\`Hello, \${name}!\`);
    // 이 코드는 애니메이션으로 렌더링되어야 합니다.
  }, [name]);

  return <div>Welcome, {name}!</div>;
}
\`\`\`

## H2: 링크 및 이미지

자세한 정보는 [Google](https://www.google.com)에서 확인하세요.

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
`

/**
 * [마크다운 #2] 엣지 케이스: 비정상적이거나 까다로운 구조
 * - 망가진 마크다운, 연속된 특수문자, 비어있는 요소 등을 테스트합니다.
 * - 컴포넌트의 안정성을 검증하는 데 목적이 있습니다.
 */
export const markdownTestData2 = `
# 엣지 케이스 테스트

## 연속된 특수 문자

******
---
___

## 비어있는 요소들

>
> >
>

* * 아이템 1
* 1.  
2.  아이템 2
3.  

## HTML과 마크다운 혼합

<div>
  이것은 div 태그 안의 텍스트입니다. *이탤릭체*가 적용될까요?
</div>

<pre>
  **이것은 pre 태그 안의 마크다운입니다.**
  렌더링이 예상과 다를 수 있습니다.
</pre>

## 아주 긴 한 단어
이단어는공백이없어매우길고자동줄바꿈과토큰화로직을테스트하기에아주좋은예시가될것입니다abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789

## 링크 속 이상한 문자
[이상한 링크](http://example.com/search?q=a%20b&key=123!@#$*)
`

/**
 * [마크다운 #3] Simple & Short: 짧고 일반적인 사용례
 * - 가장 흔하게 사용될 간단한 마크다운 구조를 테스트합니다.
 * - 최소한의 콘텐츠에서도 정상 동작하는지 확인합니다.
 */
export const markdownTestData3 = `
### 안녕하세요!

간단한 마크다운 테스트입니다.

* 첫 번째 항목
* 두 번째 항목

**감사합니다.**
`

// ======================================================================================
// HTML Test Data
// ======================================================================================

/**
 * [HTML #1] Deep Hierarchy: 깊고 복잡한 계층 구조의 안전한 HTML
 * - Sanitizer가 허용된 태그들의 복잡한 중첩 구조를 올바르게 복제하고 처리하는지 테스트합니다.
 */
export const htmlTestData1 = `
<h1>HTML 계층 구조 테스트</h1>
<div>
    <p>이것은 <b>안전한</b> HTML 콘텐츠입니다. <span>여러 태그가 <em>중첩</em>되어 있습니다.</span></p>
    <ul>
        <li>레벨 1 항목
            <ol>
                <li>레벨 2 항목 A</li>
                <li>레벨 2 항목 B
                    <ul>
                        <li>레벨 3 항목: <code>코드를 포함</code></li>
                    </ul>
                </li>
            </ol>
        </li>
        <li>또 다른 레벨 1 항목</li>
    </ul>
    <blockquote><p>안전한 인용문입니다.</p></blockquote>
    <hr/>
    <p>테스트 종료.</p>
</div>
`

/**
 * [HTML #2] Malicious & Dirty: Sanitizer를 테스트하기 위한 악성 HTML
 * - 스크립트, 이벤트 핸들러, 위험한 속성, 허용되지 않은 태그를 포함합니다.
 * - 모든 위험 요소가 제거되고 안전한 텍스트와 구조만 남아야 합니다.
 */
export const htmlTestData2 = `
<h1>보안 테스트</h1>
<p>아래 콘텐츠는 위험 요소를 포함합니다.</p>
<script>alert('XSS Attack!');</script>
<iframe src="https://example.com"></iframe>
<div style="color: red; font-size: 24px;" onmouseover="alert('Gotcha!')">
    인라인 스타일과 onmouseover 이벤트는 제거되어야 합니다.
</div>
<img src="invalid-source" onerror="alert('Image Error Attack')">
<a href="javascript:alert('Link Attack!')">악성 링크</a>
<form action="/submit">
    <input type="text" value="폼 태그는 허용되지 않습니다.">
</form>
<p>
    <b onclick="console.log('clicked')">이 텍스트만 남아야 합니다.</b>
    <u id="allowed_id" class="allowed_class">밑줄은 허용됩니다.</u>
</p>
`

/**
 * [HTML #3] Real World Snippet: 실제 웹에서 복사했을 법한 일반적인 HTML
 * - class 속성, p 태그, br 태그 등이 혼합된 형태를 테스트합니다.
 * - Sanitizer가 허용된 속성(class)은 보존하는지 확인합니다.
 */
export const htmlTestData3 = `
<p class="article-paragraph">이것은 웹사이트 기사에서 복사한 문단일 수 있습니다.<br>줄바꿈 태그도 포함되어 있습니다.</p>
<p>연락처 정보는 <a href="https://google.com" target="_blank" class="external-link" title="구글">여기</a>를 확인하세요.</p>
<div class="content-wrapper">
    <strong>중요 공지:</strong><span>&nbsp;이 부분은 중요합니다.</span>
</div>
`
