import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@remix-run/react';
import {gsap} from 'gsap';

export function Loading() {
  const ctx = useRef(null);
  const loaderBar = useRef(null);
  const loadEnded = useRef(false);
  const fetcher = useNavigation();
  const finishLoad = useRef(null);
  const startLoad = useRef(null);
  const restart = useRef(null);
  useEffect(() => {
    ctx.current = gsap.context(() => {
      restart.current = gsap.to(loaderBar.current, {width: 0, duration: 0});
      startLoad.current = gsap.timeline();
      startLoad.current
        .fromTo(
          loaderBar.current,
          {opacity: 1, width: 0},
          {opacity: 1, duration: 0.12, width: '10%'},
        )
        .to(loaderBar.current, {width: '15%', duration: 0.1})
        .to(loaderBar.current, {width: '25%', duration: 0.4})
        .to(loaderBar.current, {width: '30%', duration: 10});
      finishLoad.current = gsap.timeline();
      finishLoad.current
        .fromTo(
          loaderBar.current,
          {width: '30%'},
          {width: '100%', duration: 0.3},
        )
        .to(loaderBar.current, {opacity: 0, duration: 0.2})
        .to(loaderBar.current, {width: 0, duration: 0});
    });

    return () => ctx.current.revert();
  }, []);

  useEffect(() => {
    startLoad.current.pause(0);
    if (fetcher.state == 'idle' && loadEnded.current == true) {
      startLoad.current.pause(0)
      loadEnded.current = false;
      finishLoad.current.play(0);
    } else if (fetcher.state == 'loading') {
      startLoad.current.play(0);
      loadEnded.current = true;
    }
  }, [fetcher]);

  return (
    <div className="w-full h-[10px] fixed top-0 left-0 z-[100]">
      <div ref={loaderBar} className={`text-center h-full bg-pink-300 w-0`}></div>
    </div>
  );
}
