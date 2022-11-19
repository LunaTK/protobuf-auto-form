export type KeyId = '$key';
export type ValueId = '$value';
export type RepeatId = KeyId | ValueId;

export type RepeatedElement<T = unknown> = {
  $value: T;
};

export type MapElement<K = string, V = unknown> = {
  $key: K;
  $value: V;
};

/**
 * If T is `string | number`, returns `string`.
 * If T is `number`, returns `number`.
 *
 * This is because `keyof { [key: string]: any }` is `string | number`.
 */
type Calibrate<T extends string | number> = string extends T ? string : number;
export type AutoFormState<T extends any> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends (infer U)[]
        ? RepeatedElement<U>[]
        : T[K] extends Record<string | number, any>
        ? number extends keyof T[K]
          ? MapElement<Calibrate<keyof T[K]>, T[K][keyof T[K]]>[]
          : AutoFormState<T[K]>
        : T[K];
    }
  : T;
