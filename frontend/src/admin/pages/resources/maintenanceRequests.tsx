import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown";
import { Dropzone, Input, RSelect, RTextArea } from "@src/components/input";
import {
  SkeletonContent,
  SkeletonProfile,
  SkeletonTable,
} from "@src/components/skeleton";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Breadcrumb,
  Checkbox,
  Modal,
  Pagination,
  Table,
} from "flowbite-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsTriangleFill } from "react-icons/bs";
import {
  FaChevronDown,
  FaExclamationTriangle,
  FaEye,
  FaHome,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import {
  FaDiamond,
  FaDownload,
  FaFileLines,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

interface Modal {
  id?: number;
  type?: "view" | "add" | "edit" | "delete";
  open: boolean;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}
interface Filter {
  label: string;
  minQty: number | undefined;
  maxQty: number | undefined;
  category_id: number | undefined;
}

export default function MaintenanceRequests() {
  const queryClient = useQueryClient();

  const location = useLocation();
  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    label: "",
    minQty: undefined,
    maxQty: undefined,
    category_id: undefined,
  });
  const [page, setPage] = useState<number>(1);
  //   const [perPage, setPerPage] = useState<number>();
  //   const firstCheckboxRef = useRef<HTMLInputElement>(null);
  //   const isCheckBoxAll = useRef(false);
  //   const [checks, setChecks] = useState<Array<Check>>([]);
  //   const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  //   const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  //   const [img, setImg] = useState<FileList>();
  //   const [previewImg, setPreviewImg] = useState<string>();
  //   const [data, setData] = useState<Data>({
  //     id: 0,
  //     label: "",
  //     qty: 0,
  //     category_id: 0,
  //   });
  //   const [formError, setFormError] = useState<DataError>({
  //     label: "",
  //     qty: 0,
  //   });
  //   const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  //   const admin = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();
  const { t: fieldTrans } = useTranslation("form-fields");
  const minSm = useBreakpoint("min", "sm");

  const onCloseModal = () => {
    // resourceMutation.reset();
    setOpenModal(undefined);

    // setData({
    //   id: 0,
    //   label: "",
    //   qty: 0,
    //   category_id: 0,
    // });

    // setFormError({
    //   label: "",
    //   qty: 0,
    // });
  };

  return (
    <div className="flex w-full flex-col">
      {/* <Alert
            status={alert.status}
            state={alert.state}
            message={alert.message}
            close={(value) => toggleAlert(value)}
          /> */}
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
              {minSm ? t("home") : ""}
            </Link>
          </Breadcrumb.Item>
          {minSm ? (
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("resources")}
              </span>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>...</Breadcrumb.Item>
          )}
          <Breadcrumb.Item className="whitespace-nowrap">
            {t("view-resources")}
          </Breadcrumb.Item>
        </Breadcrumb>

        <button
          className="btn-default m-0 w-auto"
          onClick={() => setOpenModal({ open: true, type: "add" })}
        >
          Create Request
        </button>
      </div>

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        // size={"xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {t("resource-id")}:<b> {openModal?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            {/* <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                // imgSource={
                //   getResourceQuery.data?.imagePath
                //     ? SERVER_STORAGE + getResourceQuery.data?.imagePath
                //     : `https://ui-avatars.com/api/?background=random&name=${getResourceQuery.data?.label}`
                // }
                imgSource={`https://ui-avatars.com/api/?background=random&name=chair`}
                className="h-40 w-40"
              />
            </div> */}
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <SkeletonContent isLoaded={true}>
                  <div className="grid grid-flow-col grid-rows-4 gap-x-11 gap-y-8">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("subject")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        chair
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("item")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {/* {getResourceQuery.data?.categories.label} */}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("assigned-to")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {/* {getResourceQuery.data?.categories.label} */}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("issued-date")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {/* {getResourceQuery.data?.categories.label} */}
                        20/01/2024{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          19:00
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("resolved-date")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {/* {getResourceQuery.data?.categories.label} */}
                        20/01/2024{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          19:00
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("priority")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        <Badge
                          // size={"xs"}
                          theme={{
                            icon: { size: { xs: "w-2 h-2" } },
                          }}
                          color={"yellow"}
                          icon={BsTriangleFill}
                          className="w-max rounded-s px-2 py-0.5"
                        >
                          Meduim
                        </Badge>
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("status")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        <Badge
                          // size={"xs"}
                          color={"green"}
                          className="w-max rounded-s"
                        >
                          Completed
                        </Badge>
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <div className="col-span-full flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("note")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        This a note
                      </span>
                    </div>
                    <div className="col-span-full flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("attachement")}:
                      </span>
                      <div className="flex flex-row items-center justify-between rounded-s bg-gray-600 px-4 py-2 text-gray-900 dark:text-white">
                        <div className="relative flex w-full max-w-[90%] items-center justify-start gap-3 overflow-x-auto">
                          {/* <div className="sticky left-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-r to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
                          <FaFileLines className="shrink-0" size={32} />
                          <div className="text-start">
                            File.mp4{" "}
                            <div className="mt-0 text-gray-500 dark:text-gray-400">
                              20.15MB
                            </div>
                          </div>
                          {/* <div className="sticky right-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-l to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
                        </div>
                        <FaEye
                          className="cursor-pointer rounded-full p-1.5 dark:hover:bg-gray-500"
                          size={28}
                        />
                        <FaDownload
                          className="cursor-pointer rounded-full p-1.5 dark:hover:bg-gray-500"
                          size={28}
                        />
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
        show={openModal?.type === "add" ? openModal?.open : false}
        size={"2xl"}
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Modal.Header>{t("new-request")}</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      label={fieldTrans("subject")}
                      placeholder={fieldTrans("subject-placeholder")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                        containerStyle: "col-span-full",
                      }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   value={data?.label}
                      //   onChange={onChange}
                    />

                    <RSelect
                      id="item"
                      name="item"
                      label={fieldTrans("item")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   defaultValue={data?.id}
                      //   onChange={onChange}
                    >
                      <option></option>
                    </RSelect>

                    <RSelect
                      id="priority"
                      name="priority"
                      label={fieldTrans("priority")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   defaultValue={data?.id}
                      //   onChange={onChange}
                    >
                      <option></option>
                    </RSelect>

                    <RTextArea
                      id="note"
                      name="note"
                      label={fieldTrans("note")}
                      placeholder={fieldTrans("note-placeholder")}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Dropzone
                      label={fieldTrans("attachment")}
                      onChange={(e) => console.log(e.target)}
                      custom-style={{ containerStyle: "col-span-full h-auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {fieldTrans("accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={() => {}}>
              {fieldTrans("decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "edit" ? openModal?.open : false}
        size={"4xl"}
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
        <form onSubmit={() => {}}>
          <Modal.Header>
            {t("resource-id")}:<b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      label={fieldTrans("subject")}
                      placeholder={fieldTrans("subject-placeholder")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                        containerStyle: "col-span-full",
                      }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   value={data?.label}
                      //   onChange={onChange}
                    />

                    <RSelect
                      id="item"
                      name="item"
                      label={fieldTrans("item")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   defaultValue={data?.id}
                      //   onChange={onChange}
                    >
                      <option></option>
                    </RSelect>

                    <RSelect
                      id="priority"
                      name="priority"
                      label={fieldTrans("priority")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   defaultValue={data?.id}
                      //   onChange={onChange}
                    >
                      <option></option>
                    </RSelect>

                    <RTextArea
                      id="note"
                      name="note"
                      label={fieldTrans("note")}
                      placeholder={fieldTrans("note-placeholder")}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Input
                      type="date"
                      id="issuedDate"
                      name="issuedDate"
                      label={fieldTrans("issued-date")}
                      placeholder={fieldTrans("issued-date-placeholder")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                      }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   value={data?.label}
                      //   onChange={onChange}
                    />

                    <Input
                      type="date"
                      id="resolvedDate"
                      name="resolvedDate"
                      label={fieldTrans("resolved-date")}
                      placeholder={fieldTrans("resolved-date-placeholder")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                      }}
                      //   disabled={getResourceQuery.isFetching && true}
                      //   value={data?.label}
                      //   onChange={onChange}
                    />

                    <Dropzone
                      label={fieldTrans("attachment")}
                      onChange={(e) => console.log(e.target)}
                      custom-style={{ containerStyle: "col-span-full h-auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {fieldTrans("accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={() => {}}>
              {fieldTrans("decline")}
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
        <form onSubmit={() => {}}>
          <Modal.Header>{t("delete-modal")}</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("delete-modal-title")}
                {/* <b>{getResourceQuery.data?.label}</b> */}
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">
                  {t("delete-resource-modal-message")}
                </p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("delete-modal-label")}
                {/* <b>{getResourceQuery.data?.label}</b> */}
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                // error={!isVerficationMatch ? t("delete-modal-error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {t("delete-modal-delete-btn")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("delete-modal-cancel-btn")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m bg-light-primary dark:bg-dark-primary">
          <div className="w-full overflow-x-auto rounded-lg">
            <Table
              theme={{
                root: {
                  base: "w-full relative whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400",
                  shadow:
                    "absolute left-0 top-0 -z-10 h-full w-full rounded-s drop-shadow-md",
                  wrapper: "",
                },
                body: {
                  cell: {
                    base: "px-6 py-4",
                  },
                },
                head: {
                  cell: {
                    base: "bg-gray-50 px-6 py-3 dark:bg-gray-700",
                  },
                },
                row: {
                  base: "group/row group",
                  hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
                  striped:
                    "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
                },
              }}
              striped
            >
              <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                <Table.HeadCell className="sticky left-0 w-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                  <Checkbox
                    className="rounded-xs"
                    id="0"
                    // ref={firstCheckboxRef}
                    // onChange={() => handleCheck()}
                  />
                </Table.HeadCell>
                <Table.HeadCell>{t("item-id")}</Table.HeadCell>
                <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {fieldTrans("subject")}
                    </span>
                    <div
                      className="flex flex-col"
                      //   onClick={() => handleSort("label")}
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
                </Table.HeadCell>
                <Table.HeadCell>{fieldTrans("Item")}</Table.HeadCell>
                <Table.HeadCell>{fieldTrans("status")}</Table.HeadCell>
                <Table.HeadCell>{fieldTrans("issued-date")}</Table.HeadCell>
                <Table.HeadCell>{fieldTrans("Resolved-date")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">Actions</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="divide-y divide-gray-300 dark:divide-gray-600"
              >
                {/* {getResourcesQuery.isFetching &&
                  (getResourcesQuery.isRefetching || perPage) && (
                    <Table.Row>
                      <Table.Cell className="p-0">
                        <div
                          className={`table-loader absolute left-0 top-0 z-[1] grid h-full min-h-72 w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50`}
                        >
                          <Spinner />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )} */}
                <Table.Row>
                  <Table.Cell className="sticky left-0 p-2 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2">
                    {/* <div className="h-2 w-12 bg-red-600"></div> */}
                    <Input
                      id="search"
                      type="text"
                      icon={
                        <>
                          <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.label !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  label: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      }
                      label=""
                      placeholder={fieldTrans("filter-all")}
                      value={filter?.label}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <div>
                      <Dropdown
                        additionalStyle={{ containerStyle: "px-2 rounded-s" }}
                        element={
                          <div className="relative">
                            <Input
                              type="text"
                              readOnly
                              icon={
                                <>
                                  <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                                  {(filter.maxQty !== undefined ||
                                    filter.minQty !== undefined) && (
                                    <FaRegCircleXmark
                                      onClick={() =>
                                        setFilter((prev) => ({
                                          ...prev,
                                          maxQty: undefined,
                                          minQty: undefined,
                                        }))
                                      }
                                      className="absolute right-0 top-1/2 mr-6 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                                    />
                                  )}
                                </>
                              }
                              custom-style={{
                                inputStyle: "cursor-default px-8 !py-1",
                                labelStyle: "mb-0 !inline",
                              }}
                              placeholder={fieldTrans("filter-all")}
                              value={
                                filter.minQty && filter.maxQty
                                  ? filter.minQty + " ⇆ " + filter.maxQty
                                  : filter.minQty
                                    ? "≥ " + filter.minQty
                                    : filter.maxQty
                                      ? "≤ " + filter.maxQty
                                      : ""
                              }
                            />
                            {/* {filter.minQty && filter.maxQty ? (
                                  <span>
                                    {filter.minQty} &#8646; {filter.maxQty}
                                  </span>
                                ) : filter.minQty ? (
                                  <span>&#8925; {filter.minQty}</span>
                                ) : filter.maxQty ? (
                                  <span>&#8924; {filter.maxQty}</span>
                                ) : (
                                  <span className="text-gray-400">none</span>
                                )} */}

                            <FaChevronDown className="absolute right-0 top-1/2 mr-2 -translate-y-1/2 text-[11px] text-[#7f868e36] dark:text-gray-400" />
                          </div>
                        }
                      >
                        <form
                        // onSubmit={handleFilter}
                        >
                          <Dropdown.List>
                            <div className="flex gap-2">
                              <Input
                                id="minQty"
                                type="number"
                                custom-style={{
                                  containerStyle: "w-auto",
                                  inputStyle: "py-1",
                                }}
                                placeholder="min"
                                name="minQty"
                              />
                              <Input
                                id="maxQty"
                                type="number"
                                custom-style={{
                                  containerStyle: "w-auto",
                                  inputStyle: "py-1",
                                }}
                                placeholder="max"
                                name="maxQty"
                              />
                            </div>
                          </Dropdown.List>
                          <button type="submit" className="btn-default h-8">
                            Save
                          </button>
                        </form>
                      </Dropdown>
                    </div>
                    {/* <Dropdown
                        theme={{
    
                        }}
                          dismissOnClick={false}
                          label="qty"
                        >
                          <Dropdown.Item className="space-x-2">
                            <Input
                              id="minQty"
                              custom-style={{ containerStyle: "max-w-16" }}
                              placeholder="min"
                              name="minQty"
                            />
                            <Input
                              id="maxQty"
                              custom-style={{ containerStyle: "max-w-16" }}
                              placeholder="max"
                              name="maxQty"
                            />
                          </Dropdown.Item>
                        </Dropdown> */}
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="category_id"
                      name="categories"
                      icon={
                        <>
                          <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.category_id !== undefined && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  category_id: undefined,
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-4 -translate-x-full -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      }
                      custom-style={{
                        inputStyle: "px-9 !py-1",
                        labelStyle: "mb-0 !inline",
                      }}
                      value={filter.category_id ?? "default"}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          [e.target.id]:
                            e.target.options[e.target.selectedIndex].value,
                        }))
                      }
                    >
                      <option
                        value="default"
                        disabled={filter.category_id !== undefined}
                      >
                        {fieldTrans("filter-all")}
                      </option>
                      {/* {getCategoriesQuery.data?.map(
                        (category: Category, index: number) => (
                          <option key={index} value={category.id}>
                            {category.label}
                          </option>
                        ),
                      )} */}
                    </RSelect>
                  </Table.Cell>
                </Table.Row>

                <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                  <Checkbox
                    className="rounded-xs"
                    // id={resource.id.toString()}
                    name="checkbox"
                  />
                </Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                  0001
                </Table.Cell>
                <Table.Cell>Broken chair</Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                  <div className="flex items-center gap-x-2">
                    <img
                      className="w-8 rounded-full"
                      src={`https://ui-avatars.com/api/?background=random&name=chair}`}
                      alt="profile"
                    />
                    <span>chair</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={"red"} className="w-max rounded-s">
                    Canceled
                  </Badge>
                </Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                  2024/01/01
                </Table.Cell>
                <Table.Cell>2024/01/01</Table.Cell>

                <Table.Cell>
                  <div className="flex w-fit gap-x-2">
                    <div
                      onClick={() =>
                        setOpenModal({
                          id: 0,
                          type: "view",
                          open: true,
                        })
                      }
                      className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20"
                    >
                      <FaEye className="text-blue-600 dark:text-blue-500" />
                    </div>
                    <div
                      className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20"
                      onClick={() =>
                        setOpenModal({
                          id: 0,
                          type: "edit",
                          open: true,
                        })
                      }
                    >
                      <FaPen className="text-green-600 dark:text-green-500" />
                    </div>
                    <div
                      className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20"
                      onClick={() =>
                        setOpenModal({
                          id: 0,
                          type: "delete",
                          open: true,
                        })
                      }
                    >
                      <FaTrash className="text-red-600 dark:text-red-500" />
                    </div>
                  </div>
                </Table.Cell>
              </Table.Body>
            </Table>
          </div>

          <div className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-gray-500 dark:text-gray-400">
              {t("records-number")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {getResourcesQuery.data?.from}-{getResourcesQuery.data?.to} */}
                1 -5
              </span>{" "}
              {t("total-records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {getResourcesQuery.data?.total} */}
                10
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                // onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                // defaultValue={getResourcesQuery.data?.per_page}
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
                onPageChange={(page) => setPage(page)}
                totalPages={3}
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
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
