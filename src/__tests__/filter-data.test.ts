
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import { checkIfElementExists, getListOfObjectWhereKeyContainsString, getObjectsWhereKeyAnyValidStrings, getObjectsWhereKeyEqualsValue } from "../utils/filter-data";

describe("getListOfObjectWhereKeyContainsString", () => {
    it("should return a list of objects where the specified key contains the specified value", () => {
        const listOfObjects = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        const key = "name";
        const value = "o";
        const expectedOutput = [{ name: "John", age: 30 }, { name: "Bob", age: 35 }];
        expect(getListOfObjectWhereKeyContainsString(listOfObjects, key, value)).toEqual(expectedOutput);
    });
});

describe("getObjectsWhereKeyAnyValidStrings", () => {
    it("should return a list of objects where the specified key contains any of the valid strings", () => {
        const listOfObjects = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        const key = "name";
        const arrayOfValidStrings = ["o", "a"];
        const expectedOutput = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        expect(getObjectsWhereKeyAnyValidStrings(listOfObjects, key, arrayOfValidStrings)).toEqual(expectedOutput);
    });
});

describe("getObjectsWhereKeyEqualsValue", () => {
    it("should return a list of objects where the specified key is equal to the specified value", () => {
        const listOfObjects = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        const key = "age";
        const value = 30;
        const expectedOutput = [{ name: "John", age: 30 }];
        expect(getObjectsWhereKeyEqualsValue(listOfObjects, key, value)).toEqual(expectedOutput);
    });
});

describe("checkIfElementExists", () => {
    it("should return true if an object with the specified key and value exists in the list of objects", () => {
        const listOfObjects = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        const key = "name";
        const value = "Jane";
        expect(checkIfElementExists(listOfObjects, key, value)).toBe(true);
    });

    it("should return false if an object with the specified key and value does not exist in the list of objects", () => {
        const listOfObjects = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }, { name: "Bob", age: 35 }];
        const key = "name";
        const value = "Mike";
        expect(checkIfElementExists(listOfObjects, key, value)).toBe(false);
    });
});
