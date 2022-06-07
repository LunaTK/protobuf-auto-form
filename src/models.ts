export interface OverriddenFieldProps<T = any> {
  value: T
  onChange: (newValue: T) => void
}
