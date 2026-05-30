import React, { useEffect, useRef } from 'react';

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

export type AdBannerProps = {
  slot: string;
  format?: AdFormat;
  className?: string;
  style?: React.CSSProperties;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdBanner = ({ slot, format = 'auto', className = '', style }: AdBannerProps) => {
  const elRef = useRef<HTMLDivElement | HTMLInsElement | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    let timeoutId: number | null = null;

    const tryPush = () => {
      try {
        const el = elRef.current as any;
        if (el && el.offsetWidth > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          timeoutId = window.setTimeout(tryPush, 250);
        }
      } catch (e) {
        // silent
      }
    };

    tryPush();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [slot]);

  if (import.meta.env.DEV) {
    return (
      <div
        ref={elRef as React.RefObject<HTMLDivElement>}
        className={"min-h-[90px] rounded-md border-dashed border p-4 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 " + className}
        style={{ minHeight: 90, ...style }}
      >
        [AdSense — Solo en dev]
      </div>
    );
  }

  // TODO: Replace slot placeholders with real AdSense slot IDs once account is approved
  return (
    <ins
      ref={elRef as React.RefObject<HTMLInsElement>}
      className={"adsbygoogle " + className}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      aria-hidden="true"
    />
  );
};

AdBanner.displayName = 'AdBanner';
