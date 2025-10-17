import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Arma tu pizza perfecta",
      subtitle: "Cada dieta, Cada antojo, Cada tamaño",
      description: "Desde bases sin gluten hasta proteínas a base de plantas, crea tu obra maestra con nuestros ingredientes premium.",
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Arma tu pizza",
      ctaLink: "/build-your-own",
      badge: "Disponible sin gluten"
    },
    {
      id: 2,
      title: "Arma tu hamburguesa soñada",
      subtitle: "Personalizada y confiable para tu dieta",
      description: "Pan artesanal, hamburguesas premium e incontables opciones de personalización para cada preferencia dietética.",
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Arma tu hamburguesa",
      ctaLink: "/build-your-own",
      badge: "Opciones a base de plantas"
    },
    {
      id: 3,
      title: "Comida rápida premium, a tu manera",
      subtitle: "Excelencia Premium Rápido-Casual",
      description: "Experimenta la evolución de la comida reconfortante con nuestra calidad artesanal e inclusividad dietética.",
      image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Has tu pedido",
      ctaLink: "/order-delivery",
      badge: "Keto Friendly"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides?.length) % heroSlides?.length);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides?.map((slide, index) => (
          <div
            key={slide?.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide?.image}
              alt={slide?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Icon name="Award" size={16} className="text-accent" />
              <span className="text-accent font-medium text-sm">
                {heroSlides?.[currentSlide]?.badge}
              </span>
            </div>

            {/* Main Content */}
            <h1 className="font-playfair text-5xl lg:text-7xl font-semibold text-white mb-4 leading-tight">
              {heroSlides?.[currentSlide]?.title}
            </h1>
            
            <p className="text-xl lg:text-2xl text-accent font-medium mb-4">
              {heroSlides?.[currentSlide]?.subtitle}
            </p>
            
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {heroSlides?.[currentSlide]?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={heroSlides?.[currentSlide]?.ctaLink}>
                <Button variant="default" size="lg" iconName="ChefHat" iconPosition="left">
                  {heroSlides?.[currentSlide]?.cta}
                </Button>
              </Link>
              <Link to={currentSlide === 0 ? "/pizza-menu" : currentSlide === 1 ? "/burger-menu": "/build-your-own"}>
                <Button variant="default" size="lg" iconName={currentSlide === 0 ? "Pizza" : currentSlide === 1 ? "Hamburger" : "FullMenu"} iconPosition="left">
                  {currentSlide === 0 ? "Explorar menú de pizzas" : currentSlide === 1 ? "Explorar menú de hamburguesas" : "Ver menú completo"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-warm"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          
          <div className="flex space-x-2">
            {heroSlides?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-warm ${
                  index === currentSlide ? 'bg-accent' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-warm"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;