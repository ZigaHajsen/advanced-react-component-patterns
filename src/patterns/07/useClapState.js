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

  const togglerProps = {
    onClick: clapStateUpdate,
    'aria-pressed': clapState.isClicked,
  };

  const counterProps = {
    count: clapState.count,
    'aria-valuemax': MAXIMUM_USER_CLAP,
    'aria-valuemin': 0,
    'aria-valuenow': clapState.count,
  };

  return { clapState, clapStateUpdate, togglerProps, counterProps };
};
