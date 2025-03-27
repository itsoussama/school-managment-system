import { alertIntialState } from "@src/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Alert as AlertType } from "@src/utils/alert";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb, Modal } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaExclamationTriangle, FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Alert from "@src/components/alert";
import Accordion from "@src/components/accordion";
import { InfoCard } from "@src/pages/shared/components/info";
import { Button, Input, MultiSelect, RSelect } from "@src/components/input";
import UserListModal from "@src/components/userListModal";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import {
  addGrade,
  addGroup,
  addStage,
  deleteGrade,
  deleteStage,
  getGrade,
  getGradeGroup,
  getStage,
  getStages,
  getStudents,
  getTeachers,
  setGrade,
  setGroup,
  setStage,
} from "@pages/shared/utils/api";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { SkeletonAccordion } from "@src/components/skeleton";
import { Student } from "@pages/student/viewStudents";
import { Teacher } from "@pages/teacher/viewTeachers";

interface Modal {
  id: number;
  type?:
    | "addGrade"
    | "editGrade"
    | "addStage"
    | "editStage"
    | "deleteStage"
    | "deleteGrade"
    | "addGroup"
    | "assignGroupTeachesrStudents";
  open: boolean;
}

export interface StageData {
  _method?: string;
  id?: number;
  name: string;
  grades: Grade[] | number[];
  school_id: string;
}

export interface GradeData {
  _method?: string;
  id?: number;
  label: string;
  stage_id: number;
  groups?: number[];
  students?: number[];
  teachers?: number[];
  school_id: string;
}
export interface GroupData {
  _method?: string;
  id?: number;
  name: string;
  grade_id?: number;
  students?: number[];
  teachers?: number[];
  school_id: string;
}

interface Grade {
  id?: number;
  label: string;
  stage_id?: number;
  students?: Student[];
  teachers?: Teacher[];
  groups?: Group[];
  group_ids?: number[];
  total_groups?: number;
  total_teachers?: number;
  total_students?: number;
}

interface GroupStudent extends Student {
  user_id: number;
}
interface GroupTeacher extends Teacher {
  user_id: number;
}

interface Group {
  id: number;
  name: string;
  grade_id?: number;
  students?: GroupStudent[];
  teachers?: GroupTeacher[];
}

interface Stage {
  id?: number;
  name: string;
  grades: Grade[];
}

interface NewLevel {
  name: string;
  editable: boolean;
}

// interface Grade extends Stage {
//   Stage_id: number;
// }

