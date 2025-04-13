import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				fredoka: ['Fredoka', 'sans-serif'],
			},
            colors: {
                primary: '#41e67f',
                primaryhover: '#2AB868',
                darkgray: '#1A1A1A',
            }
		},
	},
	plugins: [],
};
export default config;
