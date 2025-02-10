import { Button, Checkbox, Input } from "@components/input";
import { useAppDispatch, useAppSelector } from "@hooks/useReduxEvent";
// import { UseTheme } from "@hooks/useTheme";
import { ChangeEvent, CSSProperties, useEffect } from "react";
import { FaAt, FaCircleXmark, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import learningLightImg from "@assets/learning_light.png";
import learningDarkImg from "@assets/learning_dark.png";
import { login } from "@redux/userAsyncActions";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { FaLock } from "react-icons/fa";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";

interface Data {
  email: string;
  password: string;
}

// interface DataError {
//   email?: string;
//   password?: string;
//   form?: string;
// }

export default function Login() {
  const { formData, errors, setFormData, validateForm, setError } =
    useFormValidation({
      email: "",
      password: "",
    });
  const { t } = useTranslation();

  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const langState = useAppSelector((state) => state.preferenceSlice.language);
  const auth = useAppSelector((state) => state.userSlice);
  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
  const dispatch = useAppDispatch();
  const route = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationResult = validateForm();
      if (validationResult.isValid) {
        const response = await dispatch(login(formData as unknown as Data));

        if (response.meta.requestStatus === "fulfilled") {
          return route("/");
        }

        throw Error("You have entered an invalid username or password");
      }
    } catch (error) {
      const message = (error as Error).message;
      setError("form", message);
    }
  };

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    // if (event.target.id === "remember") {
    //   // setData(prev => ({...prev, [event.target.id]: event.target.checked}))
    //   return;
    // }
    setFormData(target.id as string, target.value as string);
  };

  useEffect(() => {
    changeLanguage(langState);
  }, [langState]);

  return (
    <div
      className={`${themeState === "dark" ? "dark" : ""} flex h-full items-center justify-center lg:px-16 lg:py-9`}
    >
      <div className="wrapper">
        <div className="flex w-full items-center justify-center lg:justify-start">
          <img
            src={themeState == "dark" ? logo_dark : logo_light}
            // width={"150px"}
            alt="School Management System Logo"
          />
        </div>

        <div className="flex flex-row-reverse gap-x-6 lg:h-full">
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <img
              className="max-w-9/12"
              src={themeState == "dark" ? learningDarkImg : learningLightImg}
              alt="Learning illustration"
            />
          </div>
          <div className="mx-6 my-12 flex h-full w-full flex-1 justify-center lg:mx-0 lg:items-center lg:justify-start">
            <div className="h-fit items-center justify-center space-y-4 rounded-m bg-white p-12 py-10 shadow-sharp-dark lg:w-2/3 lg:min-w-max lg:space-y-6 lg:px-14 lg:py-12 dark:bg-gray-800 dark:shadow-sharp-light">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 lg:text-2xl dark:text-white">
                {t("form.auth.login")}
              </h1>
              <div
                className={`form-message rounded-md bg-red-500 ${errors?.form ? "flex" : "hidden"} items-center px-4 py-3`}
              >
                <FaCircleXmark color="white" />
                <p className="message ms-3 text-white">
                  {errors?.form as string}
                </p>
              </div>
              <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={t("form.auth.email")}
                  label={t("form.fields.email")}
                  onChange={handleChange}
                  onBlur={() => validateForm()}
                  leftIcon={FaAt}
                  error={errors?.email}
                />
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  label={t("form.fields.password")}
                  onChange={handleChange}
                  onBlur={() => validateForm()}
                  leftIcon={FaLock}
                  rightIcon={(isPasswordVisible) =>
                    isPasswordVisible ? FaEyeSlash : FaEye
                  }
                  error={errors?.password}
                />
                <div className="flex items-center justify-between">
                  <Checkbox
                    name="remember"
                    required={false}
                    id="remember"
                    label={t("form.fields.remember_me")}
                    htmlFor="remember"
                  />
                  <Link
                    to={"/auth/forget-password/request-link"}
                    className="text-sm font-medium text-[var(--brand-color-600)] hover:underline dark:text-[var(--brand-color-500)]"
                    style={
                      {
                        "--brand-color-500":
                          colorPalette[brandState as BrandColor][500],
                        "--brand-color-600":
                          colorPalette[brandState as BrandColor][600],
                      } as CSSProperties
                    }
                  >
                    {t("form.auth.forgot_password")}?{" "}
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="btn-default disabled:bg-[var(--brand-color-500)]"
                  disabled={auth.loading}
                >
                  {!auth.loading ? (
                    t("form.auth.login")
                  ) : (
                    <>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="me-3 inline h-4 w-4 animate-spin text-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      {t("general.loading")}...
                    </>
                  )}
                </Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {t("form.auth.dont_have_account")}{" "}
                  <Link
                    to={"/auth/sign-up"}
                    className="font-medium text-[var(--brand-color-600)] hover:underline dark:text-[var(--brand-color-500)]"
                    style={
                      {
                        "--brand-color-500":
                          colorPalette[brandState as BrandColor][500],
                        "--brand-color-600":
                          colorPalette[brandState as BrandColor][600],
                      } as CSSProperties
                    }
                  >
                    {t("form.auth.sign_up")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
