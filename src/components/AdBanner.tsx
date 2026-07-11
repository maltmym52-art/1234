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

  // واجهة العرض: صندوق خارجي يضمن توسط الإعلان في الصفحة مع مساحات جمالية واضحة
  return (
    <div 
      className="adsterra-container" 
      style={{
        display: 'block',
        textAlign: 'center',
        margin: '24px auto',
        width: '100%',
        minHeight: `${height}px`,
        overflow: 'hidden'
      }}
    >
      {/* هنا سيتم حقن الإعلان تلقائياً بواسطة الكود أعلاه */}
      <div ref={adRef} style={{ display: 'inline-block' }} />
    </div>
  );
}
