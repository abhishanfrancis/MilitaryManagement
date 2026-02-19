import { Html, Head, Main, NextScript } from 'next/document';

// Inline script to prevent FOUC (flash of unstyled content) on theme load
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en" className="h-full" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}