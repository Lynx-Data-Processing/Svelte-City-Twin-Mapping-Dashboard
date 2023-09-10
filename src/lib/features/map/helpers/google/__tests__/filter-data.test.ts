// tests/arrayManipulation.spec.ts
import { test, expect } from 'vitest'
import { checkIfElementExists, removeObjectWhereValueEqualsString } from '../filter-data' // Update the import based on your actual file path

test('checkIfElementExists should return true if element exists', () => {
  const list = [{id: 1}, {id: 2}, {id: 3}];
  const exists = checkIfElementExists(list, 'id', 2);
  expect(exists).toBe(true);
})

test('checkIfElementExists should return false if element does not exist', () => {
  const list = [{id: 1}, {id: 2}, {id: 3}];
  const exists = checkIfElementExists(list, 'id', 4);
  expect(exists).toBe(false);
})

test('removeObjectWhereValueEqualsString should remove object where key equals value', () => {
  const list = [{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}];
  const filtered = removeObjectWhereValueEqualsString(list, 'name', 'Bob');
  expect(filtered).toEqual([{name: 'Alice'}, {name: 'Charlie'}]);
})

test('removeObjectWhereValueEqualsString should return the same list if no match found', () => {
  const list = [{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}];
  const filtered = removeObjectWhereValueEqualsString(list, 'name', 'David');
  expect(filtered).toEqual(list);
})
