import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Badge, Breadcrumb, Modal, Pagination, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { customBadge, customTable } from "@src/utils/flowbite";
import { RSelect } from "@src/components/input";
import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFees } from "@src/features/api";
import { SkeletonLoadTable, SkeletonTable } from "@src/components/skeleton";
import { Student } from "../students/viewStudents";

interface Fee {
  id: number;
  type: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  student: {
    user: Student;
  };
}

export type Status = "completed" | "pending";

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function FeeManagement() {
  const { t } = useTranslation();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const navigate = useNavigate();

  const statusOptions = {
    paid: "green",
    pending: "yellow",
  };

  const getFeesQuery = useQuery({
    queryKey: ["getFees", page, perPage],
    queryFn: () => getFees(page, perPage),
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      currencyDisplay: "narrowSymbol",
    })
      .format(value)
      .replace("MAD", "DH");

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const handleDateTime = (
    options: Intl.DateTimeFormatOptions,
    date: number | Date,
  ): string => {
    return new Intl.DateTimeFormat(t("general.locales"), options).format(date);
  };

  return (
    <div className="flex flex-col">
      {/* <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      /> */}
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
              {t("entities.finance")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.view_entity", {
            entity:
              t("determiners.definite.masculine") + " " + t("entities.fee"),
          })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <TransitionAnimation>
        <div className="flex flex-wrap">
          <div className="flex w-full flex-col overflow-hidden rounded-s border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
            <div className="w-full overflow-x-auto">
              <SkeletonLoadTable
                isLoaded={
                  !(getFeesQuery.isFetching && getFeesQuery.isRefetching)
                }
              >
                <Table theme={customTable} striped>
                  <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>#</Table.HeadCell>
                    <Table.HeadCell>{t("entities.student")}</Table.HeadCell>
                    <Table.HeadCell>{t("metrics.amount")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("form.fields.issued_date")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.due_date")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body
                    // ref={tableRef}
                    className="relative border-b border-b-gray-300 dark:border-b-gray-600"
                  >
                    {getFeesQuery.isFetching && !getFeesQuery.isRefetching ? (
                      <SkeletonTable cols={6} />
                    ) : (
                      getFeesQuery.data?.data.map((fee: Fee, key: number) => (
                        <Table.Row key={key}>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {fee.id}
                          </Table.Cell>
                          <Table.Cell>
                            <div
                              className="flex w-max cursor-pointer items-center gap-x-2 rounded-s py-2 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() =>
                                navigate("/students/manage", {
                                  state: {
                                    child: {
                                      id: fee.student?.user.id,
                                    },
                                  },
                                })
                              }
                            >
                              <img
                                className="w-7 rounded-full"
                                src={
                                  fee.student?.user.imagePath
                                    ? SERVER_STORAGE +
                                      fee.student?.user.imagePath
                                    : `https://ui-avatars.com/api/?background=random&name=${getUserName(fee.student.user.name).firstName}+${getUserName(fee.student.user.name).lastName}`
                                }
                                alt="profile"
                              />
                              <span className="text-sm text-dark-primary dark:text-white">
                                {fee.student.user.name}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {formatCurrency(fee.amount)}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              theme={customBadge}
                              color={
                                statusOptions[
                                  fee.status as keyof typeof statusOptions
                                ]
                              }
                              className="w-max rounded-xs"
                            >
                              {fee.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              { dateStyle: "short" },
                              new Date(fee.created_at),
                            )}
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {handleDateTime(
                                { timeStyle: "short" },
                                new Date(fee.created_at),
                              )}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              { dateStyle: "short" },
                              new Date(fee.due_date),
                            )}
                            {/* <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(fee.due_date),
                                )}
                              </span> */}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table>
              </SkeletonLoadTable>
            </div>
            <div className="flex w-full items-center justify-between px-5 py-4">
              <span className="text-gray-500 dark:text-gray-400">
                {t("pagination.records_shown")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getFeesQuery.data?.from}-{getFeesQuery.data?.to}
                </span>{" "}
                {t("pagination.total_records")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getFeesQuery.data?.total}
                </span>
              </span>
              <div className="flex items-center gap-x-4">
                <RSelect
                  id="row-num"
                  name="row-num"
                  onChange={handlePerPage}
                  custom-style={{ inputStyle: "!py-2" }}
                  defaultValue={getFeesQuery.data?.per_page}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </RSelect>
                <Pagination
                  layout={minSm ? "pagination" : "navigation"}
                  showIcons
                  currentPage={page}
                  onPageChange={(page) =>
                    !getFeesQuery.isPlaceholderData && setPage(page)
                  }
                  totalPages={getFeesQuery.data?.last_page ?? 1}
                  nextLabel={minSm ? t("pagination.next") : ""}
                  previousLabel={minSm ? t("pagination.previous") : ""}
                  theme={{
                    pages: {
                      next: {
                        base: "rounded-r-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                      },
                      previous: {
                        base: "ml-0 rounded-l-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
