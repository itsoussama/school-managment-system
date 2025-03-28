import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { getResource } from "@src/pages/shared/utils/api";
import { useTranslation } from "react-i18next";
import { SkeletonContent, SkeletonProfile } from "@src/components/skeleton";
import { InfoField } from "@src/pages/shared/components/info";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ViewResourceModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewResourceModal({
  modal,
  onClose,
}: ViewResourceModalProps) {
  const { t } = useTranslation();

  const getResourceQuery = useQuery({
    queryKey: ["getResource", modal?.id],
    queryFn: () => getResource(modal?.id as number),
    enabled: !!modal?.id,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <>
      <Modal
        show={modal?.type === "view" ? modal?.open : false}
        size={"3xl"}
        theme={customModal}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <b> {getResourceQuery.data?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getResourceQuery.data?.imagePath
                    ? SERVER_STORAGE + getResourceQuery.data?.imagePath
                    : `https://ui-avatars.com/api/?background=random&name=${getResourceQuery.data?.label}`
                }
                className="h-40 w-40"
              />
            </div>
            <div className="box-border flex w-full flex-col gap-6">
              <div className="w-full">
                <h1 className="mb-2 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.resource_information")}
                </h1>
                <SkeletonContent isLoaded={getResourceQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.label")}
                      value={getResourceQuery.data?.label}
                    />

                    <InfoField
                      label={t("form.fields.quantity")}
                      value={getResourceQuery.data?.qty}
                    />

                    <InfoField
                      label={t("form.fields.category")}
                      value={getResourceQuery.data?.categories.label}
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
