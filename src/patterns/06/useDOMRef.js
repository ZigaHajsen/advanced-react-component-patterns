import { useState, useCallback } from 'react';

export const useDOMRef = () => {
  const [DOMRef, DOMRefSet] = useState({});

  const setRef = useCallback((node) => {
    DOMRefSet((prevState) => ({
      ...prevState,
      [node.dataset.refkey]: node,
    }));
  }, []);

  return [DOMRef, setRef];
};
