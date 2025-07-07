import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import ThemeToggle from "./components/ThemeToggle";
import StudyIframe from "./study/StudyIframe";

// Placeholder static pages
const Home = () => <div className="p-8">Home Page</div>;
const ApiTester = () => <div className="p-8">API Tester Page</div>;
const Research = () => <div className="p-8">Research Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Static pages wrapped in Navigation */}
        <Route element={<Navigation />}>
          <Route path="/" element={<Home />} />
          <Route path="/api-tester" element={<ApiTester />} />
          <Route path="/research" element={<Research />} />
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
