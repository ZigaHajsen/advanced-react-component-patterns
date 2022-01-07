import { useCallback, useState, useRef } from 'react';
import { usePrevious } from './usePrevious';

const INITIAL_STATE = {
  count: 0,
  countTotal: 0,
  isClicked: false,
};

const MAXIMUM_USER_CLAP = 50;

const callFnsInSequence =
  (...fns) =>
  (...args) => {
    fns.forEach((fn) => fn && fn(...args));
  };

export const useClapState = (initialState = INITIAL_STATE) => {
  const initialStateRef = useRef(initialState);

  const [clapState, clapStateSet] = useState(initialState);

  const clapStateUpdate = useCallback(() => {
    clapStateSet(({ count, countTotal }) => ({
      count: Math.min(count + 1, MAXIMUM_USER_CLAP),
      countTotal: count < MAXIMUM_USER_CLAP ? countTotal + 1 : countTotal,
      isClicked: true,
    }));
  }, [clapStateSet]);

  const getTogglerProps = ({ onClick, ...otherProps } = {}) => ({
    onClick: callFnsInSequence(clapStateUpdate, onClick),
    'aria-pressed': clapState.isClicked,
    ...otherProps,
  });

  const getCounterProps = ({ ...otherProps }) => ({
    count: clapState.count,
    'aria-valuemax': MAXIMUM_USER_CLAP,
    'aria-valuemin': 0,
    'aria-valuenow': clapState.count,
    ...otherProps,
  });

  const prevCount = usePrevious(clapState.count);

  const resetRef = useRef(0);
  const reset = useCallback(() => {
    if (prevCount !== clapState.count) {
      clapStateSet(initialStateRef.current);
      resetRef.current++;
    }
  }, [clapStateSet, prevCount, clapState.count]);

  return {
    clapState,
    clapStateUpdate,
    getTogglerProps,
    getCounterProps,
    reset,
    resetDep: resetRef.current,
  };
};
