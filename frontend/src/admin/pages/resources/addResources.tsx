import { Button, Checkbox, Input, MultiSelect } from "@components/input";
import { addResource, getCategories } from "@api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { useFormValidation } from "@src/hooks/useFormValidation";

export interface Data {
  label: string;
  qty: number;
  school_id: string;
  category_id: number;
  image?: File;
}

interface FormData {
  label: string;
  qty: number;
  category_id: number;
  image?: File;
}

interface Resource {
  id: number;
  label: string;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

export default function AddResources() {
  const { t } = useTranslation();
  const { formData, setFormData } = useFormValidation<FormData>({
    label: "",
    qty: 0,
    category_id: 0,
  });
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const redirect = useNavigate();

  const getCategoriesQuery = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(1, -1, undefined, undefined, admin.school_id),
  });

  const addResourceQuery = useMutation({
    mutationFn: addResource,
    onSuccess: () => {
      redirect("/resources/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: t("notifications.created_success"),
            state: true,
          },
        },
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const form: Data = {
        label: formData?.label as string,
        qty: formData?.qty as number,
        school_id: admin?.school_id as string,
        category_id: formData?.category_id as number,
      };

      if (img) {
        form["image"] = img[0];
      }

      addResourceQuery.mutate(form);
    } catch (e) {
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

  return (
    <div className="flex flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
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
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.resources")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.new_entity", { entity: t("entities.resource") })}
        </Breadcrumb.Item>
      </Breadcrumb>
      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          <div className="item flex min-w-72 flex-1 flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("general.profile")}
              </h1>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-s bg-light-primary px-8 py-5 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
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
              action=""
              onSubmit={onSubmit}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="label"
                name="label"
                label={t("form.fields.label")}
                placeholder={t("form.placeholders.label")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="number"
                id="qty"
                name="qty"
                label={t("form.fields.quantity")}
                placeholder="20"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <MultiSelect
                label={t("form.fields.category")}
                name="category_id"
                onSelectItem={(items) =>
                  setFormData("category_id", items[0].id)
                }
              >
                {getCategoriesQuery.data?.map(
                  (resource: Resource, key: number) => (
                    <Checkbox
                      key={key}
                      htmlFor={resource.id.toString()}
                      label={resource.label}
                      id={resource.id.toString()}
                      name="category_id"
                      value={resource.label}
                    />
                  ),
                )}
              </MultiSelect>

              <Button className="btn-default m-0 mt-auto" type="submit">
                {t("actions.add_entity", {
                  entity:
                    t("determiners.definite.feminine") +
                    " " +
                    t("entities.item"),
                })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
