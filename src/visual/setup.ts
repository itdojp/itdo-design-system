import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import globalCss from '../styles/global.css?inline';

const cssWithoutExternalFontImport = globalCss.replace(
  /^@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\);\s*/m,
  ''
);

const globalStyleElement = document.createElement('style');
globalStyleElement.setAttribute('data-visual-global-css', 'true');
globalStyleElement.textContent = cssWithoutExternalFontImport;
document.head.appendChild(globalStyleElement);

// Keep screenshot output deterministic in CI/browser test runtime.
document.documentElement.style.setProperty(
  '--font-sans',
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
);

const visualStabilityStyle = document.createElement('style');
visualStabilityStyle.setAttribute('data-visual-stability', 'true');
visualStabilityStyle.textContent = `
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;
document.head.appendChild(visualStabilityStyle);

afterEach(() => {
  cleanup();
});
