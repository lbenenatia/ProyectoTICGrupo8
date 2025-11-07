import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import { Icon } from 'lucide-react';

const Homepage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />
      
      </main>
      {/* Footer */}
      <footer className="bg-text-primary text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="flex w-full items-start gap-6">
              {/* Izquierda: icono + título/subtítulo */}
              <div className="flex items-start gap-3 flex-none">
                {/* Icono con aire y sin encogerse */}
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-primary-foreground"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>

                {/* Título + subtítulo; el span se posiciona sobre la mitad del h1 */}
                <div className="relative flex-none">
                  <h1 className="text-3xl font-semibold text-white leading-tight">
                    PizzUM & BurgUM
                  </h1>
                  <span className="text-white/60 text-sm">
                    Creá tu pedido
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © {new Date()?.getFullYear()} PizzUM & BurgUM. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-primary transition-warm text-sm">Política de Privacidad</a>
              <a href="#" className="text-white/60 hover:text-primary transition-warm text-sm">Términos de Servicio</a>
              <a href="#" className="text-white/60 hover:text-primary transition-warm text-sm">Accesibilidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;