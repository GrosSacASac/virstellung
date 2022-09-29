import resolve from '@rollup/plugin-node-resolve';


const GLOBAL_NAME = `x`;

const commonOutputOptions = {
    // core output options
    name: GLOBAL_NAME,
    // globals: [],

    // advanced output options
    // paths: {},
    // footer: ``,
    // intro: ``,
    // outro: ``,
    // sourcemap,
    // sourcemapFile,
    interop: false,
    extend: false,

    // danger zone
    // exports,
    // indent,
    strict: true,
    // freeze,
    namespaceToStringTag: false

    // experimental
    // entryFileNames,
    // chunkFileNames,
    // assetFileNames
};

export default [{
    input: `../source/virstellungAutoLaunch.js`,
    plugins: [resolve()],
    treeshake: {
        moduleSideEffects: true,
        moduleSideEffects: `no-external`,
    },

    output: [
        Object.assign({
            format: `es`,
            file: `built/virstellung.es.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true
    }
},];
