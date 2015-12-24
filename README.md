#vgame
一个简单的基于canvas的游戏框架


##使用

```html
    <script src="../vgame.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" charset="utf-8">
        var vg = new Vg(function(v){
            v.initDom('gameCanvas').initSize(800,1300).initZoom(true).run();
	        v.background('res/bg.png');
	        ......
        });
    </script>

    <canvas id="gameCanvas" ></canvas>
```


## 文档

[Wiki](https://github.com/overtrue/wechat/wiki)

## 目录

- [x] [使用/初始化](https://github.com/overtrue/wechat/wiki/初始化)
- [x] [Sprite](https://github.com/overtrue/wechat/wiki/Sprite)
- [x] [LabelTTF](https://github.com/overtrue/wechat/wiki/LabelTTF)
- [x] [触摸事件](https://github.com/overtrue/wechat/wiki/触摸事件)
- [x] [键盘事件](https://github.com/overtrue/wechat/wiki/键盘事件)
- [x] [鼠标事件](https://github.com/overtrue/wechat/wiki/鼠标事件)

