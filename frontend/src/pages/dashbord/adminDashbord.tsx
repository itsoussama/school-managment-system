import Chart from "react-apexcharts";
import { barLineChartOptions } from "@src/utils/chart";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import DashboardLayout from "./layout/dashbordLayout";

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

function AdminDashbord() {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  //   const { t } = useTranslation();

  const themeChange = useAppSelector(
    (state) => state.preferenceSlice.themeMode as "light" | "dark" | "auto",
  );

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}

export default AdminDashbord;
