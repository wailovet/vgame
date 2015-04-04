var vg = new Object;
var bg_content;

window.onload = function(){
	vgInit();
}

vg.getWidth = function(){
	return bg_content.width;
}
vg.getHeight = function(){
	return bg_content.height;
}
vg.bg = function(bgfile,vg_divid){
	bg_content=document.getElementById(vg_divid);
	
	var context = bg_content.getContext('2d');
	
	vg_setOnTouchListents();
	var _bg = vg.addSprite(bgfile);
	_bg.type = "bg";
}

vg.addSprite = function(file){
    var sprite = new _Sprite(file);
	vg_all_sprite.push(sprite);
	return sprite;
}
vg.addLabelTTF = function(text,size,family,color){

    family=(family!='')?family:"微软雅黑";
    size=(size!='')?size:24;
    color=(color!=null)?color:"#ffffff";
    var labelTTF = new _LabelTTF(text,size,family,color);
	vg_all_sprite.push(labelTTF);
	return labelTTF;
}

function _LabelTTF(text,size,family,color){
	var _this = this;
	var _canvas = this.canvas = document.createElement('canvas');
    var _context = this.context = this.canvas.getContext('2d');
    this.type = "LabelTTF";
	this.x = 0;
	this.y = 0;
	this.height = size;

	this.size = size;

    color=(color!='')?color:"#ffffff";



	_canvas.height = bg_content.height;
	_canvas.width = bg_content.width;
	_context.fillStyle=color;
	_context.font = size+"px "+family;


	
	this.setText = function(text){
		_context.clearRect(0,0,_canvas.width,_canvas.height);
		var metrics = _context.measureText(text);
		_this.width = metrics.width;
		_context.fillText(text,0,_this.size/1.2);

		vg_update();
	}
	_bases(this);
	this.setText(text);

}


function _Sprite(file)  {
	var _this = this;
	var _canvas = this.canvas = document.createElement('canvas');
    var _context = this.context = this.canvas.getContext('2d');
	var _img = this.img = new Image();
	this.img.src = file;
	this.type = "sprite";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.originalWidth = 0;
	this.originalHeight = 0;
	_img.onload = function(){
		_this.originalWidth = _this.width = _canvas.width = _img.width;
		_this.originalHeight = _this.height = _canvas.height = _img.height;
		_context.drawImage(_img,0,0);
		vg_update();
	}
	
	this.setBackground = function(file){
		this.img.src = file;
	}
	_bases(this);
};



var now_max_id=0;
function _bases(_this){
	now_max_id ++;
	_this.id = now_max_id;
	_this.getX = function(){ return _this.x;}
	_this.getY = function(){ return _this.y;}
	_this.setPosition = function(_x,_y){
		_this.x = _x;
		_this.y = _y;
		vg_update();
	}
	
	_this.setScale = function(f){
		_this.width = _this.originalWidth * f;
		_this.height = _this.originalHeight * f;
		vg_update();
	}
	
	//动画精度
	var jd=10;
	var move_c=false;
	_this.move = function(_x,_y,sec,funcall){
		if(move_c==true)return;
		move_c = true;
		var fdx = (_x - _this.x)/(sec*(1000));
		var fdy = (_y - _this.y)/(sec*(1000));
		var i=0;
		var k = window.setInterval(function(){
			_this.setPosition(_this.x+fdx*jd,_this.y+fdy*jd);
			vg_update();
			i+=jd;
			if(i>sec*1000){
				clearInterval(k);
				_this.setPosition(_x,_y);
				move_c=false;
				funcall();
			}
		}, jd);
        return this;
	}
	
	var scale_c = false;
	_this.scale = function(f,sec,funcall){
		if(scale_c==true)return;
		scale_c = true;
		var fdw = (_this.originalWidth*(f-1))/(sec*(1000));
		var fdh = (_this.originalHeight*(f-1))/(sec*(1000));
		_this.width = _this.originalWidth;
		_this.height = _this.originalWidth;
		
		var i=0;
		var k = window.setInterval(function(){
			_this.width = _this.width+fdw*jd;
			_this.height = _this.height+fdh*jd;
			vg_update();
			i+=jd;
			if(i>sec*1000){
				clearInterval(k);
				_this.width = _this.originalWidth*f;
				_this.height = _this.originalHeight*f;
				scale_c=false;
				if(funcall!=null){
					funcall();

				}
			}
		}, jd);
        return this;
	}
	
	_this.click = function(funcall){
		_this._click = funcall;
	}
	
	_this.remove = function(){
		for(var i=0;i<vg_all_sprite.length;i++){
			if(_this.id == vg_all_sprite[i].id){
				vg_all_sprite.splice(i,1);
				vg_update();
				return;
			}
		}
	}
	
	_this.setOpacity = function(f){
		_this.context.globalAlpha = f;
		_this.context.clearRect(0,0,_this.width,_this.height);
		_this.context.drawImage(_this.img,0,0);
		vg_update();
	}


//	_this.add = function(file){
//		
//		var s = new cc.Sprite(file);
//		s.setAnchorPoint(0,0);
//		this.ccmain.addChild(s);
//	}

}

