/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
		},
		boxShadow: {
			'3xl': '0px 0px 50px 0px rgba(45,255,196,0.9)',
		  },
		colors: {
			primary: "#EF233C",
			secondary: "#6184D8",
			neutral2: "#EDF2F4",
			neutral: "#030301",
			white: "#FFFFFF",
			black: "#000000",
			green: "#5cb85c",
		}
	},
	plugins: [],
}
