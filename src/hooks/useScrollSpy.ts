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
      rootMargin: options.isPreview ? '-20% 0px -60% 0px' : '-10% 0px -70% 0px',
      threshold: 0
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          options.onIntersect(entry.target.id);
        }
      });
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