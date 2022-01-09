'use strict'

const path = require('path')
const rollup = require('rollup')
const { babel } = require('@rollup/plugin-babel')

const rootPath = path.resolve(__dirname, '../js/dist/')
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in each file, at most one copy of each
    babelHelpers: 'bundled'
  })
]

const psPlugins = {}

const defaultPluginConfig = {}

const getConfigByPluginKey = pluginKey => {

}

const utilObjects = new Set([])

const domObjects = new Set([])

const build = async plugin => {
  console.log(`Building ${plugin} plugin...`)

  const { external, globals } = getConfigByPluginKey(plugin)
  const pluginFilename = path.basename(psPlugins[plugin])
  let pluginPath = rootPath

  if (utilObjects.has(plugin)) {
    pluginPath = `${rootPath}/util/`
  }

  if (domObjects.has(plugin)) {
    pluginPath = `${rootPath}/dom/`
  }

  const bundle = await rollup.rollup({
    input: psPlugins[plugin],
    plugins,
    external
  })

  await bundle.write({
    banner: banner(pluginFilename),
    format: 'umd',
    name: plugin,
    sourcemap: true,
    globals,
    generatedCode: 'es2015',
    file: path.resolve(__dirname, `${pluginPath}/${pluginFilename}`)
  })

  console.log(`Building ${plugin} plugin... Done!`)
}
