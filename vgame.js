Vg = function (dom_id, width, height, is_zoom) {
    if (dom_id) this.initDom(dom_id);
    if (width && height) this.initSize(width, height);
    if (is_zoom) this.initZoom(is_zoom);

    if (this.run_dom_id && this.run_width && this.run_height) {
        this.run();
    }
};

Vg.global = {"change_node":{},"is_update":false,"animation_accuracy":20}
Vg.prototype.run_zoom = false;
Vg.prototype.run_dom_id = Vg.prototype.run_width = Vg.prototype.run_height = null;
Vg.prototype.canvas_element = null;


Vg.prototype.initDom = function (dom_id) {
    this.run_dom_id = dom_id;
    return this;
};
Vg.prototype.initSize = function (width, height) {
    this.run_width = width;
    this.run_height = height;
    return this;
};
Vg.prototype.initZoom = function (is_zoom) {
    this.run_zoom = is_zoom;
    return this;
};

Vg.prototype.checkIsInit = function () {
    if (!this.run_dom_id || !this.run_width || !this.run_height) {
        throw "Init error : v.initDom('id').initSize(800,600).run();";
    }
};

Vg.prototype.run = function () {
    this.checkIsInit();
    this.canvas_element = document.getElementById(this.run_dom_id);
    if (!this.canvas_element) {
        throw "'#" + this.run_dom_id + "' Not Found";
    }
    Vg.global['width'] = this.canvas_element.width = this.run_width;
    Vg.global['height'] = this.canvas_element.height = this.run_height;

    if (this.run_zoom) {
        this.canvas_element.style.width = '100%';
        this.canvas_element.style.height = '100%';
    }
    this.setOnTouchListents();

    var _this = this;
    setInterval(function(){
        if(Vg.global['is_update']){
            _this.update();
            Vg.global['is_update'] = false;
        }
    },Vg.global['animation_accuracy'])
    return this;
};


Vg.prototype.getWidth = function () {
    return this.canvas_element.width;
}
Vg.prototype.getHeight = function () {
    return this.canvas_element.height;
}


Vg.prototype.node_list = [];
Vg.prototype.setOnTouchListents = function () {
    var tmp_x, tmp_y;
    var _this = this;
    this.canvas_element.addEventListener('click', function (e) {
        for (var i = _this.node_list.length - 1; i >= 0; i--) {
            var sp = _this.node_list[i];
            tmp_x = sp.x - (sp.width / 2);
            tmp_y = (_this.node_list.height - sp.y) - (sp.height / 2);
            if (tmp_x < e.offsetX && tmp_y < e.offsetY
                && tmp_x + sp.width > e.offsetX && tmp_y + sp.height > e.offsetY) {
                if (sp.fun_click != null) {
                    sp.fun_click();
                    return;
                }
            }
        }
    }, true);
};

Vg.prototype.background = function (file) {
    var _bg = this.addSprite(file);
    _bg.type = "bg";
};


Vg.prototype.update = function () {
    var context = this.canvas_element.getContext('2d');
    var tmp_x, tmp_y;
    for (var i = 0; i < this.node_list.length; i++) {
        var sp = this.node_list[i];
        if (sp.type == "bg") {
            context.drawImage(sp.canvas, sp.x, sp.y, sp.width, sp.height);
        } else {
            tmp_x = sp.x - (sp.width / 2);
            tmp_y = (this.canvas_element.height - sp.y) - (sp.height / 2);
            if (sp.type == "Sprite") {
                //if(Vg.global['change_node'][sp.id]){
                    context.drawImage(sp.canvas, tmp_x, tmp_y, sp.width, sp.height);
                //}
            } else {
                context.drawImage(sp.canvas, tmp_x, tmp_y);
            }
        }
    }
    Vg.global['change_node'] = {};

};


Vg.prototype.clean = function () {
    this.checkIsInit();
    var context = this.canvas_element.getContext('2d');
    context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
    this.node_list.splice(0, this.node_list.length);
    this.update();
}


