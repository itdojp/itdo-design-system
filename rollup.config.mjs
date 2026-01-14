import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const extensions = ['.ts', '.tsx'];

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
      { file: 'dist/index.js', format: 'cjs', sourcemap: true, exports: 'named' },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions }),
      typescript({ tsconfig: './tsconfig.rollup.json' }),
      postcss({
        extract: 'styles.css',
        sourceMap: true,
        plugins: [autoprefixer()],
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
