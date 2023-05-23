import { isEmptyString } from "$lib/utils/is-emptyString";

describe('isEmptyString', () => {
  it('returns true for empty string', () => {
    expect(isEmptyString('')).toBe(true);
  });

  it('returns false for non-empty string', () => {
    expect(isEmptyString('Hello, World!')).toBe(false);
  });
});
