import { ReactNode, useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";

interface Image {
  imgSource: string;
  imgSize: {
    width: string;
    height: string;
  };
}

function SkeletonProfile({ imgSource, imgSize }: Image) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    imgRef.current?.addEventListener("load", () => {
      setLoaded(true);
    });
  }, [imgRef]);

  return (
    <>
      <img
        id="profile"
        className={`max-${imgSize.width} ${!loaded ? "hidden" : ""} rounded-full`}
        src={imgSource}
        alt="profile"
        ref={imgRef}
      />

      {!loaded && (
        <div
          role="status"
          className={`${imgSize.width} ${imgSize.height} animate-pulse overflow-hidden rounded-full`}
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

// type Status = "idle" | "fetching" | "loading" | "refetching";
interface FCSkeletonContent {
  isLoaded: boolean;
  children: ReactNode;
}

function SkeletonContent({ isLoaded = false, children }: FCSkeletonContent) {
  return !isLoaded ? (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-4 h-2.5 w-48 rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-2.5 h-2 max-w-[360px] rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-2.5 h-2 rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-2.5 h-2 max-w-[330px] rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-2.5 h-2 max-w-[300px] rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="h-2 max-w-[360px] rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    children
  );
}

export { SkeletonProfile, SkeletonContent };
