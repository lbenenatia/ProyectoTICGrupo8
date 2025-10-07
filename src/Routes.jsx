import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BurgerMenu from './pages/burger-menu';
import PizzaMenu from './pages/pizza-menu';
import AccountDashboard from './pages/account-dashboard/Index';
import BuildYourOwn from './pages/build-your-own';
import OrderDeliveryPage from './pages/order-delivery';
import Homepage from './pages/homepage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/burger-menu" element={<BurgerMenu />} />
        <Route path="/pizza-menu" element={<PizzaMenu />} />
        <Route path="/account-dashboard" element={<AccountDashboard />} />
        <Route path="/build-your-own" element={<BuildYourOwn />} />
        <Route path="/order-delivery" element={<OrderDeliveryPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
