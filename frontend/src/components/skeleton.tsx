import { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";

interface Image {
  imgSource: string;
  imgSize: number;
}

function SkeletonProfile({ imgSource, imgSize }: Image) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  //   const handleImageLoad = () => {
  //     // console.log(imgRef.current);
  //   };

  useEffect(() => {
    imgRef.current?.addEventListener("load", () => {
      setLoaded(true);
    });
    // console.log(imgRef.current instanceof Element);
  }, [imgRef]);

  return (
    <>
      <img
        id="profile"
        className={`max-w-${imgSize.toString()} ${!loaded ? "hidden" : ""} rounded-full`}
        src={imgSource}
        alt="profile"
        ref={imgRef}
      />

      {!loaded && (
        <div
          role="status"
          className={`animate-pulse h-${imgSize.toString()} w-${imgSize.toString()} space-y-8 overflow-hidden rounded-full md:flex md:items-center md:space-x-8 md:space-y-0 rtl:space-x-reverse`}
        >
          <div
            className={`flex h-full w-full items-center justify-center bg-gray-300 dark:bg-gray-700`}
          >
            <FaImage className="h-10 w-10 text-gray-200 dark:text-gray-600" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  );
}

export { SkeletonProfile };
