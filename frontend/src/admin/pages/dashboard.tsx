import { Breadcrumb } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaFileExport, FaHome } from "react-icons/fa";
import Chart from "react-apexcharts";
import { TransitionAnimation } from "@src/components/animation";
import { barLineChartOptions } from "@src/utils/chart";
import { CSSProperties, useEffect } from "react";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Link } from "react-router-dom";
import { BrandColor } from "@src/utils/colors";
import { Button } from "@src/components/input";

const chartLabel = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul"];
const chartSeries = [
  {
    name: "Label 1",
    type: "column",
    data: [440, 505, 414, 671, 227, 413],
  },
  {
    name: "Label 2",
    type: "line",
    data: [23, 42, 35, 27, 43, 22],
  },
];

function Dashboard() {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const { t } = useTranslation();

  const themeChange = useAppSelector(
    (state) => state.preferenceSlice.themeMode as "light" | "dark" | "auto",
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Breadcrumb
          theme={{ list: "flex items-center overflow-x-auto px-5 py-3" }}
          className="fade-edge fade-edge-x my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800"
          aria-label="Breadcrumb"
        >
          <Breadcrumb.Item icon={FaHome} />

          <Breadcrumb.Item>{t("general.overview")}</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={"/configuration/data-management"}>
          <Button className="btn-default m-0 mt-auto flex items-center gap-x-2">
            <FaFileExport />
            {t("form.buttons.export", {
              label:
                t("determiners.definite.plural") +
                " " +
                t("general.data_other"),
            })}
          </Button>
        </Link>
      </div>
      <TransitionAnimation>
        <div>
          <div className="flex w-full flex-col rounded-s bg-light-primary p-5 dark:bg-dark-primary">
            <h1 className="ms-4 text-xl font-semibold text-gray-900 dark:text-white">
              Metric Title
            </h1>
            <Chart
              options={barLineChartOptions<string>(
                themeChange,
                brandState,
                chartLabel,
              )}
              series={chartSeries}
              // width={450}
              type="line"
            />
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}

export default Dashboard;
