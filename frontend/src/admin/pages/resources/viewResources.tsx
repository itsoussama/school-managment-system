import { Input, RSelect } from "@src/components/input";

import {
  Breadcrumb,
  Checkbox,
  Modal,
  Pagination,
  Spinner,
  Table,
} from "flowbite-react";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FaExclamationTriangle,
  FaEye,
  FaHome,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getResources,
  getResource,
  getCategories,
  setResource,
  deleteResource,
} from "@api";
import {
  SkeletonContent,
  SkeletonProfile,
  SkeletonTable,
} from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/admin/utils/alert";
import { FaChevronDown, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown"; // DropdownListButton, // DropdownList,

interface Check {
  id?: number;
  status?: boolean;
}

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete";
  open: boolean;
}

interface Resource {
  id: number;
  label: string;
  qty: string;
  school_id: number;
  categories: {
    id: string;
    label: string;
  };
}

export interface FormData {
  _method: string;
  id: number;
  label: string;
  qty: number;
  category_id: number;
  image?: File;
}

interface Data {
  id: number;
  label: string;
  qty: number;
  category_id: number;
  image?: File;
}

interface Category {
  id: number;
  label: string;
}

interface DataError {
  label: string;
  qty: number;
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

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function ViewResources() {
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
  const [closeDropDown, setCloseDropDown] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [data, setData] = useState<Data>({
    id: 0,
    label: "",
    qty: 0,
    category_id: 0,
  });
  const [formError, setFormError] = useState<DataError>({
    label: "",
    qty: 0,
  });
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();
  const { t: fieldTrans } = useTranslation("form-fields");
  const minSm = useBreakpoint("min", "sm");

  // const userId = useRef<string>(null)
  const getAllResourcesQuery = useQuery({
    queryKey: [
      "getAllResources",
      filter?.label,
      filter?.maxQty,
      filter?.minQty,
      filter?.category_id,
    ],
    queryFn: () =>
      getResources(
        1,
        -1,
        undefined,
        undefined,
        admin?.school_id,
        filter?.label,
        filter?.maxQty,
        filter?.minQty,
        filter?.category_id,
      ),
    placeholderData: keepPreviousData,
  });

  const getResourcesQuery = useQuery({
    queryKey: [
      "getResources",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
      filter?.label,
      filter?.maxQty,
      filter?.minQty,
      filter?.category_id,
    ],
    queryFn: () =>
      getResources(
        page,
        perPage,
        sort.column,
        sort.direction,
        admin.school_id,
        filter?.label,
        filter?.maxQty,
        filter?.minQty,
        filter?.category_id,
      ),
    placeholderData: keepPreviousData,
  });

  const getResourceQuery = useQuery({
    queryKey: ["getResource", openModal?.id],
    queryFn: () => getResource(openModal?.id as number),
    enabled: !!openModal?.id,
  });

  const getCategoriesQuery = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(1, -1, undefined, undefined, admin?.id),
  });

  const resourceMutation = useMutation({
    mutationFn: setResource,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getResource"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getResources"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllResources"],
      });

      setData({
        id: data?.id as number,
        label: data?.label as string,
        qty: data?.qty as number,
        category_id: data?.category_id as number,
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);

      setPreviewImg(undefined);
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const deleteResourceQuery = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getResource"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getResources"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllResources"],
      });

      setOpenModal(undefined);
      setPage(1);

      setData({
        id: 0,
        label: "",
        qty: 0,
        category_id: 0,
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  // const [selectedItem, setSelectedItem] = useState()

  const onChange = (event: ChangeEvent) => {
    const inputElem = event.target as HTMLInputElement;
    const selectElem = event.target as HTMLSelectElement;
    // if (event?.target.nodeType)
    setData((prev) => ({
      ...(prev as Data),
      [event.target.id]:
        event?.target.nodeName == "SELECT"
          ? selectElem.options[selectElem.selectedIndex].value
          : inputElem.value,
    }));
    // console.log((event.target as HTMLInputElement).value);
  };

  // const handleClientError = (field: HTMLFormElement) => {
  //   // const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&()\-`.+,/"]).{8,}$/;
  //   const passwordValidation = /[0-9]{8}/;

  //   // Error messages for empty or invalid fields
  //   const messages = {
  //     password:
  //       "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  //     confirm_password: "Passwords do not match. Please try again.",
  //   };

  //   const isEmpty = (value: string) => value.trim() === "";
  //   let error = false;

  //   // Function to set error messages and update the error flag
  //   const setError = (fieldName: string, message: string) => {
  //     setFormError((prev) => ({
  //       ...prev,
  //       [fieldName]: message,
  //     }));
  //     error = true;
  //   };

  //   // Clear error messages if validation is successful
  //   const clearError = (fieldName: string) => {
  //     setFormError((prev) => ({
  //       ...prev,
  //       [fieldName]: "",
  //     }));
  //   };

  //   // Validate password field
  //   if (changePassword) {
  //     if (isEmpty(field.password.value)) {
  //       setError("password", "Password field is required.");
  //     } else if (!passwordValidation.test(field.password.value)) {
  //       setError("password", messages.password);
  //     } else {
  //       clearError("password");
  //     }

  //     // Validate confirm password field
  //     if (isEmpty(field.confirm_password.value)) {
  //       setError("confirm_password", "Please confirm your password.");
  //     } else if (field.password.value !== field.confirm_password.value) {
  //       setError("confirm_password", messages.confirm_password);
  //     } else {
  //       clearError("confirm_password");
  //     }
  //   }

  //   return error;
  // };

  const handleCheck = async (id?: number) => {
    const firstCheckbox = firstCheckboxRef.current as HTMLInputElement;

    if (!id) {
      setChecks([]);
      await handleChecks(firstCheckbox);
    } else {
      const getValue = checks.find((elem) => elem.id === id);
      const filteredArr = checks.filter((elem) => elem.id !== id);
      setChecks([
        ...(filteredArr as []),
        { id: id, status: !getValue?.status },
      ]);
      firstCheckbox.checked = false;
    }
  };

  const handleChecks = useCallback(
    async (firstCheckbox: HTMLInputElement) => {
      if (getAllResourcesQuery.isFetched) {
        await getAllResourcesQuery.data?.forEach((resource: Resource) => {
          setChecks((prev) => {
            const checkedData = prev.some((item) => item.id === resource.id);

            if (firstCheckbox.checked && !checkedData) {
              return [...prev, { id: resource.id as number, status: true }];
            }
            return [...prev, { id: resource.id as number, status: false }];
          });
        });
      }
    },
    [getAllResourcesQuery.data, getAllResourcesQuery.isFetched],
  );

  const handleSort = (column: string) => {
    setSortPosition((prev) => prev + 1);
    switch (sortPosition) {
      case 0:
        setSort({ column: column, direction: "asc" });
        console.log("ascending");
        return;
      case 1:
        setSort({ column: column, direction: "desc" });
        console.log("descending");
        return;
      default:
        setSort({ column: "id", direction: "asc" });
        console.log("normal");
        setSortPosition(0);
        return;
    }
  };

  const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    target.minQty;
    setFilter((prev) => ({
      ...prev,
      minQty:
        target.minQty.value !== "" ? Number(target.minQty.value) : undefined,
      maxQty:
        target.maxQty.value !== "" ? Number(target.maxQty.value) : undefined,
    }));

    setCloseDropDown(true);
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
    }
  };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const input = event.target as HTMLFormElement;

    // if (!handleClientError(input)) {
    const form: FormData = {
      _method: "PUT",
      id: data?.id,
      label: data?.label,
      qty: data?.qty,
      category_id: data?.category_id,
    };

    if (img) {
      form["image"] = img[0];
    }

    resourceMutation.mutate(form);
    // } else {
    //   toggleAlert({
    //     status: "fail",
    //     message: {
    //       message: "Operation Failed",
    //       description: "Something went wrong. Please try again later.",
    //     },

    //     state: true,
    //   });
    // }
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (input.verfication.value !== getResourceQuery.data?.label) {
      setIsVerficationMatch(false);
      return;
    }

    deleteResourceQuery.mutate(openModal?.id as number);
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const ResourceData = await queryClient.ensureQueryData({
      queryKey: ["getResource", id],
      queryFn: () => getResource(id),
    });

    setData({
      id: ResourceData?.id,
      label: ResourceData?.label,
      qty: ResourceData?.qty,
      category_id: ResourceData?.category_id,
    });
  };

  const onCloseModal = () => {
    resourceMutation.reset();
    setOpenModal(undefined);

    setData({
      id: 0,
      label: "",
      qty: 0,
      category_id: 0,
    });

    setFormError({
      label: "",
      qty: 0,
    });
  };

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  // const getUserName = (fullName: string) => {
  //   const nameParts = fullName?.trim().split(/\s+/);
  //   const firstName = nameParts?.slice(0, -1).join(" ");
  //   const lastName = nameParts?.slice(-1).join(" ");

  //   return { firstName, lastName };
  // };

  const readAndPreview = (file: FileList) => {
    if (/\.(jpe?g|png|gif)$/i.test(file[0].name)) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (event) => {
        setPreviewImg(event.target?.result as string);
      });
      fileReader.readAsDataURL(file[0]);
    }
  };

  useEffect(() => {
    const alertState = location.state?.alert;
    toggleAlert({
      status: alertState?.status,
      message: alertState?.message,
      state: alertState?.state,
    });
    window.history.replaceState({}, "");
  }, [location]);

  useEffect(() => {
    const checkedVal = checks.filter((val) => val.status === true)
      .length as number;
    setNumChecked(checkedVal);
  }, [checks]);

  useEffect(() => {
    if (isCheckBoxAll) {
      handleChecks(firstCheckboxRef.current as HTMLInputElement);
    }
  }, [page, handleChecks]);

  return (
    <div className="flex w-full flex-col">
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
            base: "p-6 max-sm:h-screen max-sm:overflow-y-auto",
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
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("item-information")}
                </h1>
                <SkeletonContent isLoaded={getResourceQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("label")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getResourceQuery.data?.label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("quantity")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getResourceQuery.data?.qty}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("category")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getResourceQuery.data?.categories.label}
                      </span>
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
        <form onSubmit={onSubmitUpdate}>
          <Modal.Header>
            {t("resource-id")}:<b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="flex min-w-fit flex-col items-center gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                <SkeletonProfile
                  imgSource={
                    getResourceQuery.data?.imagePath
                      ? SERVER_STORAGE + getResourceQuery.data?.imagePath
                      : `https://ui-avatars.com/api/?background=random&name=${getResourceQuery.data?.label}`
                  }
                  className="h-40 w-40"
                />

                <button className="btn-gray relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute left-0 top-0 cursor-pointer opacity-0"
                    onChange={handleImageUpload}
                  />
                  {fieldTrans("upload-photo")}
                </button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("accepted-format")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      jpg, jpeg, png
                    </span>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("maximum-size")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      1024 mb
                    </span>
                  </span>
                </div>
              </div>
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {t("item-information")}
                  </h1>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="label"
                      name="label"
                      label={fieldTrans("label")}
                      placeholder={fieldTrans("label-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getResourceQuery.isFetching && true}
                      value={data?.label}
                      onChange={onChange}
                    />

                    <Input
                      type="number"
                      id="qty"
                      name="qty"
                      label={fieldTrans("quantity")}
                      placeholder="20"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getResourceQuery.isFetching && true}
                      value={data?.qty}
                      onChange={onChange}
                    />

                    <RSelect
                      id="category_id"
                      name="categories"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getResourceQuery.isFetching && true}
                      defaultValue={data?.id}
                      onChange={onChange}
                    >
                      {getCategoriesQuery.data?.map(
                        (category: Category, index: number) => (
                          <option
                            key={index}
                            value={category.id}
                            selected={
                              data?.category_id == category.id ? true : false
                            }
                          >
                            {category.label}
                          </option>
                        ),
                      )}
                    </RSelect>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {fieldTrans("accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
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
        <form onSubmit={onSubmitDelete}>
          <Modal.Header>{t("delete-modal")}</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("delete-modal-title")} <b>{getResourceQuery.data?.label}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">
                  {t("delete-resource-modal-message")}
                </p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("delete-modal-label")} <b>{getResourceQuery.data?.label}</b>
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("delete-modal-error") : null}
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
          {checks.find((val) => val.status === true) ? (
            <div className="flex w-full justify-between px-5 py-4">
              <div className="flex items-center gap-x-4">
                {/* <CheckboxDropdown /> */}

                <button className="btn-danger !m-0 flex w-max items-center">
                  <FaTrash className="mr-2 text-white" />
                  {t("delete-records")}
                  <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${numChecked}`}</span>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

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
                    ref={firstCheckboxRef}
                    onChange={() => handleCheck()}
                  />
                </Table.HeadCell>
                <Table.HeadCell>{t("item-id")}</Table.HeadCell>
                <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">{fieldTrans("label")}</span>
                    <div
                      className="flex flex-col"
                      onClick={() => handleSort("label")}
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
                <Table.HeadCell>{fieldTrans("quantity")}</Table.HeadCell>
                <Table.HeadCell>{fieldTrans("category")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">Actions</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="divide-y divide-gray-300 dark:divide-gray-600"
              >
                {getResourcesQuery.isFetching &&
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
                  )}
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
                        onClose={() => closeDropDown}
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
                                      onClick={() => (
                                        setCloseDropDown(true),
                                        setFilter((prev) => ({
                                          ...prev,
                                          maxQty: undefined,
                                          minQty: undefined,
                                        }))
                                      )}
                                      // onClick={(e) => e.stopPropagation()}
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
                        <form onSubmit={handleFilter}>
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
                      {getCategoriesQuery.data?.map(
                        (category: Category, index: number) => (
                          <option key={index} value={category.id}>
                            {category.label}
                          </option>
                        ),
                      )}
                    </RSelect>
                  </Table.Cell>
                </Table.Row>
                {getResourcesQuery.isFetching &&
                !(getResourcesQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={5} />
                ) : (
                  getResourcesQuery?.data.data.map(
                    (resource: Resource, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          <Checkbox
                            className="rounded-xs"
                            id={resource.id.toString()}
                            name="checkbox"
                            checked={
                              checks.find((check) => check.id == resource.id)
                                ?.status == true
                                ? true
                                : false
                            }
                            onChange={() => handleCheck(resource.id)}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {resource.id}
                        </Table.Cell>
                        <Table.Cell>{resource.label}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {resource.qty}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex w-max max-w-36 flex-wrap">
                            {resource.categories.label}
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          <div className="flex w-fit gap-x-2">
                            <div
                              onClick={() =>
                                setOpenModal({
                                  id: resource.id,
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
                                onOpenEditModal({
                                  id: resource.id,
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
                                  id: resource.id,
                                  type: "delete",
                                  open: true,
                                })
                              }
                            >
                              <FaTrash className="text-red-600 dark:text-red-500" />
                            </div>
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
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
