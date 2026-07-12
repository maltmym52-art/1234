import { useEffect } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerId || !scriptSrc) return;

    let lastPath = window.location.href;

    const loadAd = () => {
      const container = document.getElementById(containerId);
      if (!container) return;

      // تنظيف الحاوية بالكامل قبل الحقن الجديد
      container.innerHTML = '';

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptSrc;

      container.appendChild(script);
    };

    // تحميل الإعلان عند أول ظهور للمكون
    loadAd();

    // مراقبة ذكية وتلقائية لتغير الرابط (الأدوات) كل 500 ملي ثانية
    const checkInterval = setInterval(() => {
      if (window.location.href !== lastPath) {
        lastPath = window.location.href;
        loadAd(); // إعادة تحميل الإعلان فوراً عند الانتقال لأداة أخرى
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
      const container = document.getElementById(containerId);
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
