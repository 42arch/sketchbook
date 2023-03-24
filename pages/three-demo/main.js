import GUI from 'lil-gui'
import demo1 from './demo1'
import demo2 from './demo2'
const gui = new GUI({
  title: 'debug-gui',
  resizable: true,
  closeFolders: true
  // container: document.querySelector('#scene1')
})

demo1(gui)
demo2(gui)
