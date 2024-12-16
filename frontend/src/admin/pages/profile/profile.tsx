import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Button, Input, RTextArea } from "@src/components/input";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Profile() {
  const { t } = useTranslation();
  // const [data, setData] = useState<FormData>();
  // const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  // const [openModal, setOpenModal] = useState<boolean>(false);
  // const [formData, setFormData] = useState<FormData>();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  // const redirect = useNavigate();

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

      // setImg(file);
      readAndPreview(file as FileList);
    }
  };

  return (
    <div className="flex flex-col">
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
              //   onSubmit={onSubmit}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="firstName"
                name="firstName"
                label={t("form.fields.first_name")}
                placeholder={t("form.placeholders.first_name")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />
              <Input
                type="text"
                id="lastName"
                name="lastName"
                label={t("form.fields.last_name")}
                placeholder={t("form.placeholders.last_name")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="address"
                name="address"
                custom-style={{ containerStyle: "col-span-full" }}
                label={t("form.fields.address")}
                placeholder={t("form.placeholders.address")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="tel"
                id="phone"
                name="phone"
                label={t("form.fields.phone_number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={t("form.fields.email")}
                placeholder="Johndoe@example.com"
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

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
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
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
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
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
