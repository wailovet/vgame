var bc = 17.2;
var initHeight = 821 + 2 * bc;
var MAXX = 5;
var MAXY = 13;
var game_num = 0;
var game_max_num = 0;

var mStata = new Object;

//                    2
//0为单4 ，1为24 ，2为242
var rotation_stata;

var rT;
var _isOver = false;
function isOver() {
    if (_isOver)return true;
    for (var i = 0; i < MAXX; i++) {
        if (matrix[i][6] != 0 && matrix[i][6].stata != 0) {
            vg.addUpdate("main", 1000, function () {
            });
            vg.clean();
            var gamevoer = vg.addSprite("res/gameover.png");
            gamevoer.setPosition(vg.getWidth() / 2, vg.getHeight() / 2)
            _isOver = true;

            var __num = vg.addLabelTTF('1000', 55);
            __num.setPosition(320, 740);
            __num.setText(game_num);
            gamevoer.click(function () {
                _isOver = false;
                ;

                vg.clean();
                vgInit();
            });
            return true;
        }
    }
    return false;
}

function rotation() {
    if (!isCanControl)return;
    if (rotation_stata == 0) {
        return;
    }
    if (rotation_stata == 1) {
        for (var i = 0; i < MAXX; i++) {
            for (var k = 0; k < (MAXY - 1); k++) {
                var tmp = matrix[i][k];
                if (tmp != 0 && tmp.stata == 0) {
                    if (matrix[i + 1][k] != 0 && matrix[i][k + 1] == 0 &&
                        k + 1 >= 0 && k + 1 < MAXY && i + 1 < MAXX && i + 1 >= 0) {
                        matrix[i + 1][k].oneBigUp(i + 1, k);
                        matrix[i + 1][k + 1].oneLeft(i + 1, k + 1);
                        return;
                    }
                    if (matrix[i][k + 1] != 0 && matrix[i + 1][k] == 0 && matrix[i + 1][k - 1] == 0 &&
                        k + 1 >= 0 && k + 1 < MAXY && i + 1 < MAXX && i + 1 >= 0) {
                        matrix[i][k].oneRight(i, k);
                        matrix[i][k + 1].oneBigDown(i, k + 1);
                        return;
                    }
                    return;
                }
            }
        }
    }

    if (rotation_stata == 2) {
        for (var i = 0; i < MAXX; i++) {
            for (var k = 0; k < (MAXY - 1); k++) {
                var tmp = matrix[i][k];
                if (tmp != 0 && tmp.stata == 0) {
                    if (rT == 0 && i >= 0 && i < MAXX && k - 1 >= 0 && k < MAXY
                        && matrix[i][k - 1] == 0 && matrix[i + 1][k - 1] == 0 && matrix[i + 1][k - 2] == 0) {
                        tmp.oneBigDown(i, k);
                        tmp.oneRight(i, k - 1);
                        rT = 1;
                        return;
                    }
                    if (rT == 1 && i - 1 >= 0 && i < MAXY && k >= 0 && k + 3 < MAXY
                        && matrix[i - 1][k + 2] == 0 && matrix[i - 1][k + 1] == 0 && matrix[i - 1][k] == 0) {

                        matrix[i][k + 2].oneLeft(i, k + 2);
                        matrix[i - 1][k + 2].oneBigDown(i - 1, k + 2);
                        //tmp.oneBigDown(i-1,k+2);
                        rT = 2;
                        return;
                    }
                    if (rT == 2 && i >= 0 && i + 2 < MAXY && k >= 0 && k + 1 < MAXY
                        && matrix[i + 2][k + 1] == 0 && matrix[i + 1][k + 1] == 0) {
                        matrix[i + 2][k].oneBigUp(i + 2, k);
                        matrix[i + 2][k + 1].oneLeft(i + 2, k + 1);
                        rT = 3;
                        return;
                    }
                    if (rT == 3 && i >= 0 && i + 2 < MAXY && k - 1 >= 0 && k < MAXY
                        && matrix[i + 2][k - 1] == 0 && matrix[i + 2][k] == 0 && matrix[i + 2][k - 1] == 0) {
                        matrix[i + 1][k - 1].oneRight(i + 1, k - 1);
                        matrix[i + 2][k - 1].oneBigUp(i + 2, k - 1);
                        rT = 0;
                        return;
                    }
                    return;
                }
            }
        }


    }
}


