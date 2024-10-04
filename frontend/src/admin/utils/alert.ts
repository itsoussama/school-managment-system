export interface Alert {
    status: string;
    duration?: number;
    message?: {
      title: string;
      description: string;
    };
    state: boolean;
  }

  export type AlertColor = "success" | "fail";
  
  const alertIntialState: Alert = {
    status: "",
    duration: 7000,
    message: {
      title: "",
      description: "",
    },
    state: false,
  };
  
  const alertColor = {
    success: "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300",
    fail: "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300",
  };
  

  export {alertIntialState, alertColor}