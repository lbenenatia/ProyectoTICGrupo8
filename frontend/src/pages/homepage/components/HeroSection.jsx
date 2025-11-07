import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  // usamos el primer slide como contenido fijo
  const slide = {
    title: "Armá tu pedido perfecto",
    subtitle: "Cada dieta, Cada antojo, Cada tamaño",
    description:
      "Incluyendo productos sin gluten, creá tu obra maestra con nuestros ingredientes premium.",
    image:
      "https://media.istockphoto.com/id/1074255410/es/foto/hamburguesa-con-queso-tocino-cebolla-de-tomate-de-carne-empanada-y-pizza-con-mozzarella-de.jpg?s=612x612&w=0&k=20&c=Ff-iRRXzAk1zUQKuBwNNmTBlAdv66uBVdxCjUeEAQXw=",
    cta: "Armá tu pedido",
    ctaLink: "/build-your-own",
    badge: "Disponible sin gluten",
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
      {/* Background Image fija */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Icon name="Award" size={16} className="text-accent" />
              <span className="text-accent font-medium text-sm">{slide.badge}</span>
            </div>

            {/* Main Content */}
            <h1 className="font-playfair text-5xl lg:text-7xl font-semibold text-white mb-4 leading-tight">
              {slide.title}
            </h1>

            <p className="text-xl lg:text-2xl text-accent font-medium mb-4">
              {slide.subtitle}
            </p>

            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={slide.ctaLink}>
                <Button variant="default" size="lg" iconName="ChefHat" iconPosition="left">
                  {slide.cta}
                </Button>
              </Link>

              {/* Botón secundario fijo al menú de pizzas (antes dependía del índice) */}
              <Link to="/account-dashboard" state={{ defaultTab: 'favorites' }}>
                <Button variant="default" size="lg" iconName="Heart" iconPosition="left">
                  Explorar favoritos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* (sin controles de navegación ni bullets) */}
    </section>
  );
};

export default HeroSection;
