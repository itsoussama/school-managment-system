import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Badge, Breadcrumb, Modal, Pagination, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { customBadge, customTable } from "@src/utils/flowbite";
import { Button, RSelect } from "@src/components/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayrolls } from "@src/pages/shared/utils/api";
import {
  SkeletonLoadTable,
  SkeletonMetric,
  SkeletonTable,
} from "@src/components/skeleton";
import { Student } from "@pages/student/viewStudents";
import { Metric } from "@src/components/metric";
import { FaEye, FaFileLines } from "react-icons/fa6";

interface Modal {
  id?: number;
  type?: "viewPayrollHistory";
  open?: boolean;
  subModal?: Modal;
}

interface Payroll {
  id: number;
  pay_period: string;
  salary_type: string;
  base_salary: number;
  hourly_rate: number;
  hours_worked: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  payment_status: string;
  pay_date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    guardian_id: number | null;
    name: string;
    email: string;
    school_id: number;
    phone: string;
    imagePath: string | null;
    created_at: string;
    updated_at: string;
    last_activity_at: string | null;
    blocked: number;
    role: [
      {
        id: number;
        name: string;
      },
    ];
  };
}

export type Status = "completed" | "pending";

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function PayrollManagement() {
  const { t } = useTranslation();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const [openModal, setOpenModal] = useState<Modal>();
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  const roles = {
    1: "administrator_staff",
    2: "administrator",
    3: "teacher",
    4: "student",
    5: "parent",
  };

  const getPayrollsQuery = useQuery({
    queryKey: ["getPayrolls", page, perPage],
    queryFn: () => getPayrolls(page, perPage),
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

  const onCloseModal = () => {
    setOpenModal(undefined);
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

  const handleLoadMore = (e: Event) =>
    (e.target as HTMLElement)?.scrollTop > 0 && console.log("Fetch Data!");

  useEffect(() => {
    const tableElement = tableRef.current;

    tableElement?.addEventListener("scrollend", handleLoadMore);

    return () => tableElement?.removeEventListener("scrollend", handleLoadMore);
  }, []);

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
              t("determiners.definite.masculine") + " " + t("entities.payroll"),
          })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={
          openModal?.type === "viewPayrollHistory" ? openModal?.open : false
        }
        size={"3xl"}
        onClose={onCloseModal}
      >
        <Modal.Header>John Doe</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-7">
            <div className="flex flex-row justify-between gap-x-8">
              <div className="flex w-max flex-1 flex-wrap items-start gap-x-8 gap-y-6">
                <SkeletonMetric size="md" isLoaded={true}>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.grade_level")}
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {/* {getUserName(getStudentQuery.data?.name).firstName} */}
                      8,000 DH
                    </span>
                  </div>
                </SkeletonMetric>

                <SkeletonMetric size="md" isLoaded={true}>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.payroll_frequency")}
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {/* {getUserName(getStudentQuery.data?.name).firstName} */}
                      bi-weekly
                    </span>
                  </div>
                </SkeletonMetric>
                <SkeletonMetric size="md" isLoaded={true}>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.job_title")}
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Teacher
                    </span>
                  </div>
                </SkeletonMetric>
              </div>
              <Button
                className="btn-default !m-0 flex !w-max items-center gap-x-2 whitespace-nowrap"
                // onClick={() =>
                //   setOpenModal((prev) => ({
                //     ...prev,
                //     subModal: {
                //       id: 1,
                //       type: "budgetTopUp",
                //       open: true,
                //     },
                //   }))
                // }
              >
                <FaFileLines size={"14"} />
                Generate Payslip
              </Button>
            </div>
            <SkeletonLoadTable isLoaded={true}>
              <div
                className="h-80 overflow-y-auto rounded-t-s border border-gray-200 dark:border-gray-600"
                ref={tableRef}
              >
                <Table theme={customTable} striped>
                  <Table.Head className="sticky top-0 z-10 border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>
                      {t("form.fields.id", {
                        entity: t("entities.fee"),
                      })}
                    </Table.HeadCell>

                    <Table.HeadCell>{t("general.date")}</Table.HeadCell>
                    <Table.HeadCell>{t("metrics.amount")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="relative border-b border-b-gray-300 dark:border-b-gray-600">
                    <Table.Row>
                      <Table.Cell>#001</Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        20/06/2025
                      </Table.Cell>
                      <Table.Cell>8,000 DH</Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        <Badge
                          theme={customBadge}
                          className="w-max rounded-xs"
                          color="green"
                        >
                          Paid
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </SkeletonLoadTable>
          </div>
        </Modal.Body>
      </Modal>

      <TransitionAnimation>
        <div className="flex flex-wrap">
          <div className="flex w-full flex-col overflow-hidden rounded-s border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
            <div className="w-full overflow-x-auto">
              <SkeletonLoadTable
                isLoaded={
                  !(
                    getPayrollsQuery.isFetching && getPayrollsQuery.isRefetching
                  )
                }
              >
                <Table theme={customTable} striped>
                  <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>
                      {t("form.fields.id", {
                        entity: t("entities.staff_member"),
                      })}
                    </Table.HeadCell>
                    <Table.HeadCell>
                      {t("entities.staff_member")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("general.profession")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.salary")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("form.fields.issued_date")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("general.actions")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body
                    // ref={tableRef}
                    className="relative border-b border-b-gray-300 dark:border-b-gray-600"
                  >
                    {getPayrollsQuery.isFetching &&
                    !getPayrollsQuery.isRefetching ? (
                      <SkeletonTable cols={7} />
                    ) : (
                      getPayrollsQuery.data?.data.map(
                        (payroll: Payroll, key: number) => (
                          <Table.Row key={key}>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {payroll?.user.id}
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex w-max items-center gap-x-2 rounded-s">
                                <img
                                  className="w-7 rounded-full"
                                  src={
                                    payroll?.user.imagePath
                                      ? SERVER_STORAGE + payroll?.user.imagePath
                                      : `https://ui-avatars.com/api/?background=random&name=${getUserName(payroll.user.name).firstName}+${getUserName(payroll.user.name).lastName}`
                                  }
                                  alt="profile"
                                />
                                <span className="text-sm text-dark-primary dark:text-white">
                                  {payroll.user.name}
                                </span>
                              </div>
                            </Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {payroll.user.role.map((role) =>
                                t(`roles.${roles[role.id]}`),
                              )}
                            </Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {formatCurrency(payroll.base_salary)}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge
                                theme={customBadge}
                                color={
                                  //   statusOptions[
                                  //     payroll.status as keyof typeof statusOptions
                                  //   ]
                                  "green"
                                }
                                className="w-max rounded-xs"
                              >
                                {"paid"}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(payroll.created_at),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(payroll.created_at),
                                )}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: payroll.id,
                                    type: "viewPayrollHistory",
                                    open: true,
                                  })
                                }
                                className="flex w-max cursor-pointer items-center gap-x-2 rounded-s bg-blue-100 px-2 py-1.5 text-blue-600 dark:bg-blue-500 dark:bg-opacity-20 dark:text-blue-500"
                              >
                                <FaEye />
                                <p className="font-semibold">View Details</p>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ),
                      )
                    )}
                  </Table.Body>
                </Table>
              </SkeletonLoadTable>
            </div>
            <div className="flex w-full items-center justify-between px-5 py-4">
              <span className="text-gray-500 dark:text-gray-400">
                {t("pagination.records_shown")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getPayrollsQuery.data?.from}-{getPayrollsQuery.data?.to}
                </span>{" "}
                {t("pagination.total_records")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getPayrollsQuery.data?.total}
                </span>
              </span>
              <div className="flex items-center gap-x-4">
                <RSelect
                  id="row-num"
                  name="row-num"
                  onChange={handlePerPage}
                  custom-style={{ inputStyle: "!py-2" }}
                  defaultValue={getPayrollsQuery.data?.per_page}
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
                    !getPayrollsQuery.isPlaceholderData && setPage(page)
                  }
                  totalPages={getPayrollsQuery.data?.last_page ?? 1}
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
