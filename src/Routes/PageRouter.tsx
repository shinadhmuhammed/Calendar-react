import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("../Pages/LoginPage"));
const RegisterPage = lazy(() => import("../Pages/RegisterPage"));
const CalendarPage = lazy(() => import("../Pages/CalenderPage"));

const PageRouter = React.memo(() => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Suspense>
    </div>
  );
});

export default PageRouter;
