import { customProgress } from "@src/utils/flowbite";
import { Progress } from "flowbite-react";

interface ProgressWithLabelProps {
  progress: number;
  reverse?: boolean;
}

const ProgressWithStatus = ({ progress, reverse }: ProgressWithLabelProps) => {
  const statusColor = reverse
    ? progress <= 50
      ? "green"
      : progress < 90
        ? "yellow"
        : "red"
    : progress <= 25
      ? "red"
      : progress < 40
        ? "yellow"
        : "green";
  const progressPosition =
    progress == 0 ? "0%" : progress < 100 ? "-50%" : "-100%";
  return (
    <div className="relative h-full w-full translate-y-3/4">
      {/* Progress Bar */}
      <Progress
        progress={progress}
        size="sm"
        color={statusColor}
        className="w-full"
        theme={customProgress}
      />
      {/* Progress Label */}
      <span
        className="absolute top-1/2 -translate-y-1/2 transform text-sm text-gray-900 dark:text-white"
        style={{
          left: `${progress}%`,
          transform: `translate(${progressPosition}, -135%)`,
        }}
      >
        {progress}%
      </span>
    </div>
  );
};

export default ProgressWithStatus;
