// tests/getDevicon.spec.ts
import { test, expect } from 'vitest'
import { getDevicon } from '../devicon-icons' // Update the import based on your actual file path

test('getDevicon should correctly construct GitHub URL with default suffix', () => {
  const url = getDevicon('javascript-github')
  expect(url).toBe('https://raw.githubusercontent.com/devicons/devicon/develop/icons/javascript/javascript-original.svg')
})

test('getDevicon should correctly construct CDN URL with default suffix', () => {
  const url = getDevicon('javascript')
  expect(url).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg')
})

test('getDevicon should correctly construct GitHub URL with custom suffix', () => {
  const url = getDevicon('javascript-wordmark-github')
  expect(url).toBe('https://raw.githubusercontent.com/devicons/devicon/develop/icons/javascript/javascript-wordmark.svg')
})

test('getDevicon should correctly construct CDN URL with custom suffix', () => {
  const url = getDevicon('javascript-wordmark')
  expect(url).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-wordmark.svg')
})

