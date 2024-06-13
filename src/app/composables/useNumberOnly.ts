export function useNumberOnly(e: KeyboardEvent) {
  if (e.key.length === 1 && isNaN(Number(e.key))) {
    e.preventDefault();
  }
}