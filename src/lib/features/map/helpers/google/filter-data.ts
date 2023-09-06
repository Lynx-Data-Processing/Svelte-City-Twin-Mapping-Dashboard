

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
