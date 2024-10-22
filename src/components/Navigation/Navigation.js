import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UserIcon,
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import logo from "../../assests/Images/imly-logo-new.jpg";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { CogIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../Context/AuthContext";
import { FaRegCommentDots } from 'react-icons/fa';

const allNavigation = {
  Service: [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, roles: [1, 2] },
    {
      name: "Orders",
      href: "/Orders",
      icon: ClipboardDocumentListIcon,
      roles: [1, 2],
    },
    {
      name: "Payments",
      href: "/Payments",
      icon: CreditCardIcon,
      roles: [1, 2],
    },
    {
      name: "Services",
      href: "/Returns",
      icon: DocumentMagnifyingGlassIcon,
      roles: [1, 2],
    },
    { name: "Customers", href: "/Customer", icon: UsersIcon, roles: [1, 2] },
  ],
  Reporting: [
    { name: "Reports", href: "/Reports", icon: FolderIcon, roles: [1, 2] },
    { name: "Users", href: "/user", icon: UsersIcon, roles: [1, 2] },
    { name: "User Roles", href: "/RoleUser", icon: UsersIcon, roles: [1, 2] },
  ],
  Inventory: [
    { name: "Production", href: "/production", icon: CogIcon, roles: [1, 2] },
    { name: "Stores", href: "/Stores", icon: ShoppingBagIcon, roles: [1, 2] },
    { name: "Tasks", href: "/tasks", icon:ClipboardDocumentCheckIcon , roles: [1, 2] },
    {
      name: "Feedbacks",
      href: "/feedback",
      icon: ChatBubbleLeftEllipsisIcon,
      roles: [1, 2],
    },
  ],
  
};

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "/" }, // Redirect to login page
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const { isLoggedIn, userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleSettingsClick = (event) => {
    event.preventDefault();
    // Handle settings logic here, such as opening a settings modal
    console.log("Settings button clicked");
  };
  const navigation = Object.keys(allNavigation).reduce((acc, key) => {
    const filteredItems = allNavigation[key].filter((item) =>
      item.roles.includes(userRole)
    );
    if (filteredItems.length > 0) {
      acc[key] = filteredItems;
    }
    return acc;
  }, {});
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-32 shrink-0 items-center justify-center">
                  <img
                    alt="Your Company"
                    src={logo}
                    className="h-32 w-32 object-contain" // Increased size to 32x32
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {Object.entries(navigation).map(([key, items]) => (
                      <li key={key}>
                        <h3 className="text-sm font-semibold text-gray-700">
                          {key.replace(/([A-Z])/g, " $1")}
                        </h3>
                        <hr className="my-2 border-gray-300" />
                        <ul role="list" className="-mx-2 space-y-1">
                          {items.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={classNames(
                                  location.pathname.startsWith(item.href)
                                    ? "bg-gray-200"
                                    : "text-gray-900 hover:bg-custom-lightblue hover:text-white",
                                  "group flex gap-x-3 rounded-md text-sm font-semibold p-2"
                                )}
                              >
                                {/* Direct JSX usage of item.icon */}
                                <item.icon
                                  className={classNames(
                                    location.pathname.startsWith(item.href)
                                      ? "text-gray-700"
                                      : "group-hover:text-gray-700",
                                    "h-4 w-4 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                    <li className="mt-auto">
                      <button
                        onClick={handleSettingsClick}
                        className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading text-white hover:bg-indigo-700 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-white group-hover:text-white"
                        />
                        Settings
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col shadow-md border border-gray-200">
          <div
            className="flex flex-col grow bg-white px-6 pb-4" // Add left padding to the entire container
            style={{
              overflowY: 'auto',
              scrollbarWidth: 'none', // For Firefox
              msOverflowStyle: 'none', // For Internet Explorer and Edge
            }}
          >
            <style>
              {`
        .flex.grow.flex-col::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Safari and Chrome */
        }
      `}
            </style>

            {/* Logo Section */}
            <div className="flex items-center justify-center">
              <img alt="Your Company" src={logo} className="h-18 w-32" />
              <hr className="border-gray-200 my-4" />
            </div>
            <hr className="border-gray-300" />
            {/* Navigation Section */}



            <nav className="flex flex-col mt-2 flex-1 w-full">
              <ul role="list" className="space-y-6 w-full">
                {Object.entries(navigation).map(([key, items]) => (
                  <li key={key} className="w-full">
                    <h3 className="text-sm font-bold text-gray-700 mb-2 text-left pl-4">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <ul role="list" className="space-y-1 w-full">
                      {items.map((item) => (
                        <li key={item.name} className="w-full">
                          <a
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={classNames(
                              location.pathname.startsWith(item.href)
                                ? 'bg-custom-darkblue text-white'
                                : 'text-gray-900 hover:bg-custom-lightblue hover:text-gray-700',
                              'group flex items-center p-2 text-xs font-medium w-full pl-6'
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                location.pathname.startsWith(item.href) ? 'text-white' : 'group-hover:text-gray-700',
                                'h-4 w-4 shrink-0 mr-2'
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Settings Button */}
            <div className="mt-auto pb-4 flex">
              <button
                onClick={handleSettingsClick}
                className="group flex items-center ml-2 p-2 text-xs font-medium text-gray-900 hover:bg-custom-lightblue hover:text-gray-700"
              >
                <CogIcon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 ml-2 text-gray-700 mr-2"
                />
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="lg:pl-100">
          <div
            className="fixed top-0 left-0 right-0 z-40 flex  bg-white h-12 w-full items-center gap-x-4 border-b border-gray-200 px-2 shadow-sm sm:gap-x-4 sm:px-4 lg:px-6"
            // style={{ backgroundColor: "#C0C0C0" }}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              // className="-m-1.5 p-1.5 text-white lg:hidden"
              className="-m-1.5 p-1.5 text-black lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-5 w-5" />
            </button>

            <div
              aria-hidden="true"
              className="h-5 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 justify-between items-center gap-x-3 lg:gap-x-4 ml-2 sm:ml-0">
              <form
                action="#"
                method="GET"
                className="relative w-full sm:w-1/4 flex mx-auto"
              >
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block h-9 w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm" // Increased height here
                />
              </form>

              <div className="flex justify-end items-center gap-x-3 lg:gap-x-4">
                {/* Notification Button */}
                <button
                  type="button"
                  // className="-m-1.5 p-1.5 text-white hover:text-gray-500"
                   className="-m-1.5 p-1.5 text-black hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-5 w-5" />
                </button>

                <div
                  aria-hidden="true"
                  // className="hidden lg:block lg:h-5 lg:w-px lg:bg-white"
                   className="hidden lg:block lg:h-5 lg:w-px lg:bg-black"

                />

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1 flex items-center p-1">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="Profile"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full bg-gray-50" // Adjusted height and width
                    />
                    <span className="hidden lg:flex lg:items-center ml-2">
                      <span
                        aria-hidden="true"
                        // className="text-sm font-semibold leading-6 text-white"
                         className="text-sm font-semibold leading-6 text-black"
                      >
                        Tom Cook
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-4 w-4 text-black"
                      />
                    </span>
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                          onClick={
                            item.name === "Sign out" ? handleSignOut : undefined
                          }
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-0">
            <div className="px-2 sm:px-4 lg:px-6"></div>
          </main>
        </div>
      </div>
    </>
  );
}
