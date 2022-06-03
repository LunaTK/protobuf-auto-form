export interface OverriddenFieldProps<T = unknown> {
  value: T
  onChange: (newValue: T) => void
}
