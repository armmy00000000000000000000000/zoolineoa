import React, { useEffect } from 'react';

const TranslateComponent = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en,th', // ภาษาเริ่มต้น
        includedLanguages: 'en,th', // ภาษาให้เลือก
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      }, 'google_translate_element');
    };

    // โหลดสคริปต์ Google Translate
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container mt-5">
      <h1>My Web Page</h1>
      <p>Hello everybody!</p>
      <p>Translate this page:</p>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default TranslateComponent;