var isCanControl;
mStata.toSatrt = function (type) {
    isCanControl = true;

    if (isOver()) {
        matrix = initMatrix();
        return;
    }
    if (type == 0) {
        mStata.to0();
        addBox(4, 2);
        rotation_stata = 0;
    }
    if (type == 1) {
        mStata.to0();
        addBox(2, 1, 8);
        addBox(4, 2, 8);
        rotation_stata = 1;
    }
    if (type == 2) {
        mStata.to0();
        addBox(2, 1, 8);
        addBox(4, 2, 8);
        addBox(2, 3, 8);
        //allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();
        addBox(2, 2, 9);
        //allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();allBoxDown();
        rotation_stata = 2;
        rT = 0;
    }
}
//正常下落
mStata.to0 = function () {

    vg.addUpdate("main", 0.5, function () {

        if (!isCanControl) {
            mStata.to1();
        }
        if (mStata_to3_bool && allBoxDown()) {
            mStata.to1();
        }

    });
}

//冻结的box是否还能移动
function isDjMove() {

    for (var k = 0; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (i > 0 && tmp != 0 && tmp.stata == 1) {
                if (matrix[k][i - 1] == 0) {
                    return true;
                }
            }
            if (i - 1 >= 0 && tmp != 0) {
                if (matrix[k][i - 1].num == tmp.num) {
                    return true;
                }
            }
            if (i + 1 < MAXY && tmp != 0) {
                if (matrix[k][i + 1].num == tmp.num) {
                    return true;
                }
            }
            if (k - 1 >= 0 && tmp != 0) {
                if (matrix[k - 1][i].num == tmp.num) {
                    return true;
                }
            }
            if (k + 1 < MAXX && tmp != 0) {
                if (matrix[k + 1][i].num == tmp.num) {
                    return true;
                }
            }
        }
    }
    return false;
}
//加速下落
mStata.to1 = function () {
    isCanControl = false;
    vg.addUpdate("main", .01, function () {
        if (mStata_to3_bool && allBoxDown()) {
            if (!mStata.to2()) {
                mStata.to3();
            } else {
                if (isDjMove()) {
                    mStata.to1();
                    mStata.to3();
                    return;
                } else {
                    mStata.toSatrt(GetRandomNum(0, 3));
                }
            }
        }
        if (mStata_to3_bool && allBoxDown()) {
            if (!mStata.to2()) {
                mStata.to3();
            } else {
                if (isDjMove()) {
                    mStata.to1();
                    mStata.to3();
                    return;
                } else {
                    mStata.toSatrt(GetRandomNum(0, 3));
                }
            }
        }
        //
    });
}
//冻结检测
mStata.to2 = function () {

    var __ret = true;
    for (var k = 0; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (tmp != 0 && tmp.stata == 0) {
                if (i - 1 >= 0 && matrix[k][i - 1] != 0) {
                    if (matrix[k][i - 1].num == tmp.num) {
                        __ret = false;
                        continue;
                    }
                }
//				if(i+1<MAXY&&matrix[k][i+1]!=0){
//					if(matrix[k][i+1].num==tmp.num){
//						 __ret = false;
//						continue;
//					}
//				}
                if (k - 1 >= 0 && matrix[k - 1][i] != 0) {
                    if (matrix[k - 1][i].num == tmp.num) {
                        __ret = false;
                        continue;
                    }
                }
                //alert(k+1+"s"+i);

//				if(k+1<MAXY&&matrix[k+1][i]!=0){
//					if(matrix[k+1][i].num==tmp.num){
//						 __ret = false;
//						continue;
//					}
//				}
                tmp.stata = 1;

            }
            if (tmp != 0 && tmp.stata == 0) {
                __ret = false;
            }
        }
    }
    return __ret;
}
//合并检测
var mStata_to3_bool = true;
mStata.to3 = function (isRecursion) {
    if (!mStata_to3_bool)return;


    mStata_to3_bool = false;
    for (var k = MAXX - 1; k >= 0; k--) {
        for (var i = MAXY - 1; i >= 0; i--) {
            tmp = matrix[k][i];

            if (tmp != 0 && i - 1 >= 0 && tmp.num == matrix[k][i - 1].num) {
                var __tmp = tmp;
                __tmp.y = __tmp.y - 1;
                matrix[k][i] = 0
                __tmp.boxsp.move((__tmp.x + 1) * 68 + (__tmp.x * 20), (__tmp.y + 1) * 5 * bc + 80, 0.1, function () {
                    __tmp.boxsp.remove();
                    matrix[k][i - 1].addAdd();
                    mStata_to3_bool = true;
                });
                mStata.to3();
                return;
            }
        }
    }


    for (var k = 0; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (tmp != 0 && k + 1 < 5 && tmp.num == matrix[k + 1][i].num) {
                var __tmp = tmp;
                mStata_to3_bool = false;
                __tmp.x = __tmp.x + 1;
                matrix[k][i] = 0
                __tmp.boxsp.move((__tmp.x + 1) * 68 + (__tmp.x * 20), (__tmp.y + 1) * 5 * bc + 80, 0.1, function () {
                    __tmp.boxsp.remove();
                    matrix[k + 1][i].addAdd();
                    mStata_to3_bool = true;
                    mStata.to3();
                });
                return;

            }
        }
    }


    mStata_to3_bool = true;

}


