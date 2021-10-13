import React, { Fragment, SyntheticEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface CreatePlaylistModalProps {
  isModalCreateOpen: boolean;
  onClose: () => void;
  onSubmitForm: (event: SyntheticEvent) => void;
}

export function CreatePlaylistModal(props: CreatePlaylistModalProps) {
  return (
    <Transition appear show={props.isModalCreateOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={props.onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-100 shadow-xl rounded-2xl ">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Create new playlist
              </Dialog.Title>

              <form onSubmit={props.onSubmitForm}>
                <div className="spo-form">
                  <label htmlFor="playlist-name">Name</label>
                  <input type="text" id="playlist-name" name="playlistName" autoComplete="off" />
                </div>

                <div className="spo-form">
                  <label htmlFor="playlist-desc">Description</label>
                  <textarea id="playlist-desc" name="playlistDesc" cols={30} rows={10} className="spo-form"></textarea>
                </div>

                <div className="mt-4 flex justify-center">
                  <button type="submit" className="spo-btn-secondary" onClick={props.onClose}>
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
