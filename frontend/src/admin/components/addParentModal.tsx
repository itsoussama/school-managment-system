import { Input } from "@components/input";
import { addParent } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaImage, FaLock } from "react-icons/fa";
import { Modal } from "flowbite-react";

interface AddParentModal {
  open: boolean;
  toggleOpen: (isOpen: boolean) => void;
  school_id: number;
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
  school_id: number;
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

export default function AddParentModal({
  open,
  toggleOpen,
  school_id,
  child_id,
}: AddParentModal) {
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const { t: fieldsTrans } = useTranslation("form-fields");
  const [data, setData] = useState<FormData>();
  const [img, setImg] = useState<FileList>();
  const [openModal, setOpenModal] = useState<boolean>(open);
  //   const [option, setOption] = useState<Options>();
  const [previewImg, setPreviewImg] = useState<string>();
  //   const [searchValue, setSearchValue] = useState<string>("");

  const addParentQuery = useMutation({
    mutationFn: addParent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      setOpenModal(false);
      setPreviewImg(undefined);
      // todo: change state to trigger success message
    },

    onError: () => {
      // todo: change state to trigger error message
    },
  });

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  //   const handleSearch = (e: EventTarget) => {
  //     setSearchValue((e as HTMLInputElement).value);
  //     // console.log();
  //   };

  const onCloseModal = () => {
    addParentQuery.reset();
    toggleOpen(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit");

    if (img)
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
    <Modal
      show={openModal}
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
      <Modal.Header>{t("add-new-parent")}</Modal.Header>
      <form onSubmit={onSubmit}>
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
                {fieldsTrans("upload-photo")}
              </button>
              <div className="flex flex-col">
                <span className="text-xs text-gray-700 dark:text-gray-500">
                  {fieldsTrans("accepted-format")}:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    jpg, jpeg, png
                  </span>
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-500">
                  {fieldsTrans("maximum-size")}:{" "}
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
                    label={fieldsTrans("first-name")}
                    placeholder={fieldsTrans("first-name-placeholder")}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />

                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={fieldsTrans("last-name")}
                    placeholder={fieldsTrans("last-name-placeholder")}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />

                  <Input
                    type="text"
                    id="address"
                    name="address"
                    label={fieldsTrans("address")}
                    placeholder={fieldsTrans("address-placeholder")}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                    custom-style={{ containerStyle: "col-span-full" }}
                  />

                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    label={fieldsTrans("phone-number")}
                    placeholder="06 00 00 00"
                    pattern="(06|05)[0-9]{2}[0-9]{4}"
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />

                  <Input
                    type="email"
                    id="email"
                    name="email"
                    label={fieldsTrans("email")}
                    placeholder="Johndoe@example.com"
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />

                  <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-600"></div>

                  <Input
                    type="password"
                    id="password"
                    name="password"
                    label={fieldsTrans("password")}
                    placeholder="●●●●●●●"
                    custom-style={{
                      inputStyle: "px-10",
                    }}
                    icon={
                      <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    }
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />

                  <Input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    label={fieldsTrans("confirm-password")}
                    placeholder="●●●●●●●"
                    custom-style={{
                      inputStyle: "px-10",
                    }}
                    icon={
                      <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    }
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn-default !w-auto">
            {fieldsTrans("accept")}
          </button>
          <button
            type="button"
            className="btn-danger !w-auto"
            onClick={onCloseModal}
          >
            {fieldsTrans("decline")}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
