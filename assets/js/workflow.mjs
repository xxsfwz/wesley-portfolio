import * as THREE from '../vendor/three/three.module.min.mjs';

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
  const number = root.querySelector('[data-wf-number]');
  const tag = root.querySelector('[data-wf-tag]');
  const title = root.querySelector('[data-wf-title]');
  const body = root.querySelector('[data-wf-body]');
  const human = root.querySelector('[data-wf-human]');
  const tool = root.querySelector('[data-wf-tool]');
  const progress = root.querySelector('.workflow-progress span');
  let current = 0;
  let setSceneStep = () => {};
  function select(index, focus = false) {
    current = (index + steps.length) % steps.length;
    const step = steps[current];
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === current);
      button.setAttribute('aria-pressed', String(i === current));
    });
    number.textContent = step.num;
    tag.textContent = step.tag;
    title.textContent = step.title;
    body.textContent = step.body;
    human.textContent = step.human;
    tool.textContent = step.tool;
    progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    setSceneStep(current);
    if (focus) buttons[current].focus();
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        select(i + (event.key === 'ArrowRight' ? 1 : -1), true);
      }
    });
  });
  root.querySelector('.workflow-next').addEventListener('click', () => select(current + 1));
  select(0);

  const canvas = root.querySelector('canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reduced) {
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
      camera.position.set(0, 0, 9);
      const group = new THREE.Group(); scene.add(group);
      const points = [
        [-2.55,-.75,-.35],[-1.55,.45,.2],[-.5,-.25,.45],
        [.55,.65,-.2],[1.55,-.3,.3],[2.55,.55,-.25]
      ].map(([x,y,z]) => new THREE.Vector3(x,y,z));
      const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(240));
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xaabdb0, transparent: true, opacity: .7 }));
      group.add(line);
      const nodes = points.map((point, i) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(.085, 16, 12), new THREE.MeshBasicMaterial({ color: i === 0 ? 0xddeae3 : 0x6f7a75 }));
        dot.position.copy(point); group.add(dot); return dot;
      });
      const marker = new THREE.Mesh(new THREE.SphereGeometry(.17, 24, 16), new THREE.MeshBasicMaterial({ color: 0xe4ece6 }));
      group.add(marker);
      const halo = new THREE.Mesh(new THREE.RingGeometry(.27, .29, 48), new THREE.MeshBasicMaterial({ color: 0xb7c8bf, side: THREE.DoubleSide, transparent: true, opacity: .7 }));
      group.add(halo);
      const guide = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.25,0,0),new THREE.Vector3(3.25,0,0)]),new THREE.LineBasicMaterial({color:0x56615d,transparent:true,opacity:.23}));
      group.add(guide);
      let target = 0, position = 0, visible = false;
      setSceneStep = i => { target = i; nodes.forEach((n,j) => n.material.color.setHex(j===i ? 0xe4ece6 : 0x6f7a75)); };
      setSceneStep(current);
      function resize() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
      }
      const observer = new ResizeObserver(resize); observer.observe(canvas);
      const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) frame(); }, { threshold: .05 });
      visibility.observe(canvas);
      let running = false;
      function frame() {
        if (running || !visible || document.hidden || !root.closest('details').open) return;
        running = true;
        const tick = () => {
          if (!visible || document.hidden || !root.closest('details').open) { running = false; return; }
          position += (target - position) * .075;
          const a = Math.max(0, Math.min(5, Math.floor(position)));
          const b = Math.min(5, a + 1);
          const frac = position - a;
          marker.position.copy(points[a]).lerp(points[b], Math.max(0, Math.min(1, frac)));
          halo.position.copy(marker.position);
          group.rotation.y += .0009;
          renderer.render(scene, camera);
          requestAnimationFrame(tick);
        };
        tick();
      }
      root.closest('details').addEventListener('toggle', frame);
      document.addEventListener('visibilitychange', frame);
      resize(); frame();
    } catch (error) {
      canvas.hidden = true;
    }
  }
}
