import { Input, RSelect } from "@src/components/input";

import {
  Badge,
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
  FaLock,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteUser, getUser, getParents, setUser } from "@api";
import { SkeletonContent, SkeletonProfile } from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { DropdownListButton } from "@src/components/dropdown";

interface Check {
  id?: string;
  status?: boolean;
}

interface Modal {
  id: string;
  type?: "view" | "edit" | "delete";
  open: boolean;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: [
    {
      id: string;
      name: string;
    },
  ];
  childrens: [
    {
      id: string;
      name: string;
    },
  ];
}

export interface FormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}

export function ViewParents() {
  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["getTeacher"] });

  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checkAll, setCheckAll] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const [dropDownPos, setDropDownPos] = useState<EventTarget>();
  const [formData, setFormData] = useState<FormData>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  // const badgeColor = ["blue", "green", "pink", "purple", "red", "yellow"];

  const getParentsQuery = useQuery({
    queryKey: [
      "getParents",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
    ],
    queryFn: () =>
      getParents(page, perPage, sort.column, sort.direction, admin.school_id),
    placeholderData: keepPreviousData,
  });

  const getStudentQuery = useQuery({
    queryKey: ["getParent", openModal?.id],
    queryFn: () => getUser(openModal?.id as string),
    enabled: !!openModal?.id,
  });

  const setUserQuery = useMutation({
    mutationFn: setUser,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getParent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      setFormData({
        id: data?.id,
        firstName: data?.name,
        lastName: data?.name,
        email: data?.email,
        phone: data?.phone,
      });
    },
  });

  const deleteUserQuery = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getParents"] });
      // setOpenDeleteModal(undefined);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    },
  });
  // const [selectedItem, setSelectedItem] = useState()

  const handleCheckAll = useCallback(
    (firstCheckbox: HTMLInputElement) => {
      if (getParentsQuery.isFetched) {
        getParentsQuery.data?.data.data.forEach((parent: Parent) => {
          setCheckAll((prev) => {
            const alreadyChecked = prev.some((item) => item.id === parent.id);
            if (firstCheckbox.checked && !alreadyChecked) {
              return [...prev, { id: parent.id as string, status: true }];
            }
            return prev;
          });
          isCheckBoxAll.current = true;
        });
      }
    },
    [getParentsQuery.data?.data, getParentsQuery.isFetched],
  );

  const handleCheck = (id = "") => {
    const firstCheckbox = firstCheckboxRef.current as HTMLInputElement;

    if (id == "") {
      setCheckAll([]);
      handleCheckAll(firstCheckbox);
      // document.getElementsByName("checkbox").forEach((elem) => {
      //   const checkbox = elem as HTMLInputElement;
      //   // console.log(firstCheckbox.ariaChecked);

      //   if (firstCheckbox.checked) {
      //     checkbox.checked = true;
      //     setCheckAll((prev) => [
      //       ...(prev as []),
      //       { id: id as string, status: true },
      //     ]);
      //   } else {
      //     checkbox.checked = false;
      //     setCheckAll((prev) => [
      //       ...(prev as []),
      //       { id: id as string, status: false },
      //     ]);
      //   }
      // });
    } else {
      const getValue = checkAll.find((elem) => elem.id === id);
      const filteredArr = checkAll.filter((elem) => elem.id !== id);

      setCheckAll([
        ...(filteredArr as []),
        { id: id, status: !getValue?.status },
      ]);
      firstCheckbox.checked = false;
    }
  };

  const onChange = (event: ChangeEvent) => {
    setFormData((prev) => ({
      ...(prev as FormData),
      [event.target.id]: (event.target as HTMLInputElement).value,
    }));
    // console.log((event.target as HTMLInputElement).value);
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const { data: StudentData } = await queryClient.ensureQueryData({
      queryKey: ["getStudent", id],
      queryFn: () => getUser(id),
    });

    setFormData({
      id: StudentData?.id,
      firstName: StudentData?.name,
      lastName: StudentData?.name,
      email: StudentData?.email,
      phone: StudentData?.phone,
    });
  };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(formData);
    setUserQuery.mutate(formData as FormData);
    setOpenModal((prev) => ({
      id: prev?.id as string,
      open: false,
    }));
  };

  const onCloseModal = () => {
    setUserQuery.reset();
    setOpenModal((prev) => ({
      id: prev?.id as string,
      open: false,
    }));

    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (input.verfication.value !== getStudentQuery.data?.data.name) {
      setIsVerficationMatch(false);
      return;
    }

    deleteUserQuery.mutate(openModal?.id as string);
    setOpenModal((prev) => ({
      id: prev?.id as string,
      open: false,
    }));
  };

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

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  useEffect(() => {
    const checkedVal = checkAll.filter((val) => val.status === true)
      .length as number;
    setNumChecked(checkedVal);
  }, [checkAll]);

  useEffect(() => {
    if (isCheckBoxAll) {
      handleCheckAll(firstCheckboxRef.current as HTMLInputElement);
    }
  }, [page, handleCheckAll]);

  return (
    <div className="flex w-full flex-col">
      <Breadcrumb
        className="my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white px-5 py-3 text-gray-700 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb"
      >
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {t("home")}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 dark:text-gray-300">
            {t("parents")}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("view-parents")}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        // size={"md"}
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
        onClose={onCloseModal}
      >
        <Modal.Header>{openModal?.id}</Modal.Header>
        <Modal.Body>
          <div className="flex gap-x-8">
            <div className="flex flex-col items-start rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource="https://i.pravatar.cc/300"
                imgSize={{ width: "w-40", height: "h-40" }}
              />
            </div>
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  Personal Information
                </h1>
                <SkeletonContent isLoaded={getStudentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        First name:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {
                          getStudentQuery.data?.data.name.split(" ")[
                            getStudentQuery.data?.data.name.split(" ").length -
                              2
                          ]
                        }
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        Last name:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {
                          getStudentQuery.data?.data.name.split(" ")[
                            getStudentQuery.data?.data.name.split(" ").length -
                              1
                          ]
                        }
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getStudentQuery.data?.data.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        Phone:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getStudentQuery.data?.data.phone}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        Address:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        123 Rue Principale
                      </span>
                    </div>
                  </div>
                </SkeletonContent>
              </div>

              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  Academic Information
                </h1>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Subject:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Maths
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Grade Levels:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      9th, 10th
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Start date:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      2024/01/01
                    </span>
                  </div>
                </div>
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
            base: "p-6",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <form onSubmit={onSubmitUpdate}>
          <Modal.Header>{openModal?.id}</Modal.Header>
          <Modal.Body>
            <div className="flex gap-x-8">
              <div className="flex min-w-fit flex-col items-start gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                <SkeletonProfile
                  imgSource="https://i.pravatar.cc/300"
                  imgSize={{ width: "w-40", height: "h-40" }}
                />
                <button className="btn-dark dark:btn-gray">Upload photo</button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    Accepted format:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      jpg, jpeg, png
                    </span>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    Maximum size:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      1024 mb
                    </span>
                  </span>
                </div>
              </div>
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    Personal Information
                  </h1>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      label="First name"
                      placeholder="First name"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={formData?.firstName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      label="Last name"
                      placeholder="Last name"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={formData?.lastName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="address"
                      name="address"
                      label="Address"
                      placeholder="123 Rue Principale"
                      value="123 Rue Principale"
                      onChange={(e) => console.log(e.target.value)}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      label="Phone number"
                      placeholder="06 00 00 00"
                      pattern="(06|05)[0-9]{6}"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={formData?.phone}
                      onChange={onChange}
                    />

                    <Input
                      type="email"
                      id="email"
                      name="email"
                      label="Email"
                      placeholder="Johndoe@example.com"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={formData?.email}
                      onChange={onChange}
                    />

                    <Input
                      type="password"
                      id="password"
                      name="password"
                      label="Password"
                      placeholder="●●●●●●●"
                      custom-style={{
                        inputStyle: "px-10",
                      }}
                      icon={
                        <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      }
                      onChange={(e) => console.log(e.target.value)}
                    />

                    <Input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      label="Confirm password"
                      placeholder="●●●●●●●"
                      custom-style={{
                        inputStyle: "px-10",
                      }}
                      icon={
                        <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      }
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              I accept
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              Decline
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
          <Modal.Header>Delete User</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <b>{getStudentQuery.data?.data.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">
                  This will delete the user completely, and you can not undo
                  this action
                </p>
              </div>
              <p className="text-gray-900 dark:text-white">
                Please retype <b>{getStudentQuery.data?.data.name}</b>
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? "Values doesn't match" : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              Delete
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              No, cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="flex w-full flex-col rounded-m bg-light-primary dark:bg-dark-primary">
        {checkAll.find((val) => val.status === true) ? (
          <div className="flex w-full justify-between px-5 py-4">
            <div className="flex items-center gap-x-4">
              {/* <CheckboxDropdown /> */}

              <button className="btn-danger !m-0 flex w-max items-center">
                <FaTrash className="mr-2 text-white" />
                Delete
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
                base: "w-full whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400",
                shadow:
                  "absolute left-0 top-0 -z-10 h-full w-full rounded-s bg-white drop-shadow-md dark:bg-black",
                wrapper: "relative z-auto",
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
            <Table.Head className="uppercase">
              <Table.HeadCell className="w-0 p-4">
                <Checkbox
                  id="0"
                  ref={firstCheckboxRef}
                  onChange={() => handleCheck()}
                />
              </Table.HeadCell>
              <Table.HeadCell>UID</Table.HeadCell>
              <Table.HeadCell>
                <div className="flex items-center justify-center gap-x-3">
                  <span className="inline-block">Fullname</span>
                  <div
                    className="flex flex-col"
                    onClick={() => handleSort("name")}
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
              <Table.HeadCell>Child(s)</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Active time</Table.HeadCell>
              <Table.HeadCell className="w-0">
                <span className="sr-only w-full">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body ref={tableRef} className="divide-y">
              {getParentsQuery.isLoading ||
                (getParentsQuery.isFetching && (
                  <Table.Row>
                    <Table.Cell className="p-0">
                      <div
                        className={`table-loader absolute left-0 top-0 z-auto grid h-full min-h-72 w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50`}
                      >
                        <Spinner />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              <Table.Row>
                <Table.Cell className="p-2"></Table.Cell>
                <Table.Cell className="p-2"></Table.Cell>
                <Table.Cell className="p-2">
                  {/* <div className="h-2 w-12 bg-red-600"></div> */}
                  <Input
                    id="search"
                    type="text"
                    icon={
                      <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    }
                    label=""
                    placeholder="All"
                    name="search"
                    custom-style={{
                      inputStyle: "px-8 !py-1",
                      labelStyle: "mb-0 !inline",
                    }}
                  />
                </Table.Cell>
                <Table.Cell className="p-2">
                  <Input
                    id="search"
                    type="text"
                    icon={
                      <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    }
                    label=""
                    placeholder="All"
                    name="search"
                    custom-style={{
                      inputStyle: "px-8 !py-1",
                      labelStyle: "mb-0 !inline",
                    }}
                  />
                </Table.Cell>
                <Table.Cell className="p-2"></Table.Cell>
                <Table.Cell className="p-2"></Table.Cell>
                <Table.Cell className="p-2"></Table.Cell>
                <Table.Cell className="p-2"></Table.Cell>
              </Table.Row>
              {getParentsQuery.data?.data.data.map(
                (parent: Parent, key: number) => (
                  <Table.Row
                    key={key}
                    className="w-max !border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="p-4">
                      <Checkbox
                        id={(key + 1).toString()}
                        name="checkbox"
                        onChange={(ev) => handleCheck(ev.currentTarget.id)}
                        data-id={key}
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                      {parent.id}
                    </Table.Cell>
                    <Table.Cell>{parent.name}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                      <div
                        className="flex items-center gap-x-2"
                        onMouseOver={(e) => setDropDownPos(e.currentTarget)}
                        data-id={key}
                      >
                        {parent.childrens.length > 2 ? (
                          <div className="flex -space-x-4 rtl:space-x-reverse">
                            {parent.childrens.map(
                              (child, key) =>
                                key < 1 && (
                                  <img
                                    key={key}
                                    className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                    src="https://i.pravatar.cc/300?img=12"
                                    alt="profile"
                                  />
                                ),
                            )}
                            <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500">
                              {`+${parent.childrens.length - 2}`}
                            </div>
                          </div>
                        ) : parent.childrens.length > 1 ? (
                          <div className="flex -space-x-4 rtl:space-x-reverse">
                            {parent.childrens.map(
                              (child, key) =>
                                key < 1 && (
                                  <img
                                    key={key}
                                    className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                    src="https://i.pravatar.cc/300?img=12"
                                    alt="profile"
                                  />
                                ),
                            )}
                            <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500">
                              {`+${parent.childrens.length - 1}`}
                            </div>
                          </div>
                        ) : parent.childrens.length == 1 ? (
                          <>
                            <img
                              className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                              src="https://i.pravatar.cc/300?img=12"
                              alt="profile"
                            />
                            <span>{parent.childrens[0]?.name}</span>
                          </>
                        ) : (
                          <a
                            href="#"
                            className="flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            <FaUser className="me-2" />
                            Add new child
                          </a>
                        )}
                        {dropDownPos && parent.childrens.length > 0 && (
                          <DropdownListButton
                            position={dropDownPos}
                            elemId={key.toString()}
                          >
                            <DropdownListButton.List>
                              {parent.childrens.map((child, key) => (
                                <DropdownListButton.Item
                                  key={key}
                                  img="https://i.pravatar.cc/300?img=12"
                                  name={child.name}
                                />
                              ))}
                            </DropdownListButton.List>
                            <DropdownListButton.Button>
                              Add new child
                            </DropdownListButton.Button>
                          </DropdownListButton>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                      {parent.email}
                    </Table.Cell>
                    <Table.Cell>{parent.phone}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                      {/* <span>
                      {formatDuration(parent.time_spent).hour}
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        h{" "}
                      </span>
                      {formatDuration(parent.time_spent).minute > 0
                        ? formatDuration(parent.time_spent).minute
                        : ""}
                      <span
                        className="text-gray-500 dark:text-gray-400"
                        hidden={formatDuration(parent.time_spent).minute <= 0}
                      >
                        {" "}
                        min
                      </span>
                    </span> */}
                    </Table.Cell>
                    <Table.Cell className="flex w-fit gap-x-2">
                      <div className="flex w-fit gap-x-2">
                        <div
                          onClick={() =>
                            setOpenModal({
                              id: parent.id,
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
                              id: parent.id,
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
                              id: parent.id,
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
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex w-full items-center justify-between px-5 py-4">
          <span className="text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {getParentsQuery.data?.data.from}-{getParentsQuery.data?.data.to}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {getParentsQuery.data?.data.total}
            </span>
          </span>
          <div className="flex items-center gap-x-4">
            <RSelect
              id="row-num"
              name="row-num"
              onChange={handlePerPage}
              custom-style={{ inputStyle: "!py-2" }}
              defaultValue={getParentsQuery.data?.data.per_page}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </RSelect>
            <Pagination
              currentPage={page}
              onPageChange={(page) =>
                !getParentsQuery.isPlaceholderData && setPage(page)
              }
              totalPages={getParentsQuery.data?.data.last_page ?? 1}
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
    </div>
  );
}
