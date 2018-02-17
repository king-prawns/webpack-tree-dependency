# Webpack dependency tree

[![NPM](https://nodei.co/npm/webpack-tree-dependency.png?compact=true)](https://nodei.co/npm/webpack-tree-dependency/)

This a [webpack](https://webpack.js.org/) plugin that creates a dependency tree (JSON or HTML)

## Install

```bash
npm install --save-dev webpack-tree-dependency
```

## Usage

**webpack.dev.config.js**

```js
var TreeWebpackPlugin = require('webpack-tree-dependency');

module.exports = {
  plugins: [new TreeWebpackPlugin()]
};
```

After starting the dev server you will be able to find the output file at:

`localhost:port/filename.html` (or .json)

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`directory`**|`{String}`| `'src'`|path to src folder from project root|
|**`extensions`**|`{Array<String>}`|`['js']`|Files to include|
|**`filename`**|`{String}`|`'tree'`|output filename|
|**`emitHtml`**|`{Boolean}`|`true`|emit HTML or JSON|


```js
new TreeWebpackPlugin({
    directory: 'path/to/folder',
    extensions: ['js', 'html'],
    filename: 'map',
    emitHtml: true
})
```