// tests/utils.spec.ts
import { test, expect } from 'vitest'
import { isImage, isVideo, isColor, isNumber, stringifyObject } from '../value-type' // Update the import based on your actual file path

test('isImage should correctly identify image URLs', () => {
  // Positive tests
  expect(isImage('image.jpeg')).toBe(true)
  expect(isImage('image.jpg')).toBe(true)
  expect(isImage('image.gif')).toBe(true)
  expect(isImage('image.png')).toBe(true)

  // Negative tests
  expect(isImage('image.txt')).toBe(false)
  expect(isImage(null)).toBe(false)
})

test('isVideo should correctly identify video URLs', () => {
  expect(isVideo('video.mp4')).toBe(true)
  expect(isVideo('video.webm')).toBe(true)
  expect(isVideo('video.ogg')).toBe(true)
  expect(isVideo('video.mov')).toBe(false)
  expect(isVideo(null)).toBe(false)
})

test('isColor should correctly identify color codes', () => {
  expect(isColor('#fff')).toBe(true)
  expect(isColor('#ffffff')).toBe(true)
  expect(isColor('#123')).toBe(true)
  expect(isColor('#xyz')).toBe(false)
  expect(isColor(null)).toBe(false)
})

test('isNumber should correctly identify numbers', () => {
  expect(isNumber(10)).toBe(true)
  expect(isNumber('10')).toBe(true)
  expect(isNumber('a')).toBe(false)
  expect(isNumber(NaN)).toBe(false)
  expect(isNumber(null)).toBe(false)
})

test('stringifyObject should correctly stringify objects', () => {
  expect(stringifyObject({ a: 1, b: 2 })).toBe('{"a":1,"b":2}')
  expect(stringifyObject('a')).toBe('a')
  expect(stringifyObject(null)).toBe('null')
  expect(stringifyObject(undefined)).toBe(undefined)
})
