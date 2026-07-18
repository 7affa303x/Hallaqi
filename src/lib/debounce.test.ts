import { describe, expect, it, vi } from 'vitest';
import { debounce } from '@/lib/debounce';
import { assertFileWithinLimit, UPLOAD_LIMITS } from '@/lib/imageUpload';

describe('debounce', () => {
  it('delays invocation and cancels prior calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const d = debounce(fn, 200);
    d();
    d();
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    d.cancel();
    d();
    d.cancel();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('imageUpload limits', () => {
  it('accepts files under the limit', () => {
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1000 });
    expect(assertFileWithinLimit(file, UPLOAD_LIMITS.forumImageMaxBytes)).toBeNull();
  });

  it('rejects oversized files with Arabic message', () => {
    const file = new File(['x'], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: UPLOAD_LIMITS.forumImageMaxBytes + 1 });
    const msg = assertFileWithinLimit(file, UPLOAD_LIMITS.forumImageMaxBytes);
    expect(msg).toMatch(/حجم الملف/);
  });
});
