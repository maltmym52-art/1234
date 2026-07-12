import { useEffect, useRef } from 'react';

interface AdBannerProps {
  containerId: string;
  scriptSrc: string;
}

const AdBanner = ({ containerId, scriptSrc }: AdBannerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // كود الـ HTML التقليدي للإعلان الذي سيتم تشغيله داخل الـ iframe المعزول
    const adHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
          </style>
        </head>
        <body>
          <script async="async" data-cfasync="false" src="${scriptSrc}"></script>
          <div id="${containerId}"></div>
        </body>
      </html>
    `;

    // حقن الكود وتحديث الـ iframe لإجبار الإعلان على الظهور من جديد عند كل رندر
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(adHtml);
      doc.close();
    }
  }, [containerId, scriptSrc]);

  return (
    <div className="w-full flex justify-center items-center my-4 min-h-[100px]">
      <iframe
        ref={iframeRef}
        title="Ad Frame"
        width="100%"
        height="100"
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden', minHeight: '100px' }}
      />
    </div>
  );
};

export default AdBanner;
