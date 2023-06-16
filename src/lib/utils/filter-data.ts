export const getListOfObjectWhereKeyContainsString = (listOfObjects: any[], key: string, value: any) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey.includes(value);
  });
  return filteredList;
};

export const getObjectsWhereKeyAnyValidStrings = (listOfObjects: any[], key: string, arrayOfValidStrings: string[]) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return arrayOfValidStrings.some((validString) => objectKey.includes(validString));
  });
  return filteredList;
};

export const getObjectsWhereKeyEqualsValue = (listOfObjects: any[], key: string, value: any) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });
  return filteredList;
};

export const checkIfElementExists = (listOfObjects: any[], key: string, value: any) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });
  if (filteredList.length >= 1) {
    return true;
  }
  return false;
};

export const removeObjectWhereValueEqualsString = (listOfObjects: any[], key: string, value: any) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey !== value;
  });
  return filteredList;
};


export const getObjectWhereKeyEqualsGivenValue = (listOfObjects: any[], key: string, value: any) => {
  const filteredList = listOfObjects.filter((object) => {
    return object[key] === value;
  });
  if (filteredList.length >= 1) {
    return filteredList[0];
  }
  return null;
}

export const groupByKey = (array: any[], key: any) => {
  const groupedArray = array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
  return groupedArray;
};