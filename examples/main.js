var sec = 0;
var changeTime = null;
var itime = 0 ;
var isRun = true;
function timer(){
	sec++;
	if(changeTime)changeTime(sec);
	if(sec > 9){
		clearInterval(itime);
		isRun = false;
	}
}
function gameInit(vg){
	//vg.debug(true);
    vg.initDom('gameCanvas').initSize(800,1300).initZoom(true).run();
	vg.background('res/bg.png');
	var sp = vg.addSprite('res/mb0.png');
	sp.setPosition(vg.getWidth() / 2,0)



	var sp2 = vg.addSprite('res/m0.png');
	sp2.setPosition(-vg.getWidth() / 2,-vg.getHeight())





	var _x,_y;
	var c = false;

	var num = 0;

	var sp3 = vg.addSprite('res/numbo.png');
	sp3.setPosition(vg.getWidth() / 2,740)

	var __num =  vg.addLabelTTF('0',55);
	__num.setPosition(vg.getWidth() / 2,740);

	itime = setInterval("timer()",1000);

	var sp4 = vg.addSprite('res/time.png');
	sp4.setPosition(vg.getWidth() / 2,850)

	var __time =  vg.addLabelTTF('10',24,"微软雅黑","#000000");
	__time.setPosition(vg.getWidth() / 2,850);

	changeTime = function(sec){
		__time.setText(10-sec	);
	}

	vg.onTouchEnded(function(){
		if(!isRun){return;}
		if(c){return;}
		c = true;
		sp2.move(vg.getWidth() / 2,vg.getHeight()*2,0.2,function(){
			num +=100;
			__num.setText(num);
			c = false;
		});
	});


	vg.onTouchBegan(function(x,y){
		if(!isRun){return;}
		if(c){return;}
		_x = x;
		_y = y;
		sp2.setPosition(vg.getWidth() / 2,0)
	});
	vg.onTouchMoved(function(x,y){
		if(!isRun){return;}
		if(c){return;}

		sp2.setPosition(vg.getWidth() / 2,(y-_y)*2+0);
	});

}

Vg(function(v){
	gameInit(v);
});
