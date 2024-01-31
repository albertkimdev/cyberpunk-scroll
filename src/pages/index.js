import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const images = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
    "/img6.jpg",
    "/img7.jpg",
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
    "/img6.jpg",
    "/img7.jpg",
  ];

  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const [ease, setEase] = useState(0.075);
  const [maxScroll, setMaxScroll] = useState(0);

  const slider = useRef();
  const sliderWrapper = useRef();
  const slides = useRef([]);
  const requestRef = useRef();

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const updateScaleAndPosition = () => {
    if (!slides.current || typeof window === "undefined") return;
    slides.current.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const centerPosition = (rect.left + rect.right) / 2;
      const distanceFromCenter = centerPosition - window.innerWidth / 2;

      let scale, offsetX;

      if (distanceFromCenter > 0) {
        scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
        offsetX = (scale - 1) * 300;
      } else {
        scale = Math.max(
          0.5,
          1 - Math.abs(distanceFromCenter) / window.innerWidth
        );
        offsetX = 0;
      }

      gsap.set(slide, { scale, x: offsetX });
    });
  };

  const update = () => {
    const newCurrent = lerp(current, target, ease);
    setCurrent(newCurrent);

    gsap.set(sliderWrapper.current, {
      x: -newCurrent,
    });

    updateScaleAndPosition();
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (sliderWrapper.current) {
      setMaxScroll(sliderWrapper.current.offsetWidth - window.innerWidth);
    }
  }, [sliderWrapper]);

  useEffect(() => {
    const handleWheel = (e) => {
      let newTarget = target + e.deltaY;
      newTarget = Math.max(0, newTarget);
      newTarget = Math.min(maxScroll, newTarget);
      setTarget(newTarget);
    };
    window.addEventListener("wheel", handleWheel);

    window.addEventListener("resize", () => {
      setMaxScroll(sliderWrapper.current.offsetWidth - window.innerWidth);
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [target, maxScroll]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [current, target]);

  return (
    <main className="w-full h-full techno-charm">
      {/* sidebar */}
      <div
        className="flex w-[100vh] py-[1.5em] px-[3em]"
        style={{
          transform: "rotate(-90deg) translate(-100%, 0)",
          transformOrigin: "left top",
        }}
      >
        {/* sidebar item */}
        <div className="flex-[2]">
          <p className="uppercase text-[7.5rem] leading-[85%] mb-[4rem] font-techno-charm">
            Cyber
            <br />
            Punk
          </p>
          <p>Explore the computer</p>
        </div>

        {/* sidebar item */}
        <div className="flex-[2] flex gap-[6em]">
          <p className="font-thin">Scolling experience</p>
        </div>
      </div>

      {/* slider */}
      <div ref={slider} className="w-full h-full overflow-hidden">
        <div
          ref={sliderWrapper}
          className="absolute top-0 w-[8000px] px-[600px] py-0 h-full flex items-center gap-[100px]"
        >
          {images.map((img, i) => (
            <div
              ref={(el) => (slides.current[i] = el)}
              className="w-[400px] h-[500px] bg-[#e3e3e3]"
              key={i}
            >
              <img className="w-full h-full object-cover" src={img} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
