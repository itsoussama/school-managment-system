import { Checkbox, Input } from "@components/input";
import { useAppDispatch, useAppSelector } from "@hooks/useReduxEvent";
import { UseTheme } from "@hooks/useTheme";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import learningLightImg from "@assets/learning_light.png";
import learningDarkImg from "@assets/learning_dark.png";
import { login } from "@redux/userAsyncActions";

interface Data {
  email: string;
  password: string;
}

interface DataError {
  email?: string;
  password?: string;
  form?: string;
}

export default function Login() {
  const [data, setData] = useState<Data>({
    email: "",
    password: "",
  }); // for testing purpose
  const [formError, setFormError] = useState<DataError>({
    email: "",
    password: "",
    form: "",
  });
  const [theme] = UseTheme();
  // const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

  // selector
  const auth = useAppSelector((state) => state);

  // dispatcher
  const dispatch = useAppDispatch();

  // Route
  const route = useNavigate();

  // Effects
  useEffect(() => {
    const listener = (e: Event) => {
      setFormError(handleClientError((e.target as HTMLFormElement).form));
    };

    window.addEventListener("focusout", listener);

    return () => {
      window.removeEventListener("focusout", listener);
    };
  }, [data, formError]);

  // useEffect(() => {
  //     !auth.loading && Object.entries(auth.user).length > 0 && route('/')
  // }, [auth, route])

  // functions
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // const target = event.target as HTMLFormElement;

    console.log(formError);
    if (formError?.email === "" && formError?.password === "") {
      // if (target.email.value !== "" && target.password.value !== "") {
      if (data.email !== "" && data.password !== "") {
        const response = await dispatch(login(data as Data));

        if (response.meta.requestStatus === "fulfilled") {
          return route("/");
        }

        setFormError({
          form: "You have entered an invalid username or password",
        });
      } else {
        setFormError((prev) => ({ prev, form: "Invalid login credentiales" }));
      }
    }
  };

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (event.target.id === "remember") {
      // setData(prev => ({...prev, [event.target.id]: event.target.checked}))
      return;
    }
    setData((prev) => ({
      ...(prev as Data),
      [target.id as string]: target.value as string,
    }));
    // console.log("handle change ", event.target.value);
    // setTimeout(() => {
    //     return window.removeEventListener('keyup', listener)
    // }, 2000)
  };

  const handleClientError = (field: HTMLFormElement) => {
    const emailValidation = new RegExp(
      /[A-Za-z0-9]{4,}@[A-Za-z0-9]{3,}\.[A-Za-z]{2,}/,
    );
    // const passwordValidation = new RegExp(
    //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&()\-`.+,/"]).{8,}$/,
    // );
    const passwordValidation = new RegExp(/[*]*/);
    const messages = {
      email: "This field is required.",
      password: "This field is required.",
    };

    if (field.email.value != "") {
      if (!field.email.value.match(emailValidation)) {
        messages.email = "Please enter a valid email address.";
      } else {
        messages.email = "";
      }
    }

    if (field.password.value != "") {
      if (!field.password.value.match(passwordValidation)) {
        messages.password =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      } else {
        messages.password = "";
      }
    }

    return messages;
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""} flex flex-col`}>
      <div className="w-full p-6">
        <img
          className=""
          src={theme === "dark" ? logo_dark : logo_light}
          // width={"150px"}
          alt="logo"
        />
      </div>

      <div className="flex h-full flex-row-reverse">
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <img
            className="w-9/12"
            src={theme === "dark" ? learningDarkImg : learningLightImg}
            alt="learning"
          />
        </div>
        <div className="mx-6 my-12 flex h-full w-full flex-1 items-center justify-center md:mx-0 md:my-0">
          <div className="h-fit items-center justify-center space-y-4 rounded-m bg-white p-12 py-10 shadow-sharp-dark md:w-2/3 md:space-y-6 md:px-14 md:py-12 dark:bg-gray-800 dark:shadow-sharp-light">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <div
              className={`form-message rounded-md bg-red-500 ${formError?.form ? "flex" : "hidden"} items-center px-4 py-3`}
            >
              <FaCircleXmark color="white" />
              <p className="message ms-3 text-white">{formError?.form}</p>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Johndoe@company.com"
                label="Email"
                onChange={handleChange}
                error={formError?.email}
              />
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                label="Password"
                onChange={handleChange}
                error={formError?.password}
              />
              <div className="flex items-center justify-between">
                <Checkbox
                  name="remember"
                  id="remember"
                  label="Remember me"
                  onChange={handleChange}
                />
                <Link
                  to={"/auth/forget-password/request-link"}
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="btn-default disabled:bg-blue-500"
                disabled={auth.loading}
              >
                {!auth.loading ? (
                  "Sign in"
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
                    Loading...
                  </>
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  to={"/auth/sign-up"}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
