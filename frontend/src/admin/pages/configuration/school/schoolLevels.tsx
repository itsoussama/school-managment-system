import { alertIntialState } from "@src/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Alert as AlertType } from "@src/utils/alert";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb, Modal } from "flowbite-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Alert from "@src/components/alert";
import Accordion from "@src/components/accordion";
import InfoCard from "@src/admin/components/infoCard";
import { Button, Input } from "@src/components/input";
import UserListModal from "@src/components/userListModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import {
  getStage,
  getStages,
  getStudents,
  getTeachers,
} from "@src/features/api";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface Modal {
  id: number;
  type?: "addGrade" | "editGrade" | "addSection" | "editSection";
  open: boolean;
}

export interface FormData {
  _method?: string;
  id: number;
  name: string;
  school_id: string;
}

interface Grade {
  id: number;
  label: string;
}

interface Section {
  id: number;
  name: string;
  grades: Grade[];
}

// interface Grade extends Section {
//   section_id: number;
// }

export default function SchoolLevels() {
  const { t } = useTranslation();
  const { formData, setData } = useFormValidation<Section[]>([]);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [openModal, setOpenModal] = useState<Modal>();
  const [newLevel, setNewLevel] = useState<string>("");
  const admin = useAppSelector((state) => state.userSlice.user);
  const [selectedUser, setSelectedUser] = useState<{
    teachers: number[];
    students: number[];
  }>({
    students: [],
    teachers: [],
  });
  const [openUserListModal, setOpenUserListModal] = useState<{
    teachers: boolean;
    students: boolean;
  }>({
    students: false,
    teachers: false,
  });

  const getStagesQuery = useQuery({
    queryKey: ["getStages"],
    queryFn: () => getStages(admin.school_id),
    placeholderData: keepPreviousData,
  });

  const getStageQuery = useQuery({
    queryKey: ["getStage"],
    queryFn: () => getStage,
  });

  const getAllTeachersQuery = useQuery({
    queryKey: ["getAllTeachers"],
    queryFn: () => getTeachers(1, -1, undefined, undefined, admin.school_id),
    placeholderData: keepPreviousData,
  });

  const getAllStudentsQuery = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: () => getStudents(1, -1, undefined, undefined, admin.school_id),
    placeholderData: keepPreviousData,
  });

  // const changeGradeLevels = (e: ChangeEvent) => {
  //   const target = e.target as HTMLInputElement;
  //   setGradeLevels((prev) =>
  //     prev.map((section) =>
  //       section.id.toString() == target.id
  //         ? { ...section, label: target.value }
  //         : section,
  //     ),
  //   );
  // };

  const changeSectionTitle = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSections((prev) =>
      prev.map((section) =>
        section.id.toString() == target.id
          ? { ...section, label: target.value }
          : section,
      ),
    );
  };

  const deleteSection = (id: number) => {
    const filterSection = sections.filter((section) => section.id !== id);
    setSections(filterSection);
  };

  const deleteGrade = (id: number) => {
    const filterGradeLevel = gradeLevels.filter(
      (gradeLevel) => gradeLevel.id !== id,
    );
    setGradeLevels(filterGradeLevel);
  };

  const onSubmitGradeLevel = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement;
    e.preventDefault();

    setGradeLevels((prev) => [
      ...prev,
      {
        id: gradeLevels.length + 1,
        label: target.gradeLevel.value,
        section_id: 1,
      },
    ]);

    onCloseModal();
  };

  const onCloseModal = () => {
    setOpenModal(undefined);
  };

  useEffect(() => {
    if (getStagesQuery.isFetched && getStagesQuery.data) {
      setData(getStagesQuery.data);
    }
  }, [getStagesQuery.isFetched, getStagesQuery.data, setData]);

  return (
    <div className="flex flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={(value) => toggleAlert(value)}
      />

      <Breadcrumb
        theme={{ list: "flex items-center overflow-x-auto px-5 py-3" }}
        className="fade-edge fade-edge-x my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb"
      >
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {minSm ? t("general.home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.configurations")}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.school")}
              </span>
            </Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("entities.school-levels")}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "addGrade" ? openModal?.open : false}
        onClose={onCloseModal}
        size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={onSubmitGradeLevel}>
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <Input
                type="text"
                id="gradeLevel"
                name="gradeLevel"
                label={t("form.fields.grade_level")}
                placeholder={t("form.fields.grade_level")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />
            </div>
            <div className="mt-8 flex w-full flex-col">
              <Button
                type="button"
                className="btn-default"
                onClick={() => {
                  setOpenUserListModal((prev) => ({ ...prev, students: true }));
                }}
              >
                {t("actions.add_entity", {
                  entity:
                    t("determiners.indefinite.plural.masculine") +
                    " " +
                    t("entities.students"),
                })}
              </Button>
              <Button
                type="button"
                className="btn-default"
                onClick={() => {
                  setOpenUserListModal((prev) => ({ ...prev, teachers: true }));
                }}
              >
                {t("actions.add_entity", {
                  entity:
                    t("determiners.indefinite.plural.masculine") +
                    " " +
                    t("entities.teachers"),
                })}
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "editGrade" ? openModal?.open : false}
        onClose={onCloseModal}
        size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={onSubmitGradeLevel}>
          <Modal.Header>
            {t("actions.edit_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <Input
                type="text"
                id="gradeLevel"
                name="gradeLevel"
                label={t("form.fields.grade_level")}
                placeholder={t("form.fields.grade_level")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />
            </div>
            <div className="mt-8 flex w-full flex-col">
              <Button
                type="button"
                className="btn-default"
                onClick={() => {
                  setOpenUserListModal((prev) => ({ ...prev, students: true }));
                }}
              >
                {t("actions.view_entity", {
                  entity:
                    t("determiners.definite.plural") +
                    " " +
                    t("entities.students"),
                })}
              </Button>
              <Button
                type="button"
                className="btn-default"
                onClick={() => {
                  setOpenUserListModal((prev) => ({ ...prev, teachers: true }));
                }}
              >
                {t("actions.view_entity", {
                  entity:
                    t("determiners.definite.plural") +
                    " " +
                    t("entities.teachers"),
                })}
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <UserListModal
        modalHeader={
          t("actions.select_user", {
            entity: `${t("determiners.definite.plural")} ${t("entities.teachers")}`,
          }) as string
        }
        modalSize="md"
        name="teachers"
        open={openUserListModal.teachers}
        onChange={(_, value) =>
          setSelectedUser((prev) => ({ ...prev, teachers: value }))
        }
        onClose={(status) =>
          setOpenUserListModal((prev) => ({ ...prev, teachers: status }))
        }
        selectedUsersList={selectedUser.teachers as number[]}
        options={{ img: true, search: true }}
        userList={getAllTeachersQuery.data?.data}
        multipleSelection={true}
      />

      <UserListModal
        modalHeader={
          t("actions.select_user", {
            entity: `${t("determiners.definite.plural")} ${t("entities.students")}`,
          }) as string
        }
        modalSize="md"
        name="students"
        open={openUserListModal.students}
        onChange={(_, value) =>
          setSelectedUser((prev) => ({ ...prev, students: value }))
        }
        onClose={(status) =>
          setOpenUserListModal((prev) => ({ ...prev, students: status }))
        }
        selectedUsersList={selectedUser.students as number[]}
        options={{ img: true, search: true }}
        userList={getAllStudentsQuery.data?.data}
        multipleSelection={true}
      />

      <TransitionAnimation>
        <div className="flex flex-col gap-y-3">
          {formData?.map((section: Section, key: number) => (
            <Accordion
              id={section.id}
              key={key}
              title={section.name}
              onChange={changeSectionTitle}
              deleteItem={() => deleteSection(section.id)}
              value={section.name}
            >
              <Accordion.section>
                <div className="flex min-h-36 flex-row gap-x-2 overflow-x-auto p-2">
                  {section.grades.map((gradeLevel: Grade, key: number) => (
                    <InfoCard
                      title={gradeLevel.label}
                      key={key}
                      onDelete={() => deleteGrade(gradeLevel.id)}
                      onEdit={() =>
                        setOpenModal({
                          id: 0,
                          type: "editGrade",
                          open: true,
                        })
                      }
                      index={gradeLevel.id}
                    />
                  ))}
                  <div
                    className="flex w-80 min-w-60 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-xs border border-dashed border-gray-400 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-500 dark:bg-gray-750 dark:text-gray-500 dark:hover:bg-gray-700"
                    onClick={() =>
                      setOpenModal({
                        id: 0,
                        type: "addGrade",
                        open: true,
                      })
                    }
                  >
                    <FaPlus className="pointer-events-none" />
                    <span className="pointer-events-none">
                      {t("actions.add_entity", {
                        entity:
                          t("determiners.indefinite.feminine") +
                          " " +
                          t("form.fields.grade_level"),
                      })}
                    </span>
                  </div>
                </div>
              </Accordion.section>
            </Accordion>
          ))}
          <div
            className="flex cursor-pointer flex-row items-center justify-center gap-x-2 rounded-s border border-dashed border-gray-400 bg-gray-100 p-4 text-gray-500 hover:bg-gray-200 dark:border-gray-500 dark:bg-gray-750 dark:text-gray-500 dark:hover:bg-gray-700"
            onClick={() => setNewLevel("level")}
          >
            <FaPlus className="pointer-events-none" />
            <span className="pointer-events-none">
              {t("actions.add_entity", {
                entity:
                  t("determiners.indefinite.feminine") +
                  " " +
                  t("form.fields.section"),
              })}
            </span>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
