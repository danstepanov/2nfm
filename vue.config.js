module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  css: { loaderOptions: { sass: { additionalData: '@import "@/assets/sass/global-setup.sass"' } } },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear();

    // add replacement loader(s)
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({ svgo: { plugins: [ { removeDimensions: true }, { removeViewBox: false } ] } });
  },
};