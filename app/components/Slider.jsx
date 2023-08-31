import React from 'react';
import {Image,parseGid} from '@shopify/hydrogen';


function Slider({images}) {
  return (
    <div className='w-10 h-10'>
      {images.collections.nodes.map((collection) =>(
        collection.metafields && collection.metafields[1] ? (
          console.log(collection.metafields[1].url)
        ) : (console.log(collection))
      ))}

      Hello
    </div>
  );
}

export default Slider;
