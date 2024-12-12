import { alertIntialState } from "@src/admin/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Alert as AlertType } from "@admin/utils/alert";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb, Modal, Table } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Alert from "@src/components/alert";
import Accordion from "@src/components/accordion";
import InfoCard from "@src/admin/components/infoCard";
import { Input } from "@src/components/input";
import { customTable } from "@src/admin/utils/flowbite";

interface Modal {
  id: number;
  type?: "addGrade" | "editGrade" | "addSection" | "editSection";
  open: boolean;
}

interface Section {
  id: number;
  label: string;
}

interface Grade extends Section {
  section_id: number;
}

export default function GradesSections() {
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [openModal, setOpenModal] = useState<Modal>();
  const [sections, setSections] = useState<Array<Section>>([
    { id: 1, label: "Section" },
    { id: 2, label: "Section" },
  ]);

  const [gradeLevels, setGradeLevels] = useState<Array<Grade>>([
    { id: 1, label: "Grade", section_id: 1 },
    { id: 2, label: "Grade", section_id: 1 },
  ]);

  const changeGradeLevels = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setGradeLevels((prev) =>
      prev.map((section) =>
        section.id.toString() == target.id
          ? { ...section, label: target.value }
          : section,
      ),
    );
  };

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
    // parentMutation.reset();
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

  return (
    <div className="flex flex-col">
      <Alert
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
        <Breadcrumb.Item>{t("entities.grades_sections")}</Breadcrumb.Item>
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
            <div className="mt-8 flex w-full flex-col overflow-hidden rounded-s border border-gray-200 bg-light-primary dark:border-gray-600 dark:bg-dark-primary">
              <div className="w-full overflow-x-auto rounded-s">
                <Table
                  theme={{
                    ...customTable,
                    body: { cell: { base: "py-2 px-2" } },
                  }}
                  striped
                >
                  <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>{t("entities.teachers")}</Table.HeadCell>
                    <Table.HeadCell>{t("entities.students")}</Table.HeadCell>

                    {/* <Table.HeadCell className="w-0">
                  <span className="w-full">Actions</span>
                </Table.HeadCell> */}
                  </Table.Head>
                  <Table.Body
                    // ref={tableRef}
                    className="relative divide-y divide-gray-300 dark:divide-gray-600"
                  >
                    {/* {getResourcesQuery.isFetching &&
                  (getResourcesQuery.isRefetching || perPage) && (
                    <Table.Row>
                      <Table.Cell className="p-0">
                        <div
                          className={`table-loader fixed left-0 top-0 z-[1] grid h-full w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-60`}
                        >
                          <Spinner />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )} */}

                    {/* {getResourcesQuery.isFetching &&
                !(getResourcesQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={5} />
                ) : (
                  //  Code goes here
                )} */}
                    <Table.Row>
                      <Table.Cell>
                        <div className="flex items-center gap-x-2">
                          <img
                            // key={key}
                            className="h-8 w-8 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                            src="https://ui-avatars.com/api/?background=random&name=test"
                            alt="profile"
                          />

                          <span className="pointer-events-none">
                            {t("form.fields.full_name")}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-x-2">
                          <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                            <img
                              // key={key}
                              className="h-8 w-8 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                              src="https://ui-avatars.com/api/?background=random&name=test"
                              alt="profile"
                            />

                            <div className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border-2 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 group-odd:border-white group-even:border-gray-50 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500 dark:group-odd:border-gray-800 dark:group-even:border-gray-700">
                              {`+2`}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <button className="btn-outline flex !h-9 items-center justify-center gap-x-2">
                          <FaPlus />
                          <span className="test">Add Row</span>
                        </button>
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>

              {/* <div className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-gray-500 dark:text-gray-400">
              {t("records-number")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getResourcesQuery.data?.from}-{getResourcesQuery.data?.to}
              </span>{" "}
              {t("total-records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getResourcesQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getResourcesQuery.data?.per_page}
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
                  !getResourcesQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getResourcesQuery.data?.last_page ?? 1}
                nextLabel={minSm ? t("next") : ""}
                previousLabel={minSm ? t("previous") : ""}
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
          </div> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <TransitionAnimation>
        <div className="flex flex-col gap-y-3">
          {sections.map((section, key) => (
            <Accordion
              id={section.id}
              key={key}
              title={section.label}
              onChange={changeSectionTitle}
              deleteItem={() => deleteSection(section.id)}
              value={section.label}
            >
              <Accordion.section>
                <div className="flex min-h-36 flex-row gap-x-2 overflow-x-auto p-2">
                  {gradeLevels.map(
                    (gradeLevel, key) =>
                      gradeLevel.section_id === section.id && (
                        <InfoCard
                          title={gradeLevel.label}
                          key={key}
                          onDelete={() => deleteGrade(gradeLevel.id)}
                          index={gradeLevel.id}
                        />
                      ),
                  )}
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
                          t("determiners.indefinite.masculine") +
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
            onClick={() =>
              setSections((prev) => [
                ...prev,
                { id: sections.length + 1, label: "Section" },
              ])
            }
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
