import { FaPen } from "react-icons/fa";
import { colorPalette } from "../../utils/chart";
import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "@src/components/dropdown";
import { colors } from "../../utils/colors";

interface InfoCardType {
  index: number;
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InfoCard({
  index,
  title,
  onEdit,
  onDelete,
}: InfoCardType) {
  const handleColorSequence = (index: number) => {
    const styles = {
      primary: colorPalette[colors[index % colors.length]][700],
      secondary: colorPalette[colors[index % colors.length]][600],
    };

    return styles;
  };
  return (
    <div
      className={`flex w-80 min-w-60 flex-col overflow-hidden rounded-xs text-white`}
    >
      <div
        className={`flex flex-row items-center justify-between px-4 py-2`}
        style={{ backgroundColor: handleColorSequence(index).primary }}
      >
        <h1 className="text-lg font-semibold">{title}</h1>
        {/* <FaPen /> */}
        <Dropdown element={<BsThreeDotsVertical />} width="max-content">
          <Dropdown.List>
            <Dropdown.Item>
              <span className="cursor-pointer" onClick={onEdit}>
                Edit
              </span>
            </Dropdown.Item>
            <Dropdown.Item>
              <span className="cursor-pointer" onClick={onDelete}>
                Delete
              </span>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </div>
      <div
        className={`flex h-full flex-row p-4`}
        style={{ backgroundColor: handleColorSequence(index).secondary }}
      >
        <div className="flex flex-col">
          <span className="text-gray-100">Groups</span>
          <span>4</span>
        </div>
      </div>
    </div>
  );
}
