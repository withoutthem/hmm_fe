/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import {
  getScroller,
  alignItemToTop,
  highlightMatch,
  onAdaptiveCardSubmit,
} from '../domains/common/utils/utils';

/* ----------------------------- rAF & timers (최소) ----------------------------- */

let now = 0;
let rafQueue: Array<(t: number) => void> = [];
const originalPerfNow = global.performance.now.bind(global.performance);

beforeEach(() => {
  jest.useFakeTimers();

  now = 0;
  jest.spyOn(global.performance, 'now').mockImplementation(() => now);

  rafQueue = [];
  global.requestAnimationFrame = (cb: (t: number) => void) => {
    rafQueue.push(cb);
    return rafQueue.length;
  };
  global.cancelAnimationFrame = (_id: number) => {};

  document.body.innerHTML = '';
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  jest.spyOn(global.performance, 'now').mockImplementation(originalPerfNow);
});

function tickFrame(ms = 16) {
  now += ms;
  const queue = [...rafQueue];
  rafQueue = [];
  queue.forEach((cb) => cb(now));
  jest.advanceTimersByTime(0);
}

/* ----------------------------- DOM helpers ----------------------------- */

function makeScroller({
  clientHeight = 600,
  scrollHeight = 2000,
  scrollTop = 0,
}: {
  clientHeight?: number;
  scrollHeight?: number;
  scrollTop?: number;
}) {
  const scroller = document.createElement('div');
  scroller.setAttribute('data-testid', 'virtuoso-scroller');

  Object.defineProperty(scroller, 'clientHeight', { value: clientHeight, configurable: true });
  Object.defineProperty(scroller, 'scrollHeight', {
    get() {
      return (scroller as any).__scrollHeight ?? scrollHeight;
    },
    set(v) {
      (scroller as any).__scrollHeight = v;
    },
    configurable: true,
  });
  Object.defineProperty(scroller, 'scrollTop', {
    get() {
      return (scroller as any).__scrollTop ?? scrollTop;
    },
    set(v) {
      (scroller as any).__scrollTop = v;
    },
    configurable: true,
  });

  (scroller as any).getBoundingClientRect = () =>
    ({ top: 100, bottom: 100 + clientHeight, height: clientHeight }) as DOMRect;

  document.body.appendChild(scroller);
  return scroller as HTMLElement & { __scrollTop?: number; __scrollHeight?: number };
}

function addItem({
  scroller,
  index,
  top,
  height = 80,
}: {
  scroller: HTMLElement;
  index: number;
  top: number;
  height?: number;
}) {
  const el = document.createElement('div');
  el.setAttribute('data-item-index', String(index));
  (el as any).getBoundingClientRect = () => ({ top, bottom: top + height, height }) as DOMRect;
  scroller.appendChild(el);
  return el;
}

/* ----------------------------- 간단 테스트만 ----------------------------- */

describe('getScroller', () => {
  test('returns null when not present', () => {
    expect(getScroller()).toBeNull();
  });

  test('returns the scroller element when present', () => {
    const scroller = makeScroller({});
    expect(getScroller()).toBe(scroller);
  });
});

describe('alignItemToTop (instant only)', () => {
  test('jumps instantly when smooth=false (default)', async () => {
    const scroller = makeScroller({ clientHeight: 500, scrollHeight: 4000, scrollTop: 0 });
    addItem({ scroller, index: 3, top: 350 }); // scroller.top=100 → delta=250

    const p = alignItemToTop(3); // 내부에서 rAF 1프레임 대기
    tickFrame(); // 1프레임만 진행
    await p;

    expect((scroller as any).__scrollTop).toBeCloseTo(250);
  });
});

describe('highlightMatch (sanitization 포함)', () => {
  test('wraps first match with <span>', () => {
    const out = highlightMatch('Hello Surcharge Rate', 'charge');
    expect(out).toContain('<span>charge</span>');
  });

  test('returns original when no match', () => {
    const txt = 'ABC DEF';
    const out = highlightMatch(txt, 'xyz');
    expect(out).toBe(txt);
  });

  test('escapes disallowed tags', () => {
    const risky = '<img src=x onerror=alert(1) />';
    const out = highlightMatch(risky, 'img');
    expect(out).not.toContain('<img'); // 실제 태그 금지
    expect(out).toContain('&lt;'); // escape 확인
  });
});

describe('onAdaptiveCardSubmit (기본 검증)', () => {
  let alertSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('alerts when endTime <= startTime', () => {
    onAdaptiveCardSubmit({
      startTime1: '10:00',
      endTime1: '09:00',
    });
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  test('logs cancel action', () => {
    onAdaptiveCardSubmit({ action: 'cancle' });
    expect(logSpy).toHaveBeenCalledWith('취소버튼누름', expect.any(Object));
  });

  test('logs final formData when valid', () => {
    onAdaptiveCardSubmit({
      startTime1: '09:00',
      endTime1: '10:00',
      something: 'ok',
    });
    expect(logSpy).toHaveBeenCalledWith('✅ 최종 formData:', expect.any(Object));
  });
});
