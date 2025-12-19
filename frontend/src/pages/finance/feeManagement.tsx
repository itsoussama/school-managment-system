import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Badge, Breadcrumb, Modal, Pagination, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaEye, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { customBadge, customTable } from "@src/utils/flowbite";
import { Button, RSelect } from "@src/components/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFee, getFees } from "@src/pages/shared/utils/api";
import {
  SkeletonLoadTable,
  SkeletonMetric,
  SkeletonTable,
} from "@src/components/skeleton";
import { Student } from "@pages/student/viewStudents";
import { Metric } from "@src/components/metric";
import { FaPrint } from "react-icons/fa6";
import { formatCurrency } from "../shared/utils/formatters";
import {
  feeStatus,
  FeeStatus,
  getColor,
  paymentTypes,
  PaymentTypes,
  states,
} from "../shared/utils/colorIndicators";
import { colorPalette, getColorByMode } from "@src/utils/colors";

interface Modal {
  id?: number;
  type?: "viewFeeHistory";
  open?: boolean;
  subModal?: Modal;
}

interface Transaction {
  id: number;
  type: PaymentTypes;
  amount: number;
  status: string;
  date: string;
  created_at: string;
}

interface Fee {
  id: number;
  type: string;
  frequency: string;
  amount: number;
  status: FeeStatus;
  due_date: string;
  created_at: string;
  user: Student;
  transactions: Transaction;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function FeeManagement() {
  const { t } = useTranslation();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const [openModal, setOpenModal] = useState<Modal>();
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);
  const themeChange = useAppSelector(
    (state) => state.preferenceSlice.themeMode as "light" | "dark" | "auto",
  );

  const getFeesQuery = useQuery({
    queryKey: ["getFees", page, perPage],
    queryFn: () => getFees(page, perPage),
  });

