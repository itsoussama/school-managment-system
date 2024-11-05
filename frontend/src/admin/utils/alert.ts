type AlertStatus = "idle" | "success" | "fail"
export interface Alert {
    status: AlertStatus,
    message: {
      title: string,
      description: string | Array<string>
    }
    state: boolean
  }

  export type AlertColor = AlertStatus;
  
  const alertIntialState: Alert = {
    status: "idle",
    message: {
      title: '',
      description: ''
    },
    state: false,
  };

  export {alertIntialState}