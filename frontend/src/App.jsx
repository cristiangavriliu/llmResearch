import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import ThemeToggle from "./components/ThemeToggle";

import StudyIframe from "./views/study/StudyIframe";
import LandingPage from "./views/LandingPage";
import ApiTester from "./views/ApiTester";
import StudyOverview from "./views/StudyOverview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Static pages wrapped in Navigation */}
        <Route element={<Navigation />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/api-tester" element={<ApiTester />} />
          <Route path="/study-overview" element={<StudyOverview />} />
        </Route>
        {/* Study iframe-like route, no navigation */}
        <Route
          path="/study/*"
          element={
            <>
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              <StudyIframe />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
