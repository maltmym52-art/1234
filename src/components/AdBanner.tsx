import { useEffect } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  useEffect(() => {
    // 1. تحديد الحاوية
    const container = document.getElementById(containerId);
    if (!container) return;

    // 2. تنظيف الحاوية لضمان عدم التكرار
    container.innerHTML = '';

    // 3. إنشاء السكريبت ديناميكياً
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    // 4. الحقن
    container.appendChild(script);

    // تنظيف عند إغلاق المكون أو الانتقال
    return () => {
      if (container) container.innerHTML = '';
    };
  }, [containerId, scriptSrc]);

  return <div id={containerId} className="min-h-[100px] w-full flex justify-center items-center my-4" />;
};

export default AdBanner;
