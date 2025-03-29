import { Button } from "@src/components/input";
import { Event } from "../shared/components/eventsUI";
import { FaBell } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { BsCheckAll } from "react-icons/bs";

function ViewNotification() {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full pb-3 pt-6">
      <div className="flex h-full w-full flex-col divide-y divide-gray-200 overflow-hidden rounded-m dark:divide-gray-700">
        <div className="flex justify-between bg-white px-5 py-4 dark:bg-gray-800">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <Button
            className="btn-default m-0 flex w-auto items-center gap-x-2"
            //   onClick={() => setOpenModal({ open: true, type: "viewTransaction" })}
          >
            <BsCheckAll size={"24"} />
            Mark All as Read
          </Button>
        </div>
        <div className="flex-1 divide-y divide-gray-200 bg-gray-50 dark:divide-gray-700 dark:bg-gray-750">
          {new Array(7).fill(null).map(() => (
            <Event.Item
              badgeIcon={FaBell}
              badgeColor="yellow"
              readStatus="unread"
              time="a few moments ago"
              message={
                <span>
                  Mathematics exam is scheduled for <b>tomorrow at 9 AM</b>.
                </span>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewNotification;
