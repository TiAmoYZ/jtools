// 令 Rollup 从 JSON 文件中读取数据。
const pkg = require("../package.json");
const path = require("path");
// rollup不会主动寻找node_modules文件夹下的安装包
// rollup-plugin-node-resolve可以告诉rollup如何查找外部模块
const node = require("rollup-plugin-node-resolve");
// npm包大多是commonjs规范，需要将commonjs模块转换为es6供rollup处理
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const json = require("rollup-plugin-json");
const buble = require("rollup-plugin-buble");
const packageName = pkg.config.packageName;

const resolve = p => {
  return path.resolve(__dirname, "../", p);
};

const banner = "/*!\n" + " * jtools v" + pkg.version + "\n" + " * jlb web team\n" + " */";

const builds = {
  common: {
    entry: resolve("src/index.js"),
    dest: resolve(`${pkg.main}`),
    format: "cjs",
    banner
  },
  umd: {
    entry: resolve("src/index.js"),
    dest: resolve(`dist/${packageName}.min.js`),
    format: "umd",
    moduleName: packageName, // 浏览器端打开，通过jtools.add调用
    banner
  },
  esm: {
    entry: resolve("src/index.js"),
    dest: resolve(`${pkg.module}`),
    format: "es",
    banner
  }
};

function getConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    plugins: [
      buble(),
      node(),
      commonjs(),
      json(),
      babel({
        exclude: "node_modules/**",
        babelrc: false, // 不读取babelrc文件
        presets: [["@babel/env", { modules: false }]], // 设置modules: false,否则babel会子啊rollup处理之前，把模块转移成commonjs风格，导致tree-shake失败
        runtimeHelpers: true,
        plugins: [
          [
            "@babel/transform-runtime",
            {
              corejs: 2
            }
          ]
        ]
      })
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || packageName
    }
  };
  return config;
}

exports.getAllBuilds = () => Object.keys(builds).map(getConfig);