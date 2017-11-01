#WEB IDE
##IDE对象
IDE对象是一个window对象，它持有大量的全局属性
###IDE.type(废弃)
标明了当前IDE的类型
###IDE.keyManager src/utils/keyManager
快捷键管理工具
虽然每一个控件都可以自行添加onkeydown和onkeyup监听
但是整合到IDE中之后，各个界面之间的快捷键冲突，全局的快捷键和局部的快捷键冲突，都需要各自维护


```javascript
    import KeyManager from '/utils/keyManager';

    let km = new KeyMananger();
    //添加一个快捷键
    km.bind('Ctrl+shift+1',()=>{});
    IDE.keyManager.watchPage(this.$el,km);
```
