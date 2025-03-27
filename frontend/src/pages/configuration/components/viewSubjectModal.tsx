import { Badge, Modal } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { getSubject } from "@src/pages/shared/utils/api";
import { useTranslation } from "react-i18next";
import { SkeletonContent } from "@src/components/skeleton";
import { InfoField } from "@src/pages/shared/components/info";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { FaUser } from "react-icons/fa6";
import { CSSProperties } from "react";
import { BrandColor, colorPalette, colors } from "@src/utils/colors";
import { Teacher } from "@src/pages/teacher/viewTeachers";
import Dropdown from "@src/components/dropdown";
import { Grades, ModalProps } from "../school/subjects";
import { formatUserName } from "@src/pages/shared/utils/formatters";
import { useNavigate } from "react-router-dom";
import { customBadge } from "@src/utils/flowbite";

interface ViewSubjectModalProps {
  modal: ModalProps;
  onClose: (isClose?: boolean) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ViewSubjectModal({
  modal,
  onClose,
}: ViewSubjectModalProps) {
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const navigate = useNavigate();

  const getSubjectQuery = useQuery({
    queryKey: ["getSubject", modal?.id],
    queryFn: () => getSubject(modal?.id as number),
    enabled: !!modal?.id,
  });

  const onCloseModal = () => {
    onClose(true);
  };

  return (
    <Modal
      show={modal?.type === "view" ? modal?.open : false}
      size={"md"}
      onClose={onCloseModal}
    >
      <Modal.Header>
        <b>{getSubjectQuery.data?.name}</b>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
            <div className="w-full space-y-3">
              <SkeletonContent isLoaded={getSubjectQuery.isFetched}>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8">
                  <InfoField
                    label={t("form.fields.subject")}
                    value={getSubjectQuery.data?.name}
                  />
                  <InfoField
                    label={t("form.fields.coefficient")}
                    value={getSubjectQuery.data?.coef}
                  />
                  <InfoField
                    label={t("form.fields.grade_level")}
                    value={
                      <div className="flex w-max max-w-48 flex-wrap gap-2">
                        {getSubjectQuery.data?.grades.map(
                          (grade: Grades, index: number) => (
                            <Badge
                              key={index}
                              theme={customBadge}
                              color={colors[index % colors.length]}
                            >
                              {grade.label}
                            </Badge>
                          ),
                        )}
                      </div>
                    }
                  />
                  <InfoField
                    label={t("entities.teachers")}
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
                              {getSubjectQuery.data?.teachers.length > 2 ? (
                                <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                  {getSubjectQuery.data?.teachers?.map(
                                    (teacher: Teacher, key: number) =>
                                      key < 2 && (
                                        <img
                                          key={key}
                                          className="h-10 w-10 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                          src={
                                            teacher?.imagePath
                                              ? SERVER_STORAGE +
                                                teacher?.imagePath
                                              : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher?.name).firstName}+${formatUserName(teacher?.name).lastName}`
                                          }
                                          alt="profile"
                                        />
                                      ),
                                  )}
                                  <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-50 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500">
                                    {`+${getSubjectQuery.data?.teachers.length - 2}`}
                                  </div>
                                </div>
                              ) : getSubjectQuery.data?.teachers.length > 1 ? (
                                <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                  {getSubjectQuery.data?.teachers?.map(
                                    (teacher: Teacher, key: number) =>
                                      key < 2 && (
                                        <img
                                          key={key}
                                          className="h-10 w-10 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                          src={
                                            teacher?.imagePath
                                              ? SERVER_STORAGE +
                                                teacher?.imagePath
                                              : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher?.name).firstName}+${formatUserName(teacher?.name).lastName}`
                                          }
                                          alt="profile"
                                        />
                                      ),
                                  )}
                                </div>
                              ) : (
                                getSubjectQuery.data?.teachers?.length == 1 && (
                                  <>
                                    <img
                                      className="h-10 w-10 rounded-full border-2 border-gray-50 dark:border-gray-700"
                                      src={
                                        getSubjectQuery.data?.teachers[0]
                                          ?.imagePath
                                          ? SERVER_STORAGE +
                                            getSubjectQuery.data?.teachers[0]
                                              ?.imagePath
                                          : `https://ui-avatars.com/api/?background=random&name=${formatUserName(getSubjectQuery.data?.teachers[0]?.name).firstName}+${formatUserName(getSubjectQuery.data?.teachers[0]?.name).lastName}`
                                      }
                                      alt="profile"
                                    />
                                    <span className="pointer-events-none">
                                      {getSubjectQuery.data?.teachers[0]?.name}
                                    </span>
                                  </>
                                )
                              )}
                            </div>
                          }
                        >
                          <Dropdown.List>
                            {getSubjectQuery.data?.teachers.map(
                              (teacher: Teacher, key: number) => (
                                <Dropdown.Item
                                  key={key}
                                  img={
                                    teacher.imagePath
                                      ? SERVER_STORAGE + teacher.imagePath
                                      : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher.name).firstName}+${formatUserName(teacher.name).lastName}`
                                  }
                                >
                                  {teacher.name}
                                </Dropdown.Item>
                              ),
                            )}
                          </Dropdown.List>
                          <Dropdown.Button>
                            <p onClick={() => navigate("/teachers/new")}>
                              {t("actions.add_entity", {
                                entity: t("entities.teacher"),
                              })}
                            </p>
                          </Dropdown.Button>
                        </Dropdown>
                        {getSubjectQuery.data?.teachers?.length < 1 && (
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
                            onClick={() => navigate("/teachers/new")}
                          >
                            <FaUser className="me-2" />
                            {t("actions.add_entity", {
                              entity: t("entities.teacher"),
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
  );
}
