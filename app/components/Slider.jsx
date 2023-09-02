import {React, useState, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {gsap} from 'gsap';


function Slider({images, className}) {
  const [currentIndex, changeIndex] = useState(0);
  const [isVisible, setVisible] = useState(true);
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
  let changeImage = (index) => {
    let lastindex = currentIndex

    setVisible(false);
    setTimeout(() => {
      changeIndex(index);
      setVisible(true);
    }, 250);
  };
  return (
    <div className={className}>
      {urls.map((element, index) => (
        <div
          className={`${
            index === currentIndex ? '' : 'hidden '
          }h-full w-full absolute`}
          key={index}
        >
          <Image
            className={`${
              isVisible && index === currentIndex ? 'opacity-70 ' : 'opacity-0 '
            } "w-full h-full overflow-hidden transition-opacity duration-500 ease-in object-cover relative hidden lg:block`}
            src={element[0]}
            loading="lazy"
          ></Image>
          <Image
            className={`${
              isVisible && index === currentIndex ? 'opacity-70 ' : 'opacity-0 '
            }w-full h-full overflow-hidden transition-opacity ease-in duration-500 object-cover relative lg:hidden`}
            src={element[1]}
            loading="lazy"
          ></Image>
        </div>
      ))}
      <div className="flex items-center justify-center -translate-y-[25px] w-full top-full relative overflow-hidden ">
        {urls.map((element, index) => (
          <button key={index} onClick={() => changeImage(index)}>
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
