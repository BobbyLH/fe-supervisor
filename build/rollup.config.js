import fs from 'fs'
import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const { env } = process
const isBeta = !!env.beta
const pkg = fs.readFileSync('./package.json', 'utf-8')
const regExp = new RegExp(`version.*(\\d+).(\\d+).(\\d+)${isBeta ? '\\-(beta).(\\d+)' : ''}`, 'g')
pkg.match(regExp)
const version = `${RegExp.$1}_${RegExp.$2}_${RegExp.$3}${isBeta ? `-beta_${RegExp.$5}` : ''}`

const extensions = ['.ts', '.js']
module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: `dist/fe-supervisor.sdk.${version}.js`,
      format: 'umd',
      name: '$sv',
      exports: 'named',
      compact: true
    },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      typescript({
        target: 'es5',
        lib: ["es5", "es6", "es2015", "es2016", "dom"]
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        runtimeHelpers: true
      }),
      uglify()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/fe-supervisor.js',
      format: 'esm',
      compact: true,
      banner: '/* fe-supervisor.js */',
      footer: '/* Copyright (c) 2019-2019 Bobby.li \n* MIT License \n*/'
    },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      typescript({
        target: 'ESNEXT',
        lib: ["es5", "es6", "es2015", "es2016", "dom"]
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        runtimeHelpers: true
      })
    ]
  }
]
