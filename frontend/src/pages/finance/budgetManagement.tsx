import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import {
  Badge,
  Breadcrumb,
  Modal,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { barAreaChartOptions, colorPalette } from "@src/utils/chart";
import { Metric } from "@src/components/metric";
import { customBadge, customTable, customTooltip } from "@src/utils/flowbite";
import ProgressWithStatus from "@src/components/progress";
import { Button, Input, RSelect, RTextArea } from "@src/components/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBudgets,
  getBudgetTransactions,
  getBudgetUsage,
} from "@src/pages/shared/utils/api";
import {
  SkeletonChart,
  SkeletonLoadTable,
  SkeletonMetric,
  SkeletonTable,
} from "@src/components/skeleton";
import { FaClipboardList } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { getColor, paymentTypes } from "../shared/utils/colorIndicators";
import { UseTheme } from "@src/hooks/useTheme";
import { getColorByMode } from "@src/utils/colors";
import { formatCurrency } from "../shared/utils/formatters";

interface Modal {
  id?: number;
  type?: "viewTransaction" | "viewBudgetHistory" | "budgetTopUp";
  open?: boolean;
  subModal?: Modal;
}

interface Budget {
  id: number;
  allocated_amount: number;
  spent_amount: number;
  remaining_amount: number;
  category: { id: number; label: string };
}

interface BudgetHistory {
  id: number;
  amount: number;
  type: "debit" | "credit";
  status: "processing" | "failed" | "completed";
  transactionable: Budget;
  created_at: string;
}