Vg.prototype.allUpdate = {};
Vg.prototype.addUpdate = function (name, interval, call_back) {
    if (this.allUpdate[name]) {
        this.stopUpdate(name);
    }
    this.allUpdate[name] = window.setInterval(function () {
        call_back();
    }, interval * 1000);
    return this.allUpdate[name];
};
Vg.prototype.stopUpdate = function (name) {
    clearInterval(this.allUpdate[name]);
}


Vg.prototype.max_id = 0;
Vg.prototype.addSprite = function (file) {
    this.checkIsInit();
    this.max_id++;
    var sprite = new Sprite(this.max_id, file);
    var _this = this;
    sprite.setRemove(function (id) {
        for (var i = 0; i < _this.node_list.length; i++) {
            if (id == _this.node_list[i].id) {
                _this.node_list.splice(i, 1);
                return;
            }
        }
    })
    this.node_list.push(sprite);
    return sprite;
};


Vg.prototype.addLabelTTF = function (text, size, family, color) {
    this.checkIsInit();
    this.max_id++;
    family = (family != '') ? family : "微软雅黑";
    size = (size != '') ? size : 24;
    color = (color != null) ? color : "#ffffff";
    var labelTTF = new LabelTTF(this.max_id, text, size, family, color);
    var _this = this;
    labelTTF.setRemove(function (id) {
        for (var i = 0; i < _this.node_list.length; i++) {
            if (id == _this.node_list[i].id) {
                _this.node_list.splice(i, 1);
                return;
            }
        }
    })
    this.node_list.push(labelTTF);
    return labelTTF;
};


//触摸事件
Vg.prototype.onTouchBegan = function (call_back) {
    var _this = this;
    window.addEventListener('touchstart', function (event) {
        var touch = event.touches[0];
        call_back(touch.pageX, _this.canvas_element.height - touch.pageY);
    }, true);
};

//触摸划动
Vg.prototype.onTouchMoved = function (call_back) {
    var _this = this;
    window.addEventListener('touchmove', function (event) {
        var touch = event.touches[0];
        call_back(touch.pageX, _this.canvas_element.height - touch.pageY);
        event.preventDefault();
    }, true);
};


//触摸结束
Vg.prototype.onTouchEnded = function (call_back) {
    var _this = this;
    window.addEventListener('touchend', function (event) {
        var touch = event.changedTouches[0];
        call_back(touch.pageX, _this.canvas_element.height - touch.pageY);
    }, true);
};

//鼠标事件
Vg.prototype.onMouseDown = function (call_back) {
    var _this = this;
    this.canvas_element.onmousedown = function (event) {
        call_back(event.offsetX, _this.canvas_element.height - event.offsetY);
    }
};
Vg.prototype.onMouseMove = function (call_back) {
    var _this = this;
    this.canvas_element.onmousemove = function (event) {
        call_back(event.offsetX, _this.canvas_element.height - event.offsetY);
    }
};
Vg.prototype.onMouseUp = function (call_back) {
    var _this = this;
    this.canvas_element.onmouseup = function (event) {
        call_back(event.offsetX, _this.canvas_element.height - event.offsetY);
    }
};

//键盘事件
Vg.prototype.onKeyDown = function (call_back) {
    window.onkeydown = function () {
        call_back(event.which)
    };
};

Vg.prototype.onKeyUp = function (call_back) {
    window.onkeyup = function () {
        call_back(event.which)
    };
};


Vg.prototype.setData = function (key, val) {
    localStorage.setItem(key, val);
}
Vg.prototype.getData = function (key) {
    return localStorage.getItem(key);
}
Vg.prototype.log = function (str) {
    console.log("vgame[" + (new Date()).toLocaleString() + "][" + str + "]");
}


var BaseNode = function () {
};
BaseNode.prototype.id = 0;
BaseNode.prototype.x = BaseNode.prototype.y = 0;
BaseNode.prototype.width = BaseNode.prototype.height = BaseNode.prototype.originalWidth = BaseNode.prototype.originalHeight = 0;
BaseNode.prototype.getX = function () {
    return this.x;
};
BaseNode.prototype.getY = function () {
    return this.y;
};

