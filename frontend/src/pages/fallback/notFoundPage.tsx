import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Link } from "react-router-dom";
import notFoundDarkImg from "@assets/not-found-dark.png";
import notFoundlightImg from "@assets/not-found-light.png";
import { Button } from "@src/components/input";

function NotFoundPage() {
  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
  return (
    <div
      className={`dark flex h-full flex-col items-center justify-center ${themeState == "dark" ? "bg-dark-primary" : "bg-light-primary"}`}
    >
      <img
        className="mb-4 max-w-lg"
        src={themeState == "dark" ? notFoundDarkImg : notFoundlightImg}
        alt="Learning illustration"
      />
      <h1 className="mb-2 mt-4 text-4xl font-bold text-gray-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mb-4 text-gray-900 dark:text-white">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button className="btn-default">Go to Homepage</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
