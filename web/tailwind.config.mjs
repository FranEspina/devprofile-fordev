/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xxs: ['10px', '14px'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
