import { UseFormWatch } from 'react-hook-form';

export interface OverriddenFieldProps<T = any> {
  watch: UseFormWatch<T>
  value: T
  onChange: (newValue: T) => void
  /**
   * Index of repeated or map field
   */
  index?: number
  /**
   * Canonical field name
   */
  name: string
}
