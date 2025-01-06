type AlertStatus = "idle" | "success" | "fail"
export interface Alert {
  id: number,
    status: AlertStatus,
      message: string,
    state: boolean
  }

  export type AlertColor = AlertStatus;
  
  const alertIntialState: Alert = {
    id: 0,
    status: "idle",
    message: "",
    state: false,
  };

  export {alertIntialState}