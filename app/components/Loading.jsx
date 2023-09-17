import React, { useEffect,useRef } from 'react';
import {useFetcher, useNavigation} from '@remix-run/react';

export function Loading() {
  const fetcher = useFetcher();
  useEffect(() => {
    console.log(fetcher.state)
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load("/cart");
    }
  }, [fetcher]);

  fetcher.data; // the data from the loader

  return (
    <div className="w-full h-[30px] absolute top-0 left-0 z-[100]">
      <div className="text-center w-full h-full">{fetcher.state}</div>
    </div>
  );
}