var game_num_lable;
function vgInit() {
    //vg.debug(true);
    vg.initDom('gameCanvas').initSize(640, 1136).initZoom(true).run();
    vg.background('res/bg2.png', 'gameCanvas');

    game_num_lable = vg.addLabelTTF('0', 31);
    game_num_lable.setPosition(580, 557);
    game_max_num = vg.getData('max_num') != undefined ? vg.getData('max_num') : 0;
    game_num_max_lable = vg.addLabelTTF('0', 31);
    game_num_max_lable.setPosition(580, 395);
    game_num_max_lable.setText(game_max_num);

    matrix = initMatrix();
    mStata.toSatrt(GetRandomNum(0, 2));


    var isRotation;
    vg.onTouchEnded(function () {
        if (!isRotation)return;
        rotation();
    });


    var ___x, ___y;
    vg.onTouchBegan(function (x, y) {
        ___x = x;
        ___y = y;
        isRotation = true;
        return true;
    });
    vg.onTouchMoved(function (x, y) {
        if (!isCanControl)return;
        if ((x - ___x) > 75) {
            ___x = x;
            isRotation = false;
            allBoxRight();
            return;
        }
        if ((___x - x) > 75) {
            ___x = x;
            isRotation = false;
            allBoxLeft();
            return;
        }
        if (___y - y > 75) {
            isRotation = false;
            mStata.to1();
            return;
        }
    });
    vg.onKeyDown(function (ew) {
        if (ew == 37) {
            allBoxLeft();
            return;
        }
        if (ew == 39) {
            allBoxRight();
            return;
        }
        if (ew == 32) {
            rotation();
            return;
        }
        if (ew == 40) {
            mStata.to1();
            return;
        }
    });

}


function initMatrix() {
    matrix_l = new Array(MAXX);
    for (var k = 0; k < MAXX; k++) {
        matrix_r = new Array(MAXY);
        for (var i = 0; i < MAXY; i++) {
            matrix_r[i] = 0;
        }
        matrix_l[k] = matrix_r;
    }
    return matrix_l;

}
function allBoxLeft() {
    if (!isCanControl)return;

    var k = 0;
    for (var i = 0; i < MAXY; i++) {
        tmp = matrix[k][i];
        if (tmp != 0 && tmp.stata == 0) {
            return;
        }
    }
    for (k = 1; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (tmp != 0 && tmp.stata == 0 && ((matrix[k - 1][i] != 0 && matrix[k - 1][i].stata != 0) || (matrix[k - 1][i - 1] != 0 && matrix[k - 1][i - 1].stata != 0))) {
                return;
            }
        }
    }
    for (var k = 0; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (k - 1 >= 0 && tmp != 0 && matrix[k - 1][i] == 0 && tmp.stata == 0) {
                tmp.oneLeft(k, i);
            }
        }
    }
}
function allBoxRight() {
    if (!isCanControl)return;

    var k = MAXX - 1;
    for (var i = 0; i < MAXY; i++) {
        tmp = matrix[k][i];
        if (tmp != 0 && tmp.stata == 0) {
            return;
        }
    }
    for (k = 0; k < MAXX - 2; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (tmp != 0 && tmp.stata == 0 && ((matrix[k + 1][i] != 0 && matrix[k + 1][i].stata != 0) || (matrix[k + 1][i - 1] != 0 && matrix[k + 1][i - 1].stata != 0))) {
                return;
            }
        }
    }

    for (var k = MAXX - 1; k >= 0; k--) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (k + 1 < 5 && tmp != 0 && matrix[k + 1][i] == 0 && tmp.stata == 0) {
                tmp.oneRight(k, i);
            }
        }
    }
}
function allBoxDown() {
    var tmp;
    for (var k = 0; k < MAXX; k++) {
        for (var i = 0; i < MAXY; i++) {
            tmp = matrix[k][i];
            if (tmp != 0) {
                if (tmp.stata == 1) {
                    //tmp.boxsp.setBackground("res/box_dj_" + tmp.num + ".png");
                } else {
                    if (i == 0 || matrix[k][i - 1] != 0 && matrix[k][i - 1].stata != 0) {

                        tmp.stata = 1;
                        mStata.to1();
                    }
                }
                if (i > 0 && (matrix[k][i - 1] == 0 || matrix[k][i - 1].stata == 0)) {
                    //alert(k+"]"+i);
                    tmp.oneDown();
                }

            }
        }
    }

    for (var k = 0; k < MAXX; k++) {
        for (var i = 1; i < MAXY; i++) {
            if (matrix[k][i] != 0 && matrix[k][i - 1] == 0) {
                return false;
            }
        }
    }
    return true;
}


