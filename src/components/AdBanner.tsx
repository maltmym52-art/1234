import { useEffect, useRef } from 'react';

// 1. تحديد نوع البيانات التي يحتاجها المكوّن عند استدعائه
interface AdBannerProps {
  adKey: string;   // رقم المفتاح الخاص بالإعلان من Adsterra
  height: number;  // طول الإعلان (مثال: 90)
  width: number;   // عرض الإعلان (مثال: 728)
}

export default function AdBanner({ adKey, height, width }: AdBannerProps) {
  // إنشاء إشارة مرجعية (مَرسى) لتحديد مكان حقن الإعلان في الصفحة
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // التأكد من أن المكان موجود في الصفحة، ولم يتم تحميل الإعلان فيه مسبقاً
    if (adRef.current && !adRef.current.firstChild) {
      const container = adRef.current;

      // أ) تعريف المتغير العالمي الذي يطلبه موقع Adsterra لقراءة مقاسات الإعلان
      (window as any).atOptions = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {},
      };

      // ب) إنشاء عنصر السكربت (<script>) برمجياً داخل الذاكرة
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;

      // ج) وضع السكربت داخل صندوق الـ div ليبدأ المتصفح بتحميل الإعلان وعرضه
      container.appendChild(script);
    }
  }, [adKey, height, width]);

  // واجهة العرض المعدلة لتدعم الـ ID المطلوب للإعلانات المدمجة (Native Banners)
  return (
    <div className="flex justify-center my-6 w-full">
      {/* يحمل الـ ID الخاص بالحاوية ديناميكياً بناءً على الـ adKey */}
      <div id={`container-${adKey}`} ref={adRef} />
    </div>
  );
}