export default function BudgetManagement() {
  const { t } = useTranslation();
  // const admin = useAppSelector((state) => state.userSlice.user);
  const [openModal, setOpenModal] = useState<Modal>();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const minSm = useBreakpoint("min", "sm");
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const themeChange = useAppSelector(
    (state) => state.preferenceSlice.themeMode as "light" | "dark" | "auto",
  );
  const tableRef = useRef<HTMLDivElement>(null);

  const getBudgetsQuery = useQuery({
    queryKey: ["getBudgets", page, perPage],
    queryFn: () => getBudgets(page, perPage),
  });

  const getBudgetsTransactionsQuery = useQuery({
    queryKey: ["getBudgetsTransactions"],
    queryFn: () => getBudgetTransactions(),
  });

  const getBudgetTransactionsQuery = useQuery({
    queryKey: ["getBudgetTransactions", openModal?.id],
    queryFn: () =>
      openModal?.type == "viewBudgetHistory"
        ? getBudgetTransactions(openModal?.id)
        : [],
  });

  const getBudgetUsageQuery = useQuery({
    queryKey: ["getBudgetUsage"],
    queryFn: () => getBudgetUsage(),
  });

  const onCloseModal = () => {
    setOpenModal(undefined);
  };

  const onCloseSubModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      subModal: undefined,
      open: prev?.open ?? false,
    }));
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const getSpentPercentage = (spent: number, allocated: number) =>
    Number(((spent / allocated) * 100).toFixed(0));

  const handleDateTime = (
    options: Intl.DateTimeFormatOptions,
    date: number | Date,
  ): string => {
    return new Intl.DateTimeFormat(t("general.locales"), options).format(date);
  };

  // const getLastWeekDates = () => {
  //   const date = new Date();
  //   const days = 7;
  //   const weekDates = [];
  //   while (weekDates.length < days) {
  //     date.setDate(date.getDate() - 1);
  //     const formatDate = new Intl.DateTimeFormat("en", {
  //       month: "2-digit",
  //       day: "2-digit",
  //     }).format(date);

  //     weekDates.push(formatDate);
  //   }
  //   return weekDates;
  // };

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
      <div className="flex items-center justify-between">
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
                t("determiners.definite.masculine") +
                " " +
                t("entities.budget"),
            })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Button
          className="btn-default m-0 flex w-auto items-center gap-x-2"
          onClick={() => setOpenModal({ open: true, type: "viewTransaction" })}
        >
          <FaClipboardList size={"16"} />
          {t("entities.budget") + " " + t("general.activity")}
        </Button>
      </div>

      <Modal
        show={openModal?.type === "viewTransaction" ? openModal?.open : false}
        size={"5xl"}
        // theme={{
        //   content: {
        //     base: "relative h-full w-full p-4 md:h-auto",
        //     inner:
        //       "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        //   },
        //   body: {
        //     base: "p-6 max-sm:h-screen max-sm:overflow-y-auto",
        //     popup: "pt-0",
        //   },
        // }}
        onClose={onCloseModal}
      >
        <Modal.Header>{t("general.budget_transactions")}</Modal.Header>
        <Modal.Body>
          <SkeletonLoadTable
            isLoaded={
              !(getBudgetsQuery.isFetching && getBudgetsQuery.isRefetching)
            }
          >
            <div
              className="max-h-80 overflow-y-auto rounded-t-s border border-gray-200 dark:border-gray-600"
              ref={tableRef}
            >
              <Table theme={customTable} striped>
                <Table.Head className="sticky top-0 z-10 border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                  <Table.HeadCell>
                    {t("form.fields.id", { entity: t("general.transaction") })}
                  </Table.HeadCell>

                  <Table.HeadCell>{t("form.fields.category")}</Table.HeadCell>
                  <Table.HeadCell>{t("metrics.amount")}</Table.HeadCell>
                  <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                  <Table.HeadCell>{t("general.date")}</Table.HeadCell>
                </Table.Head>
                <Table.Body className="relative border-b border-b-gray-300 dark:border-b-gray-600">
                  {getBudgetsTransactionsQuery.isFetching &&
                  !getBudgetsTransactionsQuery.isRefetching ? (
                    <SkeletonTable cols={5} />
                  ) : (
                    getBudgetsTransactionsQuery.data?.map(
                      (transaction: BudgetHistory, key: number) => (
                        <Table.Row key={key}>
                          <Table.Cell>{transaction?.id}</Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {transaction.transactionable.category.label}
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
                                  transaction.type,
                                ).value
                              }
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-medium">
                            <Badge
                              color={getColor(transaction.type, paymentTypes)}
                              className="!w-fit rounded-xs"
                            >
                              {transaction.type}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                            {handleDateTime(
                              { dateStyle: "short" },
                              new Date(transaction.created_at),
                            )}
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {handleDateTime(
                                { timeStyle: "short" },
                                new Date(transaction.created_at),
                              )}
                            </span>
                          </Table.Cell>
                        </Table.Row>
                      ),
                    )
                  )}
                </Table.Body>
              </Table>
            </div>
          </SkeletonLoadTable>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModal?.type === "viewBudgetHistory" ? openModal?.open : false}
        size={"3xl"}
        onClose={onCloseModal}
      >
        <Modal.Header>category: Administrative Expenses</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-7">
            <div className="flex flex-row justify-between gap-x-8">
              <div className="flex w-max items-start gap-x-8">
                <SkeletonMetric
                  size="md"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="sm">
                      {t("metrics.allocated_budget")}
                    </Metric.Title>
                    <Metric.Value size="sm">
                      {
                        formatCurrency(
                          getBudgetUsageQuery.data?.total_allocation,
                        ).value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
                <SkeletonMetric
                  size="md"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="sm">
                      {t("metrics.allocated_budget")}
                    </Metric.Title>
                    <Metric.Value size="sm">
                      {
                        formatCurrency(
                          getBudgetUsageQuery.data?.total_allocation,
                        ).value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
                <SkeletonMetric
                  size="md"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="sm">
                      {t("metrics.allocated_budget")}
                    </Metric.Title>
                    <Metric.Value size="sm">
                      {
                        formatCurrency(
                          getBudgetUsageQuery.data?.total_allocation,
                        ).value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
              </div>
              <Button
                className="btn-default !m-0 !w-max whitespace-nowrap"
                onClick={() =>
                  setOpenModal((prev) => ({
                    ...prev,
                    subModal: {
                      id: 1,
                      type: "budgetTopUp",
                      open: true,
                    },
                  }))
                }
              >
                Budget Top-Up
              </Button>
            </div>
            <SkeletonLoadTable
              isLoaded={
                !(getBudgetsQuery.isFetching && getBudgetsQuery.isRefetching)
              }
            >
              <div
                className="h-80 overflow-y-auto rounded-t-s border border-gray-200 dark:border-gray-600"
                ref={tableRef}
              >
                <Table theme={customTable} striped>
                  <Table.Head className="sticky top-0 z-10 border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>
                      {t("form.fields.id", {
                        entity: t("general.transaction"),
                      })}
                    </Table.HeadCell>

                    <Table.HeadCell>{t("form.fields.category")}</Table.HeadCell>
                    <Table.HeadCell>{t("metrics.amount")}</Table.HeadCell>
                    <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                    <Table.HeadCell>{t("general.date")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="relative border-b border-b-gray-300 dark:border-b-gray-600">
                    {getBudgetTransactionsQuery.isFetching &&
                    !getBudgetTransactionsQuery.isRefetching ? (
                      <SkeletonTable cols={5} />
                    ) : (
                      getBudgetTransactionsQuery.data?.map(
                        (transaction: BudgetHistory, key: number) => (
                          <Table.Row key={key}>
                            <Table.Cell>{transaction.id}</Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {transaction.transactionable.category.label}
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
                                    transaction.type,
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
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(transaction.created_at),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(transaction.created_at),
                                )}
                              </span>
                            </Table.Cell>
                          </Table.Row>
                        ),
                      )
                    )}
                  </Table.Body>
                </Table>
              </div>
            </SkeletonLoadTable>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={
          openModal?.subModal?.type === "budgetTopUp"
            ? openModal?.subModal?.open
            : false
        }
        size={"md"}
        onClose={onCloseSubModal}
      >
        <Modal.Header>Budget Top-Up</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-8">
            <Input
              type="text"
              id="amount"
              name="amount"
              // onChange={(e) => setGradeFormData(e.target.id, e.target.value)}
              // value={gradeData?.label}
              label={t("metrics.amount")}
              placeholder="10.000"
            />
            <RTextArea
              id="justification"
              name="justification"
              label={t("form.fields.justification")}
              placeholder={t("form.placeholders.justification")}
              // disabled={getMaintenanceRequestQuery.isFetching && true}
              // value={(formData.description as string) || ""}
              // onChange={onChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="btn-default !w-auto">
            {t("general.accept")}
          </Button>
          <button className="btn-danger !w-auto" onClick={onCloseSubModal}>
            {t("general.decline")}
          </button>
        </Modal.Footer>
      </Modal>

      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          <div className="flex w-full flex-col rounded-s bg-light-primary p-5 dark:bg-dark-primary">
            <h1 className="mb-3 ms-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t("metrics.budget_usage")}
            </h1>
            <div className="flex h-96 w-full flex-row gap-x-8">
              <div className="h-full w-3/4">
                <SkeletonChart isLoaded={!getBudgetUsageQuery.isFetching}>
                  <Chart
                    options={barAreaChartOptions<string>(
                      themeChange,
                      brandState,
                      getBudgetUsageQuery.data?.budget.date,
                    )}
                    series={[
                      {
                        name: "Allocated Budget",
                        type: "column",
                        data: getBudgetUsageQuery.data?.budget
                          ?.budget_allocated,
                      },
                      {
                        name: "Spent",
                        type: "area",
                        data: getBudgetUsageQuery.data?.budget.budget_spent,
                      },
                    ]}
                    width={"100%"}
                    height={"100%"}
                    type="bar"
                  />
                </SkeletonChart>
              </div>
              <div className="flex flex-1 flex-col gap-y-5">
                <SkeletonMetric
                  size="lg"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="lg">
                      {t("metrics.allocated_budget")}
                    </Metric.Title>
                    <Metric.Value size="3xl">
                      {
                        formatCurrency(
                          getBudgetUsageQuery.data?.total_allocation,
                        ).value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
                <SkeletonMetric
                  size="lg"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="lg">{t("metrics.spent")}</Metric.Title>
                    <Metric.Value size="3xl">
                      {
                        formatCurrency(getBudgetUsageQuery.data?.total_spent)
                          .value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
                <SkeletonMetric
                  size="lg"
                  isLoaded={!getBudgetUsageQuery.isFetching}
                >
                  <Metric>
                    <Metric.Title size="lg">
                      {t("metrics.remaining")}
                    </Metric.Title>
                    <Metric.Value size="3xl">
                      {
                        formatCurrency(
                          getBudgetUsageQuery.data?.total_remaining,
                        ).value
                      }
                    </Metric.Value>
                  </Metric>
                </SkeletonMetric>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col overflow-hidden rounded-s border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
            <div className="w-full overflow-x-auto">
              <SkeletonLoadTable
                isLoaded={
                  !(getBudgetsQuery.isFetching && getBudgetsQuery.isRefetching)
                }
              >
                <Table theme={customTable} striped>
                  <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                    <Table.HeadCell>{t("form.fields.category")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("metrics.allocated_budget")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("metrics.spent")}</Table.HeadCell>
                    <Table.HeadCell>{t("metrics.remaining")}</Table.HeadCell>
                    <Table.HeadCell>
                      {t("metrics.spent_prcentage")}
                    </Table.HeadCell>
                    <Table.HeadCell>{t("general.actions")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body
                    // ref={tableRef}
                    className="relative border-b border-b-gray-300 dark:border-b-gray-600"
                  >
                    {getBudgetsQuery.isFetching &&
                    !getBudgetsQuery.isRefetching ? (
                      <SkeletonTable cols={6} />
                    ) : (
                      getBudgetsQuery.data?.data.map(
                        (budget: Budget, key: number) => (
                          <Table.Row key={key}>
                            <Table.Cell>{budget.category.label}</Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {formatCurrency(budget.allocated_amount).value}
                            </Table.Cell>
                            <Table.Cell>
                              {formatCurrency(budget.spent_amount).value}
                            </Table.Cell>
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                              {formatCurrency(budget.remaining_amount).value}
                            </Table.Cell>
                            <Table.Cell>
                              <ProgressWithStatus
                                progress={getSpentPercentage(
                                  budget.spent_amount,
                                  budget.allocated_amount,
                                )}
                                reverse
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: budget.id,
                                    type: "viewBudgetHistory",
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
                  {getBudgetsQuery.data?.from}-{getBudgetsQuery.data?.to}
                </span>{" "}
                {t("pagination.total_records")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getBudgetsQuery.data?.total}
                </span>
              </span>
              <div className="flex items-center gap-x-4">
                <RSelect
                  id="row-num"
                  name="row-num"
                  onChange={handlePerPage}
                  custom-style={{ inputStyle: "!py-2" }}
                  defaultValue={getBudgetsQuery.data?.per_page}
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
                    !getBudgetsQuery.isPlaceholderData && setPage(page)
                  }
                  totalPages={getBudgetsQuery.data?.last_page ?? 1}
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
