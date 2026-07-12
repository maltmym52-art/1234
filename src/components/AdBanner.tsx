import { useEffect } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  useEffect(() => {
    // التأكد من أن الكود يعمل داخل المتصفح فقط وبشكل آمن
    if (typeof window === 'undefined' || !containerId) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // تنظيف المحتوى القديم لمنع تكرار الإعلان
    container.innerHTML = '';

    // بناء سكريبت الإعلان ديناميكياً
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [containerId, scriptSrc]);

  return (
    <div 
      id={containerId} 
      className="w-full flex justify-center items-center my-4" 
      style={{ minHeight: '100px' }} 
    />
  );
};

export default AdBanner;
