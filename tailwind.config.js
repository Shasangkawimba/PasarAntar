import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                onyx: 'var(--color-onyx)',
                charcoal: 'var(--color-charcoal)',
                obsidian: 'var(--color-obsidian)',
                graphite: 'var(--color-graphite)',
                iron: 'var(--color-iron)',
                steel: 'var(--color-steel)',
                slate: 'var(--color-slate)',
                fog: 'var(--color-fog)',
                mist: 'var(--color-mist)',
                platinum: 'var(--color-platinum)',
                snow: 'var(--color-snow)',
                'acid-lime': 'var(--color-acid-lime)',
                indigo: 'var(--color-indigo)',
                emerald: 'var(--color-emerald)',
                crimson: 'var(--color-crimson)',
                cyan: 'var(--color-cyan)',
            },
            borderRadius: {
                none: '0px',
                xs: '0px',
                sm: '0px',
                md: '0px',
                lg: '0px',
                xl: '0px',
                '2xl': '0px',
                '3xl': '0px',
                full: '0px',
            }
        },
    },

    plugins: [forms],
};
