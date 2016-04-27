vg = new Vg()
vg.initDom('gameCanvas').initSize(500, 500).initZoom(true).run();
s = vg.addLabelTTF("sprit",24,"","#888888");
console.log(s);
s.setPosition(250, 250);
//s.setScale(1.5);
//s.scale(3,1);
//s.move(240, 320,5);