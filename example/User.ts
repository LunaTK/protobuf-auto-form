// Original file: example/example.proto

import type { UserDetail as _UserDetail, UserDetail__Output as _UserDetail__Output } from './UserDetail';

export interface User {
  'userId'?: (number);
  'name'?: (string);
  'friends'?: (number)[];
  'detail'?: (_UserDetail | null);
}

export interface User__Output {
  'userId'?: (number);
  'name'?: (string);
  'friends'?: (number)[];
  'detail'?: (_UserDetail__Output);
}
