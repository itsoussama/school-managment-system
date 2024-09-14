import { Checkbox, Input, MultiSelect } from "@src/components/input";
import { SkeletonProfile } from "@src/components/skeleton";
import { addStudent, getGrades } from "@src/features/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Modal } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLock, FaUserPlus, FaUserTag } from "react-icons/fa";

interface AddChildModal {
  open: boolean;
  toggleOpen: (isOpen: boolean) => void;
  school_id: number;
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
}

interface Grades {
  id: string;
  label: string;
}

type Options = "new" | "exist";

function AddChildModal({
  open,
  toggleOpen,
  school_id,
  guardian_id,
}: AddChildModal) {
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const { t: fieldTrans } = useTranslation("form-fields");
  const [openModal, setOpenModal] = useState<boolean>(open);
  const [option, setOption] = useState<Options>();
  const [formData, setFormData] = useState<FormData>();

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
    },
  });

  const handleChange = (property: string, value: string | number[]) => {
    setFormData((prev) => ({
      ...(prev as FormData),
      [property]: value,
    }));
  };

  const onCloseModal = () => {
    addStudentQuery.reset();
    setOpenModal(false);
    toggleOpen(false);
    setOption(undefined);
    setFormData({
      name: "",
      firstName: "",
      lastName: "",
      guardian_id: 0,
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      school_id: 0,
      roles: [],
      subjects: [],
      grades: [],
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(formData);
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
    });
  };

  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  return (
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
      <Modal.Header>{t("add-new-child")}</Modal.Header>
      {option === "new" ? (
        <form onSubmit={onSubmit}>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="flex min-w-fit flex-col items-center gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                <SkeletonProfile
                  imgSource="https://avatar.iran.liara.run/public/girl"
                  className="h-40 w-40"
                />
                <button className="btn-dark dark:btn-gray">Upload photo</button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {fieldTrans("accepted-format")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      jpg, jpeg, png
                    </span>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {fieldTrans("maximum-size")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      1024 mb
                    </span>
                  </span>
                </div>
              </div>
              <div className="box-border flex w-full flex-col gap-6 sm:max-h-[60vh] sm:overflow-y-auto">
                <div className="w-full space-y-3">
                  <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {t("personal-information")}
                  </h1>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      label={fieldTrans("first-name")}
                      placeholder={fieldTrans("first-name-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      value={formData?.firstName}
                      onChange={(e) =>
                        handleChange(e.target.id, e.target.value)
                      }
                    />

                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      label={fieldTrans("last-name")}
                      placeholder={fieldTrans("last-name-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      value={formData?.lastName}
                      onChange={(e) =>
                        handleChange(e.target.id, e.target.value)
                      }
                    />

                    <Input
                      type="text"
                      id="address"
                      name="address"
                      label={fieldTrans("address")}
                      placeholder={fieldTrans("address-placeholder")}
                      value="123 Rue Principale"
                      onChange={(e) => console.log(e.target.value)}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      label={fieldTrans("phone-number")}
                      placeholder="06 00 00 00"
                      pattern="(06|05)[0-9]{6}"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      value={formData?.phone}
                      onChange={(e) =>
                        handleChange(e.target.id, e.target.value)
                      }
                    />

                    <Input
                      type="email"
                      id="email"
                      name="email"
                      label={fieldTrans("email")}
                      placeholder={fieldTrans("email-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      value={formData?.email}
                      onChange={(e) =>
                        handleChange(e.target.id, e.target.value)
                      }
                    />

                    <MultiSelect
                      label={fieldTrans("grade-levels")}
                      name="grades"
                      onSelectItem={(items) =>
                        handleChange(
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
                      label={fieldTrans("password")}
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
                      label={fieldTrans("confirm-password")}
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
            <button type="submit" className="btn-default !w-auto">
              {fieldTrans("accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {fieldTrans("decline")}
            </button>
          </Modal.Footer>
        </form>
      ) : option === "exist" ? (
        <span></span>
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
            <p>{t("new-child")}</p>
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
            <p>{t("existing-child")}</p>
          </Card>
        </div>
      )}
    </Modal>
  );
}

export default AddChildModal;
