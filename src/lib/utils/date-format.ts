import type { IDateTimeFormat } from "../types/dateTimeTypes";


export const formatDateTime = (timeStamp: number, dateFormat: IDateTimeFormat) => {
    try {
        // Check if timeStamp is null or less than 0
        if (timeStamp < 0) { throw new Error('timeStamp cannot be negative.') }
        if (timeStamp == null) { throw new Error('timeStamp cannot be null.') }

        // Convert timeStamp to date object (includes leading zeros)
        let date = new Date(timeStamp);
        let dateStrip = date.toUTCString().split(' ');

        let dateObj = {
            year: dateStrip[3],
            month: {
                monthStr: dateStrip[2],
                monthInt: ('0' + (date.getMonth() + 1)).slice(-2),
            },
            day: {
                dayStr: dateStrip[0].slice(0, -1),
                dayInt: dateStrip[1],
            },
            time: dateStrip[4]
        };

        let dateComplex = `${dateObj.year}-${dateObj.month.monthInt}-${dateObj.day.dayInt} ${dateObj.time}`;
        let dateClean = `${dateObj.day.dayStr} ${dateObj.month.monthStr} ${dateObj.day.dayInt} ${dateObj.year} ${dateObj.time} UTC`;

        // Slice date-time string according to dateFormat
        switch (dateFormat) {
            case ("yyyy-mm-dd hh:mm:ss"):
                return dateComplex;
            case ("yy-mm-dd hh:mm:ss"):
                return dateComplex.slice(2,);
            case ("yyyy-mm-dd hh:mm"):
                return dateComplex.slice(0, -3);
            case ("yy-mm-dd hh:mm"):
                return dateComplex.slice(2, -3);
            case ("Day Month Date Year hh:mm:ss UTC"):
                return dateClean;
            case ("Month Date Year hh:mm"):
                return dateClean.slice(4, -7);
            default:
                throw new Error('Invalid dateFormat.');
        }

    } catch (e) {
        console.log(e);
        return e;
    }
};

export const dateTimeToMillisecondUnix = (dateTime: string) => {
    if (!dateTime) {
      throw new Error('dateTime is required');
    }
  
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid dateTime');
    }
  
    return parsedDate.getTime();
  };
  
  export const millisecondUnixToDateTime = (millisecondUnix: number) => {
    if (!millisecondUnix && millisecondUnix !== 0) {
      throw new Error('millisecondUnix is required');
    }
  
    const parsedDate = new Date(millisecondUnix);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid millisecondUnix');
    }
  
    return parsedDate.toUTCString();
  };
  