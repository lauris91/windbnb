import { useEffect, useCallback } from 'react'

export const useOutsideClick = (ref, handler, ignored) => {
  const handleOutsideClick = useCallback(
    event => {
      const ignoredArr = ignored
        ? Array.isArray(ignored)
          ? ignored
          : [ignored]
        : []

      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        ignoredArr.filter(
          ref => ref.current && ref.current.contains(event.target)
        ).length
      )
        return
      handler()
    },
    [ref, ignored, handler]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleOutsideClick])
}
