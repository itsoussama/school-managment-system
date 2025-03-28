import {
  customBadge,
  customModal,
  customToggleSwitch,
} from "@src/utils/flowbite";
import { Badge, Modal, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@src/pages/shared/utils/api";
import { useTranslation } from "react-i18next";
import { SkeletonContent, SkeletonProfile } from "@src/components/skeleton";
import {
  formatCurrency,
  formatUserName,
} from "@src/pages/shared/utils/formatters";
import {
  getColor,
  payementStatus,
} from "@src/pages/shared/utils/colorIndicators";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import BlockAdministratorModal from "./blockTeacherModal";
import { InfoField } from "@src/pages/shared/components/info";
import { badgeColor } from "@src/utils/colors";
import { Grade, Subject } from "../viewTeachers";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ViewTeacherModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewTeacherModal({
  modal,
  onClose,
}: ViewTeacherModalProps) {
  // const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>();
  const [openModal, setOpenModal] = useState<Modal>();
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  const getTeacherQuery = useQuery({
    queryKey: ["getTeacher", modal?.id, "teacher"],
    queryFn: () => getUser(modal?.id as number, "teacher"),
    enabled: !!modal?.id,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <>
      <BlockAdministratorModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <Modal
        show={modal?.type === "view" ? modal?.open : false}
        size={"3xl"}
        theme={customModal}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {/* {t("form.fields.id", { entity: t("entities.teachers") })}: */}
          <b> {getTeacherQuery.data?.teacher?.ref}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getTeacherQuery.data?.imagePath
                    ? SERVER_STORAGE + getTeacherQuery.data?.imagePath
                    : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getTeacherQuery.data?.name).firstName}+${formatUserName(getTeacherQuery.data?.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("status.active_deactivate")}
                </span>
                <ToggleSwitch
                  theme={customToggleSwitch}
                  checked={Boolean(getTeacherQuery.data?.blocked)}
                  color={brandState}
                  onChange={() =>
                    setOpenModal({
                      id: getTeacherQuery.data?.id,
                      type: "block",
                      open: true,
                    })
                  }
                />
              </div>
            </div>
            <div className="box-border flex w-full flex-col gap-6">
              <div className="w-full">
                <h1 className="mb-2 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.personal_information")}
                </h1>
                <SkeletonContent isLoaded={getTeacherQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.first_name")}
                      value={
                        formatUserName(getTeacherQuery.data?.name).firstName
                      }
                    />

                    <InfoField
                      label={t("form.fields.last_name")}
                      value={
                        formatUserName(getTeacherQuery.data?.name).lastName
                      }
                    />

                    <InfoField
                      label={t("form.fields.email")}
                      value={getTeacherQuery.data?.email}
                    />

                    <InfoField
                      label={t("form.fields.phone_number")}
                      value={getTeacherQuery.data?.phone}
                    />

                    <InfoField
                      label={t("form.fields.address")}
                      value={getTeacherQuery.data?.teacher?.address}
                      fullSpan
                    />
                  </div>
                </SkeletonContent>
                <h1 className="mb-2 mt-6 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.academic_information")}
                </h1>
                <SkeletonContent isLoaded={getTeacherQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.subjects")}
                      valueStyle="flex flex-row w-max max-w-48 flex-wrap"
                      value={getTeacherQuery.data?.subjects.map(
                        (subject: Subject, index: number) => (
                          <Badge
                            key={index}
                            color={badgeColor[index % badgeColor.length]}
                            className="mb-1 me-1 rounded-xs"
                          >
                            {subject.name}
                          </Badge>
                        ),
                      )}
                    />
                    <InfoField
                      label={t("form.fields.grade_levels")}
                      valueStyle="flex flex-row w-max max-w-48 flex-wrap"
                      value={getTeacherQuery.data?.grades.map(
                        (grade: Grade, index: number) => (
                          <Badge
                            key={index}
                            color={badgeColor[index % badgeColor.length]}
                            className="mb-1 me-1 rounded-xs"
                          >
                            {grade.label}
                          </Badge>
                        ),
                      )}
                    />
                    <InfoField
                      label={t("form.fields.start_date")}
                      value="2024/01/01"
                    />
                  </div>
                </SkeletonContent>
                <h1 className="mb-2 mt-6 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.payroll_information")}
                </h1>
                <SkeletonContent isLoaded={getTeacherQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.payment_frequency")}
                      value={getTeacherQuery.data?.payroll?.payroll_frequency}
                    />
                    <InfoField
                      label={t("form.fields.net_salary")}
                      value={
                        formatCurrency(
                          getTeacherQuery.data?.payroll?.net_salary,
                        ).value
                      }
                    />
                    <InfoField
                      label={t("form.fields.status")}
                      value={
                        <Badge
                          theme={customBadge}
                          color={getColor(
                            getTeacherQuery.data?.payroll?.payment_status,
                            payementStatus,
                          )}
                        >
                          {getTeacherQuery.data?.payroll?.payment_status}
                        </Badge>
                      }
                    />
                    <InfoField
                      label={t("form.fields.pay_date")}
                      value={getTeacherQuery.data?.payroll?.pay_date}
                    />
                  </div>
                </SkeletonContent>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
