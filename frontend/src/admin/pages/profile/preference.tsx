import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import { BrandColor, colorPalette, colors } from "@src/utils/colors";
import { customToggleSwitch } from "@src/utils/flowbite";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown";
import {
  Button,
  CheckboxGroup,
  Input,
  RSelect,
  RTextArea,
} from "@src/components/input";
import { toggleAnimation } from "@src/features/redux/animationSlice";
import {
  changeBrandColor,
  toggleLanguage,
} from "@src/features/redux/preferenceSlice";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxEvent";
import { Theme, UseTheme } from "@src/hooks/useTheme";
import { Breadcrumb, ToggleSwitch } from "flowbite-react";
import i18next from "i18next";
import { changeLanguage } from "i18next";
import {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage } from "react-icons/fa";
import { json, Link } from "react-router-dom";

interface Preferences {
  language: string;
  reduceMotion: boolean;
  theme: Theme;
  brand: BrandColor;
}
export default function Preference() {
  const { t } = useTranslation();
  // const [data, setData] = useState<FormData>();
  // const [img, setImg] = useState<FileList>();
  // const [openModal, setOpenModal] = useState<boolean>(false);
  // const [formData, setFormData] = useState<FormData>();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [preferences, setPreferences] = useState<Preferences>(
    {} as Preferences,
  );
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [theme, setTheme] = UseTheme();
  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
  const langState = useAppSelector((state) => state.preferenceSlice.language);
  const animtionState = useAppSelector(
    (state) => state.animationSlice.animation,
  );
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  const dispatch = useAppDispatch();
  // const redirect = useNavigate();

  const handleLanguageChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.value === "auto") {
      const systemLang = Intl.DateTimeFormat()
        .resolvedOptions()
        .locale.slice(0, 2);
      setPreferences({ ...preferences, language: systemLang });
      changeLanguage(systemLang);
      return;
    }
    setPreferences({ ...preferences, language: target.value });
    changeLanguage(target.value);
  };

  const handleReduceMotionChange = (checked: boolean) => {
    document.body.style.animation = "none !important";
    setPreferences({ ...preferences, reduceMotion: checked });
  };

  const handleBrandColorChange = (color: string) => {
    setPreferences({ ...preferences, brand: color as BrandColor });
  };

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    dispatch(toggleLanguage(preferences.language || target.language.value));
    dispatch(
      toggleAnimation(preferences.reduceMotion || target.reduceMotion.checked),
    );
    dispatch(changeBrandColor(preferences.brand || target.brand.value));

    toggleAlert({
      id: new Date().getTime(),
      state: true,
      status: "success",
      message: t("general.success"),
    });
  };

  useEffect(() => {
    changeLanguage(langState);
  }, [langState]);

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

        <Breadcrumb.Item>{t("entities.preference")}</Breadcrumb.Item>
      </Breadcrumb>

      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          {/* <div className="item flex min-w-72 flex-1 flex-col gap-4">
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
          </div> */}

          <div className="flex flex-[3] flex-col gap-4">
            <form
              action=""
              onSubmit={onSave}
              className="-c relative grid grid-cols-[repeat(auto-fit,_minmax(250px,400px))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(250px,400px))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <RSelect
                id="language"
                name="language"
                custom-style={{ containerStyle: "-col-span-1" }}
                label={t("form.fields.language")}
                onChange={handleLanguageChange}
                defaultValue={langState}
              >
                <option value={"auto"}>
                  {t("form.general.system_preferred")}
                </option>
                <option value="fr">{t("form.general.french")}</option>
                <option value="en">{t("form.general.english")}</option>
              </RSelect>

              {/* <CheckboxGroup
                label={t("form.fields.date_time_format")}
                custom-style={{
                  containerStyle: "col-start-1 col-end-2",
                  wrapperInputStyle: "space-y-3",
                }}
              >
                <div className="flex">
                  <CheckboxGroup.Button
                    name="dateFormat"
                    id="dateFormat_1"
                    label={"DD/MM/YYYY"}
                  />
                  <CheckboxGroup.Button
                    name="dateFormat"
                    id="dateFormat_2"
                    label={"MM/DD/YYYY"}
                  />
                </div>
                <div className="flex">
                  <CheckboxGroup.Button
                    name="timeFormat"
                    id="timeFormat_1"
                    label={"12-hour"}
                  />
                  <CheckboxGroup.Button
                    name="timeFormat"
                    id="timeFormat_2"
                    label={"24-hour"}
                  />
                </div>
              </CheckboxGroup> */}

              <RSelect
                id="theme"
                name="theme"
                label={t("form.fields.theme")}
                custom-style={{ containerStyle: "col-start-1 col-end-2" }}
                onChange={(e) => setTheme(e.target.value as Theme)}
                value={themeState}
              >
                <option value="auto">
                  {t("form.general.system_preferred")}
                </option>
                <option value="light">{t("form.general.light")}</option>
                <option value="dark">{t("form.general.dark")}</option>
              </RSelect>

              <Dropdown
                width="10%"
                additionalStyle={{
                  containerStyle: "col-start-1 col-end-2",
                  dropdownStyle: "rounded-s mt-1",
                }}
                element={
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Branding
                    </p>
                    <input
                      type="hidden"
                      id="brand"
                      name="brand"
                      defaultValue={brandState}
                    />
                    <div className="h-8 w-14 cursor-pointer rounded-s border border-gray-300 bg-gray-50 p-1.5 dark:border-gray-600 dark:bg-gray-700">
                      <div
                        className="h-full w-full rounded-xs"
                        style={{
                          backgroundColor:
                            colorPalette[
                              (preferences?.brand as BrandColor) ||
                                (brandState as BrandColor)
                            ][500],
                        }}
                      ></div>
                    </div>
                  </div>
                }
              >
                <div className="flex flex-wrap gap-2.5 p-2">
                  {colors.map((color, key) => (
                    <span
                      key={key}
                      className={`h-3 w-3 cursor-pointer rounded-[2px]`}
                      style={{ backgroundColor: colorPalette[color][500] }}
                      onClick={() => handleBrandColorChange(color)}
                    ></span>
                  ))}
                </div>
              </Dropdown>

              {/* <RSelect
                id="fontsize"
                name="fontsize"
                custom-style={{ containerStyle: "col-start-1 col-end-2" }}
                label={t("form.fields.font_size")}
              >
                <option value="default">{t("form.general.default")}</option>
                <option value="small">{t("form.general.small")}</option>
                <option value="meduim">{t("form.general.base")}</option>
                <option value="large">{t("form.general.base")}</option>
              </RSelect> */}

              <ToggleSwitch
                className="col-start-1 col-end-2"
                id="reduceMotion"
                name="reduceMotion"
                theme={customToggleSwitch}
                color={brandState}
                label={t("form.fields.reduce_motion")}
                checked={preferences.reduceMotion}
                onChange={(checked) => handleReduceMotionChange(checked)}
              />

              <Button
                className={`btn-default col-start-1 col-end-2 m-0 mt-auto`}
                type="submit"
              >
                {t("actions.save_entity", {
                  entity:
                    t("determiners.definite.plural") +
                    " " +
                    t("general.changes"),
                })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
