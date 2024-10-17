import { Table } from "flowbite-react";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";

interface Image extends HTMLAttributes<HTMLDivElement> {
  imgSource: string;
}

function SkeletonProfile({ imgSource, ...attributs }: Image) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    imgRef.current?.addEventListener("load", () => {
      setLoaded(true);
    });
  }, [imgRef]);

  return (
    <div {...attributs}>
      <img
        id="profile"
        className={`${!loaded ? "hidden" : ""} h-[inherit] w-[inherit] rounded-full`}
        src={imgSource}
        alt="profile"
        ref={imgRef}
      />

      {!loaded && (
        <div
          role="status"
          className={`h-[inherit] w-[inherit] animate-pulse overflow-hidden rounded-full`}
        >
          <div
            className={`flex h-full w-full items-center justify-center bg-gray-300 dark:bg-gray-700`}
          >
            <FaImage className="h-10 w-10 text-gray-200 dark:text-gray-600" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
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

function SkeletonTable({ rows = 5, cols = 5 }) {
  return Array(rows)
    .fill(null)
    .map((_, key) => (
      <Table.Row key={key}>
        <Table.Cell className="sr-only">empty cell</Table.Cell>
        {Array(cols)
          .fill(null)
          .map((_, key) => (
            <Table.Cell key={key}>
              <div className="mb-2.5 h-5 animate-pulse rounded-s bg-gray-200 dark:bg-gray-600"></div>
            </Table.Cell>
          ))}
      </Table.Row>
    ));
}

export { SkeletonProfile, SkeletonContent, SkeletonTable };
