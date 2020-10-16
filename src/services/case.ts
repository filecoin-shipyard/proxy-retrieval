import * as camelcaseKeys from 'camelcase-keys'

export const toJSCase = (obj) => {
  return camelcaseKeys(obj, { deep: true })
}
