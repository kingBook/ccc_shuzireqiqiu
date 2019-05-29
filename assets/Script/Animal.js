cc.Class({
    extends: cc.Component,
    properties: {
        isOut:{default:false,visible:false},
        numNO:{default:0,visible:false}
    },
    
    onLoad:function(){
        //初始缩小隐藏
        this.rightNowHide();
        
        /*this.scheduleOnce(function(){
            this.goOutside(4);
        },1)*/
    },

    rightNowHide:function(){
        this.node.setPosition(-50,-80);
        this.node.scale=0.1;
        this.node.opacity=0;
    },

    //点击气球时。编辑器关联
    onTouchStart:function(){
        if(this.isOut){
            this.node.emit("touchBalloon",this.numNO);
        }
    },


    //出去
    goOutside:function(numNO){
        if(this.isOut)return;
        this.isOut=true;

        if(this.node.opacity>0)this.rightNowHide();
        this.numNO=numNO;

        const duration=1;
        var fadeIn=cc.fadeIn(duration*0.5);
        var moveTo=cc.moveTo(duration,0,0);
        var scaleToSeq=cc.sequence( 
            cc.scaleTo(duration,1,1), 
            cc.callFunc(this.onOutComplete,this) 
        );
        this.node.runAction(cc.spawn(fadeIn,moveTo,scaleToSeq));
        //随机一个动物
        var activeChild=this.activeRandomOneChild();

        var childButton=activeChild.getChildByName("button");
        childButton.opacity=0;

        //数字
        var numJs=activeChild.getComponentInChildren("Num");//从动物节点返回字节点"数字"的Num脚本
        numJs.goNumNO(numNO);

    },
    onOutComplete:function(){

        this.scheduleOnce(this.comeback,1);
    },
    
    //回来
    comeback:function(){
        if(!this.isOut)return;
        this.isOut=false;
        
        const duration=1;
        var fadeOutSeq=cc.sequence(
            cc.delayTime(duration*0.8),
            cc.fadeOut(duration*0.2)
        );
        var moveTo=cc.moveTo(duration, cc.v2(-50,-80));
        var scaleToSeq=cc.sequence( 
            cc.scaleTo(duration,0.1,0.1), 
            cc.callFunc(this.onBackComplete,this) 
        );
        this.node.runAction(cc.spawn(fadeOutSeq,moveTo,scaleToSeq));
    },
    
    onBackComplete:function(){
        this.scheduleOnce(function(){this.goOutside(10);},1)
    },
    
    activeRandomOneChild:function(){
        var activeChild=null;
        const randomId=Math.random()*this.node.childrenCount|0;
        for(var i=0;i<this.node.childrenCount;i++){
            if(i==randomId){
                this.node.children[i].active=true;
                activeChild=this.node.children[i];
            }else{
                this.node.children[i].active=false;
            }
        }
        return activeChild;
    },
    
    onDestroy:function(){
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
    }
});
