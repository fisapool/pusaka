
"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';

// Enhance window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInitPusakaPro?: () => void; // Unique callback name
    google?: {
      translate: {
        TranslateElement: any; // Using 'any' for simplicity with Google's untyped library
      };
    };
  }
}

export function GoogleTranslateButton() {
  const uniqueCallbackName = 'googleTranslateElementInitPusakaPro';
  const uniqueDivId = 'google_translate_element_pusakapro';

  useEffect(() => {
    // Define the initialization function on the window object
    // @ts-ignore because we are dynamically adding a function to window
    window[uniqueCallbackName] = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en', // Source language of your website
            // @ts-ignore // Accessing InlineLayout.SIMPLE from the loaded Google script
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            // You can include specific languages if needed:
            // includedLanguages: 'en,ms,zh-CN,ta',
          },
          uniqueDivId // The ID of the div where the widget will be rendered
        );
      }
    };

    // Cleanup function to run when the component unmounts
    return () => {
      // @ts-ignore
      delete window[uniqueCallbackName]; // Remove the global callback
      const widgetDiv = document.getElementById(uniqueDivId);
      if (widgetDiv) {
        // Attempt to clear Google's own elements if possible
        while (widgetDiv.firstChild) {
          widgetDiv.removeChild(widgetDiv.firstChild);
        }
         // Fallback if Google's widget is more complex or replaces the div
        widgetDiv.innerHTML = '';
      }
      // Note: Removing the script tag itself can be complex as Google might load other scripts.
      // Clearing the div and callback is a primary step for SPA cleanup.
    };
  }, [uniqueCallbackName, uniqueDivId]); // Dependencies ensure effect runs if these somehow change

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '38px' }}>
        <div id={uniqueDivId} style={{ display: 'inline-block' }}>
          {/* This div will be populated by the Google Translate widget */}
          {/* Its width will be determined by the widget itself */}
        </div>
      </div>
      <Script
        id="google-translate-script" // Unique ID for the script tag
        src={`//translate.google.com/translate_a/element.js?cb=${uniqueCallbackName}`}
        strategy="lazyOnload" // Load when browser is idle
        onError={(e) => {
          console.error('Google Translate script failed to load:', e);
          const el = document.getElementById(uniqueDivId);
          if (el) {
            // Provide a user-friendly message in case of error
            el.innerHTML = '<p style="font-size: 0.8rem; color: hsl(var(--muted-foreground)); text-align: center; padding-top: 8px;">Language tool unavailable.</p>';
          }
        }}
      />
    </>
  );
}
