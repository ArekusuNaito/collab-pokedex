// const homeDirectoryName = "src";
// const outputDirectoryName = "dist"

const {fusebox} = require('fuse-box');
const {pluginJSON} = require('fuse-box');


const fuse = fusebox
({
    entry: 'src/app.tsx',
    target: 'browser',
    devServer: true,
    // homeDir: homeDirectoryName,
    webIndex:
    {
      template:'src/template.html'
    },
    // tsConfig: 'src/tsconfig.json', //If you already have a tsconfig, you can tell fusebox where it is
    dependencies:{include:['tslib']}, //👈 Sometimes fuse-box is weird and it will work without this line of code. Might save your day if you add it
    hmr: true,
    plugins: [pluginJSON()]
});
fuse.runDev();