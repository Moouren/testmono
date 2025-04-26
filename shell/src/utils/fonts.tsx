// src/lib/utils/fonts.js
import './font.css'; // Import the CSS file with @font-face definitions

// Direct references to font families - consistent across CSS and JS
const IRAN_YEKAN_FAMILY = "'IRANYekanX', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const IRAN_YEKAN_VF_FAMILY = "'IRANYekanXVF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

// Simple exports with just the class names and direct font-family styles
export const iranYekan = {
  className: 'font-iran-yekan',
  style: {
    fontFamily: IRAN_YEKAN_FAMILY
  }
};

export const iranYekanVF = {
  className: 'font-iran-yekan-vf',
  style: {
    fontFamily: IRAN_YEKAN_VF_FAMILY
  }
};