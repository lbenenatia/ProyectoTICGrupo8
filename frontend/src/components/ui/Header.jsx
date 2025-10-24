import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'context/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Inicio', path: '/homepage', icon: 'Home' },
    { name: 'Menú de Pizzas', path: '/pizza-menu', icon: 'Pizza' },
    { name: 'Menú de Hamburguesas', path: '/burger-menu', icon: 'Hamburger' },
    { name: 'Creá tu pedido', path: '/build-your-own', icon: 'ChefHat' },
  ];

  const secondaryItems = [
    { name: 'Mi Cuenta', path: '/account-dashboard', icon: 'User' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const { items } = useCart();
  const cartCount = items?.length ?? 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-warm-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-quick mr-8">
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
              Pizzum & Burgum
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

        <div className="flex-grow"></div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link to="/cart" className="inline-flex">
            <Button variant="ghost" size="sm" iconName="ShoppingCart" iconPosition="left">
              ({cartCount})
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/account-dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-warm ${
                  isActivePath('/account-dashboard')
                    ? 'bg-primary text-primary-foreground' :'text-text-primary hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon name="User" size={16} />
                <span>{user?.name || user?.email}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>Cerrar Sesión</Button>
            </div>
          ) : (
            // If auth is still initializing, show a non-interactive account placeholder
            loading ? (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary">
                <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Verificando…</span>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-warm ${
                  isActivePath('/login') ? 'bg-primary text-primary-foreground' : 'text-text-primary hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon name="User" size={16} />
                <span>Mi Cuenta</span>
              </Link>
            )
          )}

          {loading ? (
            <Button variant="default" size="sm" aria-busy="true" disabled>
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Preparando…
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => {
              if (!user) {
                // send to login and after login redirect to build-your-own
                navigate('/login', { state: { from: { pathname: '/build-your-own' } } });
              } else {
                navigate('/build-your-own');
              }
            }}>
              Ordenar Ahora
            </Button>
          )}
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

              {/* Mobile auth actions */}
              <div className="mt-2">
                {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={18} />
                        <span className="text-sm">{user?.name || user?.email}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Cerrar Sesión</Button>
                    </div>
                  ) : (
                    // Respect loading state on mobile as well
                    loading ? (
                      <div className="flex items-center justify-center py-2">
                        <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </div>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="default" fullWidth>Iniciar sesión</Button>
                      </Link>
                    )
                  )}
              </div>
            </div>

            <div className="pt-4">
              {loading ? (
                <Button variant="default" fullWidth disabled aria-busy="true">
                  Preparando…
                </Button>
              ) : (
                <Button variant="default" fullWidth onClick={() => { setIsMobileMenuOpen(false); if (!user) navigate('/login', { state: { from: { pathname: '/build-your-own' } } }); else navigate('/build-your-own'); }}>
                  Ordenar Ahora
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;