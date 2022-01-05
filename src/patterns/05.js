import React, {
  useState,
  useLayoutEffect,
  useCallback,
  createContext,
  useMemo,
  useContext,
  useEffect,
  useRef,
} from 'react';
import mojs from 'mo-js';

import styles from './index.css';
import userCustomStyles from './usage.css';

const initialState = {
  count: 0,
  countTotal: 0,
  isClicked: false,
};

const useClapAnimation = ({ clapElement, countElement, totalElement }) => {
  const [animationTimeline, animationTimelineSet] = useState(
    () => new mojs.Timeline()
  );

  useLayoutEffect(() => {
    if (!clapElement || !countElement || !totalElement) {
      return;
    }

    const duration = 300;
    const scaleButton = new mojs.Html({
      el: clapElement,
      duration,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out,
    });

    const clapTotalAnimation = new mojs.Html({
      el: totalElement,
      duration,
      delay: (3 * duration) / 2,
      opacity: { 0: 1 },
      y: { 0: -3 },
    });

    const clapCountAnimation = new mojs.Html({
      el: countElement,
      duration,
      opacity: { 0: 1 },
      y: { 0: -30 },
    }).then({
      opacity: { 1: 0 },
      y: -80,
      delay: duration / 2,
    });

    const triangleBurst = new mojs.Burst({
      parent: clapElement,
      radius: { 50: 95 },
      count: 5,
      angle: 30,
      children: {
        shape: 'polygon',
        radius: { 6: 0 },
        stroke: 'rgba(211,54,0,0.5)',
        strokeWidth: 2,
        angle: 210,
        delay: 30,
        speed: 0.2,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        duration,
      },
    });

    const circleBurst = new mojs.Burst({
      parent: clapElement,
      radius: { 50: 75 },
      angle: 25,
      duration,
      children: {
        shape: 'circle',
        radius: { 3: 0 },
        fill: 'rgba(149,165,166,0.5)',
        delay: 30,
        speed: 0.2,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      },
    });

    clapElement.style.transform = 'scale(1,1)';

    const newAnimationTimeline = animationTimeline.add([
      scaleButton,
      clapTotalAnimation,
      clapCountAnimation,
      triangleBurst,
      circleBurst,
    ]);
    animationTimelineSet(newAnimationTimeline);
  }, [clapElement, countElement, totalElement]);

  return animationTimeline;
};

const MediumClapContext = createContext();
const { Provider } = MediumClapContext;

const MediumClap = ({
  children,
  values = null,
  onClap,
  style: userStyles = {},
  className,
}) => {
  const MAXIMUM_USER_CLAP = 50;
  const [clapState, clapStateSet] = useState(initialState);

  const [{ clapRef, countRef, totalRef }, refsSet] = useState({});
  const setRef = useCallback((node) => {
    refsSet((prevState) => ({
      ...prevState,
      [node.dataset.refkey]: node,
    }));
  }, []);

  const animationTimeline = useClapAnimation({
    clapElement: clapRef,
    countElement: countRef,
    totalElement: totalRef,
  });
  const isControlled = !!values && onClap;
  const handleClapClick = () => {
    animationTimeline.replay();

    isControlled
      ? onClap()
      : clapStateSet(({ count, countTotal }) => ({
          count: Math.min(count + 1, MAXIMUM_USER_CLAP),
          countTotal: count < MAXIMUM_USER_CLAP ? countTotal + 1 : countTotal,
          isClicked: true,
        }));
  };

  const componentJustMounted = useRef(true);
  useEffect(() => {
    if (!componentJustMounted.current && !isControlled) {
      onClap && onClap(clapState);
    } else {
      componentJustMounted.current = false;
    }
  }, [clapState.count, isControlled, onClap]);

  const getState = useCallback(
    () => (isControlled ? values : clapState),
    [values, clapState, isControlled]
  );
  const memoizedValue = useMemo(
    () => ({ ...getState(), setRef }),
    [getState, setRef]
  );

  const classNames = [styles.clap, className].join(' ').trim();

  return (
    <Provider value={memoizedValue}>
      <button
        ref={setRef}
        data-refkey='clapRef'
        className={classNames}
        onClick={handleClapClick}
        style={userStyles}
      >
        {children}
      </button>
    </Provider>
  );
};

const Icon = ({ style: userStyles = {}, className }) => {
  const { isClicked } = useContext(MediumClapContext);

  const classNames = [styles.icon, isClicked ? styles.checked : '', className]
    .join(' ')
    .trim();

  return (
    <span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='-549 338 100.1 125'
        className={classNames}
        style={userStyles}
      >
        <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
        <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
      </svg>
    </span>
  );
};

const Count = ({ style: userStyles = {}, className }) => {
  const { count, setRef } = useContext(MediumClapContext);

  const classNames = [styles.count, className].join(' ').trim();

  return (
    <span
      ref={setRef}
      data-refkey='countRef'
      className={classNames}
      style={userStyles}
    >
      + {count}
    </span>
  );
};

const Total = ({ style: userStyles = {}, className }) => {
  const { countTotal, setRef } = useContext(MediumClapContext);

  const classNames = [styles.total, className].join(' ').trim();

  return (
    <span
      ref={setRef}
      data-refkey='totalRef'
      className={classNames}
      style={userStyles}
    >
      {countTotal}
    </span>
  );
};

MediumClap.Icon = Icon;
MediumClap.Count = Count;
MediumClap.Total = Total;

const INITIAL_STATE = {
  count: 0,
  countTotal: 2100,
  isClicked: false,
};

const MAXIMUM_CLAP_VALUE = 10;

const Usage = () => {
  const [state, stateSet] = useState(INITIAL_STATE);

  const handleClap = () => {
    stateSet(({ count, countTotal }) => ({
      count: Math.min(count + 1, MAXIMUM_CLAP_VALUE),
      countTotal: count < MAXIMUM_CLAP_VALUE ? countTotal + 1 : countTotal,
      isClicked: true,
    }));
  };

  return (
    <div style={{ width: '100%' }}>
      <MediumClap
        values={state}
        onClap={handleClap}
        className={userCustomStyles.clap}
      >
        <MediumClap.Icon className={userCustomStyles.icon} />
        <MediumClap.Count className={userCustomStyles.count} />
        <MediumClap.Total className={userCustomStyles.total} />
      </MediumClap>
      <MediumClap
        values={state}
        onClap={handleClap}
        className={userCustomStyles.clap}
      >
        <MediumClap.Icon className={userCustomStyles.icon} />
        <MediumClap.Count className={userCustomStyles.count} />
        <MediumClap.Total className={userCustomStyles.total} />
      </MediumClap>
    </div>
  );
};

export default Usage;