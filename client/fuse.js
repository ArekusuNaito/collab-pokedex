const {fusebox} = require('fuse-box');
const {pluginJSON} = require('fuse-box');


const fuse = fusebox
({
    entry: 'src/app.tsx',
    target: 'browser',
    devServer: true,
    webIndex:
    {
      template:'src/template.html'
    },
    // tsConfig: 'src/tsconfig.json', //If you already have a tsconfig, you can tell fusebox where it is
    hmr: true,
    plugins: [pluginJSON()]
});
fuse.runDev();