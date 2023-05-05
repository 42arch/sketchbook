import GUI from 'lil-gui'
import demo1 from './demo1'
import demo2 from './demo2'
import demo3 from './demo3'
import demo4 from './demo4'
import demo5 from './demo5'

const gui = new GUI({
  title: 'debug-gui',
  resizable: true,
  closeFolders: true
  // container: document.querySelector('#scene1')
})

// demo1(gui)
// demo2(gui)
// demo3(gui)
// demo4(gui)
demo5(gui)