export default function SchoolLevels() {
  const {
    formData: stageData,
    setFormData: setStageFormData,
    setData: setStageData,
  } = useFormValidation<Stage>({
    name: "",
    grades: [],
  });

  const {
    formData: gradeData,
    setFormData: setGradeFormData,
    setData: setGradeData,
  } = useFormValidation<Grade>({
    id: 0,
    label: "",
    stage_id: 0,
  });
  const {
    formData: groupData,
    setFormData: setGroupFormData,
    setData: setGroupData,
  } = useFormValidation<Group>({
    id: 0,
    name: "",
  });
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [openModal, setOpenModal] = useState<Modal>();
  const [newLevel, setNewLevel] = useState<NewLevel | undefined>();
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const admin = useAppSelector((state) => state.userSlice.user);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
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
    queryKey: ["getStage", openModal?.id],
    queryFn: () => getStage(openModal?.id as number),
    enabled: !!openModal?.id && openModal?.type === "deleteStage",
  });

  const getGradeQuery = useQuery({
    queryKey: ["getGrade", openModal?.id],
    queryFn: () => getGrade(openModal?.id as number),
    enabled:
      !!openModal?.id &&
      (openModal?.type === "deleteGrade" ||
        openModal?.type === "editGrade" ||
        openModal?.type === "addGroup"),
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

  const addGradeMutation = useMutation({
    mutationFn: addGrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });

      setNewLevel(undefined);
      setOpenModal(undefined);
      setSelectedStudents([]);
      setSelectedTeachers([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const setGradeMutation = useMutation({
    mutationFn: setGrade,
    onSuccess: async (data: Grade) => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroup"] });

      setNewLevel(undefined);
      setOpenModal(undefined);
      setSelectedStudents([]);
      setSelectedTeachers([]);

      setGradeData({
        id: data.id,
        label: data.label,
        groups: data.groups,
        stage_id: data.stage_id,
        students: data.students,
        teachers: data.teachers,
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: deleteGrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });

      setOpenModal(undefined);
      setGroupData({
        id: 0,
        name: "",
      });
      setSelectedStudents([]);
      setSelectedTeachers([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.deleted_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const addStageMutation = useMutation({
    mutationFn: addStage,
    onSuccess: async (data: Stage) => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });

      setStageData({
        name: data.name,
        grades: data.grades,
      });

      setNewLevel(undefined);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const addGroupMutation = useMutation({
    mutationFn: addGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroup"] });

      setOpenModal(undefined);

      setSelectedStudents([]);
      setSelectedTeachers([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const setGroupMutation = useMutation({
    mutationFn: setGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroup"] });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },

    onSettled: () => {
      setOpenModal(undefined);

      setSelectedStudents([]);
      setSelectedTeachers([]);

      setGroupData({
        id: 0,
        name: "",
        grade_id: 0,
      });
    },
  });

  const setStageMutation = useMutation({
    mutationFn: setStage,
    onSuccess: async (data: Stage) => {
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });

      setStageData({
        name: data.name,
        grades: data.grades,
      });

      setSelectedStudents([]);
      setSelectedTeachers([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const deleteStageMutation = useMutation({
    mutationFn: deleteStage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });

      setOpenModal(undefined);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.deleted_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const handleNewStage = (name: string) => {
    setNewLevel({ name: name, editable: true });
    setStageData({
      name: name,
      grades: [],
    });
  };

  const handleDeleteStage = (stageId: number) => {
    setOpenModal({ id: stageId, type: "deleteStage", open: true });
  };

  const handleStudentList = async () => {
    setOpenUserListModal((prev) => ({ ...prev, students: true }));
    // const data = (await queryClient.ensureQueryData({
    //   queryKey: ["getGrade", gradeId],
    //   queryFn: () => getGrade(gradeId),
    // })) as Grade;

    // const getStudentIds = data.students?.map(
    //   (student) => student.id,
    // ) as number[];

    // setSelectedStudents(getStudentIds);
  };

  const handleTeacherList = async () => {
    setOpenUserListModal((prev) => ({ ...prev, teachers: true }));
    // const data = (await queryClient.ensureQueryData({
    //   queryKey: ["getGrade", gradeId],
    //   queryFn: () => getGrade(gradeId),
    // })) as Grade;

    // const getTeacherIds = data.teachers?.map(
    //   (teacher) => teacher.id,
    // ) as number[];

    // setSelectedTeachers(getTeacherIds);
  };

  const resetNewStageForm = () => {
    setNewLevel(undefined);
    setStageData({
      name: "",
      grades: [],
    });
  };

  // const onOpenEditGradeModal = async ({ id, type, open: isOpen }: Modal) => {
  //   setOpenModal({ id: id, type: type, open: isOpen });

  //   const data: Grade = await queryClient.ensureQueryData({
  //     queryKey: ["getGrade", id],
  //     queryFn: () => getGrade(id),
  //   });

  //   setGradeData({
  //     id: data?.id,
  //     label: data?.label,
  //     stage_id: data?.stage_id,
  //     groups: data?.groups,
  //     group_ids: data?.group_ids,
  //     students: data?.students,
  //     teachers: data?.teachers,
  //   });

  //   // const studentIds = data.students?.map((student) => student.id);
  //   // const teacherIds = data.teachers?.map((teacher) => teacher.id);

  //   // setSelectedStudents(studentIds as number[]);
  //   // setSelectedTeachers(teacherIds as number[]);
  // };

  useEffect(() => {
    if (getGradeQuery.data) {
      const data = getGradeQuery.data;
      setGradeData({
        id: data?.id,
        label: data?.label,
        stage_id: data?.stage_id,
        groups: data?.groups,
        group_ids: data?.group_ids,
        students: data?.students,
        teachers: data?.teachers,
      });
    }
  }, [getGradeQuery.data, setGradeData]);

  const onSelectGradeGroup = async (gradeId: number, groupId: number) => {
    const data: Group & { grade: Grade } = await getGradeGroup(
      gradeId,
      groupId,
    );

    setGroupData({
      id: data?.id || groupId,
      name: data?.name,
      grade_id: data?.grade_id || gradeId,
    });

    if (groupId !== 0) {
      const studentIds = data.students
        ?.map((student) => student.user_id)
        .sort();
      const teacherIds = data.teachers
        ?.map((teacher) => teacher.user_id)
        .sort();
      console.log(studentIds);

      setSelectedStudents(studentIds as number[]);
      setSelectedTeachers(teacherIds as number[]);
    } else {
      setSelectedStudents([]);
      setSelectedTeachers([]);
    }
  };

  const onSubmitNewStage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form: StageData = {
      name: stageData?.name,
      grades: stageData?.grades,
      school_id: admin.school_id,
    };

    addStageMutation.mutate(form);
  };

  const onSubmitUpdateStage = () => {
    const form: StageData = {
      _method: "PUT",
      id: stageData?.id,
      name: stageData?.name,
      grades: stageData?.grades,
      school_id: admin.school_id,
    };

    setStageMutation.mutate(form);
  };

  const onSubmitDeleteStage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerficationMatch(true);
    const input = e.target as HTMLFormElement;

    if (
      (input.verfication.value as string).toLowerCase() !==
      getStageQuery.data?.name.toLowerCase()
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteStageMutation.mutate(openModal?.id as number);
  };

  const onSubmitNewGradeLevel = (e: FormEvent<HTMLFormElement>) => {
    // const target = e.target as HTMLFormElement;
    e.preventDefault();

    const form: GradeData = {
      label: gradeData.label,
      stage_id: openModal?.id as number,
      school_id: admin.school_id,
    };

    addGradeMutation.mutate(form);
  };

  const onSubmitNewGroup = (e: FormEvent<HTMLFormElement>) => {
    // const target = e.target as HTMLFormElement;
    e.preventDefault();

    const form: GroupData = {
      name: groupData.name,
      grade_id: openModal?.id,
      school_id: admin.school_id,
    };

    addGroupMutation.mutate(form);
  };

  const onSubmitUpdateGradeLevel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const groupIds = gradeData.groups?.map((group) => group.id);

    const formGrade: GradeData = {
      _method: "PUT",
      id: gradeData?.id,
      label: gradeData?.label,
      stage_id: gradeData?.stage_id as number,
      groups: gradeData?.group_ids as number[],
      school_id: admin.school_id,
    };

    setGradeMutation.mutate(formGrade);
  };

  const onSubmitUpdateGradeGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const groupIds = gradeData.groups?.map((group) => group.id);

    const form: GradeData = {
      _method: "PUT",
      id: gradeData?.id,
      label: gradeData?.label,
      stage_id: gradeData?.stage_id as number,
      groups: gradeData?.group_ids as number[],
      school_id: admin.school_id,
    };

    const formGroup: GroupData = {
      _method: "PUT",
      id: groupData?.id,
      name: groupData?.name,
      grade_id: groupData?.grade_id,
      students: selectedStudents,
      teachers: selectedTeachers,
      school_id: admin.school_id,
    };

    setGradeMutation.mutate(form);
    setGroupMutation.mutate(formGroup);
  };

  const onSubmitDeleteGrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerficationMatch(true);
    const input = e.target as HTMLFormElement;

    if (
      (input.verfication.value as string).toLowerCase() !==
      getGradeQuery.data?.label.toLowerCase()
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteGradeMutation.mutate(openModal?.id as number);
  };

  const onCloseModal = () => {
    setOpenModal(undefined);
    setSelectedStudents([]);
    setSelectedTeachers([]);
  };

  useEffect(() => {
    if (getStagesQuery.isFetched && getStagesQuery.data) {
      setStageData(getStagesQuery.data);
    }
  }, [getStagesQuery.isFetched, getStagesQuery.data, setStageData]);

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
        <form onSubmit={onSubmitNewGradeLevel}>
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <Input
                type="text"
                id="label"
                name="label"
                onChange={(e) => setGradeFormData(e.target.id, e.target.value)}
                label={t("form.fields.grade_level")}
                placeholder={t("form.fields.grade_level")}
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
        show={openModal?.type === "addGroup" ? openModal?.open : false}
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
        <form onSubmit={onSubmitNewGroup}>
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.group"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <Input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setGroupFormData(e.target.id, e.target.value)}
                label={t("form.fields.group")}
                placeholder={t("form.fields.group")}
              />
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
        <form onSubmit={onSubmitUpdateGradeLevel}>
          <Modal.Header>
            {t("actions.edit_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-8">
              <Input
                type="text"
                id="label"
                name="label"
                onChange={(e) => setGradeFormData(e.target.id, e.target.value)}
                value={gradeData?.label}
                label={t("form.fields.grade_level")}
                placeholder={t("form.fields.grade_level")}
              />
              <MultiSelect
                label={t("form.fields.group")}
                name="groups"
                onSelect={(items) => setGradeFormData("group_ids", items)}
                selectedValue={gradeData?.group_ids as number[]}
              >
                <MultiSelect.List>
                  {getGradeQuery.data?.groups.map(
                    (group: Group, key: number) => (
                      <MultiSelect.Option
                        key={key}
                        value={group.id}
                        label={group.name}
                      />
                    ),
                  )}
                  <Button
                    className="btn-outline !m-0 flex min-h-6 items-center justify-center"
                    onClick={() =>
                      setOpenModal({
                        id: gradeData?.id as number,
                        open: true,
                        type: "addGroup",
                      })
                    }
                  >
                    <FaPlus size={12} className="me-2" />
                    {t("actions.add_entity", {
                      entity: t("form.fields.group"),
                    })}
                  </Button>
                </MultiSelect.List>
              </MultiSelect>
            </div>
            <div className="mt-8 flex w-full flex-col">
              <Button
                type="button"
                className="btn-default"
                onClick={() =>
                  setOpenModal({
                    id: gradeData?.id as number,
                    open: true,
                    type: "assignGroupTeachesrStudents",
                  })
                }
              >
                {t("actions.view_entity", {
                  entity:
                    t("determiners.definite.plural") +
                    " " +
                    t("entities.students") +
                    " " +
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

      <Modal
        show={
          openModal?.type === "assignGroupTeachesrStudents"
            ? openModal?.open
            : false
        }
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
        <form onSubmit={onSubmitUpdateGradeGroup}>
          <Modal.Header>
            {t("actions.edit_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.group"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-8">
              <RSelect
                id="group"
                name="group"
                onChange={(e) =>
                  onSelectGradeGroup(
                    openModal?.id as number,
                    Number(e.target.value),
                  )
                }
                label={t("form.fields.group")}
              >
                <option value={0}>Select Group</option>
                {getGradeQuery.data?.groups.map((group: Group, key: number) => (
                  <option key={key} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </RSelect>
            </div>
            {groupData.id !== 0 && (
              <div className="mt-8 flex w-full flex-col">
                <Button
                  type="button"
                  className="btn-default disabled:btn-disabled"
                  disabled={groupData.id === 0}
                  onClick={() => handleStudentList()}
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
                  className="btn-default disabled:btn-disabled"
                  disabled={groupData.id === 0}
                  onClick={() => handleTeacherList()}
                >
                  {t("actions.view_entity", {
                    entity:
                      t("determiners.definite.plural") +
                      " " +
                      t("entities.teachers"),
                  })}
                </Button>
              </div>
            )}
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
        show={openModal?.type === "deleteStage" ? openModal?.open : false}
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
        <form onSubmit={onSubmitDeleteStage}>
          <Modal.Header>
            {t("actions.delete_entity", {
              entity: t("form.fields.section"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.delete.title")}
                <b>{getStageQuery.data?.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.delete.label"
                  values={{ item: getStageQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("modals.delete.error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {t("modals.delete.delete_button")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.delete.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "deleteGrade" ? openModal?.open : false}
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
        <form onSubmit={onSubmitDeleteGrade}>
          <Modal.Header>
            {t("actions.delete_entity", {
              entity: t("form.fields.grade_levels"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.delete.title")}
                <b>{getGradeQuery.data?.label}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.delete.label"
                  values={{ item: getGradeQuery.data?.label }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("modals.delete.error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {t("modals.delete.delete_button")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.delete.cancel_button")}
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
        onChange={(_, value) => setSelectedTeachers(value)}
        onClose={(status) =>
          setOpenUserListModal((prev) => ({ ...prev, teachers: status }))
        }
        selectedUsersList={selectedTeachers as number[]}
        options={{ img: true, search: true }}
        userList={getAllTeachersQuery?.data}
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
        onChange={(_, value) => setSelectedStudents(value)}
        onClose={(status) =>
          setOpenUserListModal((prev) => ({ ...prev, students: status }))
        }
        selectedUsersList={selectedStudents as number[]}
        options={{ img: true, search: true }}
        userList={getAllStudentsQuery?.data}
        multipleSelection={true}
      />

      <TransitionAnimation>
        <div className="flex flex-col gap-y-3">
          <Accordion>
            {getStagesQuery.isFetching && !getStagesQuery.isRefetching ? (
              <SkeletonAccordion />
            ) : (
              getStagesQuery.data?.map((Stage: Stage, key: number) => (
                <Accordion.container
                  id={Stage.id as number}
                  key={key}
                  title={Stage.name}
                  onChange={(e) =>
                    setStageData({
                      id: Stage.id as number,
                      name: e.target.value,
                      grades: Stage.grades,
                    })
                  }
                  onValidateChange={() => onSubmitUpdateStage()}
                  deleteItem={() => handleDeleteStage(Stage.id as number)}
                  value={stageData.name}
                  deletable
                >
                  <Accordion.section>
                    <div className="flex min-h-36 flex-row gap-x-2 overflow-x-auto p-2">
                      {Stage.grades.map((gradeLevel: Grade, key: number) => (
                        <InfoCard
                          title={gradeLevel.label}
                          key={key}
                          onDelete={() =>
                            setOpenModal({
                              id: gradeLevel?.id as number,
                              open: true,
                              type: "deleteGrade",
                            })
                          }
                          onEdit={() =>
                            setOpenModal({
                              id: gradeLevel?.id as number,
                              open: true,
                              type: "editGrade",
                            })
                          }
                          index={gradeLevel.id as number}
                        >
                          <InfoCard.Metric
                            title="Groups"
                            value={gradeLevel.total_groups}
                          />
                          <InfoCard.Metric
                            title="Students"
                            value={gradeLevel.total_students}
                          />
                          <InfoCard.Metric
                            title="Teachers"
                            value={gradeLevel.total_teachers}
                          />
                        </InfoCard>
                      ))}
                      <div
                        className="flex w-80 min-w-60 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-xs border border-dashed border-gray-400 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-500 dark:bg-gray-750 dark:text-gray-500 dark:hover:bg-gray-700"
                        onClick={() =>
                          setOpenModal({
                            id: Stage.id as number,
                            open: true,
                            type: "addGrade",
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
                </Accordion.container>
              ))
            )}
          </Accordion>
          {newLevel && (
            <form onSubmit={onSubmitNewStage}>
              <Accordion>
                <Accordion.container
                  id={0}
                  title={newLevel?.name}
                  value={stageData?.name}
                  customSideIcon={
                    <div className="flex flex-row items-center gap-3">
                      <button type="submit">
                        <FaCheck className="cursor-pointer text-blue-600" />
                      </button>
                      <button onClick={resetNewStageForm}>
                        <FaXmark className="cursor-pointer text-red-600" />
                      </button>
                    </div>
                  }
                  editable={newLevel?.editable}
                  onChange={(e) =>
                    setStageFormData(
                      "name",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                >
                  ""
                </Accordion.container>
              </Accordion>
            </form>
          )}
          <div
            className="flex cursor-pointer flex-row items-center justify-center gap-x-2 rounded-s border border-dashed border-gray-400 bg-gray-100 p-4 text-gray-500 hover:bg-gray-200 dark:border-gray-500 dark:bg-gray-750 dark:text-gray-500 dark:hover:bg-gray-700"
            onClick={() => handleNewStage("new level")}
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
