export const join = (parentName: string, name: string) =>
  parentName ? `${parentName}.${name}` : name;
