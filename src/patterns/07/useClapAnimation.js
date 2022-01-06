import { useState, useLayoutEffect } from 'react';
import mojs from 'mo-js';

export const useClapAnimation = ({
  clapElement,
  countElement,
  totalElement,
}) => {
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
