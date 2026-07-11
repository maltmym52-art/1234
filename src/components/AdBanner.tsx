import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  height: number;
  width: number;
}

export default function AdBanner({ adKey, height, width }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const container = adRef.current;

      // 1. إنشاء صندوق الإعلان المدمج برمجياً وضبط الـ ID المطلوب له تماماً
      const adContainer = document.createElement('div');
      adContainer.id = `container-${adKey}`;
      container.appendChild(adContainer);

      // 2. إعداد خيارات Adsterra العالمية
      (window as any).atOptions = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {},
      };

      // 3. إنشاء واستدعاء سكربت الإعلان
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;

      // 4. حقن السكربت بجانب صندوق الإعلان تماماً
      container.appendChild(script);
    }
  }, [adKey, height, width]);

  return (
    <div 
      className="flex justify-center my-6 w-full overflow-hidden" 
      style={{ minHeight: `${height}px` }}
    >
      {/* هذا الصندوق الخارجي الثابت الذي سيتم توليد الإعلان بداخله برمجياً */}
      <div ref={adRef} className="w-full text-center" />
    </div>
  );
}