vg.log = function(s){
	//cc.log(s);
}
vg.setData = function(key,val){
	localStorage.setItem(key,val);
}
vg.getData = function(key){
	return localStorage.getItem(key);
}
//全局触摸事件
vg.onTouchBegan = function(funcall){
	window.addEventListener('touchstart',touchStart, true);
	function touchStart (event){
 		var touch = event.touches[0];
		funcall(touch.pageX,bg_content.height - touch.pageY);
		event.preventDefault();
	}

} 
vg.onTouchMoved = function(funcall){
	window.addEventListener('touchmove',touchMove, true);
	function touchMove (event){
 		var touch = event.touches[0];
		funcall(touch.pageX,bg_content.height - touch.pageY);
		event.preventDefault();
	}
}
vg.onTouchEnded = function(funcall){
	window.addEventListener('touchend',touchEnd, false);
	function touchEnd (event){
 		var touch = event.changedTouches[0];
		funcall(touch.pageX,bg_content.height - touch.pageY);
		event.preventDefault();

	}
}
//鼠标事件
vg.onMouseDown = function (funcall){
	bg_content.onmousedown = function(event){
		funcall(event.offsetX,bg_content.height - event.offsetY);
	}
}
vg.onMouseMove = function (funcall){
	bg_content.onmousemove = function(event){
		funcall(event.offsetX,bg_content.height - event.offsetY);
	}
}
vg.onMouseUp = function (funcall){
	bg_content.onmouseup = function(event){
		funcall(event.offsetX,bg_content.height - event.offsetY);
	}
}

//键盘事件
vg.onKeyDown = function(funcall){
	vg.doKeyDown = funcall;
}
window.onkeydown= function(){
	if(vg.doKeyDown!=null){
		vg.doKeyDown(event.which);
	}
}

vg.onKeyUp = function(funcall){
	vg.doKeyUp = funcall;
}
window.onkeyup= function(){
	if(vg.doKeyUp!=null){
		vg.doKeyUp(event.which);
	}
}


var _vg_update = 0;
vg.update = function(interval,funcall){
	if(_vg_update!=0){
		vg.stopUpdate();
	}
	_vg_update= window.setInterval(function(){
			funcall();
	}, interval*1000);
}
vg.stopUpdate = function(){
	clearInterval(_vg_update);
}



var vg_all_sprite_count=0;
var vg_all_sprite = Array();
function vg_update(){
	var context = bg_content.getContext('2d');
	var tmp_x,tmp_y;
	context.clearRect(0,0,bg_content.width,bg_content.height);
	for(var i=0;i<vg_all_sprite.length;i++){
		//alert(vg_all_sprite[i]);
		var sp = vg_all_sprite[i];
		if(sp.type=="bg"){
			context.drawImage(sp.canvas,sp.x,sp.y,sp.width,sp.height);
		}else{
			tmp_x = sp.x-(sp.width/2);
			tmp_y = (bg_content.height-sp.y)-(sp.height/2);
			if (sp.type == "sprite") {
				context.drawImage(sp.canvas,tmp_x,tmp_y,sp.width,sp.height);
			}else{
				context.drawImage(sp.canvas,tmp_x,tmp_y);
			}
		}
	}
}

vg.clean = function(){	
	var context = bg_content.getContext('2d');
	context.clearRect(0,0,bg_content.width,bg_content.height);
	vg_all_sprite.splice(0,vg_all_sprite.length);
	vg_update();
}


function vg_setOnTouchListents(){
	var context = bg_content.getContext('2d');
	var tmp_x,tmp_y;
	bg_content.addEventListener('click', function(e){
		for(var i=vg_all_sprite.length-1;i>=0;i--){
			var sp = vg_all_sprite[i];
			tmp_x = sp.x-(sp.width/2);
			tmp_y = (bg_content.height-sp.y)-(sp.height/2);
			if(tmp_x<e.offsetX&&tmp_y<e.offsetY
				&&tmp_x+sp.width>e.offsetX && tmp_y+sp.height>e.offsetY){
				if(sp._click!=null){
					sp._click();
					return;
				}
			}
		}
	}, true);
}
