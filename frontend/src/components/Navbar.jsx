import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar as MTNavbar, Collapse, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-brand-600 ${isActive ? "text-brand-600" : "text-gray-700 dark:text-gray-200"}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/auth/user-sign-in"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-brand-600 ${isActive ? "text-brand-600" : "text-gray-700 dark:text-gray-200"}`
        }
      >
        User Login
      </NavLink>
      <NavLink
        to="/auth/sign-in"
        className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-full shadow-md hover:bg-brand-700 transition-all text-center"
      >
        Admin Login
      </NavLink>
    </ul>
  );

  return (
    <MTNavbar className="fixed top-0 z-50 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="flex items-center justify-between text-blue-gray-900 dark:text-white">
        <NavLink to="/" className="mr-4 cursor-pointer py-1.5 text-2xl font-bold bg-gradient-to-r from-brand-600 to-blue-400 bg-clip-text text-transparent">
          📚 Book Recommendation
        </NavLink>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{navList}</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
      </Collapse>
    </MTNavbar>
  );
}