function addBox(num, x, y) {
    if (!y)y = 8;
    var p2 = {};
    p2.boxsp = vg.addSprite("res/p" + num + ".png");
    p2.num = num;
    p2.x = x;
    p2.y = y;
    p2.stata = 0;//0为自由落体,1为冻结，2为合并
    p2.boxsp.setPosition((p2.x + 1) * 68 + (p2.x * 20), (p2.y + 1) * 5 * bc + 80);
    matrix[p2.x][p2.y] = p2;

    p2._lock = false;
    p2.oneDown = function () {
        p2._lock = true;
        this.y = (this.y - 0.2) + 0.000000000001;
        this.boxsp.setPosition((this.x + 1) * 68 + (this.x * 20), (this.y + 1) * 5 * bc + 95);
        //alert((this.y));
        if (parseInt(this.y) != parseInt(this.y + 0.2)) {
            //alert((parseInt(this.x))+"|"+(((this.y)+1)));
            matrix[parseInt(this.x)][parseInt((this.y))] = this;
            matrix[parseInt(this.x)][parseInt((this.y) + 1)] = 0;
        }
        p2._lock = false;
    }

    p2.oneBigDown = function (x, y) {
        if (p2._lock == true) {
            return;
        }
        if (this.y > 0) {
            this.y = this.y - 1;
            this.boxsp.setPosition((this.x + 1) * 68 + (this.x * 20), (this.y + 1) * 5 * bc + 95);
            matrix[x][y - 1] = this;
            matrix[x][y] = 0;
        }
    }
    p2.oneBigUp = function (x, y) {
        if (p2._lock == true) {
            return;
        }
        if (this.y + 1 < MAXY) {
            this.y = this.y + 1;
            this.boxsp.setPosition((this.x + 1) * 68 + (this.x * 20), (this.y + 1) * 5 * bc + 95);
            matrix[x][y + 1] = this;
            matrix[x][y] = 0;
        }
    }
    p2.oneLeft = function (x, y) {
        if (p2._lock == true) {
            return;
        }
        if (this.x > 0) {
            this.x = this.x - 1;
            this.boxsp.setPosition((this.x + 1) * 68 + (this.x * 20), (this.y + 1) * 5 * bc + 95);
            matrix[x - 1][y] = this;
            matrix[x][y] = 0;
        }
    }
    p2.oneRight = function (x, y) {
        if (p2._lock == true) {
            return;
        }
        if (this.x < MAXX - 1) {
            this.x = this.x + 1;
            this.boxsp.setPosition((this.x + 1) * 68 + (this.x * 20), (this.y + 1) * 5 * bc + 95);
            matrix[x + 1][y] = this;
            matrix[x][y] = 0;
        }
    }
    p2.addAdd = function () {
        this.num = this.num * 2;
        game_num += this.num;
        game_num_lable.setText(game_num);
        if (game_num > game_max_num) {
            game_max_num = game_num;
            vg.setData('max_num', game_max_num);
            game_num_max_lable.setText(game_max_num);
        }
        if (this.stata == 0) {
            this.boxsp.setBackground("res/p" + this.num + ".png");
        } else {
            this.boxsp.setBackground("res/p" + this.num + ".png");
        }
        this.boxsp.setScale(1.2);
        this.boxsp.scale(1, 0.2);
    }


}
var matrix;


var isInteger = function (number) {
    if (number % 1 < 0.001 || number % 1 > 0.9) {          //若number能被1整除
        return true;            //则显示"是整数"
    } else {                         //否则
        return false;          //显示"不是整数"
    }
};


function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}
vg = new Vg()
vgInit();