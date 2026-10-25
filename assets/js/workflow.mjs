const root = document.querySelector('.workflow-lab');
if (root) {
  const steps = [
    { num:'01', tag:'INPUT', title:'收集与核对', body:'整理分集视频、字幕与交付要求，先核对素材参数和缺失项。', human:'确认项目要求与素材范围', tool:'文件盘点、参数检查' },
    { num:'02', tag:'READ', title:'理解剧情', body:'抽帧、转写并梳理人物关系与关键情节，标记台词和镜头边界。', human:'判断剧情重点与可用镜头', tool:'抽帧、转写、剧情表' },
    { num:'03', tag:'STRUCTURE', title:'设计叙事', body:'确定开头钩子、混剪顺序和解说结构，让画面与文本逐段对应。', human:'决定节奏与叙事取舍', tool:'候选片段整理' },
    { num:'04', tag:'DRAFT', title:'生成可编辑草稿', body:'组织片段、字幕、角标与时间线；保留可回退、可继续修改的草稿。', human:'调整镜头与字幕位置', tool:'批量建稿、素材引用检查' },
    { num:'05', tag:'REVIEW', title:'逐项复核', body:'检查接缝、黑帧、音轨、字幕与画幅，发现异常后局部修复再复验。', human:'看片验收与异常处理', tool:'规则检查、结果对照' },
    { num:'06', tag:'DELIVER', title:'映射交付', body:'按批次命名、分组并核对最终文件，使成片能够追溯到项目和草稿。', human:'确认交付内容', tool:'批量命名、交付清单' }
  ];
  const buttons = [...root.querySelectorAll('.workflow-step')];
  const fields = {
    num: root.querySelector('[data-wf-number]'),
    tag: root.querySelector('[data-wf-tag]'),
    title: root.querySelector('[data-wf-title]'),
    body: root.querySelector('[data-wf-body]'),
    human: root.querySelector('[data-wf-human]'),
    tool: root.querySelector('[data-wf-tool]')
  };
  const progress = root.querySelector('.workflow-progress span');
  const stage = root.querySelector('.workflow-stage');
  let current = 0;
  function select(index, focus = false) {
    current = (index + steps.length) % steps.length;
    const step = steps[current];
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === current);
      button.setAttribute('aria-pressed', String(i === current));
    });
    Object.keys(fields).forEach(key => { fields[key].textContent = step[key]; });
    progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (focus) buttons[current].focus();
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => { select(i); stage.hidden = false; });
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        select(i + (event.key === 'ArrowRight' ? 1 : -1), true); stage.hidden = false;
      }
    });
  });
  root.querySelector('.workflow-next').addEventListener('click', () => select(current + 1));
  select(0);
  stage.hidden = true;
}

const caseDialog = document.querySelector('#workflow-case-dialog');
if (caseDialog) {
  const records = {
    cheer: {
      title: 'Cheer Reborn: Captain of the Rival Team',
      summary: '围绕剧情钩子和解说节奏，制作可继续修改的混剪与解说草稿。',
      points: ['前 20 集剧情分析与重复片段核对', '30 条混剪、10 条解说的制作批次', '复核自然钩子结尾、黑帧与字幕样式'],
      image: 'assets/images/workflow/cheer-reborn.webp',
      source: 'https://verticalvault.app/dramas/cheer-reborn-captain-of-the-rival-team-VV-119291'
    },
    error: {
      title: 'Error 404: Slept With the Wrong Guy',
      summary: '以人物关系和关键剧情为线索，组织混剪片段与解说结构。',
      points: ['前 20 集剧情分析', '30 条混剪、10 条解说的制作批次', '检查台词边界、草稿引用与成片接缝'],
      image: 'assets/images/workflow/error-404.webp',
      source: 'https://vdrama.fans/en/drama/error-404-slept-with-the-wrong-guy-freereels-S6rRH9LWcS'
    },
    her: {
      title: 'Her Name Was Never His',
      summary: '基于已手动调整的草稿继续制作，保留原有风格和可编辑结构。',
      points: ['30 条剧情混剪的制作批次', '尾部、接缝与时间线同步复核', '只修改必要片段，避免覆盖既有人工调整'],
      image: '', source: ''
    }
  };
  const imageWrap = caseDialog.querySelector('.workflow-case-dialog-art');
  const image = caseDialog.querySelector('[data-case-image]');
  const source = caseDialog.querySelector('[data-case-source]');
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    const record = records[button.dataset.case];
    caseDialog.querySelector('[data-case-title]').textContent = record.title;
    caseDialog.querySelector('[data-case-summary]').textContent = record.summary;
    const list = caseDialog.querySelector('[data-case-points]');
    list.replaceChildren(...record.points.map(point => { const item = document.createElement('li'); item.textContent = point; return item; }));
    imageWrap.hidden = !record.image;
    if (record.image) image.src = record.image;
    else image.removeAttribute('src');
    source.hidden = !record.source;
    if (record.source) source.href = record.source;
    else source.removeAttribute('href');
    caseDialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  function closeCase() { caseDialog.close(); document.body.style.overflow = ''; }
  caseDialog.querySelector('.workflow-case-close').addEventListener('click', closeCase);
  caseDialog.addEventListener('click', event => { if (event.target === caseDialog) closeCase(); });
  caseDialog.addEventListener('close', () => { document.body.style.overflow = ''; });
}
