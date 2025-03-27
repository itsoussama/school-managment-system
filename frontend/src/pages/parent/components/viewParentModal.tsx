import { customModal, customToggleSwitch } from "@src/utils/flowbite";
import { Modal, ToggleSwitch } from "flowbite-react";
import { CSSProperties, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@src/pages/shared/utils/api";
import { useTranslation } from "react-i18next";
import { SkeletonContent, SkeletonProfile } from "@src/components/skeleton";
import { formatUserName } from "@src/pages/shared/utils/formatters";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import BlockParentModal from "./blockParentModal";
import { InfoField } from "@src/pages/shared/components/info";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { Childrens } from "../viewParents";
import { FaUser } from "react-icons/fa";
import Dropdown from "@src/components/dropdown";
import AddChildModal from "@src/pages/shared/components/addChildModal";
import { useNavigate } from "react-router-dom";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ChildModal {
  id: number;
  school_id: string;
  open: boolean;
}

interface ViewParentModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewParentModal({
  modal,
  onClose,
}: ViewParentModalProps) {
  const [openModal, setOpenModal] = useState<Modal>();
  const [openChildModal, setOpenChildModal] = useState<ChildModal>({
    id: 0,
    school_id: "",
    open: false,
  });
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const navigate = useNavigate();

  const getParentQuery = useQuery({
    queryKey: ["getParent", modal?.id, "parent"],
    queryFn: () => getUser(modal?.id as number, "parent"),
    enabled: !!modal?.id,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <>
      <BlockParentModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <AddChildModal
        open={openChildModal?.open as boolean}
        toggleOpen={(isOpen: boolean) =>
          setOpenChildModal((prev: ChildModal) => ({
            id: openChildModal?.id as number,
            school_id: prev?.school_id,
            open: isOpen,
          }))
        }
        guardian_id={openChildModal.id}
        school_id={openChildModal?.school_id}
      />

      <Modal
        show={modal?.type === "view" ? modal?.open : false}
        size={"3xl"}
        theme={customModal}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <b> {getParentQuery.data?.parent?.ref}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getParentQuery.data?.imagePath
                    ? SERVER_STORAGE + getParentQuery.data?.imagePath
                    : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getParentQuery.data?.name).firstName}+${formatUserName(getParentQuery.data?.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("status.active_deactivate")}
                </span>
                <ToggleSwitch
                  theme={customToggleSwitch}
                  checked={Boolean(getParentQuery.data?.blocked)}
                  color={brandState}
                  onChange={() =>
                    setOpenModal({
                      id: getParentQuery.data?.id,
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
                <SkeletonContent isLoaded={getParentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.first_name")}
                      value={
                        formatUserName(getParentQuery.data?.name).firstName
                      }
                    />

                    <InfoField
                      label={t("form.fields.last_name")}
                      value={formatUserName(getParentQuery.data?.name).lastName}
                    />

                    <InfoField
                      label={t("form.fields.email")}
                      value={getParentQuery.data?.email}
                    />

                    <InfoField
                      label={t("form.fields.phone_number")}
                      value={getParentQuery.data?.phone}
                    />

                    <InfoField
                      label={t("form.fields.address")}
                      value={getParentQuery.data?.parent?.address}
                      fullSpan
                    />
                  </div>
                </SkeletonContent>
                <h1 className="mb-2 mt-6 rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.children_information")}
                </h1>
                <SkeletonContent isLoaded={getParentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-6">
                    <InfoField
                      label={t("form.fields.children")}
                      valueStyle="flex flex-row w-max max-w-48 flex-wrap"
                      value={
                        <>
                          <Dropdown
                            triggerEvent="hover"
                            additionalStyle={{
                              containerStyle: "!w-auto",
                              dropdownStyle: "z-50",
                            }}
                            width="auto"
                            element={
                              <div className="flex items-center gap-x-2">
                                {getParentQuery.data?.childrens.length > 2 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {getParentQuery.data?.childrens?.map(
                                      (children: Childrens, key: number) =>
                                        key < 2 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                            src={
                                              children?.imagePath
                                                ? SERVER_STORAGE +
                                                  children?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${formatUserName(children?.name).firstName}+${formatUserName(children?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                    <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-50 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500">
                                      {`+${getParentQuery.data?.childrens.length - 2}`}
                                    </div>
                                  </div>
                                ) : getParentQuery.data?.childrens.length >
                                  1 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {getParentQuery.data?.childrens?.map(
                                      (children: Childrens, key: number) =>
                                        key < 2 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                            src={
                                              children?.imagePath
                                                ? SERVER_STORAGE +
                                                  children?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${formatUserName(children?.name).firstName}+${formatUserName(children?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                  </div>
                                ) : (
                                  getParentQuery.data?.childrens?.length ==
                                    1 && (
                                    <>
                                      <img
                                        className="h-7 w-7 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                        src={
                                          getParentQuery.data?.childrens[0]
                                            ?.imagePath
                                            ? SERVER_STORAGE +
                                              getParentQuery.data?.childrens[0]
                                                ?.imagePath
                                            : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getParentQuery.data?.childrens[0]?.name).firstName}+${formatUserName(getParentQuery.data?.childrens[0]?.name).lastName}`
                                        }
                                        alt="profile"
                                      />
                                      <span className="pointer-events-none text-black dark:text-white">
                                        {
                                          getParentQuery.data?.childrens[0]
                                            ?.name
                                        }
                                      </span>
                                    </>
                                  )
                                )}
                              </div>
                            }
                          >
                            <Dropdown.List>
                              {getParentQuery.data?.childrens.map(
                                (children: Childrens, key: number) => (
                                  <Dropdown.Item
                                    key={key}
                                    img={
                                      children.imagePath
                                        ? SERVER_STORAGE + children.imagePath
                                        : `https://ui-avatars.com/api/?background=random&name=${formatUserName(children.name).firstName}+${formatUserName(children.name).lastName}`
                                    }
                                    onClick={() =>
                                      navigate("/students/manage", {
                                        state: {
                                          child: {
                                            id: children.id,
                                          },
                                        },
                                      })
                                    }
                                  >
                                    {children.name}
                                  </Dropdown.Item>
                                ),
                              )}
                            </Dropdown.List>
                            <Dropdown.Button>
                              <p
                                onClick={() =>
                                  setOpenChildModal({
                                    id: getParentQuery.data?.id,
                                    school_id: getParentQuery.data?.school_id,
                                    open: true,
                                  })
                                }
                              >
                                {t("actions.add_entity", {
                                  entity: t("general.child"),
                                })}
                              </p>
                            </Dropdown.Button>
                          </Dropdown>
                          {getParentQuery.data?.childrens?.length < 1 && (
                            <div
                              className="flex cursor-pointer items-center text-sm font-medium text-[var(--brand-color-600)] hover:underline dark:text-[var(--brand-color-500)]"
                              style={
                                {
                                  "--brand-color-500":
                                    colorPalette[brandState as BrandColor][500],
                                  "--brand-color-600":
                                    colorPalette[brandState as BrandColor][600],
                                } as CSSProperties
                              }
                              onClick={() =>
                                setOpenChildModal({
                                  id: getParentQuery.data?.id,
                                  school_id: getParentQuery.data?.school_id,
                                  open: true,
                                })
                              }
                            >
                              <FaUser className="me-2" />
                              {t("actions.add_entity", {
                                entity: t("general.child"),
                              })}
                            </div>
                          )}
                        </>
                      }
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
