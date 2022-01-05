import { useCallback, useState } from 'react';

const INITIAL_STATE = {
  count: 0,
  countTotal: 0,
  isClicked: false,
};

const MAXIMUM_USER_CLAP = 50;

export const useClapState = (initialState = INITIAL_STATE) => {
  const [clapState, clapStateSet] = useState(initialState);

  const clapStateUpdate = useCallback(() => {
    clapStateSet(({ count, countTotal }) => ({
      count: Math.min(count + 1, MAXIMUM_USER_CLAP),
      countTotal: count < MAXIMUM_USER_CLAP ? countTotal + 1 : countTotal,
      isClicked: true,
    }));
  }, [clapStateSet]);

  return [clapState, clapStateUpdate];
};
