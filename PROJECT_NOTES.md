# 冯文泽作品集网站项目记录

这份文档用来记录作品集网站从零到上线的过程，防止之后聊天记录丢失时忘记我们做过什么、文件在哪里、后续该怎么改。

## 当前状态

- 网站名称：冯文泽 Wesley Feng | 作品与简历
- 正式网站目录：`C:\Users\xxsfw\Desktop\项目\01_个人作品集网站`
- GitHub 同步目录：`C:\Users\xxsfw\Desktop\项目\.github-sync`
- GitHub 仓库：`https://github.com/xxsfwz/wesley-portfolio`
- 线上网站：`https://xxsfwz.github.io/wesley-portfolio/`
- 当前定位：正式作品集本地版 / GitHub 同步发布版 / 后续持续补充真实作品

## 已完成的事情

1. 搭建了一个静态作品集网站。
2. 确定了整体方向：影像、三维、交互、工具方法、简历摘要。
3. 反复调整视觉风格，从偏科技模板改成更克制的浅色作品集风格。
4. 收敛了过重的 AI 味，把 AI 从视觉主题改成简历和方法里的工具能力。
5. 去掉了空泛英文标题，改成更真实的中文栏目表达。
6. 增加了轻量交互：滚动出现、导航噪点过渡、hover 细节。
7. 增加了后续加分项预留区。
8. 整理了标准文件结构。
9. 上传到 GitHub 仓库。
10. 开启 GitHub Pages，并确认线上网站可以正常访问。

## 当前网站结构

```text
01_个人作品集网站/
  index.html
  README.md
  PROJECT_NOTES.md
  assets/
    css/
      styles.css
    js/
      script.js
    images/
    videos/
    pdf/
  projects/
  04_网站测试版本/
```

说明：

- `index.html`：网站主体内容。
- `assets/css/styles.css`：网站样式。
- `assets/js/script.js`：轻量交互脚本。
- `assets/images/`：正式展示图片、摄影、过程图。
- `assets/videos/`：正式展示视频。
- `assets/pdf/冯文泽_简历.pdf`：网站公开下载的 PDF 简历。
- `projects/`：正式项目详情页。
- `04_网站测试版本/`：测试版和归档测试页，不默认发布。
- `README.md`：项目基础说明。
- `PROJECT_NOTES.md`：这份项目备忘录。

## 当前页面模块

- 首页：作品集主标题、个人摘要、四个方向封面。
- 关于：个人定位和能力方向。
- 作品内容规划：动态影像、三维、交互、工具方法、摄影后期。
- 后续加分项：Showreel、项目详情页、摄影作品区、PDF 简历。
- 项目展示方式：提醒每个项目按结果、过程、职责来讲。
- 工作方式：学习理解、创意方案、生成制作、实现迭代。
- 简历摘要：求职方向、核心优势、工具栈、荣誉证书。
- 联系方式：邮箱、微信、电话。

## 已预留的后续加分项

- Showreel 视频区。
- 项目详情页模板。
- 摄影作品区。
- PDF 简历下载。
- 作品状态标签。
- 正在整理清单。
- 项目过程素材清单。
- 外部链接位置。

## 上传 GitHub 的过程

1. 登录 GitHub。
2. 创建公开仓库：`wesley-portfolio`。
3. 上传 `index.html` 和 `README.md`。
4. 分别上传：
   - `assets/css/styles.css`
   - `assets/js/script.js`
5. 进入仓库 `Settings -> Pages`。
6. Source 选择 `Deploy from a branch`。
7. Branch 选择 `main`。
8. Folder 选择 `/ (root)`。
9. 保存后等待 GitHub Actions 部署完成。
10. 得到线上链接：`https://xxsfwz.github.io/wesley-portfolio/`

## 以后怎么更新网站

推荐流程：

1. 先在 `01_个人作品集网站/` 修改正式站文件。
2. 双击 `01_个人作品集网站/index.html` 本地预览。
3. 确认没问题后，把需要公开发布的文件同步到 `.github-sync/`。
4. 在 `.github-sync/` 中检查 `git status`、提交并推送。
5. GitHub Pages / Cloudflare Pages 会自动重新部署，等一会儿刷新线上链接检查结果。

常见修改位置：

- 改文字内容：修改 `index.html`。
- 改颜色、排版、响应式：修改 `assets/css/styles.css`。
- 改噪点过渡、滚动出现、hover：修改 `assets/js/script.js`。
- 加图片：放进 `assets/images/`，再在 `index.html` 引用。
- 加视频：放进 `assets/videos/`，再在 `index.html` 引用。
- 加 PDF 简历：放进 `assets/pdf/`，再把按钮链接改成 PDF 路径。

## 下一步建议

优先级从高到低：

1. 继续准备 2-3 个能展示能力的真实作品。
2. 为每个作品准备最终效果、过程图、使用工具和个人职责。
3. 继续优化 PDF 简历，更新后放到 `assets/pdf/`。
4. 做一个 30-60 秒 Showreel 视频。
5. 把摄影作品整理成更稳定的小型图片墙。
6. 后续再增加独立项目详情页。

## 作品整理建议

每个作品尽量按这个结构准备：

```text
项目名称
项目类型
项目简介
我的职责
使用工具
最终效果
制作过程
遇到的问题
解决方式
项目总结
```

不要只放成品图。过程图、软件截图、时间线截图、建模过程、调色前后对比，会让作品更可信。

## 当前需要注意

- `index.html` 是当前正式网站版本；`04_网站测试版本/` 是独立测试页和归档测试页，不影响正式网站。
- PDF 简历按钮本地已链接到 `assets/pdf/冯文泽_简历.pdf`。
- 联系方式已更新为当前确认版本：`+86 186 9775 2007`，邮箱为 `1225762114@qq.com / xxsfwz666@gmail.com`，微信为 `xxsfwz`。
- 网站后续还可以继续降低“AI 味”，但每次大改前要先备份到项目总目录的 `91_旧实验与归档/`。
- GitHub 仓库是公开的，上传前不要放隐私信息或不想公开的文件。

## 2026-06-13 接手检查

- 正式网站目录确认：`01_个人作品集网站/`。
- GitHub 同步仓库确认：`.github-sync/`，远程仓库为 `https://github.com/xxsfwz/wesley-portfolio.git`。
- 已检查正式站 3 个主要 HTML 入口的 89 个本地资源引用，没有缺失文件。
- 已确认 `.github-sync` 当前工作区干净；发布前从正式站同步，不把 `04_网站测试版本/` 默认带到线上。
