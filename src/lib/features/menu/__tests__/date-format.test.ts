import { dateTimeToMillisecondUnix } from '$lib/features/menu/helpers/date-format'; // Replace 'your-file' with the correct path to the file containing the functions.

describe('dateTimeToMillisecondUnix', () => {
  

  it('throws an error when dateTime is missing', () => {
    expect(() => {
      dateTimeToMillisecondUnix(null as any);
    }).toThrow('dateTime is required');
  });

  it('throws an error when dateTime is invalid', () => {
    const invalidDateTime = 'invalid';
    expect(() => {
      dateTimeToMillisecondUnix(invalidDateTime);
    }).toThrow('Invalid dateTime');
  });
});

