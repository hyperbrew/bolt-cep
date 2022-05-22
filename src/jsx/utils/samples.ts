export const helloError = (str: string) => {
  // Intentional Error for Error Handling Demonstration
  //@ts-ignore
  str = strr;
};

export const helloStr = (str: string) => {
  alert(`AE got a string: ${str}`);
  return str;
};
export const helloNum = (n: number) => {
  alert(`AE got a number: ${n.toString()}`);
  return n;
};
export const helloArrayStr = (arr: string[]) => {
  alert(`AE got an array of ${arr.length} strings: ${arr.toString()}`);
  return arr;
};
export const helloObj = (obj: { height: number; width: number }) => {
  alert(`AE got an object: ${JSON.stringify(obj)}`);
  return obj;
};
