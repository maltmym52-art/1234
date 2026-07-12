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

    // كود الـ HTML المطور ليتمدد الإعلان بكامل حجمه الطبيعي دون قيود
    const adHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body { 
              margin: 0; 
              padding: 0; 
              width: 100%;
              height: 100%;
              display: flex; 
              justify-content: center; 
              align-items: center; 
              background: transparent; 
              overflow: visible;
            }
            div {
              width: 100%;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="${containerId}">
            <script async="async" data-cfasync="false" src="${scriptSrc}"></script>
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(adHtml);
      doc.close();
    }
  }, [containerId, scriptSrc]);

  return (
    <div className="w-full flex justify-center items-center my-6 overflow-visible">
      <iframe
        ref={iframeRef}
        title="Ad Frame"
        width="100%"
        height="280" 
        frameBorder="0"
        scrolling="no"
        style={{ 
          border: 'none', 
          overflow: 'visible', 
          width: '100%',
          maxWidth: '100%',
          minHeight: '250px' // يضمن مساحة كافية لظهور الإعلان بحجمه الطبيعي والكامل
        }}
      />
    </div>
  );
};

export default AdBanner;
