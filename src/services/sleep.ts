/**
 * Waits for `ms` milliseconds
 * @param  {number} ms Milliseconds
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
