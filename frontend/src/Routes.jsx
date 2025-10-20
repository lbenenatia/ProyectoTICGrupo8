import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BurgerMenu from './pages/burger-menu/Index';
import PizzaMenu from './pages/pizza-menu/Index';
import AccountDashboard from './pages/account-dashboard/Index';
import BuildYourOwn from './pages/build-your-own/Index';
import CartPage from './pages/order-delivery/Index';
import RegisterPage from './pages/register/Index';
import RequireAuth from './components/RequireAuth';
import Homepage from './pages/homepage/Index';
import LoginPage from './pages/login/Index';
import ForgotRequest from './pages/forgot-password/Request';
import ForgotReset from './pages/forgot-password/Reset';
import { AuthProvider } from "context/AuthContext";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<Homepage />} />
            <Route path="/burger-menu" element={<BurgerMenu />} />
            <Route path="/pizza-menu" element={<PizzaMenu />} />
            <Route path="/account-dashboard" element={<AccountDashboard />} />
            <Route path="/build-your-own" element={<BuildYourOwn />} />
            <Route path="/order-delivery" element={<RequireAuth><CartPage /></RequireAuth>} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotRequest />} />
            <Route path="/forgot-password/reset" element={<ForgotReset />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
