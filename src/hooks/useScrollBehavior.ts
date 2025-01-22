import { useEffect, useState, RefObject } from 'react';

interface UseScrollBehaviorOptions {
  isPreview?: boolean;
  scrollThreshold?: {
    preview: number;
    normal: number;
  };
}

interface ScrollBehavior {
  isScrolled: boolean;
  scrollToElement: (elementId: string, headerHeight: number) => void;
}

export const useScrollBehavior = (
  contentRef: RefObject<HTMLElement>,
  options: UseScrollBehaviorOptions = {}
): ScrollBehavior => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isPreview, scrollThreshold = { preview: 20, normal: 50 } } = options;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (isPreview) {
      content.style.scrollBehavior = 'smooth';
    }

    const handleScroll = () => {
      setIsScrolled(content.scrollTop > (isPreview ? scrollThreshold.preview : scrollThreshold.normal));
    };

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, [contentRef, isPreview, scrollThreshold]);

  const scrollToElement = (elementId: string, headerHeight: number) => {
    const element = document.getElementById(elementId);
    if (!element || !contentRef.current) return;

    const container = contentRef.current;
    const elementTop = element.offsetTop;
    
    container.scrollTo({
      top: elementTop - headerHeight,
      behavior: 'smooth',
    });
  };

  return {
    isScrolled,
    scrollToElement,
  };
}; 