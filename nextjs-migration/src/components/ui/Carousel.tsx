import { Children, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = Children.toArray(children);
  const itemsCount = items.length;

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = itemsCount - 1;
    } else if (newIndex >= itemsCount) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (autoPlay && !paused) {
      const intervalId = setInterval(() => {
        updateIndex(activeIndex + 1);
      }, interval);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [activeIndex, autoPlay, interval, paused]);

  if (itemsCount === 0) return null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div 
        className="whitespace-nowrap transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="inline-flex items-center justify-center w-full">
            {item}
          </div>
        ))}
      </div>

      {showArrows && itemsCount > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md w-10 h-10 p-0 flex items-center justify-center"
            onClick={() => updateIndex(activeIndex - 1)}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md w-10 h-10 p-0 flex items-center justify-center"
            onClick={() => updateIndex(activeIndex + 1)}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {showDots && itemsCount > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => updateIndex(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
