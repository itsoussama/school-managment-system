type AlertStatus = "idle" | "success" | "fail"
export interface Alert {
    status: AlertStatus,
      message: string,
    state: boolean
  }

  export type AlertColor = AlertStatus;
  
  const alertIntialState: Alert = {
    status: "idle",
    message: "",
    state: false,
  };

  export {alertIntialState}