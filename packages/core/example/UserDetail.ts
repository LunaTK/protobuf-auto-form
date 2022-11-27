// Original file: example/example.proto

import type { SomeInner as _SomeInner, SomeInner__Output as _SomeInner__Output } from './SomeInner';

export interface UserDetail {
  'address'?: (string);
  'role'?: (_SomeInner | null);
}

export interface UserDetail__Output {
  'address'?: (string);
  'role'?: (_SomeInner__Output);
}
