"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import macbook from '@/public/macbook.png'

export default function MacbookScroll() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={ref} className="relative flex justify-center items-center">
      {/* MacBook Frame */}
      <div className="relative w-[99vw] h-[700px] rounded-[30px] overflow-hidden shadow-lg bg-black">
        {/* Animated Scrollable Screen */}
        <motion.div
          style={{ y: translateY }}
          className="absolute top-0 left-0 w-full"
        >
          <Image
            src= {macbook}
            alt="Scrolling Window"
            className="object-fill w-[80vw] h-[700px] "
          />
        </motion.div>
      </div>
    </div>
  );
}
