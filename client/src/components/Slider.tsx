"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const sliderImages = [
  "/forex-background.jpg",
  "/forex-background-2.jpg",
];

export function Slider() {
  const plugin = React.useMemo(
    () => Autoplay({ delay: 2000, stopOnInteraction: false }),
    []
  );

  return (
    <Carousel
      plugins={[plugin]}
      opts={{
        loop: true,
      }}
      className="w-full h-full absolute inset-0 z-[-1] overflow-hidden"
    >
      <CarouselContent className="h-full -ml-0">
        {sliderImages.map((image, index) => (
          <CarouselItem key={index} className="pl-0 h-full w-full">
            <div className="relative w-full h-full min-h-[480px] sm:min-h-[520px] lg:min-h-[600px]">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}