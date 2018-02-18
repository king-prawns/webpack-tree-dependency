# Webpack dependency tree

[![NPM](https://nodei.co/npm/webpack-tree-dependency.png?compact=true)](https://nodei.co/npm/webpack-tree-dependency/)

This a [webpack](https://webpack.js.org/) plugin that creates a dependency tree.

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
|**`directory`**|`{String}`| `'src'`|relative path to src folder|
|**`extensions`**|`{Array<String>}`|`['js']`|Files to include|
|**`filename`**|`{String}`|`'tree'`|output filename|
|**`emitHtml`**|`{Boolean}`|`true`|emit HTML or JSON|


```js
new TreeWebpackPlugin({
    directory: 'path/to/src',
    extensions: ['js', 'html'],
    filename: 'map',
    emitHtml: true
})
```

## Example

**.json**

```json
{
  "type": "js",
  "path": "root",
  "name": "main",
  "children": [
    {
      "type": "js",
      "path": "/components/comp-one",
      "name": "index",
      "children": [
        {
          "type": "js",
          "path": "/components/comp-one/libs",
          "name": "awesome-lib",
          "children": [],
          "recursive": true
        },
        {
          "type": "html",
          "path": "/components/comp-one",
          "name": "template",
          "children": [],
          "recursive": false
        },
        {}
      ],
      "recursive": false
    },
    {
      "type": "js",
      "path": "/components/comp-two",
      "name": "index",
      "children": [],
      "recursive": false
    }
  ],
  "recursive": false
}
```
