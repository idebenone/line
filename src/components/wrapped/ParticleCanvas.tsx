"use client";

import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  color: string;
  size: number;

  constructor(
    x: number,
    y: number,
    speedX: number,
    speedY: number,
    color: string,
    size: number
  ) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.size = size;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = canvasWidth;
    }

    if (this.y > canvasHeight) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = canvasHeight;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles: Particle[] = [];

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      //   const speedX = Math.random() * 0.5 + 1;
      //   const speedY = Math.random() * 0.5 + 1;

      const speedX = 1.5;
      const speedY = 1.5;
      const color = `hsl(0, 0%, ${Math.random() * 50}%)`;
      const size = Math.random() * 2 + 1;

      particles.push(new Particle(x, y, speedX, speedY, color, size));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed -z-50" />;
};

export default ParticleCanvas;
