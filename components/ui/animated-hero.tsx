'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Roboto_Mono } from "next/font/google";


const robotoMonoBold = Roboto_Mono({ subsets: ["latin"], weight: ["700"] });


function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["DISCOVER", "CONNECT", "COLLABORATE"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (

    <div className="flex gap-4 flex-col">
      <h1 className="flex flex-col gap-8 text-5xl md:text-7xl tracking-tighter text-center font-regular ">
        <span className={`text-spektr-cyan-50 ${robotoMonoBold.className} `}>A Brand & Creator Collaboration Company</span>
        <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
          &nbsp;
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute font-semibold text-indigo-600"
              initial={{ opacity: 0, y: "-100" }}
              transition={{ type: "spring", stiffness: 50 }}
              animate={
                titleNumber === index
                  ? {
                    y: 0,
                    opacity: 1,
                  }
                  : {
                    y: titleNumber > index ? -150 : 150,
                    opacity: 0,
                  }
              }
            >
              {title}
            </motion.span>
          ))}
        </span>
      </h1>

    </div>
  );
}

export { Hero };
