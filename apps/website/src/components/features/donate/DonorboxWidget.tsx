'use client';

/**
 * Donorbox embedded donation widget.
 *
 * Wraps the official `https://donorbox.org/embed/<form-id>` iframe and
 * loads `widget.js` once via Next.js's <Script> so it hydrates correctly
 * across navigations and survives Strict Mode.
 *
 * To swap forms, change `formId` (the part after /embed/ in the URL the
 * Donorbox UI gives you, e.g. `donation-481`).
 */

import Script from 'next/script';

interface DonorboxWidgetProps {
  /** Donorbox form id, e.g. `donation-481` (the suffix of /embed/<id>). */
  formId: string;
  /** Iframe height. Donorbox recommends 900px to avoid inner scrollbars. */
  height?: string;
  /** Enable PayPal Express checkout via the widget script attribute. */
  paypalExpress?: boolean;
  /** Optional className for the wrapping <div>. */
  className?: string;
}

export function DonorboxWidget({
  formId,
  height = '900px',
  paypalExpress = true,
  className,
}: DonorboxWidgetProps) {
  return (
    <div className={className}>
      {/*
        Donorbox widget script. Loaded with strategy=afterInteractive so it
        runs after the iframe is in the DOM but doesn't block first paint.
        The paypalExpress attribute is read by the script via
        document.currentScript.getAttribute, so we forward it as a custom
        attribute below.
      */}
      <Script
        id="donorbox-widget"
        src="https://donorbox.org/widget.js"
        strategy="afterInteractive"
        // @ts-expect-error — paypalExpress is a non-standard attribute the
        // Donorbox script reads off itself; not part of the HTMLScriptElement
        // type but accepted by React in lowercase form.
        paypalexpress={paypalExpress ? 'true' : 'false'}
      />

      <iframe
        src={`https://donorbox.org/embed/${formId}`}
        name="donorbox"
        seamless
        width="100%"
        height={height}
        style={{
          maxWidth: '500px',
          minWidth: '250px',
          // Donorbox's own snippet uses `max-height: none !important` to
          // override host stylesheets that might clip the iframe.
          maxHeight: 'none',
        }}
        // The iframe needs scripts (Stripe, PayPal SDKs etc.) but no top-
        // navigation. allow-popups lets the PayPal flow open its window.
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        title="Donate via Donorbox"
      />
    </div>
  );
}
