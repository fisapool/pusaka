"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

// Extend the Window interface to include google namespace
declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: any;
        InlineLayout: {
          SIMPLE: number;
        };
      };
    };
  }
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Malay' },
  { code: 'ta', label: 'Tamil' },
  { code: 'zh-CN', label: 'Chinese' },
];

export function GoogleTranslateButton() {
  const [selectedLang, setSelectedLang] = useState('en');
  const uniqueCallbackName = 'googleTranslateElementInitPusakaPro';
  const uniqueDivId = 'google_translate_element_pusakapro';

  useEffect(() => {
    // Define the initialization function on the window object
    // @ts-ignore
    window[uniqueCallbackName] = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            includedLanguages: 'en,ms,ta,zh-CN',
          },
          uniqueDivId
        );
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    setSelectedLang(lang);

    // Trigger Google Translate to change language
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <>
      <div style={{ display: 'none' }} id={uniqueDivId}></div>
      <Script
        id="google-translate-script"
        src={`//translate.google.com/translate_a/element.js?cb=${uniqueCallbackName}`}
        strategy="lazyOnload"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="language-select" style={{ fontWeight: 'bold' }}>Select Language:</label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={handleChange}
          style={{ padding: '4px 8px', fontSize: '1rem' }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
