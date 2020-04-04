
class FirstScene extends Scene{
    public constructor() {
        super();
        this.onComplete();
        this.createView();
    }
    public rootScene: eui.UILayer;
    public onComplete() {
      
       console.log('完成')
    }
     
        private bg:egret.Shape
        private shadow;
        private txt;
        private createView(){
            this.bg = new egret.Shape();
            this.bg.graphics.beginFill(0X000000,.75);
            this.bg.graphics.drawRect(0,0,750,1334);
            this.bg.graphics.endFill();
            this.bg.graphics.beginFill(0Xffffff,1);
            this.txt = new egret.TextField;
            this.txt.text = '正确快速地匹配卡片来获得分数';
            this.txt.textColor = 0xffffff;
            this.txt.width=333;
            this.txt.height = 119;
            this.txt.textAlign = egret.HorizontalAlign.RIGHT;
            this.rootScene.addChild(this.bg);
        }
}