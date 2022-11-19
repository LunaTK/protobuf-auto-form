// Original file: example/example.proto

import type { ArticleType as _ArticleType } from './ArticleType';

export interface Comment {
  'author'?: (string);
  'content'?: (string);
  's1'?: (string);
  'type'?: (_ArticleType | keyof typeof _ArticleType);
  'something'?: "s1"|"type";
}

export interface Comment__Output {
  'author'?: (string);
  'content'?: (string);
  's1'?: (string);
  'type'?: (_ArticleType);
}
