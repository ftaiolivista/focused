export const id = x => x;
export const konst = x => _ => x;

export function curry2(f) {
  return a => b => f(a, b);
}

export function curry3(f) {
  return a => b => c => f(a, b, c);
}

export function curry4(f) {
  return a => b => c => d => f(a, b, c, d);
}
