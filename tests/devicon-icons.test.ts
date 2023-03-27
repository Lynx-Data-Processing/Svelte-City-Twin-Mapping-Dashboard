
import { getDevicon } from "$lib/utils/devicon-icons";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

describe("getDevicon", () => {
    it("should return the correct devicon URL for the provided tool string", () => {
        const toolString = "javascript";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });

    it("should handle variations of the provided tool string", () => {
        const toolString = "javascript-original-plain";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original-plain.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });

    it("should handle different variations of provided tool string", () => {
        const toolString = "javascript-original-line";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original-line.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });

    it("should handle variations of the provided tool string", () => {
        const toolString = "javascript-plain";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });

    it("should handle variations of the provided tool string", () => {
        const toolString = "javascript-wordmark";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-wordmark.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });

    it("should handle variations of the provided tool string", () => {
        const toolString = "javascript-original-wordmark";
        const expectedOutput = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original-wordmark.svg";
        expect(getDevicon(toolString)).toEqual(expectedOutput);
    });
});
