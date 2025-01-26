import { useRef, useEffect } from 'react';

interface UseScrollSpyOptions {
  root: HTMLElement | null;
  isPreview?: boolean;
  onIntersect: (id: string) => void;
}

export const useScrollSpy = (elements: string[], options: UseScrollSpyOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!options.root) return;

    const observerOptions = {
      root: options.root,
      rootMargin: options.isPreview ? '-10% 0px -70% 0px' : '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.2]
    };

    const callback: IntersectionObserverCallback = (entries) => {
      const significantEntries = entries.filter(entry => entry.intersectionRatio >= 0.1);
      
      if (significantEntries.length > 0) {
        const mostVisible = significantEntries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio ? current : prev;
        });

        if (mostVisible.isIntersecting) {
          options.onIntersect(mostVisible.target.id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(callback, observerOptions);

    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elements, options.root, options.isPreview, options.onIntersect]);

  return observerRef.current;
}; 