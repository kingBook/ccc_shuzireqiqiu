const Util=require("Util");
cc.Class({
    extends: cc.Component,

    properties: {
        animalJs:{default:null,visible:false},//animal字节点挂的脚本Animal.js
        mainJs:{default:null,visible:false}
    },

    onLoad:function(){
        this.animalJs=this.node.getChildByName("animal").getComponent("Animal");
        this.animalJs.node.on("touchBalloon",this.onTouchBalloon,this);
        //this.animalJs.goOutside(3);//test

        this.mainJs=cc.find("Main").getComponent("Main");
    },

    start:function(){

    },

    rightNowHideAnimal:function(){
        this.animalJs.rightNowHide();
    },

    /**点击气球*/
    onTouchBalloon:function(numNO){
        //播放气球上的数字音效
        this.mainJs.playNumSound(numNO);
        if(numNO==this.mainJs.needFindNumber){
            this.mainJs.clickContinuousErrorCount=0;
            this.animalJs.playRightAnim();
            //点击正确，其它窗口也立即缩回去
            this.otherWindowsComeBack();
            //停止显示伸出数字，等热气球上升后再提示下一个数字
            this.mainJs.stopDelayDisplayNumber();
            this.mainJs.rightNumCount++;
            if(this.mainJs.rightNumCount>=this.mainJs.needFindNumTotal){
                //热气球直接飞走
                this.mainJs.balloonJs.goOut();
            }else{
                //热气球上升
                this.mainJs.balloonJs.goUp();
            }
            //
            //this.mainJs.plugin.gameOver(50,3);
            
            //cc.audioEngine.play(this.mainJs.rightErrorSounds[0],false,this.mainJs.volume*0.1);//正确
            cc.audioEngine.play(this.mainJs.rightErrorSounds[2],false,this.mainJs.volume*0.06);//爆裂
            
        }else{
            this.animalJs.playErrAnim();
            //热气球下降到底部
            this.mainJs.balloonJs.goDownBottom();
            this.mainJs.clickErrorCount++;
            this.mainJs.clickContinuousErrorCount++;
            if(this.mainJs.clickContinuousErrorCount>=3){
                this.mainJs.displayErrorTipPanel();
            }
            
            cc.audioEngine.playEffect(this.mainJs.rightErrorSounds[1]);//错误
        }
    },
    
    otherWindowsComeBack:function(){
        cc.log("otherWindowsComeBack");
        var windowJsList=this.mainJs.windowJsList;
        for(var i=0;i<windowJsList.length;i++){
            var windowjs=windowJsList[i];
            if(windowjs==this)continue;
            if(!windowjs.getIsOut())continue;
            windowjs.animalJs.comeback();
        }
    },

    /**伸出去*/
    goOutside:function(numNO){
        this.animalJs.goOutside(numNO);
    },

    /**缩回来*/
    comeback:function(){
        this.animalJs.comeback();
    },

    /**是否伸出*/
    getIsOut:function(){
         return this.animalJs.isOut;
    },

    getIsBackOrOuting:function(){
        return this.animalJs.isBackOrOuting;
    },

    /**窗口显示的数字*/
    getNumNO:function(){
       return this.animalJs.numNO;
    },

    onDestroy:function(){
        this.animalJs.node.off("touchBalloon",this.onTouchBalloon,this);
    }




    
    
});
