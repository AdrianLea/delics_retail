import {React, useState, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap} from 'gsap';
import {TextPlugin} from 'gsap/TextPlugin';

import {Link} from '~/components';

function Slider({images, className}) {
  const currentIndex = useRef(0);
  const slidesRef = useRef(null);
  const clicked = useRef(0);
  const ctx = useRef(null);
  const anims = useRef([]);
  const [slideButton, changeButton] = useState(0);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => (touchEnd.current = e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) {
      clicked.current = true;
      clickFunction(
        currentIndex.current - 1 >= 0
          ? currentIndex.current - 1
          : urls.length - 1,
      );
    } else if (isLeftSwipe) {
      clicked.current = true;
      clickFunction(
        currentIndex.current + 1 < urls.length ? currentIndex.current + 1 : 0,
      );
    }
  };

  // Build a stable list of slide items from collection nodes
  const nodes = images?.collections?.nodes ?? [];
  const items = [];

  for (let idx = 0; idx < nodes.length; idx++) {
    const node = nodes[idx];
    if (!node) continue;

    const mfs = Array.isArray(node.metafields)
      ? node.metafields.filter(Boolean)
      : [];
    const getMf = (key) => mfs.find((m) => m && m.key === key);

    const desktop = getMf('herodesktop')?.reference?.image?.url;
    const mobile = getMf('heromobile')?.reference?.image?.url ?? desktop; // fallback to desktop
    const headerText = getMf('herodescriptiontext')?.value ?? '';
    const buttonText = getMf('herobuttontext')?.value ?? '';
    const link = node.onlineStoreUrl ?? '';
    const id = node.id;

    const orderRaw = getMf('sliderordernumber')?.value;
    let order = undefined;
    if (orderRaw != null && orderRaw !== '') {
      const parsed = parseInt(orderRaw, 10);
      if (!Number.isNaN(parsed)) order = parsed;
    }

    if (desktop) {
      items.push({
        desktop,
        mobile,
        headerText,
        buttonText,
        link,
        id,
        order,
        originalIndex: idx,
      });
    }
  }

  // Sort by numeric order; items without order go to the end preserving original index
  items.sort((a, b) => {
    const aKey =
      typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY;
    const bKey =
      typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY;
    if (aKey !== bKey) return aKey - bKey;
    return a.originalIndex - b.originalIndex;
  });

  const urls = items.map((it) => [
    it.desktop,
    it.mobile,
    it.headerText,
    it.buttonText,
    it.link,
    it.id,
  ]);

  useEffect(() => {
    ctx.current = gsap.context((self) => {
      gsap.registerPlugin(TextPlugin);
      const slide = gsap.utils.toArray('.slide');
      const links = gsap.utils.toArray('.information-holder');
      const text = links.map((link) => link.querySelector('.header'));
      const button = links.map((link) => link.querySelector('.link'));
      anims.current = slide.map((slide, i) => {
        let tl = gsap.timeline({
          reversed: i === 0 ? false : true,
          defaults: {duration: 1, delay: 0.7},
        });
        tl.fromTo(
          slide,
          {
            opacity: 0,
            display: 'none',
          },
          {
            opacity: 1,
            display: 'block',
            duration: 0.3,
          },
          0,
        );
        tl.to(
          text[i],
          {
            opacity: 1,
            y: -40,
            display: 'block',
            duration: 0.6,
            text: {
              value: urls[i][2],
            },
          },
          0.5,
        );
        tl.to(
          button[i],
          {
            opacity: 1,
            y: -30,
            display: 'block',
            duration: 0.6,
          },
          0.5,
        );
        return tl;
      });
    }, slidesRef);
    anims.current[0].play(0.8);
    return () => ctx.current.revert();
  }, []);

  const clickFunction = (index) => {
    if (index != currentIndex.current) {
      anims.current[currentIndex.current].progress(1);
      anims.current[index].progress(0);
      anims.current[index].delay(0.7);
      anims.current[currentIndex.current].delay(0);
      anims.current[currentIndex.current].reversed(1);
      anims.current[index].play(0);
      currentIndex.current = index;
      changeButton(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (clicked.current === true) {
        clearInterval(interval);
      }
      if (currentIndex.current < urls.length - 1 && clicked.current != true) {
        clickFunction(currentIndex.current + 1);
      } else if (clicked.current != true) {
        clickFunction(0);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [urls.length]);

  return (
    <section
      className={`slides ${className}`}
      ref={slidesRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {urls.map((element, index) => (
        <div key={`info-${element[5]}`}>
          <div
            id={index}
            className={`slide h-full w-full absolute opacity-0 hidden`}
          >
            <Image
              className={`opacity-70 w-full h-full overflow-hidden object-cover relative hidden lg:block`}
              src={element[0]}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 100vw"
            ></Image>
            <Image
              className={`opacity-70 w-full h-full overflow-hidden object-cover relative lg:hidden`}
              src={element[1]}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 100vw"
            ></Image>
            <div
              className={`information-holder absolute -translate-y-[50%] top-[50%] md:translate-y-0 md:top-[80%] md:left-[10%] font-mono left-[50%] -translate-x-[50%] md:translate-x-0 w-full`}
            >
              <div
                className={`header hidden font-bold opacity-0 w-fit font-inclusiveSans md:text-xl text-white bg-none m-auto md:m-0 text-[1.7rem] text-center md:normal-case uppercase`}
              ></div>
              <Link
                className={`link hidden bg-transparent text-white md:font-bold md:text-black md:border border-b-2 border-white md:bg-pink-200 opacity-0 w-fit h-auto py-1 md:px-5 px-0 text-center font-sans md:text-2xl justify-center md:hover:bg-transparent md:hover:text-pink-200 md:hover:border md:border-pink-200 m-auto md:m-0 rounded-sm shadow-md`}
                key={element[5]}
                to={new URL(element[4]).pathname}
                prefetch="intent"
              >
                {element[3]}
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 items-center justify-center -translate-y-[25px] w-full top-full absolute overflow-hidden ">
        {urls.map((element, index) => (
          <button
            key={`urls-${element[0]}`}
            onClick={() => {
              clicked.current = true;
              clickFunction(index);
            }}
          >
            <svg height="12" width="12">
              <circle
                cx="6"
                cy="6"
                r="5"
                stroke="white"
                strokeWidth="2"
                fill="white"
                fillOpacity={slideButton === index ? 1 : 0}
                id={index}
              />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Slider;
