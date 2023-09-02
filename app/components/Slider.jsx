import {React, useState, useEffect, useRef, createRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap} from 'gsap';

function Slider({images, className}) {
  const canClick = useRef(true);
  const [currentIndex, setIndex] = useState(0);
  const testref = useRef(null)
  const previousIndex = useRef(0);
  var urls = []

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
  const tl = useRef(gsap.timeline({paused: true}));

  useEffect(() => {
    console.log(divRefs.current);
    let ctx = gsap.context(() => {
      tl.current.fromTo(
        divRefs.current[previousIndex.current],
        {duration: 1, opacity: 1, display: 'block'},
        {opacity: 0, display: 'none'},
      );
      tl.current.fromTo(
        divRefs.current[currentIndex],
        {duration: 1, opacity: 0, display: 'block'},
        {opacity: 1, display: 'block'},
      );
    });
  }, [currentIndex]);

  useEffect(() => {
    canClick === true ? '' : tl.current.play();
  }, [canClick]);

  let clickEvent = (index) => {
    console.log(canClick.current)
    if (canClick.current === true && currentIndex != index) {
      console.log('clicked')
      previousIndex.current = currentIndex;
      setIndex(index);
      canClick.current = false;
      setTimeout(() => {
        canClick.current = true;
      }, 2000);
    }
  };

  return (
    <div className={className}>
      {urls.map((element, index) => (
        <div
          ref={(el) => (divRefs.current[index] = el)}
          id={index}
          className={`h-full w-full absolute`}
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
