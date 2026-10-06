import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealHeadingProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  staggerMs?: number;
  highlightClass?: string;
}

export function ScrollRevealHeading({
  text,
  highlightWords = [],
  className = '',
  as: Component = 'h2',
  staggerMs = 30,
  highlightClass = 'text-red-600',
}: ScrollRevealHeadingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={elementRef} className="inline-block overflow-hidden">
      <Component className={`${className} flex flex-wrap gap-x-2 gap-y-1 items-baseline`}>
        {words.map((word, index) => {
          const isHighlighted = highlightWords.some(hw => 
            word.toLowerCase().replace(/[^a-z0-9]/gi, '') === hw.toLowerCase().replace(/[^a-z0-9]/gi, '')
          );

          return (
            <span
              key={index}
              style={{
                transitionDelay: `${index * staggerMs}ms`,
              }}
              className={`inline-block transition-all duration-700 ease-out transform ${
                isVisible
                  ? 'translate-y-0 opacity-100 blur-0 scale-100'
                  : 'translate-y-8 opacity-0 blur-xs scale-90'
              } ${isHighlighted ? highlightClass : ''}`}
            >
              {word}
            </span>
          );
        })}
      </Component>
    </div>
  );
}

interface ScrollRevealParagraphProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollRevealParagraph({
  children,
  className = '',
  delayMs = 150,
}: ScrollRevealParagraphProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`${className} transition-all duration-800 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 filter-none'
          : 'translate-y-6 opacity-0 blur-xs'
      }`}
    >
      {children}
    </p>
  );
}

interface CounterRevealProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CounterReveal({
  end,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}: CounterRevealProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
