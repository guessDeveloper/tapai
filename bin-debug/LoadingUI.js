//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI(callback) {
        var _this = _super.call(this) || this;
        _this.createView();
        _this.callback = callback;
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.title = new eui.Label();
        this.title.width = 750;
        this.title.height = 200;
        this.title.x = 0;
        this.title.y = 260;
        this.title.text = 'Cardigory';
        this.title.size = 95;
        this.title.textAlign = 'center';
        // this.title2 = new eui.Label();
        // this.title2.width = 488;
        // this.title2.x = 150;
        // this.title2.y = 318;
        // this.title2.text = '卡牌归类测试'
        // this.title2.size = 76;
        // this.title2.textAlign = 'center';
        //  let title2 = new eui.Label();
        // title2.width = 488;
        // title2.x = 150;
        // title2.y = 407;
        // title2.text = '（WCST）'
        // title2.size = 82;
        // title2.textAlign = 'center';
        this.addChild(this.title);
        // this.addChild(this.title2);
        // this.addChild(title2);
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 682;
        this.textField.width = 750;
        this.textField.size = 30;
        this.textField.textAlign = "center";
        this.percentBg = new egret.Shape();
        this.percentBg.graphics.beginFill(0xfffffff, .2);
        this.percentBg.graphics.drawRect(0, 0, 480, 6);
        this.percentBg.graphics.endFill();
        this.percentBg.x = 135;
        this.percentBg.y = 732;
        this.percent = new egret.Shape();
        this.percent.graphics.beginFill(0xfffffff, 1);
        this.percent.graphics.drawRect(0, 0, 0, 6);
        this.percent.graphics.endFill();
        this.percent.x = 135;
        this.percent.y = 732;
        this.addChild(this.percentBg);
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        var persent = Math.floor((current / total) * 100);
        var width = persent / 100 * 480;
        this.textField.text = persent + "%";
        this.percent.graphics.clear();
        this.percent.graphics.beginFill(0xfffffff, 1);
        this.percent.graphics.drawRect(0, 0, width, 6);
        this.percent.graphics.endFill();
        this.addChild(this.percent);
        if (persent == 100) {
            this.complate();
        }
    };
    LoadingUI.prototype.complate = function () {
        var __this = this;
        this.removeChild(this.percent);
        this.removeChild(this.percentBg);
        this.removeChild(this.textField);
        var btn = new eui.Group();
        btn.width = 580;
        btn.height = 110;
        btn.touchEnabled = true;
        btn.x = 85;
        btn.y = 1084;
        var btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980, 1);
        btnBg.graphics.drawRect(0, 0, 580, 110);
        btnBg.graphics.endFill();
        btn.addChild(btnBg);
        var btnText = new eui.Label();
        btnText.text = '开始';
        btnText.width = 580;
        btnText.height = 110;
        btnText.textAlign = 'center';
        btnText.verticalAlign = 'middle';
        btnText.size = 40;
        btnText.textColor = 0xffffff;
        btn.addChild(btnText);
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            __this.callback();
        }, this);
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingUI.js.map