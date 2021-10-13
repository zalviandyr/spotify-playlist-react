import React, { Fragment, SyntheticEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface CreatePlaylistModalProps {
  isModalCreateOpen: boolean;
  onSubmitForm: (data: { name: string; description: string }) => void;
  onClose: () => void;
}

interface CreatePlaylistModalState {
  errors: any;
}

export class CreatePlaylistModal extends React.Component<CreatePlaylistModalProps, CreatePlaylistModalState> {
  constructor(props: CreatePlaylistModalProps) {
    super(props);

    this.state = {
      errors: {},
    };
  }

  capitalize(word: string) {
    return word[0].toUpperCase() + word.slice(1);
  }

  validateForm(event: SyntheticEvent) {
    event.preventDefault();

    const target = event.target as any;
    const fields = ["name", "description"];
    const errors: any = {};

    fields.forEach((val) => {
      const value = target[val].value;
      if (!value) {
        errors[val] = `${this.capitalize(val)} cannot blank, please fill that`;

        this.setState({ errors });
      }
    });

    const keys = Object.keys(errors);
    if (keys.length === 0) {
      this.props.onClose();

      const data = {
        name: target["name"].value,
        description: target["description"].value,
      };

      this.props.onSubmitForm(data);
    }
  }

  render() {
    return (
      <Transition appear show={this.props.isModalCreateOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={this.props.onClose}>
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

                <form onSubmit={(event) => this.validateForm(event)}>
                  <div className={`spo-form-control ${this.state.errors["name"] ? "error" : ""}`}>
                    <label htmlFor="playlist-name">Name</label>
                    <input type="text" id="playlist-name" name="name" autoComplete="off" />
                    {this.state.errors["name"] ? <small>{this.state.errors["name"]}</small> : <></>}
                  </div>

                  <div className={`spo-form-control ${this.state.errors["description"] ? "error" : ""}`}>
                    <label htmlFor="playlist-desc">Description</label>
                    <textarea id="playlist-desc" name="description" cols={30} rows={10}></textarea>
                    {this.state.errors["description"] ? <small>{this.state.errors["description"]}</small> : <></>}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button type="submit" className="spo-btn-secondary">
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
}
