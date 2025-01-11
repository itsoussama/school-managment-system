import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Button, Input } from "@src/components/input";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, setProfile } from "@src/features/api";
import { SkeletonProfile } from "@src/components/skeleton";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxEvent";
import { updateUser } from "@src/features/redux/userSlice";

export interface FormData {
  _method: string;
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  password?: string;
  password_confirmation?: string;
  image?: File;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function Profile() {
  const { t } = useTranslation();
  const { formData, errors, setFormData, setData, validateForm } =
    useFormValidation({
      email: "",
    });
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const dispatch = useAppDispatch();
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  // const redirect = useNavigate();

  const getprofileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUser(admin.id),
  });

  const profileMutation = useMutation({
    mutationFn: setProfile,
    onSuccess: (data) => {
      const responseData = {
        id: data?.id,
        firstName: getUserName(data?.name).firstName,
        lastName: getUserName(data?.name).lastName,
        address: data?.address,
        email: data?.email,
        phone: data?.phone,
      };

      setData(responseData);

      dispatch(
        updateUser({
          user: data,
        }),
      );

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setPreviewImg(undefined);
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

  useEffect(() => {
    console.log(admin);
  }, [admin]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      try {
        const form: FormData = {
          _method: "PUT",
          id: formData?.id as string,
          name: formData?.firstName + " " + formData?.lastName,
          address: formData?.address as string,
          phone: formData?.phone as string,
          email: formData?.email as string,
        };

        if (img) {
          form["image"] = img[0];
        }

        if (form?.password) {
          form["password"] = formData?.password as string;
          form["password_confirmation"] =
            formData?.password_confirmation as string;
        }

        profileMutation.mutate(form);
      } catch (error) {
        toggleAlert({
          id: new Date().getTime(),
          status: "fail",
          message: "Operation Failed",
          state: true,
        });
      }
    }
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
    if (getprofileQuery.data?.data) {
      const profile = getprofileQuery.data.data;
      setData({
        id: profile?.id,
        firstName: getUserName(profile?.name).firstName,
        lastName: getUserName(profile?.name).lastName,
        address: profile?.address,
        email: profile?.email,
        phone: profile?.phone,
      });
      // setPreviewImg(school.image);
      // setSocials(school.socials);
    }
  }, [getprofileQuery.data?.data, setData]);

  return (
    <div className="flex flex-col">
      <Alert
        id={alert.id}
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
            {minSm ? t("general.home") : ""}
          </Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{t("general.profile")}</Breadcrumb.Item>
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
              <SkeletonProfile
                className="h-44 w-44 rounded-full object-cover"
                imgSource={
                  previewImg
                    ? previewImg
                    : getprofileQuery.data?.data.imagePath
                      ? SERVER_STORAGE + getprofileQuery.data?.data.imagePath
                      : `https://ui-avatars.com/api/?background=random&name=${getUserName(getprofileQuery.data?.data.name).firstName}+${getUserName(getprofileQuery.data?.data.name).lastName}`
                }
              />
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
                {t("information.personal_information")}
              </h1>
            </div>
            <form
              action=""
              onSubmit={onSubmit}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="firstName"
                name="firstName"
                label={t("form.fields.first_name")}
                placeholder={t("form.placeholders.first_name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={(formData?.firstName as string) || ""}
              />
              <Input
                type="text"
                id="lastName"
                name="lastName"
                label={t("form.fields.last_name")}
                placeholder={t("form.placeholders.last_name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={(formData?.lastName as string) || ""}
              />

              <Input
                type="text"
                id="address"
                name="address"
                custom-style={{ containerStyle: "col-span-full" }}
                label={t("form.fields.address")}
                placeholder={t("form.placeholders.address")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={(formData?.address as string) || ""}
              />

              <Input
                type="tel"
                id="phone"
                name="phone"
                label={t("form.fields.phone_number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={(formData?.phone as string) || ""}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={t("form.fields.email")}
                placeholder="Johndoe@example.com"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                value={(formData?.email as string) || ""}
                error={errors?.email}
              />

              <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

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
                value={(formData?.password as string) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
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
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={(formData?.password_confirmation as string) || ""}
                onBlur={() => validateForm()}
                error={errors?.password_confirmation}
              />

              <Button className="btn-default m-0 mt-auto" type="submit">
                {t("form.buttons.create", { label: t("general.account") })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
