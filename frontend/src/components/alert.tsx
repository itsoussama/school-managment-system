import { Toast } from "flowbite-react";
import { MdThumbUp } from "react-icons/md";
import ReactDOM from "react-dom";
import {
  AlertColor,
  alertIntialState,
  Alert as AlertUtil,
} from "@src/admin/utils/alert";
import { FaXmark } from "react-icons/fa6";
import { useCallback, useEffect } from "react";

interface AlertProps {
  duration: number;
  status: string;
  state: boolean;
  title: string;
  description: string;
  close: (props: AlertUtil) => void;
}

const alertUi = {
  idle: {
    style: "",
    icon: "",
  },
  success: {
    style: "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300",
    icon: <MdThumbUp className="h-5 w-5" />,
  },
  fail: {
    style: "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300",
    icon: <FaXmark className="h-5 w-5" />,
  },
};

export default function Alert({
  duration = 5000,
  status,
  state,
  title,
  description,
  close,
}: AlertProps) {
  const resetAlert = useCallback(() => {
    close(alertIntialState);
  }, [close]);

  useEffect(() => {
    const alertTimeOut = setTimeout(resetAlert, duration);
    return () => {
      clearTimeout(alertTimeOut);
    };
  }, [state, duration, resetAlert]);

  return ReactDOM.createPortal(
    state && (
      <Toast className="fixed right-0 top-0 z-50 m-5 overflow-hidden border border-gray-300 dark:border-gray-700">
        <div className="absolute left-0 top-0 h-0.5 w-full rounded-lg bg-gray-300 dark:bg-gray-600">
          <div
            className={`absolute left-0 top-0 h-full w-0 animate-[fill_${duration}ms_ease-in-out_forwards] bg-gray-400 dark:bg-white`}
          ></div>
        </div>
        <div className="flex items-start">
          <div
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alertUi[status as AlertColor].style}`}
          >
            {alertUi[status as AlertColor].icon}
          </div>
          <div className="ml-3 text-sm font-normal">
            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </span>
            <div className="mb-2 text-sm font-normal">{description}</div>
            <div className="flex gap-2"></div>
          </div>
          <Toast.Toggle
            className="absolute right-0 top-0 m-2"
            onDismiss={() => close(alertIntialState)}
          />
        </div>
      </Toast>
    ),
    document.body,
  );
}
