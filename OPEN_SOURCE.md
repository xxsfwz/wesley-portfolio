# 开源依赖与设计参考

- 实际集成：Splide 4.1.4，https://github.com/Splidejs/splide ，MIT，版权许可保存在 assets/vendor/splide/LICENSE。JS与基础CSS本地保存，用于其他探索的响应式滑动、键盘导航与触控。无外部CDN运行依赖。
- 调研比较：RyanFitzgerald/devportfolio（开发者履历型作品集）、dimsemenov/PhotoSwipe（图片查看器）。未复制其代码或套用完整模板。
- 首页采用本地定制的精选作品结构；本轮加入 Three.js 0.170.0 的轻量线框装饰，依赖和 MIT 许可证本地保存。
- 首页旧内容保留在collection.html，所有原资产和项目目录保留。
- 已验证桌面1440、手机390宽；修复小屏工作流封面最小宽度溢出。项目弹窗、Escape关闭、Glide媒体元数据、Splide下一项、两份PDF下载验证通过，页面无JS错误。
- 当前仅本地预览，正式域名未发布。

## 2026-10-25 内容调整
- 首屏泰语 App AI 视频，另列两条 AI 广告；AE 区加入跃动小子与蜜蜂救狗。Glide 移到其他作品。
- 新视频使用本地轻量文件：泰语 1.71 MB、蜜蜂救狗 2.49 MB、跃动小子 8.40 MB。源文件保留。
- 工作流展示三部实际剧名与历史批次，未编造投放效果或效率百分比。
- 本轮验证：三条新视频均成功读取并播放，两个简历下载均返回 200；390px 页面无横向溢出，无脚本错误。
- 设计参考另包含 Anthropic 公开 frontend-design 指南；未确认用户提及的 OOPS 具体仓库。

## 展示与动效补充
- AI 选段七条；AE/MG 合并五件作品；游戏测试标题改为“开箱自带 BGM”；主页及完整作品集移除片前助手入口与区块。
- Three.js 参考 https://github.com/mrdoob/three.js 的线框示例，实际依赖在 assets/vendor/three，MIT LICENSE 同目录。装饰在离屏和后台时停止绘制；不支持 WebGL 时使用 CSS 线框；尊重减少动态效果设置。
- 短剧封面搜索结果混杂，未采用未核实的图片。剧名加书名号，批次保留。

## 2026-10-25 动效增强
参考 Codrops 官方教程 https://tympanus.net/codrops/2019/10/21/how-to-create-motion-hover-effects-with-image-distortions-using-three-js/ 的鼠标交互方向；未复制其代码。使用原生 Web Animations 实现错落入场、CSS 立体卡片与播放游标，现有 Three.js 线框增加旋转幅度。未引入 GSAP。验证 7 个 AI 选段与 5 个 AE 入口、视频播放、390px 无溢出、无页面脚本错误；减少动态效果模式跳过交互动画。

## 影像视觉调整
撤下 Three.js 装饰线框和 interactions.js 小交互。当前入口采用 cinema.css / cinema.js：真实泰语视频静音预览、浮动影像叠层、深色光影和 AE 展示区。预览可暂停，离屏/后台/弹窗打开时暂停；减少动态效果模式使用静态封面。已验证自动静音播放、暂停、AE视频与移动端无溢出。
