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

class Main extends eui.UILayer {
    // private root: string = 'http://1.119.40.66:45678/';
    private root: string = '/';
    //分数
    private score: egret.TextField;
    //时间圆
    private startTimer;
    private circle: egret.Shape = new egret.Shape();
    private limitTime: number;
    private speed: number = 50;
    private nowTime: number;
    private version: any = 0;
    private complateUrl: string;
    private UA = window.navigator.userAgent;
    private IsAndroid = (/Android|HTC/i.test(this.UA) || (window.navigator['platform'] + '').match(/Linux/i));
    private IsIPad = !this.IsAndroid && /iPad/i.test(this.UA);
    private IsIPhone = !this.IsAndroid && /iPod|iPhone/i.test(this.UA);
    private IsIOS = this.IsIPad || this.IsIPhone;
    private IsWeixin = /MicroMessenger/i.test(this.UA);
    private IsMiniProgram = /miniProgram/i.test(this.UA);
    private IsWeibo = /weibo/i.test(this.UA);
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
            // egret.ticker.resume();
            console.log('切换')
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
            console.log('切换')
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        // this.createGameScene();
        const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        let _this = this;
        try {
            const loadingView = new LoadingUI(function () {
                this.stage.removeChild(loadingView);
                // this.CreatePersonMessage();
                _this.createGameScene();
            });
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            // this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    /*
       创建信息收集页面
    */
    private choseSex;
    private CreatePersonMessage() {
        let _this = this;
        let title = new eui.Label();
        title.text = '请填写以下信息';
        title.textAlign = 'center';
        title.size = 40;
        title.width = 750;
        title.y = 185;
        this.addChild(title);
        let sexTitle = new eui.Label();
        sexTitle.size = 24;
        sexTitle.text = '性别*';
        sexTitle.textColor = 0xffffff;
        sexTitle.width = 200;
        sexTitle.x = 85;
        sexTitle.y = 329;
        this.addChild(sexTitle);
        let sexRadio1 = this.radioPart("男");
        sexRadio1.x = 85;
        sexRadio1.y = 377;
        this.addChild(sexRadio1);

        let sexRadio2 = this.radioPart('女');
        sexRadio2.y = 377;
        sexRadio2.x = 411;

        this.addChild(sexRadio2);
        let cricle1 = new egret.Shape();
        cricle1.graphics.beginFill(0xffffff);
        cricle1.graphics.drawCircle(98, 410, 11);
        cricle1.graphics.endFill();
        this.addChild(cricle1);
        cricle1.blendMode = egret.BlendMode.ERASE;
        let select1 = new egret.Shape();
        select1.graphics.beginFill(0xffffff);
        select1.graphics.drawCircle(98, 410, 5.5);
        select1.graphics.endFill();
        select1.alpha = 0;
        this.addChild(select1);
        let circle2 = new egret.Shape();
        circle2.graphics.beginFill(0xffffff);
        circle2.graphics.drawCircle(424, 410, 11);
        circle2.graphics.endFill();
        this.addChild(circle2);
        circle2.blendMode = egret.BlendMode.ERASE;
        let select2 = new egret.Shape();
        select2.graphics.beginFill(0xffffff);
        select2.graphics.drawCircle(424, 410, 5.5);
        select2.graphics.endFill();
        select2.alpha = 0;
        this.addChild(select2);
        sexRadio1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(sexRadio1).to({ alpha: 1 }, 100)
            cricle1.alpha = 0;
            select1.alpha = 1;
            _this.choseSex = 0;
            sexRadio1.getChildByName('circle').alpha = .4;
            egret.Tween.get(sexRadio2).to({ alpha: .4 }, 100)
            circle2.alpha = 1;
            select2.alpha = 0;
            sexRadio2.getChildByName('circle').alpha = 1;
            sexTip.alpha = 0;
        }, this)
        sexRadio2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(sexRadio1).to({ alpha: .4 }, 100)
            cricle1.alpha = 1;
            select1.alpha = 0;
            _this.choseSex = 1;
            sexRadio1.getChildByName('circle').alpha = 1;
            egret.Tween.get(sexRadio2).to({ alpha: 1 }, 100)
            circle2.alpha = 0;
            select2.alpha = 1;
            sexRadio2.getChildByName('circle').alpha = .4;
            sexTip.alpha = 0;
        }, this)
        let ageTitle = new eui.Label();
        ageTitle.size = 24;
        ageTitle.text = '年龄*';
        ageTitle.textColor = 0xffffff;
        ageTitle.width = 200;
        ageTitle.x = 85;
        ageTitle.y = 514;
        this.addChild(ageTitle);
        let ageInput = this.createInput('请输入您的年龄');
        ageInput.inputType = egret.TextFieldInputType.TEL
        ageInput.x = 85;
        ageInput.y = 561;
        ageInput.alpha = 0.4;
        this.addChild(ageInput);
        let ageLine = new egret.Shape();
        ageLine.graphics.beginFill(0xffffff);
        ageLine.graphics.drawRect(0, 0, 580, 2);
        ageLine.graphics.endFill();
        ageLine.x = 85;
        ageLine.y = 628;
        ageLine.alpha = 0.4;
        this.addChild(ageLine);
        ageInput.addEventListener(egret.Event.FOCUS_IN, function () {
            console.log('输入');
            if (ageInput.text == '请输入您的年龄') {
                ageInput.text = '';
            }
            ageInput.size = 28;
            ageInput.height = 70;
            ageInput.verticalAlign = 'middle';
            egret.Tween.get(ageLine).to({ alpha: 1 }, 300)
        }, this)
        ageInput.addEventListener(egret.Event.FOCUS_OUT, function () {
            if (ageInput.text == '') {
                ageInput.text = '请输入您的年龄'
            }
            ageTip.alpha = 0;
            egret.Tween.get(ageLine).to({ alpha: .4 }, 300)
        }, this)
        let emailTitle = new eui.Label();
        emailTitle.size = 24;
        emailTitle.text = '邮箱*';
        emailTitle.textColor = 0xffffff;
        emailTitle.width = 200;
        emailTitle.x = 85;
        emailTitle.y = 700;
        this.addChild(emailTitle)
        let emailInput = this.createInput('请输入您的邮箱');
        emailInput.x = 85;
        emailInput.y = 747;
        emailInput.alpha = .4;
        this.addChild(emailInput);
        let emailLine = new egret.Shape();
        emailLine.graphics.beginFill(0xffffff);
        emailLine.graphics.drawRect(0, 0, 580, 2);
        emailLine.graphics.endFill();
        emailLine.x = 85;
        emailLine.y = 814;
        emailLine.alpha = 0.4;
        this.addChild(emailLine);
        emailInput.addEventListener(egret.Event.FOCUS_IN, function () {
            console.log('输入');
            if (emailInput.text == '请输入您的邮箱') {
                emailInput.text = '';
            }
            emailInput.size = 28;
            emailInput.height = 70;
            emailInput.verticalAlign = 'middle';
            egret.Tween.get(emailLine).to({ alpha: 1 }, 300)
        }, this)
        emailInput.addEventListener(egret.Event.FOCUS_OUT, function () {
            if (emailInput.text == '') {
                emailInput.text = '请输入您的邮箱'
            }
            emailTip.alpha = 0;
            egret.Tween.get(emailLine).to({ alpha: .4 }, 300)
        }, this)
        let btn = new eui.Group();
        btn.width = 580;
        btn.height = 110;
        btn.x = 85;
        btn.y = 1084;
        let btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980);
        btnBg.graphics.drawRect(0, 0, 580, 110);
        btnBg.graphics.endFill();
        btn.addChild(btnBg);
        let btnTxt = new eui.Label();
        btnTxt.width = 580;
        btnTxt.height = 110;
        btnTxt.text = '提交';
        btnTxt.size = 40;
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = 'center';
        btnTxt.verticalAlign = 'middle';
        btn.addChild(btnTxt);
        this.addChild(btn);
        let sexTip = new eui.Label();
        sexTip.text = '*请选择性别';
        sexTip.size = 20;
        sexTip.textColor = 0xF6FF00;
        sexTip.width = 580;
        sexTip.x = 85;
        sexTip.y = 377 + 68 + 12;
        sexTip.alpha = 0;
        this.addChild(sexTip);
        let ageTip = new eui.Label();
        ageTip.text = '*请输入有效年龄，如：25';
        ageTip.size = 20;
        ageTip.textColor = 0xF6FF00;
        ageTip.width = 580;
        ageTip.x = 85;
        ageTip.y = 642;
        ageTip.alpha = 0;
        this.addChild(ageTip);
        let emailTip = new eui.Label();
        emailTip.text = '*请输入完整、有效的邮箱地址';
        emailTip.size = 20;
        emailTip.textColor = 0xF6FF00;
        emailTip.width = 580;
        emailTip.x = 85;
        emailTip.y = 814 + 12;
        emailTip.alpha = 0;
        this.addChild(emailTip);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.choseSex == undefined) {
                sexTip.alpha = 1;
            } else if (!/[2-5][0-9]|60|19|18/.test(ageInput.text)) {
                sexTip.alpha = 0;
                ageTip.alpha = 1;
            } else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(emailInput.text)) {
                sexTip.alpha = 0;
                ageTip.alpha = 0;
                emailTip.alpha = 1;
            } else {
                sexTip.alpha = 0;
                ageTip.alpha = 0;
                emailTip.alpha = 0;
                let sendData = {
                    playerAge: ageInput.text,
                    playerSex: _this.choseSex,
                    playerEmail: emailInput.text
                }
                let query = this.Http('POST', `${this.root}WcstGame/loginGame.do`, sendData, function (event: egret.Event) {
                    var request = <egret.HttpRequest>event.currentTarget;
                    let res = JSON.parse(request.response);
                    if (res.status == 0) {
                        _this.removeChild(sexTitle);
                        _this.removeChild(sexRadio1);
                        _this.removeChild(sexRadio2);
                        _this.removeChild(emailTip);
                        _this.removeChild(emailTitle);
                        _this.removeChild(emailInput);
                        _this.removeChild(emailLine);
                        _this.removeChild(ageTip);
                        _this.removeChild(ageTitle);
                        _this.removeChild(ageInput);
                        _this.removeChild(ageLine);
                        _this.removeChild(sexTip)
                        _this.removeChild(btn);
                        _this.init()
                    } else {
                        if (res.parameterType == 1) {
                            sexTip.text = res.message;
                            sexTip.alpha = 1;
                        } else if (res.parameterType == 2) {
                            ageTip.text = res.message;
                            ageTip.alpha = 1;
                        } else {
                            emailTip.text = res.message;
                            emailTip.alpha = 1;
                        }
                    }
                }, function (event: egret.Event) {
                    var request = <egret.HttpRequest>event.currentTarget;
                    let res = JSON.parse(request.response);
                    alert(res.message)
                })
            }
            // this.init();
        }, this)


    }
    private sexSelect(evt: eui.UIEvent): void {
        let radioGroup: eui.RadioButtonGroup = evt.target;
        console.log(radioGroup)
    }
    private radioPart(txt: string) {
        let radio = new eui.Group();
        radio.width = 258;
        radio.height = 70;
        radio.alpha = 0.4;
        let cricle = new egret.Shape();
        cricle.graphics.beginFill(0xffffff);
        cricle.graphics.drawArc(13, 33, 13, 0, Math.PI * 2, true);
        cricle.graphics.endFill();
        cricle.name = 'circle';
        radio.addChild(cricle);
        let label = new eui.Label();
        label.text = txt;
        label.textColor = 0xffffff;
        label.size = 28;
        label.width = 230;
        label.height = 68;
        label.x = 40;
        label.verticalAlign = 'middle';
        radio.addChild(label);
        let line = new egret.Shape();
        line.graphics.beginFill(0xffffff);
        line.graphics.drawRect(0, 68, 258, 2);
        line.graphics.endFill();
        radio.addChild(line);
        return radio;
    }
    private createInput(txt) {
        var txInput: egret.TextField = new egret.TextField;
        txInput.type = egret.TextFieldType.INPUT;
        txInput.width = 580;
        txInput.height = 68;
        txInput.textColor = 0xffffff;
        txInput.size = 28;
        txInput.text = txt;
        txInput.touchEnabled = true;
        txInput.verticalAlign = 'middle';
        return txInput;
        /// 注意_container是事先建立好的一个显示容器，即 egret.Sprite，并且已经添加到显示列表中
    }
    /**
    * 创建场景界面
    * Create scene interface
    */
    protected createGameScene(): void {

        // this.init();
        this.CreatePersonMessage();

    }
    private cardSelectBg: egret.Shape;
    private cardBg1;
    private cardBg2;
    private cardBg3;
    private cardBg4;
    private Card1;
    private Card2;
    private Card3;
    private Card4;
    private png34;
    private init() {
        // let sky = this.createBitmapByName("bg_img_png");
        // this.addChild(sky);
        document.body.style.background = '#29748D'
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        /*
         背景色
        */
        let bg = new egret.Shape();
        bg.graphics.beginFill(0x29748D, 1);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        bg.x = 0;
        bg.y = 0;
        this.addChild(bg);
        // 倒计时背景
        let timerBg = new egret.Shape();
        timerBg.graphics.beginFill(0xffffff, .3);
        timerBg.graphics.drawArc(53, 73, 23, 0, 2 * Math.PI, false);
        timerBg.graphics.endFill();
        this.addChild(timerBg);
        let startTimer = this.timer(30000, this.circle);
        // clearInterval(startTimer);
        // 分数
        this.score = new egret.TextField();
        this.score.y = 54;
        this.score.text = '0';
        this.score.size = 40;
        this.score.width = 720;
        this.score.textAlign = 'right';
        this.score.fontFamily = 'MyText';
        this.score.alpha = 0;
        this.addChild(this.score);
        // this.score.text = '0';
        // 分数
        this.png34 = this.createBitmapByName('34_png');
        this.png34.width = 55;
        this.png34.height = 24;
        this.png34.x = 666;
        this.png34.y =62;
        this.addChild(this.png34);
        let middleLine = this.createBitmapByName('line_bg_png');
        middleLine.width = 689;
        middleLine.height = 30;
        middleLine.x = 30;
        middleLine.y = 705;
        this.addChild(middleLine);
        // sky.width = stageW;
        // sky.height = stageH;
        let modle = this.cardPosition['one']
        this.cardSelectBg = new egret.Shape();
        this.cardSelectBg.graphics.beginFill(0xffffff);
        this.cardSelectBg.graphics.drawRect(0, 0, modle.width + 8, modle.height + 8);
        this.cardSelectBg.graphics.endFill();
        this.cardSelectBg.alpha = 0;
        this.addChild(this.cardSelectBg)
        // 帮助按钮初始化
        this.CreateHelpBtn();
        //创建背景卡牌
        this.cardBg1 = this.createCardBg('one');
        this.cardBg2 = this.createCardBg('two');
        this.cardBg3 = this.createCardBg('three');
        this.cardBg4 = this.createCardBg('four');
        this.Card1 = this.createCard('AAA', 'one');
        this.Card2 = this.createCard('BBB', 'two');
        this.Card3 = this.createCard('CCC', 'three');
        this.Card4 = this.createCard('DDD', 'four');
        this.dragObjectInit('AAA');
        // //开始引导
        this.steps();
        // this.GameInit();
        // this.GameComplate();
        // window.onbeforeunload = function(){
        //     alert('guanbi')
        // }
    }
    /**
    * 倒计时
    */
    private timer(e: number, target: egret.Shape) {

        let _this = this;
        target.graphics.beginFill(0xffffff, 1);
        target.graphics.drawArc(0, 0, 23, 0, 2 * Math.PI, true);
        target.graphics.endFill();
        target.width = 46;
        target.height = 46;
        target.anchorOffsetX = -23;
        target.anchorOffsetY = -23;
        target.x = 30;
        target.y = 96;
        egret.Tween.get(target).to({ rotation: -90 });
        this.addChild(target);
        let timer = new egret.Timer(this.speed, e / this.speed);
        this.limitTime = e;
        this.nowTime = e;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            _this.drawTime(target)
        }, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, _this.endTime, this);
        return timer

    }
    // private timer(e: number, target: egret.Shape) {
    //     let _this = this;
    //     target.graphics.beginFill(0xffffff, 1);
    //     target.graphics.drawArc(0, 0, 23, 0, 2 * Math.PI, true);
    //     target.graphics.endFill();
    //     target.width = 46;
    //     target.height = 46;
    //     target.anchorOffsetX = -23;
    //     target.anchorOffsetY = -23;
    //     target.x = 30;
    //     target.y = 96;
    //     egret.Tween.get(target).to({ rotation: -90 });
    //     this.addChild(target);
    //     // let timer = new egret.Timer(this.speed, e / this.speed);
    //     let timer = setInterval(function(){
    //         _this.drawTime(target);
    //         if(_this.nowTime == 0){
    //             clearInterval(timer)
    //             _this.endTime();
    //         }
    //     },_this.speed)
    //     this.limitTime = e;
    //     this.nowTime = e;
    //     // timer.addEventListener(egret.TimerEvent.TIMER, function () {
    //     //     _this.drawTime(target);

    //     // }, this);
    //     // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
    //     //     _this.endTime();
    //     // }, this);
    //     return timer
    // }
    private drawTime(target) {
        console.log('定时器在运作')
        this.nowTime -= this.speed;
        let deg = 2 * Math.PI - (this.nowTime / this.limitTime * 2 * Math.PI);
        target.graphics.clear();
        target.graphics.beginFill(0xffffff, 1);
        target.graphics.moveTo(0, 0);
        target.graphics.lineTo(23, 0);
        target.graphics.drawArc(0, 0, 23, 0, deg, this.nowTime > 0);
        target.graphics.lineTo(0, 0);
        target.graphics.endFill();
        this.addChild(target);
        if (this.isHelpbtnOpen) {
            this.setChildIndex(target, 8)
        }

    }
    private endTime() {
        let _this = this
        let data = {
            singleCardValue: '',
            unqiueCardValue: _this.anwserCardType,
            remainingTime: Math.floor(_this.nowTime / 1000),
            currentScore: _this.score.text,
            isExistGame: 0
        }
        _this.sendAnser(data);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let _this = this;
        // this.startTimer.stop();
        this.dragRemoveevent();
        this.isHelpbtnOpen = true;
        this.helpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        let bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0X000000, .75);
        bg.graphics.drawRect(0, 0, 750, 1334);
        bg.graphics.endFill();
        bg.graphics.beginFill(0Xffffff, 1);
        this.shadowBg = bg;

        this.addChild(bg);
        this.BigBgShow();
        this.setChildIndex(this.shadowBg, 1000)
        var myGroup = new eui.Group();
        myGroup.x = 100;
        myGroup.y = 393;
        myGroup.width = 575;
        myGroup.height = 450;
        this.addChild(myGroup);
        var title: eui.Label = new eui.Label();
        title.text = '帮助';
        title.width = 549;
        title.size = 36;
        title.textColor = 0Xffffff;
        title.x = 100;
        title.y = 312;
        title.textAlign = "center";
        this.addChild(title);
        var label: eui.Label = new eui.Label();
        //   label.text = "描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容内容描述内容描述内容内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容内容描述内容描述内容内容描述内容";
        label.width = 575;
        label.height = 900;
        label.y = 10;
        label.textColor = 0x999999;
        label.size = 26;
        label.lineSpacing = 12;
        this.addChild(label);
        myGroup.addChild(label);
        //   let helpText = new egret.TextField();
        //   helpText.width = 550;
        //   helpText.height = 800;
        //   helpText.y = 8;
        //   helpText.lineSpacing = 7;
        label.textFlow = (new egret.HtmlTextParser).parser(
            '<font color="#999999" size="28" ><b>请注意，在您阅读时，游戏倒计时并未暂停。</b></font>\n\n' +
            '<font color="#999999" size="28" >游戏过程中不可暂停。如果退出，您的回答将不会被记录，并且将会从首页重新开始。</font>\n\n' +
            '<font color="#999999" size="28" style="letter-spacing:10;">为了您的体验，请尽量在安静、不被打扰的环境下一次性地完成本游戏。\n\n如果您因为某些原因无法继续游戏，请关闭浏览器页面并重新开始。\n\n我们会在保证游戏有效性的前提下收集尽量少的信息。\n\n我们将采取合理的安全手段保护游戏使用及分发过程中收集的所有信息。\n\n在没有您的许可的情况下，我们不会向任何无关的第三方提供任何有可能识别出您的身份的信息。</font>\n\n' + '<font color="#999999" size="27">如果对游戏有任何的建议或者疑问 ，     请联系\nh9000cn@outlook.com</font>'
        );
        myGroup.addChild(label);
        var myScroller = new eui.Scroller();
        myScroller.x = 100;
        myScroller.y = 393;
        myScroller.width = 575;
        myScroller.height = 450;
        //设置viewport
        myScroller.viewport = myGroup;
        this.addChild(myScroller);
        myScroller.verticalScrollBar.visible = true;
        let closeBtn = this.createBitmapByName('close_png');
        closeBtn.width = 52;
        closeBtn.height = 52;
        closeBtn.x = 349;
        closeBtn.y = 1062;
        closeBtn.touchEnabled = true;
        this.addChild(closeBtn)
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            myGroup.removeChild(label);
            _this.removeChild(myScroller);
            _this.removeChild(closeBtn)

            _this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
            _this.removeChild(_this.shadowBg);
            _this.BigBgHide();
            _this.isHelpbtnOpen = false;
            _this.removeChild(title);
            _this.touchHandles();
            _this.setChildIndex(_this.dragCardLinght, _this.numChildren);
            _this.setChildIndex(_this.dragCardBg, _this.numChildren)
            _this.setChildIndex(_this.dragGroup, _this.numChildren);

        }, this)
    }


    private dragCardLinght;
    private dragGroup; //拖拽对象
    private dragCardBg;
    //初始化答题卡牌
    private dragObjectInit(type: string) {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.dragCardLinght = new egret.Shape();
        this.dragCardLinght.graphics.beginFill(0xb5c92a, 1);
        this.dragCardLinght.graphics.drawRoundRect(0, 0, 167, 286, 10, 10);
        this.dragCardLinght.graphics.endFill();
        this.dragCardLinght.x = this.cardPosition['answer'].x - 7;
        this.dragCardLinght.y = this.cardPosition['answer'].y - 7;
        this.dragCardLinght.alpha = 0;
        var blurFliter = new egret.BlurFilter(3, 3);
        this.dragCardLinght.filters = [blurFliter];
        // this.dragCardBg = this.createCardBg('answer');
        this.dragCardBg = new eui.ViewStack();
        this.dragCardBg.width = this.cardPosition['answer'].width;
        this.dragCardBg.width = this.cardPosition['answer'].height;
        this.dragCardBg.x = this.cardPosition['answer'].x;
        this.dragCardBg.y = this.cardPosition['answer'].y;
        let bg = this.createCardBg('answer');
        bg.x = 0;
        bg.y = 0;
        let back = new egret.Shape();
        back.graphics.beginFill(0x000, 1);
        back.graphics.drawRect(0, 0, this.cardPosition['answer'].width, this.cardPosition['answer'].height);
        back.graphics.endFill();
        this.dragCardBg.addChild(bg);
        this.dragCardBg.addChild(back);
        this.dragCardBg.selectedIndex = 0;
        this.dragGroup = this.createCard(type, 'answer');
        this.dragGroup.touchEnabled = true;
        // this.touchHandles();
        this.addChild(this.dragCardLinght);
        this.addChild(this.dragCardBg)
        this.addChild(this.dragGroup);
        if (this.isHelpbtnOpen) {
            this.setChildIndex(this.dragCardLinght, 10);
            this.setChildIndex(this.dragCardBg, 11);
            this.setChildIndex(this.dragGroup, 12)
        }
    }
    private startX;
    private startY;
    private XTouch: number;
    private YTouch: number;
    private isTouch: boolean = false;
    private CardList;
    private anwserCardType;
    private touchHandles() {
        this.dragGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OntouchBegin, this)

        this.dragGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.Ontouchend, this)
    }
    private OntouchBegin(e: egret.TouchEvent): void {
        this.isTouch = true;
        this.startX = this.dragGroup.x;
        this.startY = this.dragGroup.y;
        this.XTouch = e.stageX;
        this.YTouch = e.stageY;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.OntouchMove, this)
    }
    private OntouchMove(e: egret.TouchEvent): void {
        if (this.isTouch == true) {
            this.dragCardLinght.x = this.startX + (e.stageX - this.XTouch) - 7;
            this.dragCardLinght.y = this.startY + (e.stageY - this.YTouch) - 7;
            this.dragCardBg.x = this.startX + (e.stageX - this.XTouch);
            this.dragCardBg.y = this.startY + (e.stageY - this.YTouch);
            this.dragGroup.x = this.startX + (e.stageX - this.XTouch);
            this.dragGroup.y = this.startY + (e.stageY - this.YTouch);
            let isSelect = false
            for (let i in this.cardPosition) {
                if (this.hitTest(this.cardPosition[i]) && i != 'answer') {
                    isSelect = true
                    this.cardSelectBg.x = this.cardPosition[i].x - 4;
                    this.cardSelectBg.y = this.cardPosition[i].y - 4;
                    this.cardSelectBg.alpha = 1;
                    break;
                }
            }
            if (!isSelect) {
                this.cardSelectBg.alpha = 0;
            }
        }

    }
    private Ontouchend(e: egret.TouchEvent): void {
        this.isTouch = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.OntouchMove, this);
        let select = false;
        let _this = this;
        this.cardSelectBg.alpha = 0;
        for (let i in this.cardPosition) {
            if (this.hitTest(this.cardPosition[i]) && i != 'answer') {
                select = true;
                this.dragRemoveevent();
                this.startTimer.stop();
                // clearInterval(this.startTimer);
                let data = {
                    singleCardValue: this.CardList[this.backIndex(i)],
                    unqiueCardValue: this.anwserCardType,
                    remainingTime: Math.floor(this.nowTime / 1000),
                    currentScore: this.score.text,
                    isExistGame: 0
                }

                // this.successCard();
                egret.Tween.get(this.dragGroup).to({ x: this.cardPosition[i].x, y: this.cardPosition[i].y }, 500, egret.Ease.quadIn).call(function () {
                    _this.sendAnser(data);
                })
                egret.Tween.get(this.dragCardBg).to({ x: this.cardPosition[i].x, y: this.cardPosition[i].y }, 500, egret.Ease.quadIn);
                egret.Tween.get(this.dragCardLinght).to({ x: this.cardPosition[i].x - 7, y: this.cardPosition[i].y - 7 }, 500, egret.Ease.quadIn)
                break
            }
        }
        if (!select) {
            egret.Tween.get(this.dragGroup).to({ x: this.cardPosition['answer'].x, y: this.cardPosition['answer'].y }, 100, egret.Ease.backOut);
            egret.Tween.get(this.dragCardBg).to({ x: this.cardPosition['answer'].x, y: this.cardPosition['answer'].y }, 100, egret.Ease.backOut);
            egret.Tween.get(this.dragCardLinght).to({ x: this.cardPosition['answer'].x, y: this.cardPosition['answer'].y }, 100, egret.Ease.backOut);
        }

    }

    private backIndex(index: string) {
        let reIndex;
        switch (index) {
            case 'one':
                reIndex = 0
                break;
            case 'two':
                reIndex = 1;
                break;
            case 'three':
                reIndex = 2;
                break;
            case 'four':
                reIndex = 3;
                break
        }
        return reIndex
    }
    /*
     移出绑定事件

    */
    private dragRemoveevent() {
        this.dragGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OntouchBegin, this)

        this.dragGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.Ontouchend, this)
    }

    /*
      引导拖动事件
    */
    private stepdragCardLinght;
    private stepdragGroup; //拖拽对象
    private stepdragCardBg;
    private stetFourArrow;
    private stepFourText;
    private stepFourCard;
    private stepFourCardBg;
    private stepFourBorder;
    private guitScore;
    private guiBG;
    //初始化引导答题卡牌
    private stepdragObjectInit() {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.stepdragCardLinght = new egret.Shape();
        this.stepdragCardLinght.graphics.beginFill(0xb5c92a, 1);
        this.stepdragCardLinght.graphics.drawRoundRect(0, 0, 167, 286, 10, 10);
        this.stepdragCardLinght.graphics.endFill();
        this.stepdragCardLinght.x = this.cardPosition['answer'].x - 7;
        this.stepdragCardLinght.y = this.cardPosition['answer'].y - 7;
        this.stepdragCardLinght.alpha = 0;
        var blurFliter = new egret.BlurFilter(3, 3);
        this.stepdragCardLinght.filters = [blurFliter];
        this.stepdragCardBg = this.createCardBg('answer');
        this.stepdragGroup = this.createCard('AAA', 'answer');
        this.stepdragGroup.touchEnabled = true;
        this.stepdragGroup.alpha = 0;
        this.stepFourCardBg.alpha = 0;
        // this.touchHandles();
        this.addChild(this.stepdragCardLinght);
        this.addChild(this.stepdragCardBg)
        this.addChild(this.stepdragGroup);
        egret.Tween.get(this.stepdragCardBg).to({ alpha: 1 }, 500, egret.Ease.backOut);
        egret.Tween.get(this.stepdragGroup).to({ alpha: 1 }, 500, egret.Ease.backOut);
    }
    private guitTouchHandles() {
        this.stepdragGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.guitTouchstart, this)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.guitTouchend, this)
    }
    private guitTouchstart(e: egret.TouchEvent) {
        this.isTouch = true;
        this.startX = this.stepdragGroup.x;
        this.startY = this.stepdragGroup.y;
        this.XTouch = e.stageX;
        this.YTouch = e.stageY;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.guitTouchmove, this);
        egret.Tween.get(this.stetFourArrow).to({ alpha: 0 }, 300, egret.Ease.backOut);
    }
    private guitTouchmove(e: egret.TouchEvent) {
        if (this.isTouch == true) {
            this.stepdragCardLinght.x = this.startX + (e.stageX - this.XTouch) - 7;
            this.stepdragCardLinght.y = this.startY + (e.stageY - this.YTouch) - 7;
            this.stepdragCardBg.x = this.startX + (e.stageX - this.XTouch);
            this.stepdragCardBg.y = this.startY + (e.stageY - this.YTouch);
            this.stepdragGroup.x = this.startX + (e.stageX - this.XTouch);
            this.stepdragGroup.y = this.startY + (e.stageY - this.YTouch);
            let isSelect = false

            if (this.stephitTest(this.cardPosition['one'])) {
                isSelect = true
                this.stepFourBorder.x = this.cardPosition['one'].x - 4;
                this.stepFourBorder.y = this.cardPosition['one'].y - 4;
                // this.setChildIndex(this.cardSelectBg,300);
                this.stepFourBorder.alpha = 1;
            }

            if (!isSelect) {
                this.stepFourBorder.alpha = 0;
            }
        }
    }

    private guitTouchend(e: egret.TouchEvent) {
        this.isTouch = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.guitTouchmove, this);

        let select = false;
        let _this = this
        if (this.stephitTest(this.cardPosition['one'])) {
            this.stepdragGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.guitTouchstart, this)
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.guitTouchend, this);
            select = true;

            egret.Tween.get(_this.stepdragGroup).to({ x: _this.cardPosition['one'].x, y: _this.cardPosition['one'].y }, 500, egret.Ease.quadIn)
            egret.Tween.get(_this.stepdragCardBg).to({ x: _this.cardPosition['one'].x, y: _this.cardPosition['one'].y }, 500, egret.Ease.quadIn)
            egret.Tween.get(_this.stepdragCardLinght).to({ x: _this.cardPosition['one'].x - 7, y: _this.cardPosition['one'].y - 7 }, 500, egret.Ease.quadIn).call(function () {

                egret.Tween.get(_this.stepdragCardLinght).to({ alpha: 1 }, 500, egret.Ease.backOut).wait(300).call(function () {
                    _this.guitScore.text = 44;
                    _this.removeChild(_this.png34);
                    _this.score.alpha = 1;
                    _this.score.text = '44';
                    _this.scroeAdd(10);
                    egret.Tween.get(_this.stepdragCardBg).to({ y: -300 }, 500, egret.Ease.backOut).call(function () {

                    })
                    egret.Tween.get(_this.stepdragCardLinght).to({ y: -300 }, 500, egret.Ease.backOut).call(function () {
                        //  _this.removeChild(_this.stepdragCardLinght);
                    })
                    egret.Tween.get(_this.stepdragGroup).to({ y: -300 }, 500, egret.Ease.backOut).call(function () {
                        _this.removeChild(_this.stepdragGroup);
                        _this.removeChild(_this.stepdragCardLinght);
                        _this.removeChild(_this.stepdragCardBg);
                        egret.Tween.get(_this.stepFourText).to({ alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                            //   _this.removeChild(_this.stepFourText);
                        })

                        egret.Tween.get(_this.stetFourArrow).to({ alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                            //   _this.removeChild(_this.stetFourArrow);
                        })
                        egret.Tween.get(_this.stepFourBorder).to({ alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                            //   _this.removeChild(_this.stepFourBorder);
                        })
                        egret.Tween.get(_this.stepFourCardBg).to({ alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                            //   _this.removeChild(_this.stepFourCardBg);
                        })
                        egret.Tween.get(_this.stepFourCard).to({ alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                            //   _this.removeChild(_this.stepFourCard);
                            _this.removeChild(_this.guiBG);
                            _this.removeChild(_this.guitScore);
                            _this.stepFive();
                        })
                    })

                    egret.Tween.get(_this.stepdragCardBg).to({ y: -300 }, 500, egret.Ease.backOut).call(function () {
                        //   _this.removeChild(_this.stepdragCardBg);
                    })

                })

            })

        }
        if (!select) {
            egret.Tween.get(this.stetFourArrow).to({ alpha: 1 }, 300, egret.Ease.backOut);
            egret.Tween.get(this.stepdragGroup).to({ x: this.cardPosition['answer'].x, y: this.cardPosition['answer'].y }, 100, egret.Ease.backOut);
            egret.Tween.get(this.stepdragCardBg).to({ x: this.cardPosition['answer'].x, y: this.cardPosition['answer'].y }, 100, egret.Ease.backOut);
            egret.Tween.get(this.stepdragCardLinght).to({ x: this.cardPosition['answer'].x - 7, y: this.cardPosition['answer'].y - 7 }, 100, egret.Ease.backOut);
        }
    }
    /*
     碰撞检测
    */
    private hitTest(obj1): boolean {
        let disX, disY;
        if (this.dragGroup.x >= obj1.x) {
            disX = obj1.x + obj1.width - this.dragGroup.x
        } else {
            disX = this.dragGroup.x + this.dragGroup.width - obj1.x
        }
        if (this.dragGroup.y >= obj1.y) {
            disY = obj1.y + obj1.height - this.dragGroup.y
        } else {
            disY = this.dragGroup.y + this.dragGroup.height - obj1.y
        }
        let scale = disX * disY
        return disX > 0 && scale > 0 && scale > this.dragGroup.width * this.dragGroup.height * .5
    }
    private stephitTest(obj1): boolean {
        let disX, disY;
        if (this.stepdragGroup.x >= obj1.x) {
            disX = obj1.x + obj1.width - this.stepdragGroup.x
        } else {
            disX = this.stepdragGroup.x + this.stepdragGroup.width - obj1.x
        }
        if (this.stepdragGroup.y >= obj1.y) {
            disY = obj1.y + obj1.height - this.stepdragGroup.y
        } else {
            disY = this.stepdragGroup.y + this.stepdragGroup.height - obj1.y
        }
        let scale = disX * disY
        return disX > 0 && scale > 0 && scale > this.stepdragGroup.width * this.stepdragGroup.height * .5
    }
    /*
     成功效果
    */
    private successCard() {
        let _this = this;
        egret.Tween.get(this.dragCardLinght).to({ alpha: 1 }, 500, egret.Ease.quadIn).wait(300).call(function () {
            egret.Tween.get(_this.dragGroup).to({ y: -300 }, 500, egret.Ease.backOut);
            egret.Tween.get(_this.dragCardBg).to({ y: -300 }, 500, egret.Ease.backOut);
            egret.Tween.get(_this.dragCardLinght).to({ y: -300 }, 500, egret.Ease.backOut).call(function () {
                _this.dragObjectInit(_this.anwserCardType);
                _this.touchHandles();
                _this.startTimer = _this.timer(_this.limitTime, _this.circle);
                _this.startTimer.start();
            });
        })
    }
    private errorCard() {
        console.log(this.dragCardBg)
        var timer: egret.Timer = new egret.Timer(500, 2);
        timer.addEventListener(egret.TimerEvent.TIMER, this.changeIndexByTimer, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.changeIndexByTimerEnd, this);
        timer.start();
    }
    private changeIndexByTimer() {
        this.dragCardBg.selectedIndex = this.dragCardBg.selectedIndex == 0 ? 1 : 0;
    }
    private changeIndexByTimerEnd() {
        let _this = this;
        egret.Tween.get(this.dragGroup).to({ y: 1500 }, 1000, egret.Ease.backInOut);
        egret.Tween.get(this.dragCardBg).to({ y: 1500 }, 1000, egret.Ease.backInOut);
        egret.Tween.get(this.dragCardLinght).to({ y: 1500 }, 1000, egret.Ease.bounceInOut).call(function () {
            _this.removeDargCard();
            _this.dragObjectInit(_this.anwserCardType);
            _this.touchHandles();
            _this.startTimer = _this.timer(_this.limitTime, _this.circle);
            _this.startTimer.start();
        });
    }
    // 移出拖拽对象
    private removeDargCard() {
        this.removeChild(this.dragCardLinght);
        this.removeChild(this.dragCardBg);
        this.removeChild(this.dragGroup);
    }
    /*
       初始化刺激卡
    */
    private cardPosition = {
        one: {
            x: 30,
            y: 277,
            width: 153,
            height: 272,
        },
        two: {
            x: 209,
            y: 277,
            width: 153,
            height: 272
        },
        three: {
            x: 388,
            y: 277,
            width: 153,
            height: 272
        },
        four: {
            x: 567,
            y: 277,
            width: 153,
            height: 272
        },
        answer: {
            x: 299,
            y: 845,
            width: 153,
            height: 272
        }
    }

    private createCard(type: string, order: string) {
        //p判断颜色
        let targetGroup = 'redCards_json';
        let img: egret.Bitmap;
        let isRed = /\wA\w/;
        let isYellow = /\wB\w/;
        let isBule = /\wC\w/;
        let isGreen = /\wD\w/;
        if (isRed.test(type)) {
            img = this.createBitmapByName(`redCards_json.${type}`);
        } else if (isYellow.test(type)) {
            img = this.createBitmapByName(`yellowCards_json.${type}`);
        } else if (isBule.test(type)) {
            img = this.createBitmapByName(`blueCards_json.${type}`);
        } else {
            img = this.createBitmapByName(`greenCards_json.${type}`)
        }
        img.x = this.cardPosition[order].x;
        img.y = this.cardPosition[order].y;
        img.width = this.cardPosition[order].width;
        img.height = this.cardPosition[order].height;
        let shadowFilter: egret.DropShadowFilter = new egret.DropShadowFilter(40, 60, 0x000000, 0.8, 16, 16, 0.6, egret.BitmapFilterQuality.LOW, false, false);
        // 17      img.filters = [shadowFilter];
        this.addChild(img);

        return img
    }
    private createCardBg(order: string) {
        let img: egret.Bitmap;
        img = this.createBitmapByName('cardBg_jpg');
        img.x = this.cardPosition[order].x;
        img.y = this.cardPosition[order].y;
        img.width = this.cardPosition[order].width;
        img.height = this.cardPosition[order].height;
        this.addChild(img);
        return img
    }
    /*
      帮助按钮
 
    */
    private helpBtn;
    private isHelpbtnOpen;
    private CreateHelpBtn() {
        let helpBtn = this.createBitmapByName("icon-help_png");
        helpBtn.width = 46;
        helpBtn.height = 46;
        helpBtn.x = 30;
        helpBtn.y = 1238;
        helpBtn.touchEnabled = true;
        helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.helpBtn = helpBtn;
        this.addChild(helpBtn);
        return helpBtn
    }
    /*
      截屏操作
    */
    private drawImage() {
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(this.stage);
        // 5      let base64Str = renderTexture.toDataURL("image/png");
        // 6      renderTexture.saveToFile("image/png", "aa.png",new egret.Rectangle(0, 0, stage.width,stage.height));
    }

    private BigBgShow() {
        window.document.getElementById('cover').style.display = 'block'
    }
    private BigBgHide() {
        window.document.getElementById('cover').style.display = 'none'
    }
    //创建引导1
    private shadowBg;
    private steps() {
        console.log('step1')
        let _this = this;
        let bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0X000000, .75);
        bg.graphics.drawRect(0, 0, 750, 1334);
        bg.graphics.endFill();
        bg.graphics.beginFill(0Xffffff, 1);
        this.shadowBg = bg;
        this.addChild(bg);
        this.BigBgShow();
        let score = new egret.TextField();
        score.y = 54;
        score.text = '0123456789';
        score.size = 40;
        score.width = 720;
        score.textAlign = egret.HorizontalAlign.RIGHT;
        score.fontFamily = 'MyText';
        score.alpha = 0;
        this.addChild(score);
        
        // this.score.fontFamily = 'MyText';
        //步骤一文字
        let text1 = new egret.TextField;
        text1.text = '正确快速地匹配卡片来获得分数';
        text1.textColor = 0xffffff;
        text1.width = 350;
        text1.textAlign = egret.HorizontalAlign.JUSTIFY;
        text1.size = 48;
        text1.lineSpacing = 30;
        text1.x = 209;
        text1.y = 449;
        text1.alpha = 0;
        this.addChild(text1);
        egret.Tween.get(text1).wait(500).to({ y: 429, alpha: 1 }, 500, egret.Ease.backOut);
        let btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980, 1)
        btnBg.graphics.drawRect(0, 0, 320, 110);
        btnBg.graphics.endFill();
        btnBg.x = 215;
        btnBg.y = 1164;
        btnBg.touchEnabled = true;
        btnBg.alpha = 0;
        this.addChild(btnBg);
        egret.Tween.get(btnBg).wait(500).to({ y: 1144, alpha: 1 }, 500, egret.Ease.backOut);
        let btnTxt = new egret.TextField;
        btnTxt.text = '我知道了';
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = egret.HorizontalAlign.CENTER;
        btnTxt.size = 40;
        btnTxt.width = this.stage.width;
        btnTxt.lineSpacing = 30;
        btnTxt.x = 0;
        btnTxt.y = 1200;
        btnTxt.alpha = 0;
        this.addChild(btnTxt);
        egret.Tween.get(btnTxt).wait(500).to({ y: 1180, alpha: 1 }, 500, egret.Ease.backOut);
        let btnClick = false;
        btnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log(btnClick, 'one')
            if (!btnClick) {
                btnClick = true;

                btnBg.touchEnabled = false;
                egret.Tween.get(text1).to({ y: 439, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(text1)
                })
                egret.Tween.get(btnBg).to({ y: 1145, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnBg);
                })
                egret.Tween.get(btnTxt).to({ y: 1190, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnTxt);
                    // _this.GameComplate();
                    _this.stepThree();
                })

            }

        }, this);
    }
    private stepTwo() {
        let _this = this;
        let arrow = this.createBitmapByName('icon_arrow_right_png');
        arrow.width = 97;
        arrow.height = 67;
        arrow.x = 607;
        arrow.y = 130;
        arrow.alpha = 0;
        this.addChild(arrow);
        egret.Tween.get(arrow).to({ y: 120, alpha: 1 }, 500, egret.Ease.backOut);
        let text = new egret.TextField;
        text.text = '你的分数在这里           做的越快，分数越多～';
        text.textColor = 0xffffff;
        text.textAlign = egret.HorizontalAlign.LEFT;
        text.size = 36;
        text.lineSpacing = 10;
        text.width = 360;
        text.x = 338;
        text.alpha = 0;
        text.y = 189;
        this.addChild(text);
        this.score.text = '34';
        // this.score.fontFamily = 'MyText';
        egret.Tween.get(text).to({ y: 169, alpha: 1 }, 500, egret.Ease.backOut);
        let rect = new egret.Shape();
        rect.graphics.beginFill(0x29748d, 1);
        rect.graphics.drawRect(0, 0, 90, 70);
        rect.graphics.endFill();
        rect.x = 644;
        rect.y = 38;
        this.addChild(rect);
        //  rect.blendMode = egret.BlendMode.ERASE;
        let btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980, 1)
        btnBg.graphics.drawRect(0, 0, 320, 110);
        btnBg.graphics.endFill();
        btnBg.x = 215;
        btnBg.y = 1144;
        btnBg.touchEnabled = true;
        this.addChild(btnBg);
        let btnTxt = new egret.TextField;
        btnTxt.text = '我知道了';
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = egret.HorizontalAlign.CENTER;
        btnTxt.size = 40;
        btnTxt.width = this.stage.width;
        btnTxt.lineSpacing = 30;
        btnTxt.x = 0;
        btnTxt.y = 1180;
        this.addChild(btnTxt);
        let score = new egret.TextField();
        score.y = 54;
        score.text = '34';
        score.size = 40;
        score.width = 720;
        score.textAlign = egret.HorizontalAlign.RIGHT;
        score.fontFamily = 'MyText';
        this.addChild(score);
        btnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (btnBg.touchEnabled) {
                console.log('two')
                btnBg.touchEnabled = false;
                this.removeChild(rect)
                egret.Tween.get(text).to({ y: 189, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(text)
                })
                egret.Tween.get(score).to({y:64,alpha:0},500,egret.Ease.backOut);
                egret.Tween.get(arrow).to({ y: 130, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(arrow);
                })
                egret.Tween.get(btnBg).to({ y: 1145, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnBg);
                })
                egret.Tween.get(btnTxt).to({ y: 1190, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnTxt);
                    _this.removeChild(score);
                    _this.stepFour();
                })

            }

        }, this);
    }
    private stepThree() {
        let _this = this;
        let arrow = this.createBitmapByName('icon_arrow_left_png');
        arrow.width = 97;
        arrow.height = 67;
        arrow.x = 42;
        arrow.y = 136;
        arrow.alpha = 0;
        this.addChild(arrow);
        egret.Tween.get(arrow).to({ y: 116, alpha: 1 }, 500, egret.Ease.backOut);
        let text = new egret.TextField;
        text.text = '每轮有30秒的时间';
        text.textColor = 0xffffff;
        text.textAlign = egret.HorizontalAlign.LEFT;
        text.size = 36;
        text.width = 590;
        text.x = 160;
        text.alpha = 0;
        text.y = 184;
        this.addChild(text);
        let rect = new egret.Shape();
        rect.graphics.beginFill(0x29748d, 1);
        rect.graphics.drawRect(0, 0, 70, 70);
        rect.graphics.endFill();
        rect.x = 18;
        rect.y = 38;
        this.addChild(rect);
        //  rect.blendMode = egret.BlendMode.ERASE;
        egret.Tween.get(text).to({ y: 164, alpha: 1 }, 500, egret.Ease.backOut);
        // 倒计时背景
        let timerBg = new egret.Shape();
        timerBg.graphics.beginFill(0xffffff, .3);
        timerBg.graphics.drawArc(53, 73, 23, 0, 2 * Math.PI, false);
        timerBg.graphics.endFill();
        this.addChild(timerBg);
        let circle: egret.Shape = new egret.Shape();
        let startTimer = this.timer(10000, circle);
        startTimer.start();
        startTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, _this.endTime, this);
        let btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980, 1)
        btnBg.graphics.drawRect(0, 0, 320, 110);
        btnBg.graphics.endFill();
        btnBg.x = 215;
        btnBg.y = 1164;
        btnBg.touchEnabled = true;
        btnBg.alpha = 0;
        this.addChild(btnBg);
        egret.Tween.get(btnBg).to({ y: 1144, alpha: 1 }, 500, egret.Ease.backOut);
        let btnTxt = new egret.TextField;
        btnTxt.text = '我知道了';
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = egret.HorizontalAlign.CENTER;
        btnTxt.size = 40;
        btnTxt.width = this.stage.width;
        btnTxt.lineSpacing = 30;
        btnTxt.x = 0;
        btnTxt.y = 1200;
        btnTxt.alpha = 0;
        this.addChild(btnTxt);
        egret.Tween.get(btnTxt).to({ y: 1180, alpha: 1 }, 500, egret.Ease.backOut);
        btnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (btnBg.touchEnabled) {
                console.log('three')
                btnBg.touchEnabled = false;
                this.removeChild(rect)
                egret.Tween.get(text).to({ y: 184, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(text)
                })
                egret.Tween.get(arrow).to({ y: 136, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(arrow);
                })
                egret.Tween.get(btnBg).to({ y: 1145, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnBg);
                })
                egret.Tween.get(btnTxt).to({ y: 1190, alpha: 0 }, 500, egret.Ease.backOut).call(function () {

                    _this.removeChild(btnTxt);


                    _this.stepTwo();
                })
                startTimer.stop();
                // clearInterval(startTimer);
                timerBg.graphics.clear();
                circle.graphics.clear();
                _this.removeChild(timerBg);
                _this.removeChild(circle);
                startTimer = null;
            }
        }, this);
    }

    private stepFour() {
        this.guiBG = new egret.Shape();
        this.guiBG.graphics.beginFill(0x29748d, 1);
        this.guiBG.graphics.drawRect(0, 0, 90, 70);
        this.guiBG.graphics.endFill();
        this.guiBG.x = 644;
        this.guiBG.y = 38;
        this.addChild(this.guiBG);
        this.guitScore = new egret.TextField();
        this.guitScore.y = 54;
        this.guitScore.text = '34';
        this.guitScore.size = 40;
        this.guitScore.width = 720;
        this.guitScore.textAlign = egret.HorizontalAlign.RIGHT;
        this.guitScore.fontFamily = 'MyText';
        this.addChild(this.guitScore);
        this.stepFourText = new egret.TextField;
        this.stepFourText.text = '把下面的卡片拖到上面来匹配';
        this.stepFourText.textColor = 0xffffff;
        this.stepFourText.textAlign = egret.HorizontalAlign.CENTER;
        this.stepFourText.size = 36;
        this.stepFourText.width = 750;
        this.stepFourText.x = 0;
        this.stepFourText.alpha = 0;
        this.stepFourText.y = 181;
        this.addChild(this.stepFourText);
        egret.Tween.get(this.stepFourText).to({ y: 161, alpha: 1 }, 500, egret.Ease.backOut);
        //绘制发光边框
        this.stepFourBorder = new egret.Shape();
        this.stepFourBorder.graphics.beginFill(0xffffff, 1);
        this.stepFourBorder.graphics.drawRect(0, 0, this.cardPosition['one'].width+8,this.cardPosition['one'].height+8);
        this.stepFourBorder.graphics.endFill();
        //   border.alpha = 0;
        this.stepFourBorder.alpha = 0;
        this.stepFourBorder.x = this.cardPosition['one'].x - 4;
        this.stepFourBorder.y = this.cardPosition['one'].y - 4;
        var blurFliter = new egret.BlurFilter(3, 3);
        // this.stepFourBorder.filters = [blurFliter];
        this.addChild(this.stepFourBorder);
        this.stepFourCardBg = this.createCardBg('one');
        this.stepFourCard = this.createCard('AAA', 'one');
        this.stepFourCardBg.alpha = 0;
        this.stepFourCard.alpha = 0;
        egret.Tween.get(this.stepFourCardBg).to({ alpha: 1 }, 500, egret.Ease.backOut);
        egret.Tween.get(this.stepFourCard).to({ alpha: 1 }, 500, egret.Ease.backOut);
        this.dragGroup.alpha = 0;
        let shadowFilter: egret.DropShadowFilter = new egret.DropShadowFilter(0, 0, 0xb5c92a, 0.8, 16, 16, 0.6, egret.BitmapFilterQuality.LOW, false, false);
        this.stepFourCard.filters = [shadowFilter];
        //   Card1Bg.alpha = 0;
        //   Card1.alpha = 0;
        //   egret.Tween.get(Card1Bg).to({alpha:1},500,egret.Ease.backOut);
        //   egret.Tween.get(border).to({alpha:1},500,egret.Ease.backOut);
        //   egret.Tween.get(Card1).to({alpha:1},500,egret.Ease.backOut);
        this.dragCardBg.alpha = 0;
        this.stetFourArrow = this.createBitmapByName('arrow_move_png');
        this.stetFourArrow.width = 153;
        this.stetFourArrow.height = 254;
        this.stetFourArrow.x = 132;
        this.stetFourArrow.y = 577;
        this.stetFourArrow.alpha = 0;
        this.addChild(this.stetFourArrow);
        egret.Tween.get(this.stetFourArrow).to({ alpha: 1 }, 800, egret.Ease.backOut);
        this.stepdragObjectInit();
        this.stepdragCardLinght.alpha = 0;
        this.guitTouchHandles();

    }
    private stepFive() {
        let _this = this;
        this.dragGroup.alpha = 1;
        this.dragCardBg.alpha = 1;
        let stepFourText = new egret.TextField;
        stepFourText.text = '如果选错了的话,';
        stepFourText.textColor = 0xffffff;
        stepFourText.textAlign = egret.HorizontalAlign.CENTER;
        stepFourText.size = 48;
        stepFourText.width = 750;
        stepFourText.x = 0;
        stepFourText.alpha = 0;
        stepFourText.y = 439;
        this.addChild(stepFourText);
        let stepFourText2 = new egret.TextField;
        stepFourText2.text = '只要把下一张选对就好啦！';
        stepFourText2.textColor = 0xffffff;
        stepFourText2.textAlign = egret.HorizontalAlign.CENTER;
        stepFourText2.size = 48;
        stepFourText2.width = 750;
        stepFourText2.x = 0;
        stepFourText2.alpha = 0;
        stepFourText2.y = 516;
        this.addChild(stepFourText2);
        egret.Tween.get(stepFourText).to({ y: 429, alpha: 1 }, 500, egret.Ease.backOut);
        egret.Tween.get(stepFourText2).to({ y: 506, alpha: 1 }, 500, egret.Ease.backOut);
        let btnBgt = new egret.Shape();
        btnBgt.graphics.beginFill(0x00C980, 1)
        btnBgt.graphics.drawRect(0, 0, 320, 110);
        btnBgt.graphics.endFill();
        btnBgt.x = 215;
        btnBgt.y = 1144;
        btnBgt.touchEnabled = true;
        this.addChild(btnBgt);
        let btnTxt = new egret.TextField;
        btnTxt.text = '我知道了';
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = egret.HorizontalAlign.CENTER;
        btnTxt.size = 40;
        btnTxt.width = this.stage.width;
        btnTxt.lineSpacing = 30;
        btnTxt.x = 0;
        btnTxt.y = 1180;
        this.addChild(btnTxt);
        btnBgt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (btnBgt.touchEnabled) {
                btnBgt.touchEnabled = false;
                egret.Tween.get(btnBgt).to({ y: 1145, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnBgt);
                })
                egret.Tween.get(stepFourText).to({ y: 439, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(stepFourText);
                })
                egret.Tween.get(stepFourText2).to({ y: 516, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(stepFourText2);
                })
                egret.Tween.get(btnTxt).to({ y: 1190, alpha: 0 }, 500, egret.Ease.backOut).call(function () {
                    _this.removeChild(btnTxt);
                    _this.stepSix();
                })
            }
        }, this);
    }
    private stepSix() {
        let _this = this;
        let stepFourText3 = new egret.TextField;
        stepFourText3.text = '准备好了的话，就点击';
        stepFourText3.textColor = 0xffffff;
        stepFourText3.textAlign = egret.HorizontalAlign.CENTER;
        stepFourText3.size = 48;
        stepFourText3.width = 750;
        stepFourText3.x = 0;
        stepFourText3.alpha = 0;
        stepFourText3.y = 439;
        this.addChild(stepFourText3);
        let stepFourText4 = new egret.TextField;
        stepFourText4.text = '屏幕开始回答吧!';
        stepFourText4.textColor = 0xffffff;
        stepFourText4.textAlign = egret.HorizontalAlign.CENTER;
        stepFourText4.size = 48;
        stepFourText4.width = 750;
        stepFourText4.x = 0;
        stepFourText4.alpha = 0;
        stepFourText4.y = 516;
        this.addChild(stepFourText4);
        egret.Tween.get(stepFourText3).to({ y: 429, alpha: 1 }, 500, egret.Ease.backOut);
        egret.Tween.get(stepFourText4).to({ y: 506, alpha: 1 }, 500, egret.Ease.backOut);
        let btnBg = new egret.Shape();
        btnBg.graphics.beginFill(0x00C980, 1)
        btnBg.graphics.drawRect(0, 0, 320, 110);
        btnBg.graphics.endFill();
        btnBg.x = 215;
        btnBg.y = 910;
        btnBg.touchEnabled = true;
        this.addChild(btnBg);
        let btnTxt = new egret.TextField;
        btnTxt.text = '准备好了';
        btnTxt.textColor = 0xffffff;
        btnTxt.textAlign = egret.HorizontalAlign.CENTER;
        btnTxt.size = 40;
        btnTxt.width = this.stage.width;
        btnTxt.lineSpacing = 30;
        btnTxt.x = 0;
        btnTxt.y = 946;
        this.addChild(btnTxt);
        let resetBtn = this.createBitmapByName('resst_png');
        resetBtn.x = 358;
        resetBtn.y = 1134;
        resetBtn.width = 34;
        resetBtn.height = 36;
        resetBtn.touchEnabled = true;
        this.addChild(resetBtn);
        let stepFourText = new egret.TextField;
        stepFourText.text = '再看一次';
        stepFourText.textColor = 0xffffff;
        stepFourText.textAlign = egret.HorizontalAlign.CENTER;
        stepFourText.size = 32;
        stepFourText.width = 750;
        stepFourText.x = 0;
        //  stepFourText.alpha = 0;
        stepFourText.y = 1206;
        this.addChild(stepFourText);
        resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (resetBtn.touchEnabled) {
                resetBtn.touchEnabled = false;
                _this.removeChild(stepFourText3);
                _this.removeChild(stepFourText4);
                _this.removeChild(stepFourText);
                _this.removeChild(resetBtn);
                _this.removeChild(btnBg);
                _this.removeChild(btnTxt);
                _this.removeChild(this.shadowBg);
                _this.steps();
            }
        }, this)
        btnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (btnBg.touchEnabled) {
                btnBg.touchEnabled = false;
                _this.removeChild(stepFourText3);
                _this.removeChild(stepFourText4);
                _this.removeChild(stepFourText);
                _this.removeChild(resetBtn);
                _this.removeChild(btnBg);
                _this.removeChild(btnTxt);
                _this.BigBgHide();
                _this.removeChild(this.shadowBg);
                _this.GameInit();
            }

        }, this)
    }


    //初始化游戏
    private GameInit() {
        this.clearCard();
        let query = this.Http('POST', `${this.root}WcstGame/startGame.do`, {}, function (
            event: egret.Event
        ) {
            var request = <egret.HttpRequest>event.currentTarget;
            let res = JSON.parse(request.response);
            console.log(res)
            if (res.status == 0) {
                let cardList = res.singleCardValue.split(',');
                this.CardList = cardList;
                this.version = res.gameVersion;
                this.complateUrl = res.questionnaireLink;
                this.anwserCardType = res.unqiueCardValue;
                this.CreateSelectCard(cardList);
                this.dragObjectInit(res.unqiueCardValue);
                this.touchHandles();
                this.limitTime = res.gameTime * 1000;
                this.startTimer = this.timer(this.limitTime, this.circle, this.endTime);
                this.startTimer.start();
                this.score.text = res.currentScore;
            } else {
                alert(res.message);
                // this.steps();
            }
            console.log("post data : ", JSON.parse(request.response));
        }, function () { })
    }

    //提交答案
    private sendAnser(data) {
        ;
        let _this = this
        let query = this.Http('POST', `${this.root}WcstGame/getNextGameAndSubmitResult.do`, data, function (
            event: egret.Event
        ) {
            var request = <egret.HttpRequest>event.currentTarget;
            let res = JSON.parse(request.response);
            console.log(res)
            if (res.status == 0) {
                // 游戏继续
                if (res.gameStatus == 0) {
                    if (res.result == 0) {
                        _this.anwserCardType = res.unqiueCardValue;
                        _this.scroeAdd(res.currentScore - this.score.text);
                        _this.score.text = res.currentScore;
                        _this.successCard();
                    } else {
                        _this.anwserCardType = res.unqiueCardValue;
                        _this.score.text = res.currentScore;
                        _this.errorCard();
                    }
                } else {
                    _this.GameComplate();
                }

            } else {
                alert(res.message);
                _this.steps();
            }
            console.log("post data : ", JSON.parse(request.response));
        }, function () { })
    }
    // 添加分数动画
    private scroeAdd(NUM: number) {
        let _this = this;
        if (NUM !== 0) {
            let text = new eui.Label();
            text.text = `+${NUM}`;
            text.textColor = 0xffffff;
            text.size = 20;
            text.width = 720;
            text.x = 0;
            text.y = 100;
            text.textAlign = 'right';
            text.fontFamily = 'MyText';
            text.alpha = 0;
            this.addChild(text);
            egret.Tween.get(text).to({ y: 96, alpha: 1 }, 500, egret.Ease.backInOut).wait(500).to({ y: 90, alpha: 0 }, 500, egret.Ease.backInOut).call(function () {
                _this.removeChild(text)
            })
        }
    }
    // 游戏结束
    private GameComplate() {
        //截屏操作
        this.BigBgShow();
        let _this = this;
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        this.helpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        let bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0X000000, .75);
        bg.graphics.drawRect(0, 0, 750, 1334);
        bg.graphics.endFill();
        this.shadowBg = bg;
        this.addChild(bg);
        let Text = new eui.Label;
        Text.text = '你的得分';
        Text.textColor = 0xffffff;
        Text.textAlign = 'center';
        Text.size = 36;
        Text.width = 750;
        Text.x = 0;
        Text.y = 323;
        this.addChild(Text);
        let line = new egret.Shape();
        line.graphics.beginFill(0xc1bfc0, 1);
        line.graphics.drawRect(0, 0, 42, 4);
        line.graphics.endFill();
        line.x = 354;
        line.y = 406;
        this.addChild(line);
        let score = new eui.Label();
        score.textColor = 0xF8594D;
        score.textAlign = 'center';
        score.text = this.score.text;
        score.fontFamily = 'MyText';
        score.width = 750;
        score.size = 160;
        score.y = 520;
        score.alpha = 0;
        this.addChild(score);
        egret.Tween.get(score).to({ y: 480, alpha: 1 }, 1000, egret.Ease.quadIn).call(function () {
            renderTexture.drawToTexture(_this.stage);
            if (_this.version == 0) {
                let btn = new eui.Group();
                btn.width = 450;
                btn.height = 100;
                btn.x = 150;
                btn.y = 1030;
                btn.touchEnabled = true;
                let btnBg = new egret.Shape();
                btnBg.graphics.beginFill(0x00C980, 1);
                btnBg.graphics.drawRect(0, 0, 450, 100);
                btnBg.graphics.endFill();
                let btnText = new eui.Label();
                btnText.text = '回答问卷帮我们改进';
                btnText.textColor = 0xffffff;
                btnText.textAlign = 'center';
                btnText.size = 40;
                btnText.width = 450;
                btnText.height = 100;
                btnText.verticalAlign = 'middle';
                btn.addChild(btnBg)
                btn.addChild(btnText);
                _this.addChild(btn);
                btn.alpha = 0;
                egret.Tween.get(btn).to({ alpha: 1 }, 500, egret.Ease.quadIn)
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    if (_this.version == 0) {
                        window.location.href = _this.complateUrl;
                    } else {
                        //  if(_this.IsWeixin){

                        let base64 = renderTexture.toDataURL("image/png", new egret.Rectangle(0, 0, _this.stage.width, _this.stage.height));
                        let img = <HTMLImageElement>window.document.getElementById('downloadImg');
                        if (img.src) { img.src = base64 };
                        window.document.getElementById('downloadImg').style.display = 'block';

                        //  }else if(_this.IsAndroid){
                        //     renderTexture.saveToFile("image/png", "Documents/test/aa.png",new egret.Rectangle(0, 0, _this.stage.width,_this.stage.height));  
                        //  }else if(_this.IsIOS){
                        //      let base64 =renderTexture.toDataURL("image/png", new egret.Rectangle(0, 0, _this.stage.width,_this.stage.height));
                        //      this.download(base64);
                        //  }else{
                        //      renderTexture.saveToFile("image/png", "Documents/test/aa.png",new egret.Rectangle(0, 0, _this.stage.width,_this.stage.height));  
                        //  }   
                    }
                }, this)
            } else {
                let finger = _this.createBitmapByName('finger_png');
                finger.width = 100;
                finger.height = 100;
                finger.x = 325;
                finger.y = 971;
                _this.addChild(finger);
                finger.alpha = 0;
                egret.Tween.get(finger).to({ alpha: 1 }, 500, egret.Ease.quadIn)
                let text = new eui.Label();
                text.text = '长按此保存图片分享你的分数';
                text.width = 236;
                text.textAlign = 'center';
                text.textColor = 0xffffff;
                text.size = 32;
                text.lineSpacing = 30;
                text.y = 1118;
                text.x = 264;
                _this.addChild(text);
                egret.Tween.get(text).to({ alpha: 1 }, 500, egret.Ease.quadIn)
                let base64 = renderTexture.toDataURL("image/png", new egret.Rectangle(0, 0, _this.stage.width, _this.stage.height));
                let img = <HTMLImageElement>window.document.getElementById('downloadImg');
                if (img.src) { img.src = base64 };
                window.document.getElementById('downloadImg').style.display = 'block';
            }
        })
    }

    private download(data) {
        let imgData = data;
        this.downloadFile('测试.png', imgData);
    }
    //下载
    private downloadFile(fileName, content) {
        let aLink = document.createElement('a');
        let blob = this.base64ToBlob(content); //new Blob([content]);

        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);

        // aLink.dispatchEvent(evt);
        //aLink.click()
        aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
    }


    //base64转blob
    private base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }
    //cardClear
    private clearCard() {
        this.score.text = '0';
        egret.Tween.get(this.cardBg1).to({ y: this.cardPosition['one'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.cardBg2).to({ y: this.cardPosition['two'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.cardBg3).to({ y: this.cardPosition['three'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.cardBg4).to({ y: this.cardPosition['four'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.Card1).to({ y: this.cardPosition['one'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.Card2).to({ y: this.cardPosition['two'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.Card3).to({ y: this.cardPosition['three'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.Card4).to({ y: this.cardPosition['four'].y + 10, alpha: 0 }, 300, egret.Ease.backOut);
        egret.Tween.get(this.dragGroup).to({ y: this.cardPosition['answer'].y + 10, alpha: 0 }, 300, egret.Ease.backOut)
        egret.Tween.get(this.dragCardBg).to({ y: this.cardPosition['answer'].y + 10, alpha: 0 }, 300, egret.Ease.backOut)
    }
    private CreateSelectCard(list) {
        this.cardBg1 = this.createCardBg('one');
        this.cardBg1.alpha = 0;
        egret.Tween.get(this.cardBg1).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.cardBg2 = this.createCardBg('two');
        this.cardBg2.alpha = 0;
        egret.Tween.get(this.cardBg2).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.cardBg3 = this.createCardBg('three');
        this.cardBg3.alpha = 0;
        egret.Tween.get(this.cardBg3).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.cardBg4 = this.createCardBg('four');
        this.cardBg4.alpha = 0;
        egret.Tween.get(this.cardBg4).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.Card1 = this.createCard(list[0], 'one');
        this.Card1.alpha = 0;
        egret.Tween.get(this.Card1).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.Card2 = this.createCard(list[1], 'two');
        this.Card2.alpha = 0;
        egret.Tween.get(this.Card2).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.Card3 = this.createCard(list[2], 'three');
        this.Card3.alpha = 0;
        egret.Tween.get(this.Card3).to({ alpha: 1 }, 800, egret.Ease.backOut)
        this.Card4 = this.createCard(list[3], 'four');
        this.Card4.alpha = 0;
        egret.Tween.get(this.Card4).to({ alpha: 1 }, 800, egret.Ease.backOut)
    }
    //  private request =  new egret.HttpRequest();
    private Http(type: string, url: string, data: Object, success: Function, error: Function) {
        let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        let nowType = type == 'GET' ? egret.HttpMethod.GET : egret.HttpMethod.POST;
        let params = '';
        if (type == 'GET') {
            params = '?'
            for (let i in data) {
                params += `${i}=${data[i]}&`;
            }
            params = params.replace(/&$/, '');
            request.open(url + params, nowType);

            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

            request.send();
        } else {
            for (let i in data) {
                params += `${i}=${data[i]}&`;
            }
            params = params.replace(/&$/, '');
            request.open(url, nowType);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // request.setRequestHeader("withCredentials", 'true');
            request.withCredentials = true;
            request.send(params);
        }
        request.addEventListener(egret.Event.COMPLETE, success, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, error, this);
        // request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
        return request
    }


}


