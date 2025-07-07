import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  "text-blue-600 font-semibold px-2 py-1" +
  (isActive ? " underline" : "");

const Navigation = () => (
  <div>
    <nav className="bg-white shadow mb-8 px-4 py-2 flex gap-4">
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/api-tester" className={navLinkClass}>
        API Tester
      </NavLink>
      <NavLink to="/research" className={navLinkClass}>
        Research
      </NavLink>
    </nav>
    <main>
      <Outlet />
    </main>
  </div>
);

export default Navigation;
