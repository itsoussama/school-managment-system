import { Spinner, Table } from "flowbite-react";
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
        {Array(cols)
          .fill(null)
          .map((_, key) => (
            <Table.Cell key={key}>
              <div className="mb-2.5 h-3 animate-pulse rounded-s bg-gray-200 dark:bg-gray-600"></div>
            </Table.Cell>
          ))}
      </Table.Row>
    ));
}

interface SkeletonLoadTableProps extends FCSkeletonContent {}

function SkeletonLoadTable({ isLoaded, children }: SkeletonLoadTableProps) {
  if (isLoaded) {
    return children;
  }

  return (
    <div role="status" className="relative h-full w-full">
      <div
        className={`absolute left-0 top-0 z-[50] grid h-full w-full place-items-center rounded-s bg-gray-100 bg-opacity-40 backdrop-blur-sm dark:bg-gray-800 dark:bg-opacity-60`}
      >
        <Spinner />
        <span className="sr-only">Loading...</span>
      </div>

      {children}
    </div>
  );
}

interface SkeletonMetricProps extends FCSkeletonContent {
  size?: "xs" | "sm" | "md" | "lg";
}

function SkeletonMetric({
  isLoaded,
  children,
  size = "md",
}: SkeletonMetricProps) {
  if (isLoaded) {
    return children;
  }

  const sizeToPoint = {
    xs: "5",
    sm: "7",
    md: "9",
    lg: "12",
  };

  return (
    <div
      role="status"
      className={`w-full min-w-32 h-${sizeToPoint[size]} flex animate-pulse flex-col gap-y-2`}
    >
      <div className="h-1/3 w-3/4 rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="h-2/3 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonChartProps extends FCSkeletonContent {}

function SkeletonChart({ isLoaded, children }: SkeletonChartProps) {
  if (isLoaded) {
    return children;
  }

  return (
    <div role="status" className="relative h-full w-full">
      <div
        className={`absolute left-0 top-0 z-[50] grid h-full w-full place-items-center rounded-s bg-gray-100 bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-30`}
      >
        <Spinner />
        <span className="sr-only">Loading...</span>
      </div>

      {children}
    </div>
  );
}

function SkeletonAccordion() {
  return (
    <div role="status" className="w-full animate-pulse">
      <div className="mb-4 h-12 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-4 h-12 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-4 h-12 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-4 h-12 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <div className="mb-4 h-12 w-full rounded-s bg-gray-200 dark:bg-gray-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export {
  SkeletonProfile,
  SkeletonContent,
  SkeletonTable,
  SkeletonLoadTable,
  SkeletonAccordion,
  SkeletonMetric,
  SkeletonChart,
};
