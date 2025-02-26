import React from "react";

interface MetricProps {
  children: React.ReactNode;
}

const Metric = ({ children }: MetricProps) => (
  <div className="flex flex-col gap-y-0.5">{children}</div>
);

Metric.Title = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base text-gray-600 dark:text-gray-300">{children}</h3>
);
Metric.Value = ({ children }: { children: React.ReactNode }) => (
  <p className="text-3xl font-semibold text-gray-900 dark:text-white">
    {children}
  </p>
);

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
