import { Maybe, Either } from 'monet';

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
export function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

export { Maybe, Either };
