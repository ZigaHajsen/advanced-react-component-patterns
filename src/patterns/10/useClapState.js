import { useCallback, useState, useRef, useReducer } from 'react';
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

const internalReducer = ({ count, countTotal }, { type, payload }) => {
  switch (type) {
    case 'clap':
      return {
        count: Math.min(count + 1, MAXIMUM_USER_CLAP),
        countTotal: count < MAXIMUM_USER_CLAP ? countTotal + 1 : countTotal,
        isClicked: true,
      };
    case 'reset':
      return payload;
    default:
      break;
  }
};

export const useClapState = (
  initialState = INITIAL_STATE,
  reducer = internalReducer
) => {
  const initialStateRef = useRef(initialState);

  const [clapState, dispatch] = useReducer(reducer, initialState);

  const clapStateUpdate = () => {
    dispatch({ type: 'clap' });
  };

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
      dispatch({ type: 'reset', payload: initialStateRef.current });
      resetRef.current++;
    }
  }, [dispatch, prevCount, clapState.count]);

  return {
    clapState,
    clapStateUpdate,
    getTogglerProps,
    getCounterProps,
    reset,
    resetDep: resetRef.current,
  };
};

useClapState.reducer = internalReducer;
useClapState.types = { clap: 'clap', reset: 'reset' };
