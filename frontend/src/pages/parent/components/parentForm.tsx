import { Button, Input, MultiSelect } from "@src/components/input";
import { SkeletonProfile } from "@src/components/skeleton";
import { useFormValidation } from "@src/hooks/useFormValidation";
import {
  ChangeEvent,
  CSSProperties,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaImage, FaLock, FaPlus } from "react-icons/fa6";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { formatUserName } from "@src/pages/shared/utils/formatters";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { getStudents } from "@src/pages/shared/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Childrens, Parent } from "../viewParents";
import { pluck } from "@src/utils/arrayMethod";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { Link } from "react-router-dom";

export interface FormData {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
  password_confirmation?: string;
  childrens: number[];
  image?: File;
}

export interface Data {
  _method?: string;
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  childrens: number[];
  image?: File;
  password?: string;
  password_confirmation?: string;
  roles?: number[];
  school_id?: string;
}

interface ParentFormProps {
  action: "Create" | "Edit";
  initialData: FormData;
  oldData?: Parent;
  formSubmitRef?: RefObject<HTMLFormElement>;
  additionalStyle?: string;
  onFormData: (data: Data) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function ParentForm({
  action,
  initialData,
  oldData,
  formSubmitRef,
  onFormData,
  additionalStyle = "grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]",
}: ParentFormProps) {
  const { t } = useTranslation();
  const { formData, errors, setFormData, setData, validateForm } =
    useFormValidation<FormData>(initialData);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [changePassword, toggleChangePassword] = useState<boolean>(false);
  const user = useAppSelector((state) => state.userSlice.user);
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(1, -1, undefined, undefined, user.school_id),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validationResult = validateForm();
      if (validationResult.isValid) {
        const form: Data = {
          name: formData?.firstName + " " + formData?.lastName,
          email: formData?.email as string,
          phone: formData?.phone as string,
          address: formData?.address as string,
          childrens: formData?.childrens,
        };

        if (action === "Edit") {
          form["_method"] = "PUT";
          form["id"] = formData?.id as number;
        } else {
          form["school_id"] = user.school_id;
          form["roles"] = [5];
          form["password"] = formData?.password as string;
          form["password_confirmation"] =
            formData?.password_confirmation as string;
        }

        if (img) {
          form["image"] = img[0];
        }

        if (form?.password) {
          form["password"] = formData?.password as string;
          form["password_confirmation"] =
            formData?.password_confirmation as string;
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

  const handleChangePassword = (isVisible: boolean) => {
    toggleChangePassword(isVisible);
    setData({ ...formData, password: "", password_confirmation: "" });
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
        firstName: formatUserName(oldData.name).firstName,
        lastName: formatUserName(oldData.name).lastName,
        address: oldData.address,
        email: oldData.email,
        phone: oldData.phone,
        childrens: oldData.childrens.map(pluck("id")),
      });

      const imagePath = oldData?.imagePath
        ? SERVER_STORAGE + oldData?.imagePath
        : `https://ui-avatars.com/api/?background=random&name=${formatUserName(oldData.name).firstName}+${formatUserName(oldData.name).lastName}`;

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
              {t("information.parent_information")}
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
              id="firstName"
              name="firstName"
              label={t("form.fields.first_name")}
              placeholder={t("form.placeholders.first_name")}
              value={(formData.firstName as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="lastName"
              name="lastName"
              label={t("form.fields.last_name")}
              placeholder={t("form.placeholders.last_name")}
              value={(formData.lastName as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="address"
              name="address"
              custom-style={{ containerStyle: "col-span-full" }}
              label={t("form.fields.address")}
              placeholder={t("form.placeholders.address")}
              value={(formData.address as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="tel"
              id="phone"
              name="phone"
              label={t("form.fields.phone_number")}
              placeholder="06 00 00 00"
              pattern="(06|05)[0-9]{2}[0-9]{4}"
              value={(formData.phone as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="email"
              id="email"
              name="email"
              label={t("form.fields.email")}
              placeholder="Johndoe@example.com"
              value={(formData.email as string) || ""}
              error={errors?.email}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
              onBlur={() => validateForm()}
            />

            <MultiSelect
              name="childrens"
              label={t("form.fields.childrens")}
              onSelect={(items) => setFormData("childrens", items)}
              selectedValue={formData?.childrens}
            >
              <MultiSelect.List>
                {getChildrensQuery.data?.map(
                  (child: Childrens, key: number) => (
                    <MultiSelect.Option
                      key={key}
                      value={child.id}
                      label={child.name}
                    />
                  ),
                )}
                <div className="sticky -top-2 z-10 -m-2 h-full space-y-2 bg-white p-2 dark:bg-gray-700">
                  {/* <Input
                  id="search"
                  type="text"
                  icon={
                    <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  }
                  label=""
                  onKeyUp={(e) => handleSearch(e.target)}
                  placeholder={fieldsTrans("filter-all")}
                  name="search"
                  custom-style={{
                    inputStyle: "px-8 !py-1",
                    labelStyle: "mb-0 !inline",
                  }}
                /> */}
                  <Link
                    to={"/students/new"}
                    className="btn-default flex h-8 items-center justify-center"
                    style={
                      {
                        "--brand-color-300":
                          colorPalette[brandState as BrandColor][300],
                        "--brand-color-600":
                          colorPalette[brandState as BrandColor][600],
                        "--brand-color-700":
                          colorPalette[brandState as BrandColor][700],
                        "--brand-color-800":
                          colorPalette[brandState as BrandColor][800],
                      } as CSSProperties
                    }
                  >
                    <FaPlus size={12} className="me-2" />
                    {t("actions.new_entity", {
                      entity: t("form.fields.childrens"),
                    })}
                  </Link>
                  <Button
                    className="btn-default flex h-8 items-center justify-center"
                    onClick={() => setOpenModal(true)}
                  >
                    <FaPlus size={12} className="me-2" />
                    {t("actions.existing_entity", {
                      entity: t("form.fields.childrens"),
                    })}
                  </Button>
                </div>
              </MultiSelect.List>
            </MultiSelect>

            <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

            {changePassword || action === "Create" ? (
              <>
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
                  value={(formData.password as string) || ""}
                  error={errors?.password}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                  onBlur={() => validateForm()}
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
                  value={(formData.password_confirmation as string) || ""}
                  error={errors?.password_confirmation}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                  onBlur={() => validateForm()}
                />
              </>
            ) : (
              <Button
                onClick={() => handleChangePassword(true)}
                className="btn-default !w-auto"
              >
                {t("form.buttons.change", {
                  label:
                    t("determiners.definite.masculine") +
                    " " +
                    t("form.fields.password"),
                })}
              </Button>
            )}

            {action === "Create" && (
              <Button className="btn-default" type="submit">
                {t("form.buttons.create", { label: t("general.account") })}
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
