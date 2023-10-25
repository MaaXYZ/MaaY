export function useThrottle<T extends (...args: any[]) => void>(
  callback: (...args: Parameters<T>) => void,
  delay = 1000
): typeof callback {
  let shouldWait = false
  return (...args) => {
    if (shouldWait) {
      return
    }
    callback(...args)
    shouldWait = true
    setTimeout(() => {
      shouldWait = false
    }, delay)
  }
}
