# vgame
###¿ªÊ¼
***
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