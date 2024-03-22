import { type Option } from '@/components/ui/multiple-selector'

export function optionsToArray(options: Option[]) {
  if (!options || options.length === 0) return []
  return options.map(o => o.value)
}

export function arrayToOptions(array: []) {
  try {
    if (!array || Object.keys(array).length === 0 || array.length === 0) return ([] as Option[])
    return array.map(value => {
      return {
        label: value,
        value: value
      } as Option
    })
  }
  catch (error) {
    throw error
  }
}

export function stringToOptions(json: string) {
  console.log(json.replace('{', '[').replace('}', ']'))
  const array = JSON.parse(json.replace('{', '[').replace('}', ']'))
  return arrayToOptions(array)
}