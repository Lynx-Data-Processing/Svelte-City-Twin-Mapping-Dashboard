export const getListOfObjectWhereKeyContainsString = (listOfObjects: any[], key: string, value: string) => {
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

export const getObjectsWhereKeyEqualsValue = (listOfObjects: any[], key: string, value: string) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });
  return filteredList;
};

export const checkIfElementExists = (listOfObjects: any[], key: string, value: string) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });
  if (filteredList.length >= 1) {
    return true;
  }
  return false;
};

export const removeObjectWhereValueEqualsString = (listOfObjects: any[], key: string, value: string) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey !== value;
  });
  return filteredList;
};
