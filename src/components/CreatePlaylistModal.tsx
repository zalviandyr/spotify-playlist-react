import React, { Fragment, SyntheticEvent } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { capitalize } from "../helpers/string-helper";
import { CreatePlaylistModel } from "../models";

interface CreatePlaylistModalProps {
  isModalCreateOpen: boolean;
  onSubmitForm: (data: CreatePlaylistModel) => void;
  onClose: () => void;
}

interface CreatePlaylistModalState {
  errors: any;
  isPublic: boolean;
  isCollaborative: boolean;
}

export class CreatePlaylistModal extends React.Component<CreatePlaylistModalProps, CreatePlaylistModalState> {
  constructor(props: CreatePlaylistModalProps) {
    super(props);

    this.state = {
      errors: {},
      isPublic: true,
      isCollaborative: false,
    };
  }

  validateForm(event: SyntheticEvent) {
    event.preventDefault();

    const target = event.target as any;
    const fields = ["name", "description"];
    const errors: any = {};

    fields.forEach((val) => {
      const value = target[val].value;
      if (!value) {
        errors[val] = `${capitalize(val)} cannot blank, please fill that`;

        this.setState({ errors });
      }
    });

    const keys = Object.keys(errors);
    if (keys.length === 0) {
      this.props.onClose();

      this.props.onSubmitForm({
        name: target["name"].value,
        description: target["description"].value,
        isPublic: this.state.isPublic,
        isCollaborative: this.state.isCollaborative,
      });
    }
  }

  publicSwitchAction() {
    this.setState((prevState) => ({
      isPublic: !prevState.isPublic,
      isCollaborative: !prevState.isPublic ? false : prevState.isCollaborative,
    }));
  }

  collaborativeSwitchAction() {
    this.setState((prevState) => ({
      isPublic: !prevState.isCollaborative ? false : prevState.isPublic,
      isCollaborative: !prevState.isCollaborative,
    }));
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

                  <div className="spo-form-control flex justify-between">
                    <label htmlFor="playlist-public">Is public playlist ? </label>

                    <Switch
                      as="button"
                      checked={this.state.isPublic}
                      onChange={() => this.publicSwitchAction()}
                      className={`${
                        this.state.isPublic ? "bg-blue-600" : "bg-gray-600"
                      } relative inline-flex items-center h-6 rounded-full w-11 mt-3 transition-colors ease-in-out duration-200`}
                    >
                      <span
                        className={`${
                          this.state.isPublic ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}
                      />
                    </Switch>
                  </div>

                  <div className="spo-form-control flex justify-between">
                    <label htmlFor="playlist-public">Is collaborative playlist ? </label>

                    <Switch
                      as="button"
                      checked={this.state.isCollaborative}
                      onChange={() => this.collaborativeSwitchAction()}
                      className={`${
                        this.state.isCollaborative ? "bg-blue-600" : "bg-gray-600"
                      } relative inline-flex items-center h-6 rounded-full w-11 mt-3 transition-colors ease-in-out duration-200`}
                    >
                      <span
                        className={`${
                          this.state.isCollaborative ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}
                      />
                    </Switch>
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
