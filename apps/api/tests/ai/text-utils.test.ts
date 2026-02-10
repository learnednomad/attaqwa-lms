import { stripHtml, escapeLikePattern } from '../../src/api/ai/services/text-utils';

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('should decode HTML entities', () => {
    expect(stripHtml('&amp; &lt; &gt; &quot; &nbsp;')).toBe('& < > "');
  });

  it('should collapse whitespace', () => {
    expect(stripHtml('  Hello   world  ')).toBe('Hello world');
  });

  it('should handle empty string', () => {
    expect(stripHtml('')).toBe('');
  });

  it('should handle nested HTML', () => {
    expect(stripHtml('<div><p><span>text</span></p></div>')).toBe('text');
  });

  it('should handle self-closing tags', () => {
    expect(stripHtml('line1<br/>line2')).toBe('line1 line2');
  });
});

describe('escapeLikePattern', () => {
  it('should escape percent sign', () => {
    expect(escapeLikePattern('100%')).toBe('100\\%');
  });

  it('should escape underscore', () => {
    expect(escapeLikePattern('my_variable')).toBe('my\\_variable');
  });

  it('should escape backslash', () => {
    expect(escapeLikePattern('path\\to')).toBe('path\\\\to');
  });

  it('should escape multiple special characters', () => {
    expect(escapeLikePattern('50% off_sale\\')).toBe('50\\% off\\_sale\\\\');
  });

  it('should leave normal text unchanged', () => {
    expect(escapeLikePattern('hello world')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(escapeLikePattern('')).toBe('');
  });
});
