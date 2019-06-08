import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

const extensions = ['.ts', '.js']
module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/fe-supervisor.min.js',
    format: 'umd',
    name: '$sv',
    exports: 'named',
    compact: true,
    banner: '/* fe-supervisor.js */',
    footer: '/* Copyright (c) 2019-2019 Bobby.li \n* MIT License \n*/'
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
    uglify()
  ]
}
