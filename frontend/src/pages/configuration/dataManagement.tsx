import useBreakpoint from "@hooks/useBreakpoint";
import { TransitionAnimation } from "@src/components/animation";
import { Button, RSelect } from "@src/components/input";
import { exportUser } from "@src/pages/shared/utils/api";
import { Breadcrumb } from "flowbite-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FormData {
  test: string;
}

export default function DataManagement() {
  const [data, setData] = useState<FormData>();
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const docBlob = await exportUser();
      // Create a link element
      const url = window.URL.createObjectURL(new Blob([docBlob.response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set the file name
      link.setAttribute("download", "users.xlsx");

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  return (
    <div className="flex flex-col">
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
              {t("entities.configurations")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("entities.data_management")}</Breadcrumb.Item>
      </Breadcrumb>
      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          <div className="item flex min-w-72 flex-1 flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("general.import_export")}
              </h1>
            </div>
            <div>
              <form
                action=""
                onSubmit={onSubmit}
                className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
              >
                <RSelect
                  id="date"
                  name="test"
                  label={t("general.date")}
                  custom-style={{ inputStyle: "disabled:disable" }}
                  // disabled
                  onChange={(e) => handleChange(e.target.id, e.target.value)}
                  defaultValue={""}
                >
                  <option value="">None</option>
                  <option value="2024">2024</option>
                </RSelect>

                <Button className="btn-default m-0 mt-auto" type="submit">
                  {t("form.buttons.export")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
