import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const extensions = ['.ts', '.js']
module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/fronted-monitor.js',
    format: 'umd',
    name: 'Monitor',
    exports: 'named',
    compact: true,
    banner: '/* fronted-monitor.js */',
    footer: '/* Copyright (c) 2019-2019 Bobby.li \n* MIT License \n*/'
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
    // babel({
    //   include: ['src/**/*'],
    //   exclude: 'node_modules/**',
    //   extensions,
    //   runtimeHelpers: true
    // }),
    uglify()
  ]
}
