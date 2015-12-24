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

[Wiki](https://github.com/wailovet/vgame/wiki)

## 目录

- [x] [使用/初始化](https://github.com/wailovet/vgame/wiki/初始化)
- [x] [背景](https://github.com/wailovet/vgame/wiki/背景)
- [x] [全局属性](https://github.com/wailovet/vgame/wiki/全局属性)
- [x] [Sprite](https://github.com/wailovet/vgame/wiki/Sprite)
- [x] [LabelTTF](https://github.com/wailovet/vgame/wiki/LabelTTF)
- [x] [触摸事件](https://github.com/wailovet/vgame/wiki/触摸事件)
- [x] [键盘事件](https://github.com/wailovet/vgame/wiki/键盘事件)
- [x] [鼠标事件](https://github.com/wailovet/vgame/wiki/鼠标事件)
- [x] [定时器](https://github.com/wailovet/vgame/wiki/定时器)
- [x] [数据存取](https://github.com/wailovet/vgame/wiki/数据存取)

