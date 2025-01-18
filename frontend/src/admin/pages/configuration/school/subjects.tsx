import { colors } from "@src/utils/colors";
import { customBadge, customTable, customTooltip } from "@src/utils/flowbite";
import { TransitionAnimation } from "@src/components/animation";
import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  RSelect,
} from "@src/components/input";
import { SkeletonContent, SkeletonTable } from "@src/components/skeleton";
import {
  addSubject,
  deleteSubject,
  getGrades,
  getSubject,
  getSubjects,
  setSubject,
} from "@src/features/api";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Breadcrumb,
  Modal,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "flowbite-react";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaExclamationTriangle,
  FaEye,
  FaHome,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";

interface Modal {
  id?: number;
  type?: "view" | "addSubject" | "edit" | "delete";
  open: boolean;
}

interface Subject {
  id: number;
  name: string;
  grades: Grades[];
}

export interface FormData {
  _method?: string;
  id: number;
  name: string;
  coef: number;
  grades: string[];
  school_id: string;
}
interface Grades {
  id: string;
  label: string;
}

export default function Subjects() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { formData, setFormData, setData } = useFormValidation({});
  const [openModal, setOpenModal] = useState<Modal>();
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const admin = useAppSelector((state) => state.userSlice.user);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const minSm = useBreakpoint("min", "sm");

  const getSubjectsQuery = useQuery({
    queryKey: [
      "getSubjects",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
    ],
    queryFn: () =>
      getSubjects(page, perPage, sort.column, sort.direction, admin.school_id),
  });

  const getSubjectQuery = useQuery({
    queryKey: ["getSubject", openModal?.id],
    queryFn: () => getSubject(openModal?.id as number),
    enabled: !!openModal?.id,
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: getGrades,
  });

  const addSubjectQuery = useMutation({
    mutationFn: addSubject,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getSubject"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getSubjects"],
      });

      console.log(data);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const setSubjectQuery = useMutation({
    mutationFn: setSubject,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getSubject"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getSubjects"],
      });

      console.log(data);

      setData({
        id: data?.id as string,
        name: data?.name as string,
        grades: data.grades as [],
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const deleteSubjectQuery = useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getSubject"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getSubjects"],
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const onChange = (property: string, value: string | unknown[]) => {
    const exists = getSubjectsQuery.data?.data.some(
      (subject: Subject) => subject.name === value,
    );
    if (exists) {
      setData((prev) => ({
        ...prev,
        [property]: prev[property] === value ? "" : value,
      }));

      return;
    }
    setData((prev) => ({ ...prev, [property]: value }));
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const { data } = await queryClient.ensureQueryData({
      queryKey: ["getSubject", id],
      queryFn: () => getSubject(id as number),
    });

    console.log(data);

    setData({
      id: data?.id,
      name: data?.name,
      grades: data?.grades,
    });
  };

  const onCloseModal = () => {
    // setSubjectQuery.reset();
    setOpenModal(undefined);

    // setData({
    //   id: 0,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   phone: "",
    //   password: "",
    //   confirm_password: "",
    // });

    // setFormError({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirm_password: "",
    //   phone: "",
    // });
  };

  const onSubmitAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const gradesArray =
        (formData?.grades as Grades[]).map((grade) => grade.id) || [];

      const form: FormData = {
        id: formData?.id as number,
        name: formData?.name as string,
        coef: 2,
        grades: gradesArray as string[],
        school_id: admin.school_id,
      };

      addSubjectQuery.mutate(form);
    } catch (error) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (
      (input.verfication.value as string).toLowerCase() ===
      getSubjectQuery.data?.data.name
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteSubjectQuery.mutate(openModal?.id as number);
  };
  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const gradesArray =
        (formData?.grades as Grades[]).map((grade) => grade.id) || [];

      const form: FormData = {
        _method: "PUT",
        id: formData?.id as number,
        name: formData?.name as string,
        coef: 2,
        grades: gradesArray as string[],
        school_id: admin.school_id,
      };

      setSubjectQuery.mutate(form);
    } catch (error) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }
  };

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />

      <div className="flex items-center justify-between">
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
          <Breadcrumb.Item className="whitespace-nowrap">
            {t("form.fields.subjects")}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Button
          className="btn-default m-0 w-auto"
          onClick={() => setOpenModal({ open: true, type: "addSubject" })}
        >
          {t("actions.add_entity", {
            entity:
              t("determiners.indefinite.feminine") +
              " " +
              t("form.fields.subject"),
          })}
        </Button>
      </div>

      <Modal
        show={openModal?.type === "addSubject" ? openModal?.open : false}
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
        <form onSubmit={onSubmitAdd}>
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8">
              <Input
                type="text"
                id="name"
                name="name"
                label={t("form.fields.subject")}
                placeholder={t("form.fields.subject")}
                onChange={(e) => onChange(e.target.id, e.target.value)}
              />
              <MultiSelect
                label={t("form.fields.grade_levels")}
                name="grades"
                onSelectItem={(items) => setFormData("grades", items)}
              >
                {getGradesQuery.data?.data.data.map(
                  (grade: Grades, key: number) => (
                    <Checkbox
                      key={key}
                      label={grade.label}
                      id={grade.id}
                      name="grades"
                      value={grade.label}
                    />
                  ),
                )}
              </MultiSelect>
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
        show={openModal?.type === "view" ? openModal?.open : false}
        size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-screen max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {t("form.fields.id", { entity: t("form.fields.subject") })}:
          <b> {openModal?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <SkeletonContent isLoaded={getSubjectQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.label")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getSubjectQuery.data?.data.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.grade_levels")}:
                      </span>
                      <div className="flex w-max max-w-48 flex-wrap">
                        {getSubjectQuery.data?.data.grades.map(
                          (grade: Grades, index: number) => (
                            <Badge
                              key={index}
                              color={colors[index % colors.length]}
                              className="mb-1 me-1 rounded-xs"
                            >
                              {grade.label}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </SkeletonContent>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModal?.type === "edit" ? openModal?.open : false}
        size={"lg"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-[75vh] max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <form onSubmit={onSubmitUpdate}>
          <Modal.Header>
            {t("form.fields.id", { entity: t("form.fields.subject") })}:
            <b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="box-border flex w-full flex-col gap-6 sm:max-h-[60vh] sm:overflow-y-auto">
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      label={t("form.fields.label")}
                      placeholder={t("form.fields.label")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getSubjectQuery.isFetching && true}
                      value={(formData?.name as string) || ""}
                      onChange={(e) => onChange(e.target.id, e.target.value)}
                    />

                    <MultiSelect
                      label={t("form.fields.grade_levels")}
                      name="grades"
                      onSelectItem={(items) => setFormData("grades", items)}
                      externalSelectedItems={formData?.grades as Grades[]}
                    >
                      {getGradesQuery.data?.data.data.map(
                        (grade: Grades, key: number) => (
                          <Checkbox
                            key={key}
                            label={grade.label}
                            id={grade.id}
                            name="grades"
                            value={grade.label}
                            checked={
                              (formData?.grades as Grades[])?.find(
                                (value) =>
                                  value.id.toString() === grade.id.toString(),
                              )
                                ? true
                                : false
                            }
                          />
                        ),
                      )}
                    </MultiSelect>
                  </div>
                </div>
              </div>
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
        show={openModal?.type === "delete" ? openModal?.open : false}
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
        <form onSubmit={onSubmitDelete}>
          <Modal.Header>
            {t("actions.delete_entity", { entity: t("form.fields.subject") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.delete.title")}
                <b>{getSubjectQuery.data?.data.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("modals.delete.label", {
                  item: getSubjectQuery.data?.data.name,
                })}
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

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
          <div className="w-full overflow-x-auto rounded-lg">
            <Table theme={customTable} striped>
              <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                <Table.HeadCell className="sticky left-0 w-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                  {/* <Checkbox
                    className="rounded-xs"
                    id="0"
                    ref={firstCheckboxRef}
                    onChange={() => handleCheck()}
                  /> */}
                </Table.HeadCell>
                <Table.HeadCell>
                  {t("form.fields.id", { entity: t("form.fields.subjects") })}
                </Table.HeadCell>
                {/* <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {t("subject")}
                    </span>
                    <div
                      className="flex flex-col"
                    //   onClick={() => handleSort("title")}
                    >
                      <FaSortUp
                        className={`h-2.5 ${sortPosition === 2 ? "text-gray-600" : "text-gray-400"}`}
                        viewBox="0 -140 320 412"
                      />
                      <FaSortDown
                        className={`h-2.5 ${sortPosition === 1 ? "text-gray-600" : "text-gray-400"}`}
                        viewBox="0 240 320 412"
                      />
                    </div>
                  </div> 
                </Table.HeadCell>*/}
                <Table.HeadCell>{t("form.fields.label")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.grade_levels")}</Table.HeadCell>
                <Table.HeadCell>{t("entities.teachers")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">{t("general.actions")}</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="relative border-b border-b-gray-300 dark:border-b-gray-600"
              >
                {getSubjectsQuery.isFetching &&
                  (getSubjectsQuery.isRefetching || perPage) && (
                    <Table.Row>
                      <Table.Cell className="p-0">
                        <div
                          className={`table-loader fixed left-0 top-0 z-[1] grid h-full w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-60`}
                        >
                          <Spinner />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}

                {getSubjectsQuery.isFetching &&
                !(getSubjectsQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={5} />
                ) : (
                  getSubjectsQuery.data?.data.map(
                    (subject: Subject, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          {/* <Checkbox
                            className="rounded-xs"
                            id={maintenanceReq.id.toString()}
                            name="checkbox"
                            checked={
                              checks.find(
                                (check) => check.id == maintenanceReq.id,
                              )?.status == true
                                ? true
                                : false
                            }
                            onChange={() => handleCheck(maintenanceReq.id)}
                          /> */}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {subject.id}
                        </Table.Cell>
                        <Table.Cell>{subject.name}</Table.Cell>

                        <Table.Cell>
                          <div className="flex w-max max-w-48 flex-wrap">
                            {subject.grades?.map(
                              (grade, key) =>
                                key <= 5 && (
                                  <Badge
                                    key={key}
                                    theme={customBadge}
                                    color={colors[key % colors.length]}
                                    className="mb-1 me-1 rounded-xs"
                                  >
                                    {/* {t(maintenanceReq.status)} */}
                                    {grade.label}
                                  </Badge>
                                ),
                            )}

                            {subject.grades?.length > 5 && (
                              <Badge
                                theme={customBadge}
                                color={"gray"}
                                className="mb-1 me-1 rounded-xs bg-gray-300 dark:bg-gray-500"
                              >
                                +{subject.grades?.length - 5}
                              </Badge>
                            )}

                            {/* <Dropdown
                              element={
                                // <div className=""></div>
                              }
                              width="max-content"
                              additionalStyle={{
                                containerStyle: "rounded-s px-1 py-0",
                              }}
                            //   onClose={(state) =>
                            //     setCloseDropDown(state as boolean)
                            //   }
                            //   close={closeDropDown}
                            >
                              <Dropdown.List
                                additionalStyle={{ containerStyle: " py-1" }}
                              >
                                {Object.entries(statusOptions).map(
                                  (status, key) => (
                                    <div
                                      key={key}
                                      className="cursor-pointer rounded-s py-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                      onClick={() =>
                                        handleStatusChange(
                                          maintenanceReq.id,
                                          status[0] as Status,
                                        )
                                      }
                                    >
                                      <Badge
                                        theme={customBadge}
                                        data-status={status[0]}
                                        className="w-max rounded-xs"
                                        color={status[1]}
                                        key={key}
                                      >
                                        {t(status[0])}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </Dropdown.List>
                            </Dropdown> */}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {/* <div
                            className="flex cursor-pointer items-center gap-x-2"
                            onClick={() =>
                              redirect("/resources/manage", {
                                state: {
                                  resource: {
                                    id: maintenanceReq.resources.id,
                                  },
                                },
                              })
                            }
                          >
                            <img
                              className="w-8 rounded-full"
                              src={`https://ui-avatars.com/api/?background=random&name=${maintenanceReq.resources.label}}`}
                              alt="profile"
                            />
                            <span>{maintenanceReq.resources.label}</span>
                          </div> */}
                        </Table.Cell>

                        <Table.Cell>
                          <div className="flex w-fit gap-x-2">
                            <Tooltip
                              content="View"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: subject.id,
                                    type: "view",
                                    open: true,
                                  })
                                }
                                className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20"
                              >
                                <FaEye className="text-blue-600 dark:text-blue-500" />
                              </div>
                            </Tooltip>
                            <Tooltip
                              content="Edit"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20"
                                onClick={() =>
                                  onOpenEditModal({
                                    id: subject.id,
                                    type: "edit",
                                    open: true,
                                  })
                                }
                              >
                                <FaPen className="text-green-600 dark:text-green-500" />
                              </div>
                            </Tooltip>
                            <Tooltip
                              content="Delete"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20"
                                onClick={() =>
                                  setOpenModal({
                                    id: subject.id,
                                    type: "delete",
                                    open: true,
                                  })
                                }
                              >
                                <FaTrash className="text-red-600 dark:text-red-500" />
                              </div>
                            </Tooltip>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ),
                  )
                )}
              </Table.Body>
            </Table>
          </div>

          <div className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-gray-500 dark:text-gray-400">
              {t("pagination.records_shown")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getSubjectsQuery.data?.from}-{getSubjectsQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getSubjectsQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getSubjectsQuery.data?.per_page}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </RSelect>
              <Pagination
                layout={minSm ? "pagination" : "navigation"}
                showIcons
                currentPage={page}
                onPageChange={(page) =>
                  !getSubjectsQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getSubjectsQuery.data?.last_page ?? 1}
                nextLabel={minSm ? t("pagination.next") : ""}
                previousLabel={minSm ? t("pagination.previous") : ""}
                theme={{
                  pages: {
                    next: {
                      base: "rounded-r-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                    },
                    previous: {
                      base: "ml-0 rounded-l-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
