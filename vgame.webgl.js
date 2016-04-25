Vg = function (dom_id, width, height, is_zoom) {
    if (dom_id) this.initDom(dom_id);
    if (width && height) this.initSize(width, height);
    if (is_zoom) this.initZoom(is_zoom);

    if (this.run_dom_id && this.run_width && this.run_height) {
        this.run();
    }
};

Vg.global = {"width": 0, "height": 0, "change_node": {}, "is_update": false, "animation_accuracy": 10, "scene": {}}
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

    this.setOnTouchListents();


    // 创建WebGL渲染器，镜头以及场景
    var m_z = 10000;
    var camera = new THREE.PerspectiveCamera(Math.atan(this.canvas_element.height / 2 / m_z) / Math.PI * 360,
        this.canvas_element.width / this.canvas_element.height, 1, 20000);
    Vg.global['scene'] = new THREE.Scene();
    camera.position.z = m_z;
    Vg.global['camera'] = camera;
    this.renderer = new THREE.WebGLRenderer({"canvas": this.canvas_element});
    this.renderer.setSize(this.canvas_element.width, this.canvas_element.height);
    var _this = this;
    setInterval(function () {
        _this.update();
    }, Vg.global['animation_accuracy'])

    if (this.run_zoom) {
        this.canvas_element.style.width = '100%';
        this.canvas_element.style.height = '100%';
    }
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
    _bg.setPosition(Vg.global['width'] / 2, Vg.global['height'] / 2, 0);
};


Vg.prototype.update = function () {
    this.renderer.render(Vg.global['scene'], Vg.global['camera']);
};


Vg.prototype.clean = function () {
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
    sprite.setRemove(function () {
        Vg.global['scene'].remove(this.node)
    });
    return sprite;
};


Vg.prototype.addLabelTTF = function (text, size, family, color) {
    this.checkIsInit();
    this.max_id++;
    family = (family != '' && typeof family != 'undefined') ? family : "微软雅黑";
    size = (size != '') ? size : 24;
    color = (color != null) ? color : "#ffffff";
    var labelTTF = new LabelTTF(this.max_id, text, size, family, color);
    var _this = this;
    labelTTF.setRemove(function (id) {

    })
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
    if (this.node)this.node.position.set(x - (Vg.global['width'] / 2), y - (Vg.global['height'] / 2), this.node.position.z);
    Vg.global['change_node'][this.id] = true;
    Vg.global['is_update'] = true;
    return this;
};
BaseNode.prototype.setScale = function (f) {
    this.scale_value = f;
    this.width = this.originalWidth * this.scale_value;
    this.height = this.originalHeight * this.scale_value;
    if (this.node)this.node.scale.set(this.width, this.height, 1);
    Vg.global['change_node'][this.id] = true;
    Vg.global['is_update'] = true;
    return this;
};


BaseNode.prototype.move_lock = false;
BaseNode.prototype.animation_accuracy = 10;
BaseNode.prototype.move = function (x, y, sec, call_back) {
    if (!sec)sec = 0.5;
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
    if (!sec)sec = 0.5;
    if (this.scale_lock == true)return;
    this.scale_lock = true;
    //this.width = this.originalWidth;
    //this.height = this.originalHeight;

    var _this = this;
    var i = 0;
    var sv = this.scale_value;
    var k = window.setInterval(function () {
        _this.setScale(sv + ((f - sv) / (sec * (1000)) * i));
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
    if (this.fun_remove)this.fun_remove(this.id);
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
    this.textureLoader = new THREE.TextureLoader();
    var _this = this;
    this.scale_value = 1;
    this.textureLoader.load(file, function (t) {
        var material = new THREE.SpriteMaterial({map: t});
        _this.node = new THREE.Sprite(material);
        _this.originalWidth = _this.width = material.map.image.width;
        _this.originalHeight = _this.height = material.map.image.height;
        _this.setScale(_this.scale_value);
        _this.setPosition(_this.x, _this.y);
        _this.node.position.z = _this.id;
        Vg.global['scene'].add(_this.node);
    });

};
Sprite.prototype = new BaseNode();
Sprite.prototype.constructor = Sprite;
Sprite.prototype.type = "Sprite";
Sprite.prototype.canvas = null;
Sprite.prototype.img = null;

//效率渣
Sprite.prototype.setBackground = function (file) {

    var textureLoader = new THREE.TextureLoader();
    var _this = this;
    textureLoader.load(file, function (t) {
        var material = new THREE.SpriteMaterial({map: t});
        delete _this.node.material;
        _this.node.material = material;
    });
};


var LabelTTF = function (id, text, size, family, color) {
    this.id = id;

    var _this = this;
    var loader = new THREE.FontLoader();
    color = 0xffffff
    loader.load("http://threejs.org/examples/fonts/helvetiker_regular.typeface.js", function (response) {
        console.log(response);
        var textGeo = new THREE.TextGeometry(text, {
            font: response,
            size: size,
            height: size,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: false,
            material: 0,
            extrudeMaterial: 1
        });
        var material = new THREE.MultiMaterial([
            new THREE.MeshPhongMaterial({color: color, shading: THREE.FlatShading}), // front
            new THREE.MeshPhongMaterial({color: color, shading: THREE.SmoothShading}) // side
        ]);
        _this.node = new THREE.Mesh(textGeo, material);
        _this.setPosition(0, 0);
        Vg.global['scene'].add(_this.node);

    });
};

LabelTTF.prototype = new BaseNode();
LabelTTF.prototype.constructor = LabelTTF;
LabelTTF.prototype.type = "LabelTTF";
LabelTTF.prototype.canvas = null;
LabelTTF.prototype.text = "";
LabelTTF.prototype.size = 0;
LabelTTF.prototype.setText = function (text) {
    this.text = text;

};

window.Vg = Vg;



