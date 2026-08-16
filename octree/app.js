(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const palette = {
    background:0x111719,
    levels:[0x70d1dc,0xf0bd62,0x70cea0,0xee786a,0xada3ef],
    point:0xedf4f2,
    active:0xf0bd62
  };
  let steps = [];
  let stepIndex = 0;
  let running = false;
  let speed = 1;
  let lastTick = 0;
  let activeStep = -1;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;

  document.title = '八叉树 Octree · Algorithm Lab';
  $('title').textContent = '八叉树 Octree';
  $('monogram').textContent = 'OT';
  $('eyebrow').textContent = 'SPATIAL / OCTREE';
  $('primary-label').textContent = '三维点 x,y,z（分号分隔，范围 0-1）';
  $('secondary-label').textContent = '叶节点容量（1-4）';
  $('input-a').value = '0.12,0.18,0.22;0.21,0.24,0.19;0.78,0.72,0.81;0.68,0.76,0.71;0.52,0.48,0.56;0.57,0.43,0.61;0.31,0.67,0.38;0.84,0.21,0.33;0.42,0.82,0.74;0.73,0.38,0.48';
  $('input-b').value = '2';
  $('option-wrap').hidden = true;
  $('metric-label-1').textContent = '已插入点';
  $('metric-label-2').textContent = '叶节点';
  $('metric-label-3').textContent = '最大深度';
  $('principle').textContent = '三维立方体在容量超限时沿三个坐标轴同时二分为八个子空间，查询只访问可能命中的体素。';
  $('complexity').textContent = 'INSERT / RANGE QUERY · AVERAGE O(LOG N)';
  canvas.setAttribute('aria-label','八叉树三维空间递归剖分动画');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.background);
  const camera = new THREE.PerspectiveCamera(42,1,.1,100);
  camera.position.set(2.2,1.75,2.35);
  camera.lookAt(0,0,0);
  const renderer = new THREE.WebGLRenderer({ canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1,2));
  const world = new THREE.Group();
  world.rotation.set(-.2,.58,0);
  scene.add(world);
  const ambient = new THREE.AmbientLight(0xffffff,1.4);
  scene.add(ambient);

  class Cell {
    constructor(x,y,z,size,depth=0) {
      this.x=x;this.y=y;this.z=z;this.size=size;this.depth=depth;
      this.points=[];this.children=null;
    }
  }

  function parsePoints(value) {
    return String(value).split(/[;；]+/).map((part,index) => {
      const values=part.split(/[\s,，]+/).filter(Boolean).map(Number);
      return values.length===3 && values.every((number) => Number.isFinite(number) && number>=0 && number<=1)
        ? { id:index,x:values[0],y:values[1],z:values[2] }
        : null;
    }).filter(Boolean).slice(0,40);
  }

  function childIndex(cell,point) {
    const half=cell.size/2;
    return (point.x>=cell.x+half?1:0) | (point.y>=cell.y+half?2:0) | (point.z>=cell.z+half?4:0);
  }

  function subdivide(cell) {
    const size=cell.size/2;
    cell.children=Array.from({length:8},(_,index) => new Cell(
      cell.x+(index&1?size:0),
      cell.y+(index&2?size:0),
      cell.z+(index&4?size:0),
      size,
      cell.depth+1
    ));
  }

  function insert(cell,point,capacity) {
    if (!cell.children && (cell.points.length<capacity || cell.depth>=5)) {
      cell.points.push(point);
      return cell;
    }
    if (!cell.children) {
      const existing=cell.points.splice(0);
      subdivide(cell);
      existing.forEach((item) => insert(cell.children[childIndex(cell,item)],item,capacity));
    }
    return insert(cell.children[childIndex(cell,point)],point,capacity);
  }

  function snapshot(root,inserted,activeLeaf,label) {
    const leaves=[];
    let maxDepth=0;
    const visit=(cell) => {
      if (cell.children) cell.children.forEach(visit);
      else {
        maxDepth=Math.max(maxDepth,cell.depth);
        leaves.push({x:cell.x,y:cell.y,z:cell.z,size:cell.size,depth:cell.depth,count:cell.points.length,active:cell===activeLeaf});
      }
    };
    visit(root);
    steps.push({label,inserted:inserted.map((point) => ({...point})),leaves,metrics:[inserted.length,leaves.length,maxDepth],note:activeLeaf?'SUBDIVIDE / DESCEND':'OCTREE COMPLETE'});
  }

  function build() {
    $('error').textContent='';
    const points=parsePoints($('input-a').value);
    const capacity=Math.max(1,Math.min(4,Math.round(Number($('input-b').value)||2)));
    if (points.length<2) {
      $('error').textContent='请输入至少两个范围在 0-1 内的三维点';
      return false;
    }
    const root=new Cell(0,0,0,1,0),inserted=[];
    steps=[];
    snapshot(root,inserted,null,'创建单位立方体根节点');
    points.forEach((point) => {
      const leaf=insert(root,point,capacity);
      inserted.push(point);
      snapshot(root,inserted,leaf,`插入点 P${point.id}，落入深度 ${leaf.depth}`);
    });
    snapshot(root,inserted,null,`八叉树构建完成，共 ${inserted.length} 个点`);
    stepIndex=0;running=false;lastTick=0;activeStep=-1;
    updateUi();
    return true;
  }

  function disposeWorld() {
    while (world.children.length) {
      const object=world.children.pop();
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    }
  }

  function rebuildScene(state) {
    disposeWorld();
    const rootGeometry=new THREE.BoxGeometry(1,1,1);
    const rootEdges=new THREE.EdgesGeometry(rootGeometry);
    rootGeometry.dispose();
    const rootLine=new THREE.LineSegments(rootEdges,new THREE.LineBasicMaterial({color:0x43615b,transparent:true,opacity:.5}));
    world.add(rootLine);
    for (const leaf of state.leaves) {
      const geometry=new THREE.BoxGeometry(leaf.size,leaf.size,leaf.size);
      const edges=new THREE.EdgesGeometry(geometry);
      geometry.dispose();
      const color=leaf.active?palette.active:palette.levels[Math.min(leaf.depth,palette.levels.length-1)];
      const material=new THREE.LineBasicMaterial({color,transparent:true,opacity:leaf.count?.75:.18});
      const cube=new THREE.LineSegments(edges,material);
      cube.position.set(leaf.x+leaf.size/2-.5,leaf.y+leaf.size/2-.5,leaf.z+leaf.size/2-.5);
      world.add(cube);
    }
    state.inserted.forEach((point,index) => {
      const geometry=new THREE.SphereGeometry(index===state.inserted.length-1?.026:.019,12,8);
      const material=new THREE.MeshBasicMaterial({color:index===state.inserted.length-1?palette.active:palette.point});
      const sphere=new THREE.Mesh(geometry,material);
      sphere.position.set(point.x-.5,point.y-.5,point.z-.5);
      world.add(sphere);
    });
  }

  function updateUi() {
    const state=steps[stepIndex];
    if (!state) return;
    $('status').textContent=state.label;
    state.metrics.forEach((value,index) => { $(`metric-${index+1}`).textContent=value; });
    $('note').textContent=`${state.note} · STEP ${stepIndex+1} / ${steps.length}`;
    $('play').textContent=running?'暂停':stepIndex===steps.length-1?'重播':'播放';
    if (activeStep!==stepIndex) { activeStep=stepIndex;rebuildScene(state); }
  }

  function stepOnce() {
    if (stepIndex<steps.length-1) stepIndex++;
    else running=false;
    updateUi();
  }

  function resize() {
    const rect=canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1,2));
    renderer.setSize(rect.width,rect.height,false);
    camera.aspect=rect.width/Math.max(1,rect.height);
    camera.updateProjectionMatrix();
  }

  function frame(time) {
    if (running && (lastTick===0 || time-lastTick>520/speed)) { stepOnce();lastTick=time; }
    if (!dragging && !matchMedia('(prefers-reduced-motion: reduce)').matches) world.rotation.y+=.0012;
    renderer.render(scene,camera);
    requestAnimationFrame(frame);
  }

  canvas.addEventListener('pointerdown',(event) => { dragging=true;pointerX=event.clientX;pointerY=event.clientY;canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove',(event) => { if(!dragging)return;world.rotation.y+=(event.clientX-pointerX)*.008;world.rotation.x+=(event.clientY-pointerY)*.006;pointerX=event.clientX;pointerY=event.clientY; });
  canvas.addEventListener('pointerup',() => { dragging=false; });
  canvas.addEventListener('wheel',(event) => { event.preventDefault();camera.position.multiplyScalar(event.deltaY>0?1.07:.94);camera.position.clampLength(1.4,4);camera.lookAt(0,0,0); },{passive:false});
  $('apply').addEventListener('click',build);
  $('reset').addEventListener('click',() => { $('input-a').value='0.12,0.18,0.22;0.21,0.24,0.19;0.78,0.72,0.81;0.68,0.76,0.71;0.52,0.48,0.56;0.57,0.43,0.61;0.31,0.67,0.38;0.84,0.21,0.33;0.42,0.82,0.74;0.73,0.38,0.48';$('input-b').value='2';build(); });
  $('step').addEventListener('click',() => { running=false;if(stepIndex===steps.length-1)build();stepOnce(); });
  $('play').addEventListener('click',() => { if(stepIndex===steps.length-1)build();running=!running;lastTick=0;updateUi(); });
  $('speed').addEventListener('input',(event) => { speed=Number(event.target.value);$('speed-value').textContent=`${speed.toFixed(1)}x`; });
  addEventListener('resize',resize);
  resize();build();requestAnimationFrame(frame);
})();
