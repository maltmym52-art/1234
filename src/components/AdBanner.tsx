import { useEffect, useState } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  // استخدام عدّاد لتغيير الـ key الداخلي وإجبار المكون على إعادة البناء بالكامل
  const [adRefreshKey, setAdRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastPath = window.location.href;

    // مراقبة تغير الرابط (الانتقال بين الأدوات)
    const checkInterval = setInterval(() => {
      if (window.location.href !== lastPath) {
        lastPath = window.location.href;
        // زيادة العداد لتدمير الحاوية القديمة وبناء حاوية جديدة تماماً
        setAdRefreshKey((prev) => prev + 1);
      }
    }, 400);

    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerId || !scriptSrc) return;

    // ننتظر قليلاً للتأكد من أن الحاوية الجديدة تم رندرها في الـ DOM
    const timer = setTimeout(() => {
      const container = document.getElementById(`${containerId}-${adRefreshKey}`);
      if (!container) return;

      container.innerHTML = '';

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptSrc;

      container.appendChild(script);
    }, 50);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById(`${containerId}-${adRefreshKey}`);
      if (container) container.innerHTML = '';
    };
  }, [containerId, scriptSrc, adRefreshKey]);

  return (
    <div 
      key={adRefreshKey}
      id={`${containerId}-${adRefreshKey}`} 
      className="w-full flex justify-center items-center my-4 min-h-[100px]" 
      style={{ minHeight: '100px' }} 
    />
  );
};

export default AdBanner;
