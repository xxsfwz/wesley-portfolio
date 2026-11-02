来源：https://github.com/stackedlol/ascii-sharks
许可：MIT（见 LICENSE）
下载日期：2026-11-03
修改：renderer.ts 的 paintBackground 省略 paintGrid；其余模拟/渲染保持上游实现。
浏览器模块使用 Node.js stripTypeScriptTypes(mode=transform) 从 src/*.ts 生成，并将相对导入补为 .mjs。
页面集成：assets/js/ocean-background.mjs、assets/css/ocean-background.css。
