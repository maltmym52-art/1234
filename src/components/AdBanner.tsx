import { useEffect } from 'react';

const AdBanner = ({ adKey, containerId }) => {
  useEffect(() => {
    // 1. تحديد الحاوية
    const container = document.getElementById(containerId);
    if (!container) return;

    // 2. تنظيف الحاوية لضمان عدم التكرار
    container.innerHTML = '';

    // 3. إنشاء السكريبت ديناميكياً
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pl30211000.effectivecpmnetwork.com/${adKey}/invoke.js`;
    
    // 4. الحقن
    container.appendChild(script);

    // تنظيف عند إغلاق المكون
    return () => { container.innerHTML = ''; };
  }, [adKey, containerId]);

  return <div id={containerId} className="min-h-[90px] w-full flex justify-center" />;
};

export default AdBanner;
