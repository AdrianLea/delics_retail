import {React, useState, useEffect, useRef, useLayoutEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap} from 'gsap';

import {Text, Link} from '~/components';

function Slider({images, className}) {
  const canClick = useRef(true);
  const currentIndex = useRef(0);
  const slidesRef = useRef(null);
  const clicked = useRef(0);
  const ctx = useRef(null);
  const anims = useRef([]);
  const [slideButton, changeButton] = useState(0);
  var urls = [];

  for (let i = 0; i < images.collections.nodes.length + 1; i++) {
    if (
      images.collections.nodes[i] !== undefined &&
      images.collections.nodes[i].metafields[0] !== null
    ) {
      let node = images.collections.nodes[i];
      urls.push([
        node.metafields[0].reference.image.url,
        node.metafields[1].reference.image.url,
      ]);
    }
  }
  urls.reverse();

  useLayoutEffect(() => {
    ctx.current = gsap.context((self) => {
      const slide = gsap.utils.toArray('.slide');
      const links = gsap.utils.toArray('.information-holder');
      const text = links.map((link) => link.querySelector('.header'));
      const button = links.map((link) => link.querySelector('.link'));
      anims.current = slide.map((slide, i) => {
        let tl = gsap.timeline({
          reversed: i === 0 ? false : true,
          defaults: {duration: 1, delay: 0.7},
        });
        tl.to(
          slide,
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
          },
          0.5,
        );
        tl.to(
          button[i],
          {
            opacity: 1,
            y: -20,
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
    if (canClick.current === true) {
      canClick.current = false;
      changeButton(index);
      anims.current[index].delay(0.8);
      anims.current[currentIndex.current].delay(0);
      anims.current[currentIndex.current].reversed(true);
      anims.current[index].reversed(false);
      currentIndex.current = index;
      setTimeout(() => {
        canClick.current = true;
      }, 1100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (clicked.current === true) {
        clearInterval(interval);
      }
      if (currentIndex.current < urls.length - 1 && clicked.current != true) {
        clickFunction(currentIndex.current + 1);
      } else if (currentIndex.current != true) {
        clickFunction(0);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`slides ${className}`} ref={slidesRef}>
      {urls.map((element, index) => (
        <>
          <div
            id={index}
            className={`slide h-full w-full absolute opacity-0 hidden`}
            key={index}
          >
            <Image
              className={`opacity-70 w-full h-full overflow-hidden object-cover relative hidden lg:block`}
              src={element[0]}
              loading="lazy"
            ></Image>
            <Image
              className={`opacity-70 w-full h-full overflow-hidden object-cover relative lg:hidden`}
              src={element[1]}
              loading="lazy"
            ></Image>
            <div
              className={`information-holder absolute top-[80%] left-[10%]`}
              key={index}
            >
              <h2 className={`header hidden bg-white opacity-0 p-1`}>
                Lorem ipsum dolor sit amet,
              </h2>
              <Link
                className={`link hidden bg-white opacity-0 w-auto h-auto p-2 text-center font-sans text-lg font-bold justify-center`}
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </>
      ))}
      <div className="flex gap-4 items-center justify-center -translate-y-[25px] w-full top-full relative overflow-hidden ">
        {urls.map((element, index) => (
          <button
            key={index}
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
