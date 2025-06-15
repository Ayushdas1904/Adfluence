"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import dashboard from "@/public/dashboard.png"; // Adjust the path as necessary


export default function DemoScroll() {
  return (
    <div className="flex flex-col overflow-hidden mt-[-380px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Insights Into Our <br />
              <span className="text-4xl md:text-[6rem] font-bold  leading-none">
                DASHBOARD
              </span>
            </h1>

          </>
        }
      >
        <Image
          src={dashboard}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
