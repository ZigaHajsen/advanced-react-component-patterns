import { useRef, useEffect } from 'react';

export const useEffectAfterMount = (callback, dependencies) => {
  const componentJustMounted = useRef(true);

  useEffect(() => {
    if (!componentJustMounted.current) {
      return callback();
    } else {
      componentJustMounted.current = false;
    }
  }, dependencies);
};
