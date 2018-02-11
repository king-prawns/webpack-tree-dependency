'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function TreeWebpackPlugin (options) {
  // Default options
  this.options = Object.assign({
    directory: 'src',
    extensions: ['js'],
    outputPath: '',
    filename: 'tree',
    emitHtml: true
  }, options);
}

TreeWebpackPlugin.prototype.apply = function (compiler) {
  var that = this;
  if (that.options.filename === 'index') {
    throw new Error('"index" is not a valid filename');
  }
  if (that.options.extensions.length <= 0) {
    throw new Error('there must be at least one extension');
  }
  that.options.directory = path.resolve(__dirname, '../../' + that.options.directory);
  try {
    fs.lstatSync(that.options.directory).isDirectory()
  } catch(e) {
    throw new Error('directory not exist');
  }
  compiler.plugin('emit', function (compilation, callback) {
    var dependencyMap = {};

    compilation.modules.forEach(function (module) {
      if (!module.resource || !that.isResource(module.resource)) return;

      var dependencies = (module.dependencies || [])
        .filter(function (dependency) {
          return dependency.module &&
          dependency.module.resource &&
          that.isResource(dependency.module.resource)
        })
        .map(function (dependency) { return that.purgePath(dependency.module.resource) });

      dependencyMap[that.purgePath(module.resource)] = dependencies;
    });

    var root = Object.keys(dependencyMap)
      .find(function(component) {
        return Object.keys(dependencyMap)
          .every(function(innerComp) {
            return dependencyMap[innerComp].indexOf(component) < 0;
          });
      });

    var dependencyTree = that.createTree(dependencyMap, root);

    var source = '';
    var ext = ''
    if (that.options.emitHtml) {
      var tpl = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');
      source = _.template(tpl)({tree: dependencyTree, extensions: that.options.extensions });
      ext = '.html';
    } else {
      source = JSON.stringify(dependencyTree);
      ext = '.json';
    }

    var output = path.join(
      that.options.outputPath,
      that.options.filename + ext
    );

    compilation.assets[output] = {
      source : function () { return source },
      size   : function () { return source.length }
    };

    callback();
  });
};

TreeWebpackPlugin.prototype.isResource = function (modulePath) {
  if (modulePath.indexOf(this.options.directory) !== 0) return false;
  var exts = this.options.extensions.map(function (ext) { return '.' + ext; })
  return exts.indexOf(path.extname(modulePath)) >= 0;
};

TreeWebpackPlugin.prototype.createTree = function (dependencyMap, node) {
  var that = this;
  var nodes = [];
  var index = 0;
  function nodeRecursion(dependencyMap, node, recursive) {
    var children = [];
    if (!recursive) {
      children = (dependencyMap[node] || [])
        .map(function (child) {
          var isRecursive = false;
          if (dependencyMap[child].length > 0) {
            isRecursive = nodes.indexOf(child) >= 0;
          }
          if (!isRecursive) {
            nodes[index] = child;
            index++;
          }
          return nodeRecursion(dependencyMap, child, isRecursive);
        });
    }

    var ext = path.extname(node);
    var trNode = node.slice(0, -ext.length);
    var slashPos = trNode.lastIndexOf('/');

    return {
      "type": ext.slice(1),
      "path": trNode.slice(0, slashPos) || 'root',
      "name": trNode.slice(slashPos+1),
      "children": children,
      "recursive": recursive || false
    };
  }
  return nodeRecursion(dependencyMap, node);
};

TreeWebpackPlugin.prototype.purgePath = function (modulePath) {
  return modulePath.replace(this.options.directory, '');
}

module.exports = TreeWebpackPlugin;
