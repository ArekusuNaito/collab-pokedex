// const homeDirectoryName = "src";
// const outputDirectoryName = "dist"

const {fusebox} = require('fuse-box');
const {pluginJSON} = require('fuse-box');
const fuse = fusebox
({
    entry: 'server.ts',
    target: 'server',
    // homeDir: homeDirectoryName,
    // useSingleBundle: true,
    // tsConfig: 'src/tsconfig.json', //If you already have a tsconfig, you can tell fusebox where it is
    dependencies:{include:['tslib']}, //👈 Sometimes fuse-box is weird and it will work without this line of code. Might save your day if you add it
    // hmr: true,
    // watch:true,
    plugins: [pluginJSON()]
});
fuse.runDev(handler=>
  {
    handler.onComplete(output=>
      {
        //This will execute your entry file and it will be refreshed
        output.server.handleEntry({nodeArgs:[],scriptArgs:[]})
      })
  })