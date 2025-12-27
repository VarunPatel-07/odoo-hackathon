import React, { useCallback, useRef } from "react";

export const useDebounce = (callback, delay = 500) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const naiveDebounce = useCallback((func, delayMs, ...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      func(...args);
    }, delayMs);
  }, []);

  return React.useMemo(
    () =>
      (...args) =>
        naiveDebounce(callbackRef.current, delay, ...args),
    [delay, naiveDebounce]
  );
};
