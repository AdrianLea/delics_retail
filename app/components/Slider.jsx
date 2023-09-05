import {React, useState, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap, Power2, random} from 'gsap';
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
    console.log('rendered anims')
    let ctx = gsap.context(() => {
      clickEvent(0)
      tl.current.to(
        buttonRefs.current[previousIndex.current],
        {duration: 1, opacity: 0, display: 'none', ease: Power2.easeOut, yPercent: 250},
        0,
      );
      tl.current.to(
        buttonRefs.current[indexHolder.current],
        {duration: 1, display: 'block', yPercent: -250, ease: Power2.easeIn, opacity: 1},
        1,
      );
      tl.current.to(
        textRefs.current[previousIndex.current],
        {duration: 1, opacity: 0, display: 'none', ease: Power2.easeOut, yPercent: 250},
        0,
      );
      tl.current.to(
        textRefs.current[indexHolder.current],
        {duration: 1, display: 'block', yPercent: -200, ease: Power2.easeIn, opacity: 1},
        1,
      );
      tl.current.to(
        divRefs.current[previousIndex.current],
        {duration: 0.8, opacity: 0, display: 'block'},
        0.2,
      );
      tl.current.to(
        divRefs.current[indexHolder.current],
        {opacity: 1, display: 'block', duration: 0.8},
        0.2,
      );
    });
    return () => {
      ctx.revert();
    };
  });

 

  let clickEvent = (index) => {
    if (canClick.current === true && indexHolder.current != index) {

      canClick.current = false;
      previousIndex.current = indexHolder.current;
      indexHolder.current = index;
      setIndex(index);
      tl.current.restart();
      tl.current.play();
      setTimeout(() => {
        previousIndex.current = indexHolder.current; // changes hidden on previous elements to hidden
        canClick.current = true;
      }, 2100);
    }
  };

  useEffect(() => {
    console.log('startA')
    const intervalId = setInterval(() => {
      let randomIndex = 0;
      if (indexHolder.current < urls.length - 1) {
        randomIndex = indexHolder.current + 1
      }
      else{
        randomIndex = 0;
      }
      if (canClick.current === true){
        clickEvent(randomIndex);
      }

    }, 10000);

    // Clean up the interval on component unmount
    return () => {
      console.log('clean a')
      clearInterval(intervalId)};
  })

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
          <div
            ref={(el) => (textRefs.current[index] = el)}
            id="desctext"
            className={`${
              index === indexHolder.current
                ? 'translate-y-[200%] opacity-0'
                : 'opacity-100'
            }`}
          >
            {index}
          </div>
          <div
            ref={(el) => (buttonRefs.current[index] = el)}
            id="button"
            opacity={index === previousIndex.current ? 1 : 0}
            className={`${
              index === indexHolder.current
                ? 'translate-y-[250%] opacity-0'
                : 'opacity-100'
            }`}
          >
            Test
          </div>
        </div>
      ))}
      {urls.map((element, index) => (
        <div
          ref={(el) => (divRefs.current[index] = el)}
          id={index}
          className={`h-full w-full absolute ${
            index === indexHolder.current || index === previousIndex.current ? '' : ' hidden'
          } ${index === indexHolder.current ? 'opacity-0' : 'opacity-100'}`}
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
      <div className="flex gap-4 items-center justify-center -translate-y-[25px] w-full top-full relative overflow-hidden ">
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
