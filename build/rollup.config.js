import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

module.exports = {
  input: 'js/src/index.js',
  output: {
    file: 'dist/roar.js',
    format: 'umd',
    name: 'Roar',
    exports: 'named',
    compact: true,
    banner: '/* roar.js */',
    footer: '/* Copyright (c) 2018-2019 Bobby.li \n* MIT License \n*/'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({exclude: 'node_modules/**', runtimeHelpers: true})
  ]
}
