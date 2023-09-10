// tests/formatText.spec.ts
import { test, expect } from 'vitest'
import { formatText } from '../text-format' // Update the import based on your actual file path

test('formatText should replace underscores with spaces', () => {
  const text = "hello_world";
  const formatted = formatText(text);
  expect(formatted).toBe("Hello World");
})

test('formatText should capitalize the first letter of each word', () => {
  const text = "hello world";
  const formatted = formatText(text);
  expect(formatted).toBe("Hello World");
})

test('formatText should handle mixed cases', () => {
  const text = "hElLo_woRLd";
  const formatted = formatText(text);
  expect(formatted).toBe("Hello World");
})

test('formatText should handle empty strings', () => {
  const text = "";
  const formatted = formatText(text);
  expect(formatted).toBe("");
})
