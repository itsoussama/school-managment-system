import { alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { Alert as AlertType } from "@src/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Button, Input, InputDropdown, RTextArea } from "@src/components/input";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchool, setSchool } from "@src/features/api";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import React from "react";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { SkeletonProfile } from "@src/components/skeleton";

interface Socials {
  id: number;
  platform: string;
  link: string;
}

interface Data {
  id: string;
  name: string;
  address: string;
  contact: string;
  image?: File;
}

export interface FormData extends Data {
  _method: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function GeneralSettings() {
  const queryClient = useQueryClient();
  const { formData, setFormData, errors, setData, validateForm } =
    useFormValidation({
      contact: "",
    });
  const { t } = useTranslation();
  const [img, setImg] = useState<FileList>();
  const socialPlatforms = ["facebook", "instagram", "twitter", "linkedin"];
  const socialLinksPlaceholders: Record<string, string> = {
    facebook: "https://facebook.com/yourprofile",
    instagram: "https://instagram.com/yourhandle",
    twitter: "https://twitter.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourname",
  };
  const [socials, setSocials] = useState<Array<Socials>>([]);
  const [previewImg, setPreviewImg] = useState<string>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);

  const getSchoolQuery = useQuery({
    queryKey: ["getSchool"],
    queryFn: () => getSchool(admin.school_id),
  });

  const schoolMutation = useMutation({
    mutationFn: setSchool,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getSchool"] });

      setData({
        id: data.id,
        name: data.name,
        address: data.address,
      });

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

  const addSocial = () => {
    setSocials((prev) => [
      ...prev,
      { id: socials.length, platform: "", link: "" },
    ]);
  };

  const handleSocialChange = (id: number, field: string, value: string) => {
    setSocials((prev) =>
      prev.map((social) =>
        social.id === id ? { ...social, [field]: value } : social,
      ),
    );
  };

  // const onChange = (event: ChangeEvent) => {
  //   const inputElem = event.target as HTMLInputElement;
  //   const selectElem = event.target as HTMLSelectElement;
  //   // if (event?.target.nodeType)
  //   setData((prev) => ({
  //     ...prev,
  //     [event.target.id]:
  //       event?.target.nodeName == "SELECT"
  //         ? selectElem.options[selectElem.selectedIndex].value
  //         : inputElem.value,
  //   }));
  // };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    console.log(validationResult.isValid);

    if (validationResult.isValid) {
      try {
        const form: FormData = {
          _method: "PUT",
          id: formData?.id as string,
          name: formData?.name as string,
          address: formData?.address as string,
          contact: formData?.contact as string,
        };
        if (img) {
          form["image"] = img[0];
        }

        schoolMutation.mutate(form);
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

  const removeSocial = (id: number) => {
    const newSocial = socials.filter((social) => social.id !== id);
    setSocials(newSocial);
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
    if (getSchoolQuery.data) {
      const school = getSchoolQuery.data;
      setData({
        id: school.id,
        name: school.name,
        address: school.address,
        contact: school.contact,
      });
      // setPreviewImg(school.image);
      // setSocials(school.socials);
    }
  }, [getSchoolQuery.data]);

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
        {minSm ? (
          <>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.configurations")}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.school")}
              </span>
            </Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("general.general")}</Breadcrumb.Item>
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
                    : getSchoolQuery.data?.image_path
                      ? SERVER_STORAGE + getSchoolQuery.data?.image_path
                      : `https://ui-avatars.com/api/?background=random&name=${getSchoolQuery.data?.name}`
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
                {t("information.school_information")}
              </h1>
            </div>
            <form
              onSubmit={onSubmitUpdate}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="name"
                name="name"
                custom-style={{ containerStyle: "col-span-full" }}
                label={t("form.fields.school_name")}
                placeholder={t("form.placeholders.school_name")}
                disabled={getSchoolQuery.isFetching}
                value={(formData.name as string) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="address"
                name="address"
                custom-style={{ containerStyle: "col-span-full" }}
                label={t("form.fields.address")}
                placeholder={t("form.placeholders.address")}
                disabled={getSchoolQuery.isFetching}
                value={(formData.address as string) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <RTextArea
                id="description"
                name="description"
                custom-style={{ containerStyle: "col-span-full" }}
                label={t("form.fields.description")}
                rows={5}
                placeholder={t("form.placeholders.description")}
              />

              <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

              <h1 className="col-span-full text-xl font-semibold text-gray-900 dark:text-white">
                {t("information.contact_information")}
              </h1>

              <Input
                type="tel"
                id="contact"
                name="contact"
                label={t("form.fields.phone_number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                value={(formData?.contact as string) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                error={errors?.contact}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={t("form.fields.email")}
                placeholder="Johndoe@example.com"
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="website"
                name="website"
                label={t("form.fields.website")}
                placeholder="www.example.com"
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <div className="flex flex-col gap-y-2">
                <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {t("form.fields.social_media")}
                </span>
                {socials?.map((social, key) => (
                  <div key={key} className="flex gap-x-1">
                    <InputDropdown custom-style={{ containerStyle: "flex-1" }}>
                      <InputDropdown.Select
                        options={socialPlatforms}
                        onSelectedValue={(value) =>
                          handleSocialChange(social.id, "platform", value)
                        }
                        value={social.platform || ""}
                      />
                      <InputDropdown.Input
                        onChange={(e) =>
                          handleSocialChange(social.id, "link", e.target.value)
                        }
                        placeholder={socialLinksPlaceholders[social.platform]}
                        value={social.link}
                      />
                    </InputDropdown>
                    <button
                      type="button"
                      className="aspect-square rounded-s bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-200"
                      onClick={() => removeSocial(social.id)}
                    >
                      <IoIosClose size="28" className="m-auto" />
                    </button>
                  </div>
                ))}
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => addSocial()}
                >
                  {t("actions.add_entity", {
                    entity:
                      t("determiners.indefinite.feminine") +
                      " " +
                      t("general.social"),
                  })}
                </button>
              </div>

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
