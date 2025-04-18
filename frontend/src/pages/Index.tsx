import React, { useEffect, useRef } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create floating elements
    const elements = Array.from({
      length: 20
    }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.2 + 0.1
    }));

    // Animation function
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach(element => {
        // Update position
        element.x += element.speedX;
        element.y += element.speedY;

        // Wrap around screen
        if (element.x > canvas.width) element.x = 0;
        if (element.x < 0) element.x = canvas.width;
        if (element.y > canvas.height) element.y = 0;
        if (element.y < 0) element.y = canvas.height;

        // Draw element
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 135, 245, ${element.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F12] text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <Header />
      <Hero />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
