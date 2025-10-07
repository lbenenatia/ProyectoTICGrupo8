import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Pizza Menu', path: '/pizza-menu', icon: 'Pizza' },
    { name: 'Burger Menu', path: '/burger-menu', icon: 'Beef' },
    { name: 'Build Your Own', path: '/build-your-own', icon: 'ChefHat' },
    { name: 'Order & Delivery', path: '/order-delivery', icon: 'Truck' },
  ];

  const secondaryItems = [
    { name: 'My Account', path: '/account-dashboard', icon: 'User' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-warm-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-quick">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-playfair font-semibold text-lg text-primary leading-none">
              PizzaBurger
            </span>
            <span className="font-inter text-xs text-text-secondary leading-none">
              Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-warm ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-primary hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.name}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="ghost" size="sm" iconName="ShoppingCart" iconPosition="left">
            Cart (0)
          </Button>
          <Link
            to="/account-dashboard"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-warm ${
              isActivePath('/account-dashboard')
                ? 'bg-primary text-primary-foreground' :'text-text-primary hover:bg-muted hover:text-primary'
            }`}
          >
            <Icon name="User" size={16} />
            <span>Account</span>
          </Link>
          <Button variant="default" size="sm">
            Order Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="ShoppingCart" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-warm">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-warm ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            <div className="border-t border-border pt-2 mt-2">
              {secondaryItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-warm ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <Button variant="default" fullWidth>
                Order Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;