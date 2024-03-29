import type { DateFull, DateSimple, YYYY_MM_DD_hh_mm, YYYY_MM_DD_hh_mm_ss, YY_MM_DD_hh_mm, YY_MM_DD_hh_mm_ss } from "$lib/constants/dateTime";


export type IDateTimeFormat = typeof YYYY_MM_DD_hh_mm_ss | typeof YY_MM_DD_hh_mm_ss | typeof YYYY_MM_DD_hh_mm | typeof YY_MM_DD_hh_mm | typeof DateFull | typeof DateSimple;