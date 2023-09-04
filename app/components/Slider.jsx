import {React, useState, useEffect, useRef, ReactDOM} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap, Power2} from 'gsap';
import { Link } from './Link';

function Slider({images, className}) {
  const canClick = useRef(true);
  const [currentIndex, setIndex] = useState(0);
  const indexHolder = useRef(0);
  const previousIndex = useRef(-1);
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

  const divRefs = useRef(
    new Array(urls.length).map(() => React.createRef(null)),
  );
  const tl = useRef(gsap.timeline({}));

  const buttonRefs = useRef(
    new Array(urls.length).map(() => React.createRef(null)),
  );

  const textRefs = useRef(
    new Array(urls.length).map(() => React.createRef(null)),
  );
  useEffect(() => {
    let ctx = gsap.context(() => {
      console.log("buttons:",buttonRefs.current[previousIndex.current],buttonRefs.current[indexHolder.current])
      console.log("texts:",textRefs.current[previousIndex.current],textRefs.current[indexHolder.current])
      tl.current.fromTo(
        buttonRefs.current[previousIndex.current],
        {duration: 1, opacity: 1, display: 'block', ease: Power2.easeOut, yPercent: 0},
        {opacity: 0, display: 'none', yPercent: 250},
        0,
      );
      tl.current.fromTo(
        buttonRefs.current[indexHolder.current],
        {duration: 1, opacity: 0, display: 'block', yPercent: 250, ease: Power2.easeIn},
        {opacity: 1, display: 'block', yPercent: 0},
        1,
      );
      tl.current.fromTo(
        textRefs.current[previousIndex.current],
        {duration: 1, opacity: 1, display: 'block',ease: Power2.easeOut, yPercent:0},
        {opacity: 0, display: 'none', yPercent: 200},
        0,
      );
      tl.current.fromTo(
        textRefs.current[indexHolder.current],
        {duration: 1, opacity: 0, display: 'block', yPercent: 200, ease: Power2.easeIn},
        {opacity: 1, display: 'block', yPercent: 0},
        1,
      );
      tl.current.fromTo(
        divRefs.current[previousIndex.current],
        {duration: 0.8, opacity: 1, display: 'block'},
        {opacity: 0, display: 'none'},
        0.2,
      );
      tl.current.fromTo(
        divRefs.current[indexHolder.current],
        {duration: 0.8, opacity: 0, display: 'block'},
        {opacity: 1, display: 'block'},
        0.2,
      );
    });

    return () => {
      ctx.revert();
    };
  }, [indexHolder.current,previousIndex.current]);


  let clickEvent = (index) => {
    if (canClick.current === true && currentIndex != index) {
      canClick.current = false;
      previousIndex.current = currentIndex;
      indexHolder.current = index;
      setIndex(index);
      tl.current.restart();
      tl.current.play();
      setTimeout(() => {
        previousIndex.current = indexHolder.current; // changes hidden on previous elements to hidden
        canClick.current = true;
      }, 2000);
    }
  };

  return (
    <div className={className}>
      {urls.map((element, index) => (
        <div
          id={index}
          className={` text-white text-lg w-full absolute top-[80%] z-[60] flex flex-col justify-center items-center${
            index === indexHolder.current || index === previousIndex.current ? '' : ' hidden'
          }`}
          key={index}
        >
          <div ref={(el) => (textRefs.current[index] = el)} id="desctext">{index}</div>
          <div ref={(el) => (buttonRefs.current[index] = el)} id="button">Test</div>
        </div>
      ))}
      {urls.map((element, index) => (
        <div
          ref={(el) => (divRefs.current[index] = el)}
          id={index}
          className={`h-full w-full absolute ${
            index === indexHolder.current || index === previousIndex.current ? '' : ' hidden'
          }`}
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
        </div>
      ))}
      <div className="flex gap-4 items-center justify-center -translate-y-[25px] w-full top-full relative overflow-hidden  ">
        {urls.map((element, index) => (
          <button key={index} onClick={() => clickEvent(index)}>
            <svg height="12" width="12">
              <circle
                cx="6"
                cy="6"
                r="5"
                stroke="white"
                strokeWidth="2"
                fill="white"
                fillOpacity={currentIndex === index ? 1 : 0}
                id={index}
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Slider;
