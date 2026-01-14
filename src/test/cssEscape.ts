const cssEscape = (value: string): string => {
  const cssGlobal = (globalThis as { CSS?: { escape?: (input: string) => string } }).CSS;
  if (cssGlobal?.escape) {
    return cssGlobal.escape(String(value));
  }
  return String(value);
};

export default cssEscape;
