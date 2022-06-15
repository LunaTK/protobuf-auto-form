export interface OverriddenFieldProps<T = any> {
  value: T
  onChange: (newValue: T) => void
  /**
   * Index of repeated or map field
   */
  index?: number
}
