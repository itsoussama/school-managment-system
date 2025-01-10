import { Toast } from "flowbite-react";
import ReactDOM from "react-dom";
import {
  AlertColor,
  alertIntialState,
  Alert as AlertUtil,
} from "@src/utils/alert";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import React, { useCallback, useEffect, useMemo } from "react";

const ALERT_DURATION = import.meta.env.VITE_ALERT_DURATION;

interface AlertUI {
  [key: string]: {
    style: {
      base?: string;
      content?: string;
      dismiss?: string;
    };
    icon: React.ReactElement | "";
  };
}

interface AlertProps {
  id: number;
  status: string;
  state: boolean;
  message: string;
  close: (props: AlertUtil) => void;
}

const alertUi: AlertUI = {
  idle: {
    style: {},
    icon: "",
  },
  success: {
    style: {
      base: "!bg-green-200 dark:border-green-900 dark:!bg-green-800",
      content: "text-green-700 dark:text-green-200",
      dismiss: "text-green-400 dark:text-green-300",
    },
    icon: (
      <FaCircleCheck className="h-4 w-4 text-green-600 dark:text-green-200" />
    ),
  },
  fail: {
    style: {
      base: "!bg-red-200 dark:border-red-900 dark:!bg-red-800",
      content: "text-red-700 dark:text-red-100",
      dismiss: "text-red-400 dark:text-red-300",
    },
    icon: <FaCircleXmark className="h-4 w-4 text-red-600 dark:text-red-300" />,
  },
};

export default function Alert({
  id,
  status,
  state,
  message,
  close,
}: AlertProps) {
  const alertId = useMemo(() => id, [id]);
  useEffect(() => {
    if (alertId) {
      console.log("alert ", alertId);
    }
    const alertTimeOut = setTimeout(() => {
      close(alertIntialState);
    }, ALERT_DURATION);
    return () => {
      clearTimeout(alertTimeOut);
    };
  }, [alertId, close]);

  return ReactDOM.createPortal(
    state && (
      <Toast
        key={id}
        theme={{
          toggle: {
            base: "",
            icon: alertUi[status as AlertColor].style.dismiss,
          },
        }}
        className={`fixed right-1/2 top-0 z-50 mt-5 w-auto animate-slide-in overflow-hidden border p-3 ${alertUi[status as AlertColor].style.base} `}
        style={{ translate: "50% 0" }}
      >
        {/* <div
          className={`absolute left-0 top-0 h-0.5 w-full rounded-lg bg-gray-300 dark:bg-gray-600`}
        >
          <div
            className={`absolute left-0 top-0 h-full w-0 animate-[fill_7s_ease-in-out_both] bg-gray-400 dark:bg-white`}
          ></div>
        </div> */}
        <div className="flex items-center">
          <div
            className={`inline-flex shrink-0 items-center justify-center rounded-s`}
          >
            {alertUi[status as AlertColor].icon}
          </div>
          <div
            className={`ml-3 mr-12 text-sm font-normal ${alertUi[status as AlertColor].style.content}`}
          >
            {message}
          </div>
          <Toast.Toggle
            className=""
            onDismiss={() => close(alertIntialState)}
          />
        </div>
      </Toast>
    ),
    document.body,
  );
}
