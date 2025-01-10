import { Checkbox, Input, MultiSelect, Button } from "@src/components/input";
import { addStudent, assignChilds, getGrades, getStudents } from "@api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Card, Modal } from "flowbite-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaImage,
  FaLock,
  FaSearch,
  FaUserPlus,
  FaUserTag,
} from "react-icons/fa";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import Alert from "@components/alert";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface AddChildModal {
  open: boolean;
  toggleOpen: (isOpen: boolean) => void;
  school_id: string;
  guardian_id: number;
}

export interface FormData {
  guardian_id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: number;
  roles: number[];
  subjects: number[];
  grades: number[];
  image: File;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

interface Grades {
  id: string;
  label: string;
}

interface Childs {
  id: string;
  imagePath: string;
  name: string;
  guardian_id: string;
}

type Options = "new" | "exist";

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

function AddChildModal({
  open,
  toggleOpen,
  school_id,
  guardian_id,
}: AddChildModal) {
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const { formData, errors, setFormData, validateForm } = useFormValidation({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(open);
  const [option, setOption] = useState<Options>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedChilds, setSelectedChilds] = useState<number[]>([]);
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const admin = useAppSelector((state) => state.userSlice.user);

  const getChildrensQuery = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: () => getStudents(1, -1, undefined, undefined, admin.school_id),
    placeholderData: keepPreviousData,
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: getGrades,
  });

  const addStudentQuery = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getParents"],
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

  const assignChildsQuery = useMutation({
    mutationFn: assignChilds,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getParents"],
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

  const handleSearch = (e: EventTarget) => {
    setSearchValue((e as HTMLInputElement).value);
    // console.log();
  };

  const onCloseModal = () => {
    addStudentQuery.reset();
    setOpenModal(false);
    toggleOpen(false);
    setOption(undefined);
  };

  const getSelectedChilds = (event: ChangeEvent<HTMLInputElement>) => {
    const ChildId: number = parseInt(event.target?.id);
    if (event.target.checked) {
      setSelectedChilds((prev) => [...prev, ChildId]);
    } else {
      const filtredChildList = selectedChilds.filter(
        (childId) => childId !== ChildId,
      );
      setSelectedChilds(filtredChildList);
    }
  };

  const onSubmitNewChild = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateForm();
    if (validationResult.isValid) {
      try {
        if (img) {
          addStudentQuery.mutate({
            name: formData?.firstName + " " + formData?.lastName,
            email: formData?.email as string,
            school_id: school_id,
            guardian_id: guardian_id,
            password: formData?.password as string,
            password_confirmation: formData?.password_confirmation as string,
            phone: formData?.phone as string,
            roles: [3],
            subjects: [1],
            grades: formData?.grades as number[],
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
    }
  };

  const onSubmitExistingChilds = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    assignChildsQuery.mutate({
      parent_id: guardian_id,
      childrens: selectedChilds,
    });
  };

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
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

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
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
        <Modal.Header>{t("general.add_new_child")}</Modal.Header>
        {option === "new" ? (
          <form onSubmit={onSubmitNewChild}>
            <Modal.Body>
              <div className="flex flex-col gap-8 sm:flex-row">
                <div className="flex min-w-fit flex-col items-center gap-y-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
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
                        custom-style={{ inputStyle: "disabled:opacity-50" }}
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        label={t("form.fields.last_name")}
                        placeholder={t("form.placeholders.last_name")}
                        custom-style={{ inputStyle: "disabled:opacity-50" }}
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="text"
                        id="address"
                        name="address"
                        label={t("form.fields.address")}
                        placeholder={t("form.fields.address")}
                        onChange={(e) => console.log(e.target.value)}
                        custom-style={{ containerStyle: "col-span-full" }}
                      />

                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        label={t("form.fields.phone_number")}
                        placeholder="06 00 00 00"
                        pattern="(06|05)[0-9]{6}"
                        custom-style={{ inputStyle: "disabled:opacity-50" }}
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                      />

                      <Input
                        type="email"
                        id="email"
                        name="email"
                        label={t("form.fields.email")}
                        placeholder={t("form.placeholders.email")}
                        custom-style={{ inputStyle: "disabled:opacity-50" }}
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                        onBlur={() => validateForm()}
                        error={errors?.email}
                      />

                      <MultiSelect
                        label={t("form.fields.grade_levels")}
                        name="grades"
                        onSelectItem={(items) =>
                          setFormData(
                            "grades",
                            items.map((item) => parseInt(item.id)),
                          )
                        }
                      >
                        {getGradesQuery.data?.data.data.map(
                          (grade: Grades, key: number) => (
                            <Checkbox
                              key={key}
                              htmlFor={grade.label}
                              label={grade.label}
                              id={grade.id}
                              name="grades"
                              value={grade.label}
                            />
                          ),
                        )}
                      </MultiSelect>

                      <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-600"></div>

                      <Input
                        type="password"
                        id="password"
                        name="password"
                        label={t("form.fields.password")}
                        placeholder="●●●●●●●"
                        leftIcon={FaLock}
                        rightIcon={(isPasswordVisible) =>
                          isPasswordVisible ? FaEyeSlash : FaEye
                        }
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                        onBlur={() => validateForm()}
                        error={errors?.password}
                      />

                      <Input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        label={t("form.fields.confirm_password")}
                        placeholder="●●●●●●●"
                        leftIcon={FaLock}
                        rightIcon={(isPasswordVisible) =>
                          isPasswordVisible ? FaEyeSlash : FaEye
                        }
                        onChange={(e) =>
                          setFormData(e.target.id, e.target.value)
                        }
                        onBlur={() => validateForm()}
                        error={errors?.password_confirmation}
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
              <button className="btn-danger !w-auto" onClick={onCloseModal}>
                {t("general.decline")}
              </button>
            </Modal.Footer>
          </form>
        ) : option === "exist" ? (
          <form onSubmit={onSubmitExistingChilds}>
            <div className="flex max-h-[70vh] flex-col p-2">
              <div className="sticky z-10 h-full bg-white pb-4 pt-2 dark:bg-gray-700">
                <Input
                  id="search"
                  type="text"
                  leftIcon={FaSearch}
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
                {getChildrensQuery.data?.data.map(
                  (child: Childs, key: number) =>
                    child.name.search(new RegExp(searchValue, "i")) !== -1 && (
                      <div>
                        <Checkbox
                          key={key}
                          htmlFor={child.name}
                          label={child.name}
                          id={child.id}
                          name="childrens"
                          image={
                            <img
                              className="h-7 w-7 rounded-full"
                              src={
                                child?.imagePath
                                  ? SERVER_STORAGE + child?.imagePath
                                  : `https://ui-avatars.com/api/?background=random&name=${getUserName(child?.name).firstName}+${getUserName(child?.name).lastName}`
                              }
                              alt="profile"
                            />
                          }
                          onChange={getSelectedChilds}
                          value={child.name}
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
              <p>{t("actions.new_entity", { entity: t("general.child") })}</p>
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
                {t("actions.existing_entity", { entity: t("general.child") })}
              </p>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
}

export default AddChildModal;
