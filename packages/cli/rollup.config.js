import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'

const name = pkg.bin.koge.replace(/\.js$/, '')

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: false,
      }
    ],
  })
]