  const getFeeQuery = useQuery({
    queryKey: ["getFee", openModal?.id],
    queryFn: ({ queryKey }) =>
      openModal?.type == "viewFeeHistory" && queryKey[0]
        ? getFee(openModal?.id as number)
        : [],
  });

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
    date: string | number | Date,
  ): string => {
    const dateInstance = date && new Date(date);
    return dateInstance
      ? new Intl.DateTimeFormat(t("general.locales"), options).format(
          dateInstance,
        )
      : "";
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
              t("determiners.definite.masculine") + " " + t("entities.fee"),
          })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "viewFeeHistory" ? openModal?.open : false}
        size={"3xl"}
        onClose={onCloseModal}
      >
        <Modal.Header>{getFeeQuery.data?.fee?.user?.name}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-7">
            <div className="flex flex-row justify-between gap-x-8">
              <div className="flex w-max flex-1 flex-row flex-wrap items-start gap-x-8 gap-y-6">
                <div className="flex flex-col gap-y-1">
                  <SkeletonMetric size="lg" isLoaded={!getFeeQuery?.isFetching}>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.grade_level")}
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      <Badge
                        theme={customBadge}
                        color={"blue"}
                        className="mb-1 me-1"
                      >
                        {getFeeQuery.data?.fee?.user?.grades[0].label}
                      </Badge>
                    </span>
                  </SkeletonMetric>
                </div>
                <div className="flex flex-col gap-y-1">
                  <SkeletonMetric size="lg" isLoaded={!getFeeQuery?.isFetching}>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.parent_guardian")}
                    </span>
                    <div
                      className="flex w-max cursor-pointer items-center gap-x-2 rounded-s px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() =>
                        navigate("/parents/manage", {
                          state: {
                            parent: {
                              id: getFeeQuery.data?.fee?.user?.guardian.id,
                            },
                          },
                        })
                      }
                    >
                      <img
                        className="w-5 rounded-full"
                        src={
                          getFeeQuery.data?.fee?.user?.guardian.imagePath
                            ? SERVER_STORAGE +
                              getFeeQuery.data?.fee?.user?.guardian.imagePath
                            : `https://ui-avatars.com/api/?background=random&name=${getUserName(getFeeQuery.data?.fee?.user?.guardian.name).firstName}+${getUserName(getFeeQuery.data?.fee?.user?.guardian.name).lastName}`
                        }
                        alt="profile"
                      />
                      <span className="text-sm text-dark-primary dark:text-white">
                        {/* {getStudentQuery.data?.guardian?.name} */}
                        <SkeletonMetric
                          size="lg"
                          isLoaded={!getFeeQuery?.isFetching}
                        >
                          {getFeeQuery.data?.fee?.user?.guardian.name}
                        </SkeletonMetric>
                      </span>
                    </div>
                  </SkeletonMetric>
                </div>
                <Metric>
                  <SkeletonMetric size="lg" isLoaded={!getFeeQuery?.isFetching}>
                    <Metric.Title size="sm">
                      {t("metrics.outstanding_balance")}
                    </Metric.Title>

                    <Metric.Value
                      size="sm"
                      additionalStyle="!text-red-600 dark:!text-red-400"
                    >
                      {
                        formatCurrency(getFeeQuery.data?.outstanding_balance)
                          .value
                      }
                    </Metric.Value>
                  </SkeletonMetric>
                </Metric>
                <div className="flex flex-col gap-y-1">
                  <SkeletonMetric size="lg" isLoaded={!getFeeQuery?.isFetching}>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.next_due_date")}
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {handleDateTime(
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                        getFeeQuery.data?.fee?.due_date,
                      )}
                    </span>
                  </SkeletonMetric>
                </div>
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
                <FaPrint size={"14"} />
                Print Receipt
              </Button>
            </div>
            <SkeletonLoadTable isLoaded={true}>
              <div
                className="max-h-80 overflow-y-auto rounded-t-s border border-gray-200 dark:border-gray-600"
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
                    {getFeeQuery.data?.fee?.transactions?.map(
                      (transaction: Transaction, key: number) => (
                        <Table.Row key={key}>
                          <Table.Cell>{transaction.id}</Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                              transaction.date,
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <span
                              style={{
                                color: getColorByMode(
                                  themeChange,
                                  colorPalette[
                                    getColor(
                                      transaction.type,
                                      paymentTypes,
                                    ) as keyof typeof colorPalette
                                  ][600],
                                  colorPalette[
                                    getColor(
                                      transaction.type,
                                      paymentTypes,
                                    ) as keyof typeof colorPalette
                                  ][400],
                                ),
                              }}
                            >
                              {
                                formatCurrency(
                                  transaction.amount,
                                  transaction?.type,
                                ).value
                              }
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            <Badge
                              theme={customBadge}
                              color={getColor(transaction.type, paymentTypes)}
                            >
                              {transaction.type}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ),
                    ) ?? (
                      <Table.Row>
                        <Table.Cell colSpan={4}>
                          <span className="flex justify-center">
                            No Transaction
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    )}
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
                  !(getFeesQuery.isFetching && getFeesQuery.isRefetching)
                }
              >
                <Table theme={customTable} striped>
                  <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>#</Table.HeadCell>
                    <Table.HeadCell>{t("entities.student")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.type")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("form.fields.payment_frequency")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("metrics.amount")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("form.fields.issued_date")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.due_date")}</Table.HeadCell>
                    <Table.HeadCell>{t("general.actions")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body
                    // ref={tableRef}
                    className="relative border-b border-b-gray-300 dark:border-b-gray-600"
                  >
                    {getFeesQuery.isFetching && !getFeesQuery.isRefetching ? (
                      <SkeletonTable cols={9} />
                    ) : (
                      getFeesQuery.data?.data.map((fee: Fee, key: number) => (
                        <Table.Row key={key}>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            #00{fee.id}
                          </Table.Cell>
                          <Table.Cell>
                            <div
                              className="flex w-max cursor-pointer items-center gap-x-2 rounded-s py-2 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() =>
                                navigate("/students/manage", {
                                  state: {
                                    child: {
                                      id: fee.user.id,
                                    },
                                  },
                                })
                              }
                            >
                              <img
                                className="w-7 rounded-full"
                                src={
                                  fee.user?.imagePath
                                    ? SERVER_STORAGE + fee.user?.imagePath
                                    : `https://ui-avatars.com/api/?background=random&name=${getUserName(fee.user?.name).firstName}+${getUserName(fee.user?.name).lastName}`
                                }
                                alt="profile"
                              />
                              <span className="text-sm text-dark-primary dark:text-white">
                                {fee.user?.name}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {fee.type}
                          </Table.Cell>
                          <Table.Cell>{fee.frequency}</Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {formatCurrency(fee.amount).value}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              theme={customBadge}
                              color={getColor(fee.status, feeStatus)}
                              className="w-max rounded-xs"
                            >
                              {fee.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                              fee?.created_at,
                            )}
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {handleDateTime(
                                { timeStyle: "short" },
                                fee?.created_at,
                              )}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              { dateStyle: "short" },
                              fee?.due_date,
                            )}
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {handleDateTime(
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                },
                                fee?.due_date,
                              )}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div
                              onClick={() =>
                                setOpenModal({
                                  id: fee.user.id,
                                  type: "viewFeeHistory",
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
