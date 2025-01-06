import { Button, Checkbox, Input } from "@components/input";
import { addParent, assignParent, getParents } from "@api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaImage,
  FaLock,
  FaSearch,
  FaUserPlus,
  FaUserTag,
} from "react-icons/fa";
import { Card, Modal } from "flowbite-react";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import Alert from "@components/alert";
import { useAppSelector } from "@src/hooks/useReduxEvent";

interface AddParentModal {
  open: boolean;
  toggleOpen: (isOpen: boolean) => void;
  school_id: string;
  child_id: number;
}

export interface FormData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: string;
  childrens: number[];
  roles: number[];
  image: File;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

interface Parent {
  id: string;
  imagePath: string;
  name: string;
}

type Options = "new" | "exist";

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function AddParentModal({
  open,
  toggleOpen,
  school_id,
  child_id,
}: AddParentModal) {
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const [data, setData] = useState<FormData>();
  const [img, setImg] = useState<FileList>();
  const [openModal, setOpenModal] = useState<boolean>(open);
  const [option, setOption] = useState<Options>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const admin = useAppSelector((state) => state.userSlice.user);

  const getParentsQuery = useQuery({
    queryKey: ["getAllParents"],
    queryFn: () => getParents(1, -1, undefined, undefined, admin.school_id),
    placeholderData: keepPreviousData,
  });

  const addParentQuery = useMutation({
    mutationFn: addParent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      setOpenModal(false);
      toggleOpen(false);

      setPreviewImg(undefined);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
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

  const assignParentQuery = useMutation({
    mutationFn: assignParent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      setOpenModal(false);
      toggleOpen(false);
      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
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

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  const handleSearch = (e: EventTarget) => {
    setSearchValue((e as HTMLInputElement).value);
    // console.log();
  };

  const onCloseModal = () => {
    addParentQuery.reset();
    toggleOpen(false);
    setOption(undefined);
  };

  const getSelectedParent = (event: ChangeEvent<HTMLInputElement>) => {
    const parentId: number = parseInt(event.target?.id);
    if (event.target.checked) {
      setSelectedParent(parentId);
    } else {
      setSelectedParent(null);
    }
  };

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

  const onSubmitNewParent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (img) {
        addParentQuery.mutate({
          name: data?.firstName + " " + data?.lastName,
          email: data?.email as string,
          school_id: school_id,
          password: data?.password as string,
          password_confirmation: data?.password_confirmation as string,
          phone: data?.phone as string,
          childrens: [child_id],
          roles: [4],
          image: img[0],
        });
      } else {
        throw new Error("image not found");
      }
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }
  };

  const onSubmitExistingParent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    assignParentQuery.mutate({
      child_id: child_id,
      parent: selectedParent as number,
    });
  };

  const readAndPreview = (file: FileList) => {
    if (/\.(jpe?g|png|gif)$/i.test(file[0].name)) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (event) => {
        setPreviewImg(event.target?.result as string);
      });
      fileReader.readAsDataURL(file[0]);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
    }
  };

  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={(value) => toggleAlert(value)}
      />

      <Modal
        show={openModal}
        size={option ? "4xl" : "xl"}
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
        <Modal.Header>
          {t("actions.add_entity", { entity: t("entities.parent") })}
        </Modal.Header>
        {option === "new" ? (
          <form onSubmit={onSubmitNewParent}>
            <Modal.Body>
              <div className="flex flex-col gap-8 sm:flex-row">
                <div className="flex min-w-fit flex-col items-center gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                  {previewImg ? (
                    <img
                      className="h-44 w-44 rounded-full object-cover"
                      src={previewImg}
                      alt="profile"
                    />
                  ) : (
                    <div
                      className={`flex h-44 w-44 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700`}
                    >
                      <FaImage className="h-10 w-10 text-gray-200 dark:text-gray-600" />
                    </div>
                  )}
                  <button className="btn-gray relative overflow-hidden">
                    <input
                      type="file"
                      className="absolute left-0 top-0 cursor-pointer opacity-0"
                      onChange={handleImageUpload}
                    />
                    {t("form.buttons.upload", { label: t("general.photo") })}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-700 dark:text-gray-500">
                      {t("form.general.accepted_format")}:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        jpg, jpeg, png
                      </span>
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-500">
                      {t("form.general.maximum_size")}:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        1024 mb
                      </span>
                    </span>
                  </div>
                </div>
                <div className="box-border flex w-full flex-col gap-6 sm:max-h-[60vh] sm:overflow-y-auto">
                  <div className="w-full space-y-3">
                    <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                      {t("information.personal_information")}
                    </h1>
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        label={t("form.fields.first_name")}
                        placeholder={t("form.placeholders.first_name")}
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        label={t("form.fields.last_name")}
                        placeholder={t("form.placeholders.last_name")}
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="text"
                        id="address"
                        name="address"
                        label={t("form.fields.address")}
                        placeholder={t("form.placeholders.address")}
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                        custom-style={{ containerStyle: "col-span-full" }}
                      />

                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        label={t("form.fields.phone_number")}
                        placeholder="06 00 00 00"
                        pattern="(06|05)[0-9]{2}[0-9]{4}"
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="email"
                        id="email"
                        name="email"
                        label={t("form.fields.email")}
                        placeholder="Johndoe@example.com"
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />

                      <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-600"></div>

                      <Input
                        type="password"
                        id="password"
                        name="password"
                        label={t("form.fields.password")}
                        placeholder="●●●●●●●"
                        custom-style={{
                          inputStyle: "px-10",
                        }}
                        icon={
                          <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        }
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        label={t("form.fields.confirm_password")}
                        placeholder="●●●●●●●"
                        custom-style={{
                          inputStyle: "px-10",
                        }}
                        icon={
                          <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        }
                        onChange={(e) =>
                          handleChange(e.target.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn-default !w-auto">
                {t("general.accept")}
              </Button>
              <button
                type="button"
                className="btn-danger !w-auto"
                onClick={onCloseModal}
              >
                {t("general.decline")}
              </button>
            </Modal.Footer>
          </form>
        ) : option === "exist" ? (
          <form onSubmit={onSubmitExistingParent}>
            <div className="flex max-h-[70vh] flex-col p-2">
              <div className="sticky z-10 h-full bg-white pb-4 pt-2 dark:bg-gray-700">
                <Input
                  id="search"
                  type="text"
                  icon={
                    <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  }
                  label=""
                  onKeyUp={(e) => handleSearch(e.target)}
                  placeholder={t("general.all")}
                  name="search"
                  custom-style={{
                    inputStyle: "px-8 !py-1",
                    labelStyle: "mb-0 !inline",
                  }}
                />
              </div>
              <div className="flex flex-col gap-y-3 overflow-y-auto">
                {getParentsQuery.data?.data.map(
                  (parent: Parent, key: number) =>
                    parent.name.search(new RegExp(searchValue, "i")) !== -1 && (
                      <div key={key}>
                        <Checkbox
                          htmlFor={parent.name}
                          label={parent.name}
                          id={parent.id}
                          name="childrens"
                          image={
                            <img
                              className="h-7 w-7 rounded-full"
                              src={
                                parent?.imagePath
                                  ? SERVER_STORAGE + parent?.imagePath
                                  : `https://ui-avatars.com/api/?background=random&name=${getUserName(parent?.name).firstName}+${getUserName(parent?.name).lastName}`
                              }
                              alt="profile"
                            />
                          }
                          onChange={getSelectedParent}
                          disabled={
                            selectedParent &&
                            selectedParent != parseInt(parent.id)
                              ? true
                              : false
                          }
                          custom-style={{
                            containerStyle: `${selectedParent && selectedParent != parseInt(parent.id) ? "disable" : ""}`,
                          }}
                          value={parent.name}
                        />
                      </div>
                    ),
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button type="submit" className="btn-default !w-auto">
                {t("general.accept")}
              </Button>
              <button className="btn-danger !w-auto" onClick={onCloseModal}>
                {t("general.decline")}
              </button>
            </Modal.Footer>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-3 py-9">
            <Card
              onClick={() => setOption("new")}
              theme={{
                root: {
                  base: "flex rounded-s cursor-pointer border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700",
                  children:
                    "flex h-full w-56  flex-col items-center justify-center gap-4 p-12",
                },
              }}
              className="font-normal text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <FaUserPlus size={48} />
              <p>
                {t("actions.new_entity", {
                  entity:
                    t("determiners.indefinite.masculine") +
                    " " +
                    t("entities.parent"),
                })}
              </p>
            </Card>
            <Card
              onClick={() => setOption("exist")}
              theme={{
                root: {
                  base: "flex rounded-s cursor-pointer border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700",
                  children:
                    "flex h-full w-56 flex-col items-center justify-center gap-4 p-12",
                },
              }}
              className="font-normal text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <FaUserTag size={48} />
              <p>
                {t("actions.existing_entity", { entity: t("entities.parent") })}
              </p>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
}
