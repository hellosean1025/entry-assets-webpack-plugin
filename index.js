var fs = require ('fs');
var path = require ('path');

function AssetsWebpackPlugin (options) {
  this.options = Object.assign (
    {},
    {
      filename: 'webpack-entry-assets.json',
      fileTypes: ['js', 'css'],
    },
    options
  );
}

AssetsWebpackPlugin.prototype = {
  constructor: AssetsWebpackPlugin,

  apply: function (compiler) {
    var self = this;
    var options = compiler.options;
    var afterEmit = (compilation, callback) => {
      var stats = compilation.getStats ().toJson ({
        hash: true,
        publicPath: true,
        assets: true,
        chunks: false,
        modules: false,
        source: false,
        errorDetails: false,
        timings: false,
      });
      // publicPath with resolved [hash] placeholder

      var assets = stats.entrypoints.main.assets;
      var data = {
        css: [],
        js: []
      }
      for(var i=0; i< assets.length; i++){
        var item = assets[i];
        if(item.substr(item.length - 3) === '.js'){
          data.js.push(item)
        }else if(item.substr(item.length - 4) === '.css'){
          data.css.push(item)
        }
      }
      var assetPath = options.output.path;
      var filename = self.options.filename;
      fs.writeFileSync(path.resolve(assetPath, filename), JSON.stringify(data,null,2), 'utf8')
    };

    if (compiler.hooks) {
      var plugin = {name: 'AssetsWebpackPlugin'};

      compiler.hooks.afterEmit.tapAsync (plugin, afterEmit);
    } else {
      compiler.plugin ('after-emit', afterEmit);
    }
  },
};

module.exports = AssetsWebpackPlugin;
