"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function DashboardNav() {
  const { user } = useUser();

  // Initialize Tailwind Element for Navigation
  useEffect(() => {
    const init = async () => {
      const { Sidenav, Dropdown, Ripple, initTE } = await import("tw-elements");
      initTE({ Sidenav, Dropdown, Ripple });

      const sidenav2 = document.getElementById("sidenav-1");
      const sidenavInstance2 = Sidenav.getInstance(sidenav2);

      let innerWidth2: number | null = null;

      const setMode2 = () => {
        // Check necessary for Android devices
        if (window.innerWidth === innerWidth2) {
          return;
        }

        innerWidth2 = window.innerWidth;

        if (
          sidenavInstance2 &&
          window.innerWidth < sidenavInstance2.getBreakpoint("xl")
        ) {
          sidenavInstance2.changeMode("over");
          sidenavInstance2.hide();
        } else if (sidenavInstance2) {
          sidenavInstance2.changeMode("side");
          sidenavInstance2.show();
        }
      };

      if (
        sidenavInstance2 &&
        window.innerWidth < sidenavInstance2.getBreakpoint("sm")
      ) {
        setMode2();
      }

      // Event listeners
      window.addEventListener("resize", setMode2);
    };
    init();
  }, []);

  return (
    <>
      {/* Sidenav */}
      <nav
        id="sidenav-1"
        className="fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] dark:bg-zinc-800 xl:data-[te-sidenav-hidden='false']:translate-x-0"
        data-te-sidenav-init
        data-te-sidenav-hidden="false"
        data-te-sidenav-mode-breakpoint-over="0"
        data-te-sidenav-mode-breakpoint-side="xl"
        data-te-sidenav-content="#content"
        data-te-sidenav-accordion="true"
      >
        <ul
          className="relative m-0 list-none px-[0.2rem]"
          data-te-sidenav-menu-ref
        >
          <li className="relative">
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/dashboard"
              data-te-sidenav-link-ref
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/dashboard/restaurants"
              data-te-sidenav-link-ref
            >
              All Restaurants
            </Link>
          </li>
          <li>
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/dashboard/cuisines"
              data-te-sidenav-link-ref
            >
              All Cuisines
            </Link>
          </li>
          <li>
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/search"
              data-te-sidenav-link-ref
            >
              Map
            </Link>
          </li>
        </ul>
        <hr className="my-4 h-1 bg-primary-200" />
        <ul
          className="relative m-0 list-none px-[0.2rem]"
          data-te-sidenav-menu-ref
        >
          <li className="relative">
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/dashboard/restaurants/create"
              data-te-sidenav-link-ref
            >
              Create New Restaurant
            </Link>
          </li>
          <li>
            <Link
              className="group flex h-12 cursor-pointer items-center rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-primary-400/10 hover:text-primary-600 hover:outline-none focus:bg-primary-400/10 focus:text-primary-600 focus:outline-none active:bg-primary-400/10 active:text-primary-600 active:outline-none data-[te-sidenav-state-active]:text-primary-600 data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              href="/dashboard/cuisines/create"
              data-te-sidenav-link-ref
            >
              Create New Cuisine
            </Link>
          </li>
        </ul>
      </nav>
      {/* End Sidenav */}

      {/* Main Nav */}
      <nav
        id="main-navbar"
        className="fixed left-0 right-0 top-0 flex w-full flex-nowrap items-center justify-between bg-white py-[0.6rem] text-gray-500 shadow-lg hover:text-gray-700 focus:text-gray-700 dark:bg-zinc-700 lg:flex-wrap lg:justify-start xl:pl-60 z-[999]"
        data-te-navbar-ref
      >
        {/*Container wrapper */}
        <div className="flex w-full flex-wrap items-center justify-between px-4">
          {/*Toggler */}
          <button
            data-te-sidenav-toggle-ref
            data-te-target="#sidenav-1"
            className="block border-0 bg-transparent px-2.5 text-gray-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 xl:hidden"
            aria-controls="#sidenav-1"
            aria-haspopup="true"
          >
            <span className="[&>svg]:w-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          {/*Search form */}
          <form className="relative ml-4 mr-auto flex flex-wrap items-stretch xl:mx-0">
            <input
              autoComplete="off"
              type="search"
              className="relative m-0 inline-block w-[1%] min-w-[225px] flex-auto rounded border border-solid border-gray-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition duration-300 ease-in-out focus:border-primary-600 focus:text-gray-700 focus:shadow-te-primary focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-200"
              placeholder='Search (ctrl + "/" to focus)'
            />
            <span
              className="flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-gray-700 dark:text-gray-200 [&>svg]:w-4"
              id="basic-addon2"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </span>
          </form>

          {/*Right links */}
          <ul className="relative flex items-center">
            {/* NOTIFICATIONS */}
            <li className="relative" data-te-dropdown-ref>
              <Link
                className="mr-4 flex items-center text-gray-500 hover:text-gray-700 focus:text-gray-700"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-te-dropdown-toggle-ref
                aria-expanded="false"
              >
                <span className="dark:text-gray-200 [&>svg]:w-3.5">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="bell"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"
                    ></path>
                  </svg>
                </span>
                <span className="absolute -mt-2.5 ml-2 rounded-full bg-red-600 px-1.5 py-[1px] text-[0.6rem] text-white">
                  1
                </span>
              </Link>
              <ul
                className="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-zinc-700 [&[data-te-dropdown-show]]:block"
                aria-labelledby="navbarDropdownMenuLink"
                data-te-dropdown-menu-ref
              >
                <li>
                  <Link
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                    href="#"
                    data-te-dropdown-item-ref
                  >
                    Some news
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                    href="#"
                    data-te-dropdown-item-ref
                  >
                    Another news
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                    href="#"
                    data-te-dropdown-item-ref
                  >
                    Something else here
                  </Link>
                </li>
              </ul>
            </li>

            {/* PROFILE */}
            <li className="relative" data-te-dropdown-ref>
              <Link
                className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-te-dropdown-toggle-ref
                aria-expanded="false"
              >
                <Image
                  src={
                    user?.picture ||
                    "https://tecdn.b-cdn.net/img/Photos/Avatars/img(31).webp"
                  }
                  className="rounded-full"
                  height={22}
                  width={22}
                  alt="Avatar"
                  loading="lazy"
                />
              </Link>
              <ul
                className="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-zinc-700 [&[data-te-dropdown-show]]:block"
                aria-labelledby="dropdownMenuButton2"
                data-te-dropdown-menu-ref
              >
                <li>
                  <Link
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                    href="/dashboard/profile"
                    data-te-dropdown-item-ref
                  >
                    My profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                    href="#"
                    data-te-dropdown-item-ref
                  >
                    Settings
                  </Link>
                </li>
                {!user ? (
                  <li>
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                      href="/api/auth/login"
                      data-te-dropdown-item-ref
                    >
                      Login
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                      href="/api/auth/logout"
                      data-te-dropdown-item-ref
                    >
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
        {/*Container wrapper */}
      </nav>
      {/* End Main Nav */}
    </>
  );
}
