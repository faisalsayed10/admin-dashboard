import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, PropsWithChildren, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  loading?: boolean;
  showSidebar?: boolean;
};

const Layout: React.FC<PropsWithChildren<Props>> = ({
  children,
  loading = false,
  showSidebar = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: router.asPath === "/",
    },
    {
      name: "Users",
      href: "/users",
      icon: UsersIcon,
      current: router.route.startsWith("/users"),
    },
    {
      name: "Groups",
      href: "/groups",
      icon: CalendarIcon,
      current: router.route.startsWith("/groups"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderIcon,
      current: router.route.startsWith("/projects"),
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ChartPieIcon,
      current: router.route.startsWith("/tasks"),
    },
  ];

  if (loading)
    return (
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#000"
        ariaLabel="three-dots-loading"
        wrapperClass="w-full h-full min-h-screen flex items-center justify-center"
        visible={true}
      />
    );

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link href={item.href}>
                                  <span
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-50 text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-indigo-600"
                                          : "text-gray-400 group-hover:text-indigo-600",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={`${
            showSidebar
              ? "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col"
              : "hidden"
          }`}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <span
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      supabase.auth.signOut();
                      setTimeout(() => router.push("/login"), 1000);
                    }}
                    className="flex items-center gap-x-4 w-full px-6 py-3 text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900"
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-400" />
                    <span aria-hidden="true">Log Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          className={`sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 ${
            showSidebar && "lg:hidden"
          }`}
        >
          <button
            type="button"
            className={`-m-2.5 p-2.5 text-gray-700 ${
              showSidebar ? "lg:hidden" : "hidden"
            }`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <button
            type="button"
            onClick={() => {
              supabase.auth.signOut();
              setTimeout(() => router.push("/login"));
            }}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-900" />
          </button>
        </div>

        <main className={`py-10 ${showSidebar && "lg:pl-64"}`}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
