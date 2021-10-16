import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Transition } from "@headlessui/react";
import { notificationAtom } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Notification() {
  const [notificationState, setNotificationState] = useRecoilState(notificationAtom);

  useEffect(() => {
    console.log("useEffect: Notification");

    setTimeout(() => {
      setNotificationState((curVal) => ({
        ...curVal,
        isShow: false,
      }));
    }, 7000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationState.isShow]);

  return (
    <Transition
      show={notificationState.isShow}
      enter="transition ease-in-out duration-350 transform"
      enterFrom="-translate-y-20"
      enterTo="translate-y-full"
      leave="transition ease-in-out duration-350 transform"
      leaveFrom="translate-y-full"
      leaveTo="-translate-y-20"
    >
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md absolute top-0 right-0 mt-5 mr-5">
        <div
          className={`flex items-center justify-center w-12 ${
            notificationState.isError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {notificationState.isError ? (
            <FontAwesomeIcon icon={["fas", "times"]} size="lg" className="text-white" />
          ) : (
            <FontAwesomeIcon icon={["fas", "check"]} size="lg" className="text-white" />
          )}
        </div>

        <div className="px-4 py-2 -mx-3">
          <div className="mx-3">
            {notificationState.isError ? (
              <span className="font-semibold text-red-500">Failed</span>
            ) : (
              <span className="font-semibold text-green-500">Success</span>
            )}

            <p className="text-sm text-gray-600">{notificationState.message}</p>
          </div>
        </div>
      </div>
    </Transition>
  );
}
