import { RefObject } from "@fullcalendar/core/preact.js";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { SkeletonProfile } from "@src/components/skeleton";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { getCategories } from "@src/pages/shared/utils/api";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaImage } from "react-icons/fa6";
import { Button, Input, RSelect } from "@src/components/input";
import { Resource } from "../viewResources";

export interface FormData {
  id?: number;
  label: string;
  qty: number;
  category_id: number;
  image?: File;
}

export interface Data {
  _method?: string;
  id?: number;
  label: string;
  qty: number;
  category_id: number;
  image?: File;
  school_id?: string;
}

interface ResourceFormProps {
  action: "Create" | "Edit";
  initialData: FormData;
  oldData?: Data;
  formSubmitRef?: RefObject<HTMLFormElement>;
  additionalStyle?: string;
  onFormData: (data: Data) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ResourceForm({
  action,
  initialData,
  oldData,
  formSubmitRef,
  onFormData,
  additionalStyle = "grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]",
}: ResourceFormProps) {
  const { t } = useTranslation();
  const { formData, setFormData, setData, validateForm } =
    useFormValidation<FormData>(initialData);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const user = useAppSelector((state) => state.userSlice.user);

  const getCategoriesQuery = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(1, -1, undefined, undefined, user.school_id),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validationResult = validateForm();
      if (validationResult.isValid) {
        const form: Data = {
          label: formData?.label as string,
          qty: formData?.qty as number,
          category_id: formData?.category_id as number,
        };

        if (action === "Edit") {
          form["_method"] = "PUT";
          form["id"] = formData?.id as number;
        } else {
          form["school_id"] = user.school_id;
        }

        if (img) {
          form["image"] = img[0];
        }

        onFormData(form);
      }
    } catch (error) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    }
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

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData.id,
        label: oldData.label,
        qty: oldData.qty,
        category_id: oldData.category_id,
      });

      const imagePath = oldData?.image
        ? SERVER_STORAGE + oldData?.image
        : `https://ui-avatars.com/api/?background=random&name=${oldData.label}`;

      setPreviewImg(imagePath);
    }
  }, [oldData, setData]);

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />
      <div className="flex flex-wrap gap-5">
        <div className="item flex min-w-72 flex-1 flex-col gap-4">
          <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("general.profile")}
            </h1>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-s bg-light-primary px-8 py-5 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            {previewImg ? (
              <SkeletonProfile imgSource={previewImg} className="h-44 w-44" />
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
              {t("form.buttons.upload", {
                label: t("general.photo"),
              })}
            </button>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700 dark:text-gray-500">
                {t("form.general.accepted_format")}:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  jpg, jpeg, png
                </span>
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-500">
                {t("form.general.maximum_size")}:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  1024 mb
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-[3] flex-col gap-4">
          <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("information.resource_information")}
            </h1>
          </div>
          <form
            onSubmit={onSubmit}
            ref={formSubmitRef}
            className={
              "relative grid gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light " +
              additionalStyle
            }
          >
            <Input
              type="text"
              id="label"
              name="label"
              label={t("form.fields.label")}
              placeholder={t("form.placeholders.label")}
              value={(formData.label as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="number"
              id="qty"
              name="qty"
              label={t("form.fields.quantity")}
              placeholder="20"
              value={(formData.qty as number) || 0}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <RSelect
              label={t("form.fields.category")}
              name="category_id"
              id="category_id"
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            >
              {getCategoriesQuery.data?.map(
                (resource: Resource, key: number) => (
                  <option key={key} value={resource.id}>
                    {resource.label}
                  </option>
                ),
              )}
            </RSelect>

            <Button className="btn-default m-0 mt-auto" type="submit">
              {t("actions.add_entity", {
                entity:
                  t("determiners.definite.feminine") +
                  " " +
                  t("entities.resource"),
              })}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
