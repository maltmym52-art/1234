import { useEffect } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  useEffect(() => {
    // حماية تامة ضد الانهيار أثناء الـ Build أو التشغيل
    if (typeof window === 'undefined' || !containerId || !scriptSrc) return;

    const loadAd = () => {
      const container = document.getElementById(containerId);
      if (!container) return;

      // تفريغ الحاوية لحقن الإعلان الجديد ونظافة الـ DOM
      container.innerHTML = '';

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptSrc;

      container.appendChild(script);
    };

    // تشغيل الإعلان فوراً عند تحميل المكون
    loadAd();

    // مستمع مدمج: يعيد تشغيل الإعلان تلقائياً عند انتقال المستخدم بين الأدوات (تغير الرابط)
    window.addEventListener('popstate', loadAd);

    return () => {
      window.removeEventListener('popstate', loadAd);
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
