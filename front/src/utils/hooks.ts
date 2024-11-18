import { useCallback, useEffect } from "preact/hooks";

export const useEvent = (eventName: string, handler: (e: Event) => void) => {
  const add = useCallback((element: HTMLElement) => {
    element.addEventListener(eventName, handler);
  }, [])
  const remove = (element: HTMLElement) => {
    element.removeEventListener(eventName, handler);
  }
  return [add, remove]
}
