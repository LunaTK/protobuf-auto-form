// Original file: example/example.proto

import type { ArticleType as _ArticleType } from './ArticleType';
import type { Comment as _Comment, Comment__Output as _Comment__Output } from './Comment';
import type { UserDetail as _UserDetail, UserDetail__Output as _UserDetail__Output } from './UserDetail';

export interface Article {
  'title'?: (string);
  'type'?: (_ArticleType | keyof typeof _ArticleType);
  'content'?: (string);
  'tags'?: (string)[];
  'nickname'?: (string);
  'userId'?: (number);
  'referrers'?: ({[key: string]: number});
  'comments'?: (_Comment)[];
  'detail'?: (_UserDetail | null);
  '_content'?: "content";
  'author'?: "nickname"|"userId";
}

export interface Article__Output {
  'title'?: (string);
  'type'?: (_ArticleType);
  'content'?: (string);
  'tags'?: (string)[];
  'nickname'?: (string);
  'userId'?: (number);
  'referrers'?: ({[key: string]: number});
  'comments'?: (_Comment__Output)[];
  'detail'?: (_UserDetail__Output);
}
