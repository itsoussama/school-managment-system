import { FaPen } from "react-icons/fa";

export default function InfoCard() {
  // const colors
  return (
    <div className="flex w-80 min-w-60 flex-col overflow-y-hidden rounded-xs bg-gray-700 text-white">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold">Grade</h1>
        <FaPen />
      </div>
      <div className="from-gray-650 flex flex-row bg-gradient-to-t to-gray-600 p-4">
        <div className="flex flex-col">
          <span className="text-gray-100">Groups</span>
          <span>4</span>
        </div>
      </div>
    </div>
  );
}
