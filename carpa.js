function hasCommonElements(arr1: any[], arr2: any[]): boolean {
  return new Set(new Set(...arr1), ...arr2).size < [...arr1, ...arr2].length;
}

const arr1 = [2, 5, 1, 34, 61, 1];
const arr2 = [3, 3, 9, 88, 60, 8];
