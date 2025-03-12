import twSize from "@src/utils/size";
import { HTMLAttributes } from "react";

interface MetricProps {
  children: React.ReactNode;
  additionalStyle?: string;
}
interface MetricElementsProps extends MetricProps {
  size?: string;
}

const Metric = ({ children }: MetricProps) => (
  <div className="flex flex-col gap-y-1">{children}</div>
);

Metric.Title = ({ children, size = "base" }: MetricElementsProps) => {
  const getSize = () => twSize[size as keyof typeof twSize];
  return (
    <h3
      className={`text-gray-600 dark:text-gray-300`}
      style={{ fontSize: getSize() }}
    >
      {children}
    </h3>
  );
};
Metric.Value = ({
  children,
  size = "base",
  additionalStyle,
}: MetricElementsProps) => {
  const getSize = () => twSize[size as keyof typeof twSize];
  return (
    <p
      className={`font-semibold text-gray-900 dark:text-white ${additionalStyle}`}
      style={{ fontSize: getSize() }}
    >
      {children}
    </p>
  );
};

const MetricCard = ({ children }: MetricProps) => (
  <div className="metric-card">{children}</div>
);

MetricCard.Icon = ({ children }: MetricProps) => (
  <div className="icon">{children}</div>
);
MetricCard.Content = ({ children }: MetricProps) => (
  <div className="content">{children}</div>
);
MetricCard.Title = ({ children }: { children: React.ReactNode }) => (
  <h3>{children}</h3>
);
MetricCard.Value = ({ children }: { children: React.ReactNode }) => (
  <p>{children}</p>
);

export { Metric, MetricCard };
