import svelte from 'rollup-plugin-svelte';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/main.ts',
  output: {
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js',
    compact: true,
    minifyInternalExports: true,
  },
  plugins: [
    json(),

    svelte({
      preprocess: sveltePreprocess({ sourceMap: true }),
      compilerOptions: {
        dev: false,
      }
    }),

    css({ output: 'bundle.css' }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),

    commonjs(),

    typescript({
      sourceMap: false,
      inlineSources: false,
      rootDir: './src',
    }),

    terser(),
  ],
};
