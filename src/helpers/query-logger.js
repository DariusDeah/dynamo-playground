import colors from "colors";
export const startQueryTimeLogger = (opteration) => console.time(opteration);
export const queryTimeLogger = (operation) =>
  console.timeLog(operation, "--estimated time".yellow);
