import resolve from '@rollup/plugin-node-resolve';


const GLOBAL_NAME = `x`;

const commonOutputOptions = {
    name: GLOBAL_NAME,
    interop: false,
    extend: false,

    strict: true,
    namespaceToStringTag: false,
};

export default [{
    input: `../source/virstellungAutoLaunch.js`,
    plugins: [resolve()],
    treeshake: {
        moduleSideEffects: true,
    },

    output: [
        Object.assign({
            format: `es`,
            file: `built/virstellungAutoLaunch.es.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true,
    },
},{
    input: `./selectHelper.js`,
    plugins: [resolve()],
    treeshake: {
        moduleSideEffects: true,
        moduleSideEffects: `no-external`,
    },

    output: [
        Object.assign({
            format: `es`,
            file: `built/selectHelper.es.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true,
    },
}];
