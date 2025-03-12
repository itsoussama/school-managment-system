import { PaymentTypes } from "./colorIndicators";

function formatCurrency(value:number, type?: PaymentTypes) {
    const formatedValue = new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        currencyDisplay: "narrowSymbol"
      })

      const paymentTypeSign = (paymentType?: PaymentTypes) => {
        switch (paymentType) {
          case 'credit':
          return "+"
          case 'debit':
          return "-"
          default:
            return ""
        }
      }
    
    return {"value":paymentTypeSign(type) + formatedValue.format(value).replace('MAD', 'DH'), "currency": "DH"}
}

const dateTimeFormatter = (date: string | null) => {
    if (date !== null) {
      if (!isNaN(new Date(date).valueOf())) {
        const dateLocal: Date = new Date(date);
        const offsetDate = new Date(
          dateLocal.getTime() - dateLocal.getTimezoneOffset() * 60000,
        ); // Adjust for local timezone
        return offsetDate.toISOString().slice(0, 16);
      }
    }
    return "";
  };

export { formatCurrency, dateTimeFormatter}

