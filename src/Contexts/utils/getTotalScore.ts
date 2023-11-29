import { IOption } from '../../types'

export function getTotalScore(option: IOption): number {
  return Object.values(option.attributes)
    .reduce((accumulatedSum, attribute) => accumulatedSum + attribute.weight * attribute.score, 0)
}
