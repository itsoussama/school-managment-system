import { customModal, customToggleSwitch } from "@src/utils/flowbite";
import { Badge, Modal, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@src/pages/shared/utils/api";
import { useTranslation } from "react-i18next";
import { SkeletonContent, SkeletonProfile } from "@src/components/skeleton";
import { formatUserName } from "@src/pages/shared/utils/formatters";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import BlockStudentModal from "./blockStudentModal";
import { InfoField } from "@src/pages/shared/components/info";
import { badgeColor } from "@src/utils/colors";
import { Grade, Subject } from "../viewStudents";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import AddParentModal from "@src/pages/shared/components/addParentModal";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ParentModal {
  id: number;
  school_id: string;
  open: boolean;
}

interface ViewStudentModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewStudentModal({
  modal,
  onClose,
}: ViewStudentModalProps) {
  const [openModal, setOpenModal] = useState<Modal>();
  const [openParentModal, setOpenParentModal] = useState<ParentModal>({
    id: 0,
    school_id: "",
    open: false,
  });
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const navigate = useNavigate();

  const getStudentQuery = useQuery({
    queryKey: ["getStudent", modal?.id, "student"],
    queryFn: () => getUser(modal?.id as number, "student"),
    enabled: !!modal?.id,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <>
      <BlockStudentModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <AddParentModal
        open={openParentModal?.open as boolean}
        toggleOpen={(isOpen: boolean) =>
          setOpenParentModal((prev: ParentModal) => ({
            id: openParentModal?.id as number,
            school_id: prev?.school_id,
            open: isOpen,
          }))
        }
        child_id={openParentModal.id}
        school_id={openParentModal?.school_id}
      />

      <Modal
        show={modal?.type === "view" ? modal?.open : false}
        size={"3xl"}
        theme={customModal}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <b> {getStudentQuery.data?.student?.ref}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getStudentQuery.data?.imagePath
                    ? SERVER_STORAGE + getStudentQuery.data?.imagePath
                    : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getStudentQuery.data?.name).firstName}+${formatUserName(getStudentQuery.data?.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("status.active_deactivate")}
                </span>
                <ToggleSwitch
                  theme={customToggleSwitch}
                  checked={Boolean(getStudentQuery.data?.blocked)}
                  color={brandState}
                  onChange={() =>
                    setOpenModal({
                      id: getStudentQuery.data?.id,
                      type: "block",
                      open: true,
                    })
                  }
                />
              </div>
            </div>
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full">
                <h1 className="mb-2 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.personal_information")}
                </h1>
                <SkeletonContent isLoaded={getStudentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.first_name")}
                      value={
                        formatUserName(getStudentQuery.data?.name).firstName
                      }
                    />

                    <InfoField
                      label={t("form.fields.last_name")}
                      value={
                        formatUserName(getStudentQuery.data?.name).lastName
                      }
                    />

                    <InfoField
                      label={t("form.fields.email")}
                      value={getStudentQuery.data?.email}
                    />

                    <InfoField
                      label={t("form.fields.phone_number")}
                      value={getStudentQuery.data?.phone}
                    />

                    <InfoField
                      label={t("form.fields.address")}
                      value={getStudentQuery.data?.student?.address}
                      fullSpan
                    />
                    <InfoField
                      label={t("form.fields.parent_guardian")}
                      value={
                        getStudentQuery.data?.guardian ? (
                          <div
                            className="mt-2 flex w-max cursor-pointer items-center gap-x-2 rounded-s py-2 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() =>
                              navigate("/parents/manage", {
                                state: {
                                  parent: {
                                    id: getStudentQuery.data?.guardian.id,
                                  },
                                },
                              })
                            }
                          >
                            <img
                              className="w-7 rounded-full"
                              src={
                                getStudentQuery.data?.guardian.imagePath
                                  ? SERVER_STORAGE +
                                    getStudentQuery.data?.guardian.imagePath
                                  : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getStudentQuery.data?.guardian.name).firstName}+${formatUserName(getStudentQuery.data?.guardian.name).lastName}`
                              }
                              alt="profile"
                            />
                            <span className="text-sm text-dark-primary dark:text-white">
                              {getStudentQuery.data?.guardian?.name}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                            onClick={() =>
                              setOpenParentModal({
                                id: getStudentQuery.data?.id,
                                school_id: getStudentQuery.data?.school_id,
                                open: true,
                              })
                            }
                          >
                            <FaUser className="me-2" />
                            {t("general.assign_to_parent")}
                          </div>
                        )
                      }
                    />
                  </div>
                </SkeletonContent>
                <h1 className="mb-2 mt-6 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.academic_information")}
                </h1>
                <SkeletonContent isLoaded={getStudentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.subjects")}
                      valueStyle="flex flex-row w-max max-w-48 flex-wrap"
                      value={getStudentQuery.data?.subjects.map(
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
                      value={getStudentQuery.data?.grades.map(
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
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
