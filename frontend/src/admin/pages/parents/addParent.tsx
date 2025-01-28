import { Input, MultiSelect, Checkbox, Button } from "@components/input";
import { addParent, getStudents } from "@api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Modal } from "flowbite-react";
import {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock, FaPlus, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import roles from "@admin/roles.json";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  childrens: number[];
  image?: File;
}

export interface Data {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: string;
  childrens: number[];
  roles: number[];
  image?: File;
}

interface Childs {
  id: string;
  imagePath: string;
  name: string;
  guardian_id: string;
}

interface DataChilds {
  id: string;
  [key: string]: string;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function AddParent() {
  const { t } = useTranslation();
  const { formData, errors, setFormData, validateForm } =
    useFormValidation<FormData>({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      childrens: [],
    });
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [formData, setFormData] = useState<FormData>();
  const [selectedChilds, setSelectedChilds] = useState<number[]>([]);
  const [dataChild, setDataChild] = useState<DataChilds[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const redirect = useNavigate();

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(1, -1, undefined, undefined, admin.school_id), // should get the school id from admin user
    placeholderData: keepPreviousData,
  });

  const addParentQuery = useMutation({
    mutationFn: addParent,
    onSuccess: () => {
      redirect("/parents/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: "Operation Successful",
            state: true,
          },
        },
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

  const handleSelectedChild = (childs: Array<DataChilds>) => {
    const childId = childs.map((childs) => parseInt(childs.id));
    setSelectedChilds(childId);
    setDataChild(childs);

    setFormData("childrens", childId);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateForm();
    if (validationResult.isValid) {
      try {
        const form: Data = {
          name: formData?.firstName + " " + formData?.lastName,
          email: formData?.email as string,
          school_id: admin?.school_id,
          password: formData?.password as string,
          password_confirmation: formData?.password_confirmation as string,
          phone: formData?.phone as string,
          childrens: selectedChilds,
          roles: [roles.parent],
        };
        if (img) {
          form["image"] = img[0];
        }

        addParentQuery.mutate(form);
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

  const onCloseModal = () => {
    // addStudentQuery.reset();
    setOpenModal(false);
    setSearchValue("");
    setPreviewImg(undefined);
    // setFormData({
    //   name: "",
    //   firstName: "",
    //   lastName: "",
    //   guardian_id: 0,
    //   phone: "",
    //   email: "",
    //   password: "",
    //   password_confirmation: "",
    //   school_id: 0,
    //   roles: [],
    //   subjects: [],
    //   grades: [],
    //   image: {
    //     lastModified: 0,
    //     name: "",
    //     size: 0,
    //     type: "",
    //   },
    // });
  };

  const getSelectedChilds = (event: ChangeEvent<HTMLInputElement>) => {
    const child = event.target;
    const ChildId: number = parseInt(event.target?.id);
    if (event.target.checked) {
      setSelectedChilds((prev) => [...prev, ChildId]);
      setDataChild((prev) => [...prev, { id: child.id, label: child.value }]);
    } else {
      const filtredChildList = selectedChilds.filter(
        (childId) => childId !== ChildId,
      );
      setSelectedChilds(filtredChildList);
      setDataChild(dataChild.filter((data) => data.id !== child.id));
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
    setFormData("childrens", selectedChilds);
  }, [selectedChilds, setFormData]);

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
              {t("entities.parents")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.add_entity", { entity: t("entities.parent") })}
        </Breadcrumb.Item>
      </Breadcrumb>

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
        <Modal.Header>
          {t("actions.new_entity", { entity: t("general.child") })}
        </Modal.Header>
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
            {getChildrensQuery.data?.map(
              (child: Childs, key: number) =>
                child.name.search(new RegExp(searchValue, "i")) !== -1 && (
                  <div key={key}>
                    <Checkbox
                      key={key}
                      htmlFor={child.id}
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
                      checked={
                        selectedChilds.includes(parseInt(child.id))
                          ? true
                          : false
                      }
                      value={child.name}
                    />
                  </div>
                ),
            )}
          </div>
        </div>
        <Modal.Footer>
          <Button
            type="submit"
            className="btn-default !w-auto"
            onClick={onCloseModal}
          >
            {t("general.accept")}
          </Button>
          {/* <button className="btn-danger !w-auto" onClick={onCloseModal}>
            {fieldsTrans("decline")}
          </button> */}
        </Modal.Footer>
      </Modal>
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
                {t("information.parent_information")}
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
              />

              <Input
                type="text"
                id="lastName"
                name="lastName"
                label={t("form.fields.last_name")}
                placeholder={t("form.placeholders.last_name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="address"
                name="address"
                label={t("form.fields.address")}
                placeholder={t("form.placeholders.address")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                custom-style={{ containerStyle: "col-span-full" }}
              />

              <Input
                type="tel"
                id="phone"
                name="phone"
                label={t("form.fields.phone_number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={t("form.fields.email")}
                placeholder="Johndoe@example.com"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                error={errors?.email}
              />

              <MultiSelect
                label={t("form.fields.childrens")}
                name="childrens"
                externalSelectedItems={dataChild}
                onSelectItem={(items) => handleSelectedChild(items)}
              >
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
              </MultiSelect>

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
