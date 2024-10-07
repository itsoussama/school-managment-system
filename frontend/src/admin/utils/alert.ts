type AlertStatus = "idle" | "success" | "fail"
export interface Alert {
    status: AlertStatus;
    message: {
      title: string,
      description: string
    }
    state: boolean;
  }

  export type AlertColor = AlertStatus;

  export const alertDuration = 7000
  
  const alertIntialState: Alert = {
    status: "idle",
    message: {
      title: '',
      description: ''
    },
    state: false,
  };

  export {alertIntialState}