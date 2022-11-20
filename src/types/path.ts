import type { FieldValues, Primitive } from 'react-hook-form';
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

export type Path<T> = T extends ReadonlyArray<infer V>
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

type PathValue<T, P extends Path<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends ValueId
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, R & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends ValueId
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never;

export type AFFieldPathValue<
  TFieldValues extends FieldValues,
  TFieldPath extends AFFieldPath<TFieldValues>,
> = PathValue<TFieldValues, TFieldPath>;
