
import type { ParamMatcher } from '@sveltejs/kit';
export const match: ParamMatcher = (param) => {
    const slugRegex = /^\d+$/;
    return slugRegex.test(param)
};
