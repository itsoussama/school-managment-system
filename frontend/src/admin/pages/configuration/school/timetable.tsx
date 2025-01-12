import { alertIntialState } from "@src/utils/alert";
// import { TransitionAnimation } from "@src/components/animation";
import { Alert as AlertType } from "@src/utils/alert";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb, Modal, Spinner } from "flowbite-react";
import {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Alert from "@src/components/alert";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { Button, CheckboxGroup, Input, RSelect } from "@src/components/input";
import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core/index.js";
import allLocales from "@fullcalendar/core/locales-all";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { options } from "@fullcalendar/core/preact.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { addEvent, deleteEvent, getEvents, setEvent } from "@src/features/api";

interface Modal {
  id: string;
  type?: "addEvent" | "editEvent" | "filter";
  open: boolean;
  title?: string;
  startDate?: string;
  endDate?: string;
}

interface Events {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  // editable: boolean;
}

export interface FormData {
  _method?: string;
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  assign_to: number[];
}

type CalendarEventChange = EventClickArg | EventDropArg | EventResizeDoneArg;

// interface Section {
//   id: number;
//   label: string;
// }

// interface Grade extends Section {
//   section_id: number;
// }

export default function Timetable() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [openModal, setOpenModal] = useState<Modal>();
  const [filters, setFilters] = useState({
    profile: "administrator",
    options: {},
  });
  const admin = useAppSelector((state) => state.userSlice.user);
  const [events, setEvents] = useState<Array<Events>>([]);
  const isLoading = useRef<boolean>(true);

  const getEventsQuery = useQuery({
    queryKey: ["getEvents"],
    queryFn: () => getEvents(admin.school_id),
  });

  const addEventQuery = useMutation({
    mutationFn: addEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getEvents"] });
      setEvents((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          start: data.start,
          end: data.end,
          description: data.description,
        },
      ]);

      toggleAlert({
        id: new Date().getTime(),
        message: "Operation Successful",
        status: "success",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const setEventQuery = useMutation({
    mutationFn: setEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEvents((prev) =>
        prev.map((event) =>
          event.id == data.id
            ? {
                ...event,
                start: data.start,
                end: data.end,
                title: data.title,
                // description: info.event.description
              }
            : event,
        ),
      );
      console.log(data);

      toggleAlert({
        id: new Date().getTime(),
        message: "Operation Successful",
        status: "success",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const deleteEventQuery = useMutation({
    mutationFn: deleteEvent,
    onMutate: async (eventID) => {
      const newEvents = events.filter((event) => event.id !== eventID);
      setEvents(newEvents);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getEvents"] });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const openSelectEventModal = (eventInfo: DateSelectArg) => {
    setOpenModal({
      id: events.length.toString(),
      open: true,
      type: "addEvent",
      startDate: eventInfo?.startStr.slice(0, 16),
      endDate: eventInfo?.endStr.slice(0, 16),
    });
    eventInfo.view.calendar.unselect();
    // console.log(new Date(eventInfo.startStr as string).toISOString());
  };

  const openEditEventModal = (eventInfo: EventClickArg) => {
    const eventID = events.find((event) => event.id == eventInfo?.event.id)
      ?.id as string;

    setOpenModal({
      id: eventID,
      open: true,
      type: "editEvent",
      startDate: eventInfo?.event.startStr.slice(0, 16),
      endDate: eventInfo?.event.endStr.slice(0, 16),
      title: eventInfo?.event.title,
    });
  };

  const changeEvent = (info: CalendarEventChange) => {
    const eventID = events.find((event) => event.id == info?.event.id)
      ?.id as string;

    // console.log(eventID);

    setEventQuery.mutate({
      _method: "PUT",
      id: eventID,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      // description: target.description.value,
      assign_to: [admin.id],
    });
  };

  const submitDeleteEvent = (id: string) => {
    try {
      deleteEventQuery.mutate(id);
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }

    onCloseModal();
  };

  const submitAddEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    try {
      const eventID = (events.length + 1).toString();
      addEventQuery.mutate({
        id: eventID,
        title: target.eventTitle.value,
        start: target.start.value,
        end: target.end.value,
        // description: target.description.value,
        assign_to: [admin.id],
      });
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }

    onCloseModal();
  };

  const submitEditEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    try {
      const eventID = events.find((event) => event.id == openModal?.id)
        ?.id as string;

      setEventQuery.mutate({
        _method: "PUT",
        id: eventID,
        title: target.eventTitle.value,
        start: target.start.value,
        end: target.end.value,
        // description: target.description.value,
        assign_to: [admin.id],
      });
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }

    onCloseModal();
  };

  const onCloseModal = () => {
    // parentMutation.reset();
    setOpenModal(undefined);

    // setData({
    //   id: 0,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   phone: "",
    //   password: "",
    //   confirm_password: "",
    // });

    // setFormError({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirm_password: "",
    //   phone: "",
    // });
  };

  useEffect(() => {
    if (getEventsQuery?.data) {
      const eventsCollection: Array<Events> = getEventsQuery?.data;
      const events = eventsCollection.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
      }));
      setEvents(events);
      isLoading.current = false;
    }
  }, [getEventsQuery?.data]);

  return (
    <div className="flex h-full flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={(value) => toggleAlert(value)}
      />

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
          <>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.configurations")}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("entities.school")}
              </span>
            </Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("entities.timetable")}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "filter" ? openModal?.open : false}
        onClose={onCloseModal}
        size={"sm"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Modal.Header>
            {t("actions.filter_entity", { entity: t("general.event") })}
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8">
              <CheckboxGroup
                label="Profile"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    profile: e.target.dataset.value as string,
                  }))
                }
              >
                <CheckboxGroup.Button
                  defaultChecked={true}
                  data-value="administrator"
                  name="profile"
                  custom-style={{ labelStyle: "w-full" }}
                  // onChange={(e) => console.log(e.target.checked)}
                  label={t("entities.administrator")}
                />
                <CheckboxGroup.Button
                  data-value="teacher"
                  name="profile"
                  custom-style={{ labelStyle: "w-full" }}
                  label={t("entities.teacher")}
                />
                <CheckboxGroup.Button
                  data-value="student"
                  name="profile"
                  custom-style={{ labelStyle: "w-full" }}
                  label={t("entities.student")}
                />
              </CheckboxGroup>
              {filters.profile === "administrator" ? (
                <RSelect
                  id="section"
                  name="section"
                  label={t("form.fields.section")}
                >
                  <option value={"section1"}>section1</option>
                  <option value={"section2"}>section2</option>
                  <option value={"section3"}>section3</option>
                </RSelect>
              ) : filters.profile === "teacher" ? (
                <RSelect
                  id="group"
                  name="grade"
                  label={t("form.fields.grade_level")}
                >
                  <option value={"grade1"}>grade1</option>
                  <option value={"grade2"}>grade2</option>
                  <option value={"grade3"}>grade3</option>
                </RSelect>
              ) : (
                <>
                  <RSelect
                    id="gradeLevel"
                    name="gradeLevel"
                    label={t("form.fields.grade_levels")}
                    // onChange={(e) => handleChange(e.target.id, e.target.value)}
                  >
                    <option value={"grade1"}>grade1</option>
                    <option value={"grade2"}>grade2</option>
                    <option value={"grade3"}>grade3</option>
                  </RSelect>
                  <RSelect
                    id="group"
                    name="group"
                    label={t("form.fields.group")}
                    // onChange={(e) => handleChange(e.target.id, e.target.value)}
                  >
                    <option value={"a"}>A</option>
                    <option value={"b"}>B</option>
                    <option value={"c"}>C</option>
                  </RSelect>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "addEvent" ? openModal?.open : false}
        onClose={onCloseModal}
        size={"xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={submitAddEvent}>
          <Modal.Header>
            {t("actions.add_entity", { entity: t("general.event") })}
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8">
              <Input
                type="datetime-local"
                id="start"
                name="start"
                label={t("form.fields.start_date")}
                defaultValue={openModal?.startDate}
              />
              <Input
                type="datetime-local"
                id="end"
                name="end"
                label={t("form.fields.end_date")}
                defaultValue={openModal?.endDate}
              />
              <Input
                type="text"
                id="eventTitle"
                name="eventTitle"
                label={t("general.title")}
                defaultValue={openModal?.title}
                custom-style={{ containerStyle: "col-span-full" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "editEvent" ? openModal?.open : false}
        onClose={onCloseModal}
        size={"xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={submitEditEvent}>
          <Modal.Header>
            {t("actions.edit_entity", { entity: t("general.event") })}
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8">
              <Input
                type="datetime-local"
                id="start"
                name="start"
                label={t("form.fields.start_date")}
                defaultValue={openModal?.startDate}
                onChange={(e) => console.log(e.target.value)}
              />
              <Input
                type="datetime-local"
                id="end"
                name="end"
                label={t("form.fields.end_date")}
                defaultValue={openModal?.endDate}
                onChange={(e) => console.log(e.target.value)}
              />
              <Input
                type="text"
                id="eventTitle"
                name="eventTitle"
                label={t("general.title")}
                defaultValue={openModal?.title}
                placeholder={t("general.title")}
                custom-style={{ containerStyle: "col-span-full" }}
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button
              className="btn-outline !ml-0 !w-auto"
              onClick={onCloseModal}
            >
              {t("general.decline")}
            </button>
            <button
              className="btn-danger !ml-auto flex !w-auto items-center gap-2"
              onClick={() => submitDeleteEvent(openModal?.id as string)}
            >
              <FaTrash />
              {t("actions.delete_entity")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* <TransitionAnimation> */}
      <div
        className={`relative flex-1 ${isLoading.current ? "loading" : ""}`}
        style={
          {
            "--brand-color-600": colorPalette[brandState as BrandColor][600],
            "--brand-color-700": colorPalette[brandState as BrandColor][700],
            "--brand-color-900": colorPalette[brandState as BrandColor][900],
          } as CSSProperties
        }
      >
        {isLoading.current && (
          <Spinner className="absolute left-1/2 top-1/2 z-10" />
        )}
        <FullCalendar
          plugins={[
            timeGridPlugin,
            dayGridPlugin,
            bootstrap5Plugin,
            interactionPlugin,
          ]}
          slotMinTime={"06:00:00"}
          slotMaxTime={"20:00:00"}
          allDaySlot={false}
          firstDay={1}
          height={"100%"}
          nowIndicator={true}
          editable={true}
          selectable={true}
          // droppable={true}
          customButtons={{
            addEvent: {
              text: t("actions.new_entity", { entity: t("general.event") }),
              hint: t("actions.new_entity", { entity: t("general.event") }),
              click: () => {
                setOpenModal({
                  id: events.length.toString(),
                  open: true,
                  type: "addEvent",
                });
              },
              // icon: "calendar-plus-fill",
            },
            filter: {
              text: t("general.filter"),
              hint: t("general.filter"),
              click: () => {
                setOpenModal({
                  id: "",
                  open: true,
                  type: "filter",
                });
              },
              themeIcon: "bootstrap5",
              bootstrapFontAwesome: "true",
              // icon: "funnel-fill",
            },
          }}
          dayHeaderFormat={{ weekday: "long" }}
          titleFormat={{
            month: "long",
            year: "numeric",
            day: "2-digit",
          }}
          headerToolbar={{
            right: "addEvent filter",
            center: "title",
            left: "prev,next dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="timeGridWeek"
          locales={allLocales}
          locale="fr"
          events={events}
          loading={() =>
            (isLoading.current = getEventsQuery.isFetching ? true : false)
          }
          select={openSelectEventModal}
          eventClick={(info) => openEditEventModal(info)}
          eventDrop={(info) => changeEvent(info)}
          eventResize={(info) => changeEvent(info)}
        />
      </div>
      {/* </TransitionAnimation> */}
    </div>
  );
}