BaseNode.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
    Vg.global['change_node'][this.id] = true;
    Vg.global['is_update'] = true;
    return this;
};
BaseNode.prototype.setScale = function (f) {
    this.width = this.originalWidth * f;
    this.height = this.originalHeight * f;
    Vg.global['is_update'] = true;
    return this;
};


BaseNode.prototype.move_lock = false;
BaseNode.prototype.animation_accuracy = 10;
BaseNode.prototype.move = function (x, y, sec, call_back) {
    if (this.move_lock == true)return;
    this.move_lock = true;
    var fdx = (x - this.x) / (sec * (1000));
    var fdy = (y - this.y) / (sec * (1000));
    var _this = this;
    var i = 0;
    var k = window.setInterval(function () {
        _this.setPosition(_this.x + fdx * _this.animation_accuracy, _this.y + fdy * _this.animation_accuracy);
        i += _this.animation_accuracy;
        if (i > sec * 1000) {
            clearInterval(k);
            _this.setPosition(x, y);
            _this.move_lock = false;
            if (call_back)call_back();
        }
    }, _this.animation_accuracy);
    return this;
};

BaseNode.prototype.scale_lock = false;
BaseNode.prototype.scale = function (f, sec, call_back) {
    if (this.scale_lock == true)return;
    this.scale_lock = true;
    var fdw = (this.originalWidth * (f - 1)) / (sec * (1000));
    var fdh = (this.originalHeight * (f - 1)) / (sec * (1000));
    this.width = this.originalWidth;
    this.height = this.originalHeight;

    var _this = this;
    var i = 0;
    var k = window.setInterval(function () {
        _this.width = _this.width + fdw * _this.animation_accuracy;
        _this.height = _this.height + fdh * _this.animation_accuracy;
        i += _this.animation_accuracy;
        Vg.global['is_update'] = true;
        if (i > sec * 1000) {
            clearInterval(k);
            _this.setScale(f);
            _this.scale_lock = false;
            if (call_back) call_back();
        }
    }, _this.animation_accuracy);
    return this;
};

BaseNode.prototype.fun_click = null;
BaseNode.prototype.click = function (call_back) {
    this.fun_click = call_back;
};

BaseNode.prototype.remove = function () {
    this.fun_remove(this.id);
    Vg.global['is_update'] = true;
};

BaseNode.prototype.setOpacity = function (f) {
    this.context.globalAlpha = f;
    Vg.global['is_update'] = true;
};


BaseNode.prototype.fun_remove = null;
BaseNode.prototype.setRemove = function (callback) {
    this.fun_remove = callback;
};


var Sprite = function (id, file) {

    this.id = id;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.src = file;
    var _this = this;
    this.img.onload = function () {
        _this.originalWidth = _this.width = _this.canvas.width = _this.img.width;
        _this.originalHeight = _this.height = _this.canvas.height = _this.img.height;
        _this.context.drawImage(_this.img, 0, 0);
    }
};
Sprite.prototype = new BaseNode();
Sprite.prototype.constructor = Sprite;
Sprite.prototype.type = "Sprite";
Sprite.prototype.canvas = null;
Sprite.prototype.img = null;

Sprite.prototype.setBackground = function (file) {
    this.img.src = file;
};


var LabelTTF = function (id, text, size, family, color) {
    this.id = id;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = Vg.global['width'];
    this.canvas.height = Vg.global['height'];
    this.height = size;

    this.context.fillStyle = color;
    this.context.font = size + "px " + family;
    this.size = size;
    this.setText(text);
};

LabelTTF.prototype = new BaseNode();
LabelTTF.prototype.constructor = LabelTTF;
LabelTTF.prototype.type = "LabelTTF";
LabelTTF.prototype.canvas = null;
LabelTTF.prototype.text = "";
LabelTTF.prototype.size = 0;
LabelTTF.prototype.setText = function (text) {
    this.text = text;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var metrics = this.context.measureText(text);
    this.width = metrics.width;
    this.context.fillText(this.text, 0, this.size / 1.2);
    Vg.global['is_update'] = true;
};

window.Vg = Vg;



