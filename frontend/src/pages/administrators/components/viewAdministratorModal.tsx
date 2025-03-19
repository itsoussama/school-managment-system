import {
  customBadge,
  customModal,
  customToggleSwitch,
} from "@src/utils/flowbite";
import { Badge, Modal, ToggleSwitch } from "flowbite-react";
import AdministratorsForm, { FormData } from "./administratorsForm";
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, setAdministrator } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
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

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface BlockSwitch {
  [key: string]: boolean;
}

interface ViewAdministratorModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewAdministratorModal({
  modal,
  onClose,
}: ViewAdministratorModalProps) {
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  const getAdministratorQuery = useQuery({
    queryKey: ["getAdministrator", modal?.id, "administrator"],
    queryFn: () => getUser(modal?.id as number, "administrator"),
    enabled: !!modal?.open,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <Modal
      show={modal?.type === "view" ? modal?.open : false}
      size={"3xl"}
      theme={customModal}
      onClose={onCloseModal}
    >
      <Modal.Header>
        {t("form.fields.id", { entity: t("entities.administrators") })}:
        <b> {modal?.id}</b>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
            <SkeletonProfile
              imgSource={
                getAdministratorQuery.data?.imagePath
                  ? SERVER_STORAGE + getAdministratorQuery.data?.imagePath
                  : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getAdministratorQuery.data?.name).firstName}+${formatUserName(getAdministratorQuery.data?.name).lastName}`
              }
              className="h-40 w-40"
            />
            <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                {t("status.active_deactivate")}
              </span>
              <ToggleSwitch
                theme={customToggleSwitch}
                checked={blockSwitch[getAdministratorQuery.data?.id] || false}
                color={brandState}
                //   onChange={() =>
                //     setOpenModal({
                //       id: getAdministratorQuery.data?.id,
                //       type: "block",
                //       open: true,
                //     })
                //   }
              />
            </div>
          </div>
          <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
            <div className="w-full space-y-3">
              <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                {t("information.personal_information")}
              </h1>
              <SkeletonContent isLoaded={getAdministratorQuery.isFetched}>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.first_name")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {
                        formatUserName(getAdministratorQuery.data?.name)
                          .firstName
                      }
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.last_name")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {
                        formatUserName(getAdministratorQuery.data?.name)
                          .lastName
                      }
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.email")}:
                    </span>
                    <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                      {getAdministratorQuery.data?.email}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.phone_number")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {getAdministratorQuery.data?.phone}
                    </span>
                  </div>
                  <div className="col-span-full flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.address")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {getAdministratorQuery.data?.administrator?.address}
                    </span>
                  </div>
                </div>
              </SkeletonContent>
              <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                {t("information.payroll_information")}
              </h1>
              <SkeletonContent isLoaded={getAdministratorQuery.isFetched}>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.payment_frequency")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {getAdministratorQuery.data?.payroll.payroll_frequency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.net_salary")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {
                        formatCurrency(
                          getAdministratorQuery.data?.payroll.net_salary,
                        ).value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.status")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      <Badge
                        theme={customBadge}
                        color={getColor(
                          getAdministratorQuery.data?.payroll.payment_status,
                          payementStatus,
                        )}
                      >
                        {getAdministratorQuery.data?.payroll.payment_status}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.pay_date")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {getAdministratorQuery.data?.payroll.pay_date}
                    </span>
                  </div>
                </div>
              </SkeletonContent>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
