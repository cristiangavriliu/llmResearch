import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `relative menu-link transition-colors group`;

const Navigation = () => (
  <div>
    {/* Navigation Bar */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary flex items-center justify-between px-4 pt-3 pb-2 text-sm">
      {/* Navigation Links */}
      <div className="flex space-x-8">
        <NavLink
          to="/"
          className={navLinkClass}
          data-path="/"
          end
        >
          {({ isActive }) => (
            <span className="relative">
              Forschung
              <span
                className={
                  "block absolute left-0 -bottom-1 w-full h-0.5 bg-current origin-center transition-transform duration-300" +
                  (isActive ? " scale-x-100" : " scale-x-0")
                }
                aria-hidden="true"
              ></span>
            </span>
          )}
        </NavLink>
        <NavLink
          to="/study-overview"
          className={navLinkClass}
          data-path="/study-overview"
        >
          {({ isActive }) => (
            <span className="relative">
              Studie
              <span
                className={
                  "block absolute left-0 -bottom-1 w-full h-0.5 bg-current origin-center transition-transform duration-300" +
                  (isActive ? " scale-x-100" : " scale-x-0")
                }
                aria-hidden="true"
              ></span>
            </span>
          )}
        </NavLink>
        <NavLink
          to="/api-tester"
          className={navLinkClass}
          data-path="/api-tester"
        >
          {({ isActive }) => (
            <span className="relative">
              Api-testing
              <span
                className={
                  "block absolute left-0 -bottom-1 w-full h-0.5 bg-current origin-center transition-transform duration-300" +
                  (isActive ? " scale-x-100" : " scale-x-0")
                }
                aria-hidden="true"
              ></span>
            </span>
          )}
        </NavLink>
      </div>
      {/* Theme Component Container */}
      <ThemeToggle />
    </nav>
    <main className="pt-10">
      <Outlet />
    </main>
  </div>
);

export default Navigation;
