import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'
import executable from "rollup-plugin-executable"
import shebang from 'rollup-plugin-preserve-shebang';

const name = pkg.bin.koge.replace(/\.js$/, '')

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [
      esbuild(), 
      executable(),
      shebang()
    ],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: false,
      }
    ],
  })
]