var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var FirstScene = (function (_super) {
    __extends(FirstScene, _super);
    function FirstScene() {
        var _this = _super.call(this) || this;
        _this.onComplete();
        _this.createView();
        return _this;
    }
    FirstScene.prototype.onComplete = function () {
        console.log('完成');
    };
    FirstScene.prototype.createView = function () {
        this.bg = new egret.Shape();
        this.bg.graphics.beginFill(0X000000, .75);
        this.bg.graphics.drawRect(0, 0, 750, 1334);
        this.bg.graphics.endFill();
        this.bg.graphics.beginFill(0Xffffff, 1);
        this.txt = new egret.TextField;
        this.txt.text = '正确快速地匹配卡片来获得分数';
        this.txt.textColor = 0xffffff;
        this.txt.width = 333;
        this.txt.height = 119;
        this.txt.textAlign = egret.HorizontalAlign.RIGHT;
        this.rootScene.addChild(this.bg);
    };
    return FirstScene;
}(Scene));
__reflect(FirstScene.prototype, "FirstScene");
//# sourceMappingURL=FirstScene.js.map