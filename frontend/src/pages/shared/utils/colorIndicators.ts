import { BsTriangleFill } from "react-icons/bs";
import { FaCircle, FaDiamond } from "react-icons/fa6";

export type States = "completed" | "in_progress" | "pending";

const states = {
  completed: "green",
  in_progress: "blue",
  pending: "orange",
};

export type Priorities = "low" | "medium" | "high";

const priorities = {
  low: { color: "blue", icon: FaCircle },
  medium: { color: "yellow", icon: BsTriangleFill },
  high: { color: "red", icon: FaDiamond },
};

export type PaymentStatus = "paid" | "unpaid" | "pending";

const payementStatus = {
  paid: "green",
  unpaid: "yellow",
  pending: "orange",
}

export type PaymentTypes = "credit" | "debit";

const paymentTypes = {
  credit: "green",
  debit: "red",
}

export type FeeStatus = 'paid'| 'pending'| 'overdue';

const feeStatus = {
  paid: "green",
  pending: "yellow",
  overdue: "red",
}

function getColor<T extends string>(value: T, options: Record<T, string>) {
  return (options[value as T])
}

export {getColor, states, priorities, feeStatus, payementStatus, paymentTypes}