import { IAttribute } from '../../types'

export function getAttributeErrorMessage<T extends keyof IAttribute>(key: T, value: IAttribute[T]): string {
  if (key === 'name' && !value) {
    return 'Name cannot be empty'
  }

  if (key === 'weight' && Number(value) < 1) {
    return 'Weight must be greater than 0'
  }

  return ''
}
