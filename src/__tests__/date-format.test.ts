import "@testing-library/jest-dom";
import { TimeStampFormatEnum } from "../types/enums";
import { dateTimeToMillisecondUnix, formatDateTime, millisecondUnixToDateTime } from '../utils/date-format';

describe('formatDateTime function', () => {
    it('should format timestamp with format YYYY_MM_DD_hh_mm_ss', () => {
      const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
      const expectedOutput = '2022-10-04 18:45:00';
      const result = formatDateTime(timestamp, TimeStampFormatEnum.YYYY_MM_DD_hh_mm_ss);
      expect(result).toEqual(expectedOutput);
    });

    it('should format timestamp with format YYYY_MM_DD_hh_mm', () => {
      const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
      const expectedOutput = '2022-10-04 18:45';
      const result = formatDateTime(timestamp, TimeStampFormatEnum.YYYY_MM_DD_hh_mm);
      expect(result).toEqual(expectedOutput);
    });

    it('should format timestamp with format YY_MM_DD_hh_mm_ss', () => {
      const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
      const expectedOutput = '22-10-04 18:45:00';
      const result = formatDateTime(timestamp, TimeStampFormatEnum.YY_MM_DD_hh_mm_ss);
      expect(result).toEqual(expectedOutput);
    });

    it('should format timestamp with format YY_MM_DD_hh_mm', () => {
      const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
      const expectedOutput = '22-10-04 18:45';
      const result = formatDateTime(timestamp, TimeStampFormatEnum.YY_MM_DD_hh_mm);
      expect(result).toEqual(expectedOutput);
    });

    it('should format timestamp with format "Day Month Date Year hh:mm:ss"', () => {
      const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
      const expectedOutput = 'Tue Oct 04 2022 18:45:00 UTC';
      const result = formatDateTime(timestamp, TimeStampFormatEnum.DateFull);
      expect(result).toEqual(expectedOutput);
    });

	it('should format timestamp with format "Month Date Year hh:mm"', () => {
		const timestamp = 1664909100639; // Tue Oct 04 2022 18:45:00
		const expectedOutput = 'Oct 04 2022 18:45';
		const result = formatDateTime(timestamp, TimeStampFormatEnum.DateSimple);
		expect(result).toEqual(expectedOutput);
	  });

    it('should throw an error if timestamp is negative', () => {
      const timestamp = -1;
      const expectedOutput = new Error('timeStamp cannot be negative.');
      const result = formatDateTime(timestamp, TimeStampFormatEnum.YYYY_MM_DD_hh_mm_ss);
      expect(result).toEqual(expectedOutput);
    });
});


describe('dateTimeToMillisecondUnix', () => {
  test('should return the correct millisecond unix value for a valid date string', () => {
    const dateTime = '2022-01-01T00:00:00.000Z';
    const expectedMillis = 1640995200000;
    expect(dateTimeToMillisecondUnix(dateTime)).toEqual(expectedMillis);
  });

  test('should throw an error when an invalid date string is provided', () => {
    const dateTime = 'invalid date string';
    expect(() => dateTimeToMillisecondUnix(dateTime)).toThrow('Invalid dateTime');
  });
});

describe('millisecondUnixToDateTime', () => {
  test('should return the correct UTC string for a valid millisecond unix value', () => {
    const millis = 1640995200000;
    const expectedDateTime = 'Sat, 01 Jan 2022 00:00:00 GMT';
    expect(millisecondUnixToDateTime(millis)).toEqual(expectedDateTime);
  });

});
