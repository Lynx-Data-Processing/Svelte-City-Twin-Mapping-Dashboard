
import { checkIfElementExists } from "$lib/features/map/helpers/google/filter-data";
import "@testing-library/jest-dom";

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
