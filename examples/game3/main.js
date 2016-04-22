var canvas = document.getElementById("gameCanvas");

// 创建WebGL渲染器，镜头以及场景
var camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height);
var scene = new THREE.Scene();

var tan_60 = 1.7320508075689
// 镜头起始位置0，0，0，因此将镜头回拉
camera.position.z = (canvas.width * tan_60) / 2;


var textureLoader = new THREE.TextureLoader();
mapC = textureLoader.load("sprite0.png", function (t) {
    var material = new THREE.SpriteMaterial({map: t});
    var sprite = new THREE.Sprite(material);
    var width = material.map.image.width;
    var height = material.map.image.height;
    sprite.scale.set(width, height, 1);
    sprite.position.set(0, 0, 1);
    scene.add(sprite);
    var renderer = new THREE.WebGLRenderer({"canvas": canvas});

// 开始渲染
    renderer.setSize(canvas.width, canvas.height);
    renderer.render(scene, camera);
});




