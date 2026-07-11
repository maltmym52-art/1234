import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
}

export default function AdBanner({ adKey }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // التأكد من أن المكوّن موجود في الصفحة ولم يتم حقنه مسبقاً
    if (adRef.current && !adRef.current.firstChild) {
      const container = adRef.current;

      // 1. إنشاء الحاوية بالـ ID الديناميكي المطلوبة للسكربت
      const adContainer = document.createElement('div');
      adContainer.id = `container-${adKey}`;
      container.appendChild(adContainer);

      // 2. إنشاء السكربت وحقنه
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;

      container.appendChild(script);
    }
  }, [adKey]);

  return (
    <div className="flex justify-center my-6 w-full overflow-hidden min-h-[90px]">
      {/* هنا سيتم توليد الإعلان داخل الأداة بتنسيق متناسق */}
      <div ref={adRef} className="w-full text-center" />
    </div>
  );
}
