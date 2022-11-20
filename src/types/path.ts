import type {
  FieldPathValue,
  FieldValues,
  IsFlatObject,
  Primitive,
} from 'react-hook-form';
import type {
  IsTuple,
  TupleKeys,
} from 'react-hook-form/dist/types/path/common';
import type { KeyId, ValueId } from './autoFormState';

type PbMap<V> =
  | {
      [key: string]: V;
    }
  | {
      [key: number]: V;
    };

type IsPbMap<T> = T extends object
  ? string extends keyof T
    ? true
    : number extends keyof T
    ? true
    : false
  : false;

type PathImpl<K extends string | number, V> = V extends Primitive
  ? `${K}`
  : `${K}` | `${K}.${Path<V>}`;

type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
      }[TupleKeys<T>]
    : PathImpl<ValueId, V>
  : IsPbMap<T> extends true
  ? T extends PbMap<infer V>
    ? KeyId | PathImpl<ValueId, V>
    : never
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>;
    }[keyof T];

export type AFFieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>;
