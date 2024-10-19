import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';


const LoginPage = lazy(() => import('../Pages/LoginPage'));
const RegisterPage=lazy(()=> import('../Pages/RegisterPage'))

const PageRouter = React.memo(() => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        </Routes>
      </Suspense>
    </div>
  );
});

export default PageRouter;
