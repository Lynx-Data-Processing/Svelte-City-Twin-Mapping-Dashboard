
import type { ParamMatcher } from '@sveltejs/kit';
export const match: ParamMatcher = (param) => {
    const slugRegex = /^[a-zA-Z]+$/;
    return slugRegex.test(param)
};