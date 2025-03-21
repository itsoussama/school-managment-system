import { colorPalette } from "@utils/chart";
import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "@src/components/dropdown";
import { colors } from "@utils/colors";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

interface InfoCardProps {
  index: number;
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

function InfoCard({ index, title, children, onEdit, onDelete }: InfoCardProps) {
  const { t } = useTranslation();
  const [closeDropDown, setCloseDropDown] = useState(false);
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
        <Dropdown
          additionalStyle={{
            containerStyle:
              "cursor-pointer rounded-full p-1 hover:bg-white hover:bg-opacity-10",
          }}
          close={closeDropDown}
          element={<BsThreeDotsVertical size={16} />}
          width="auto"
        >
          <Dropdown.List>
            <Dropdown.Item>
              <span
                className="cursor-pointer"
                onClick={() => (onEdit?.(), setCloseDropDown(true))}
              >
                {t("general.edit")}
              </span>
            </Dropdown.Item>
            <Dropdown.Item>
              <span
                className="cursor-pointer"
                onClick={() => (onDelete?.(), setCloseDropDown(true))}
              >
                {t("general.delete")}
              </span>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </div>
      <div
        className={`flex h-full flex-row gap-3 p-4`}
        style={{ backgroundColor: handleColorSequence(index).secondary }}
      >
        {children}
      </div>
    </div>
  );
}

InfoCard.Metric = function Metric({
  title,
  value,
}: {
  title: string;
  value: unknown;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-100">{title}</span>
      <span>{`${value}`}</span>
    </div>
  );
};

interface InfoFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  containerStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
  fullSpan?: boolean;
}

function InfoField({
  label,
  value,
  fullSpan,
  containerStyle,
  labelStyle,
  valueStyle,
}: InfoFieldProps) {
  return (
    <div
      className={`flex flex-col gap-y-1 ${fullSpan ? "col-span-full w-full" : ""} ${containerStyle}`}
    >
      <span
        className={`text-sm font-semibold text-gray-800 dark:text-gray-400 ${labelStyle}`}
      >
        {label}:
      </span>
      <span className={`text-base text-gray-900 dark:text-white ${valueStyle}`}>
        {value}
      </span>
    </div>
  );
}

export { InfoField, InfoCard };
