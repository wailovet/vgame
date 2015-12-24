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

- [x] [使用/初始化](/wiki/初始化)
- [x] [Sprite](/wiki/Sprite)
- [x] [LabelTTF](/wiki/LabelTTF)
- [x] [触摸事件](/wiki/触摸事件)
- [x] [键盘事件](/wiki/键盘事件)
- [x] [鼠标事件](/wiki/鼠标事件)

