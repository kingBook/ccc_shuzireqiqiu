cc.Class({
    extends: cc.Component,
    properties: {
        isOut:{default:false,visible:false},
        numNO:{default:0,visible:false},
        isBackOrOuting:{default:false,visible:false},
        explosionAnim:{default:null,type:cc.Animation,visible:false},
        explosionAnimState:{default:null,visible:false},
        numNode:{default:null,type:cc.Node,visible:false}
    },
    
    onLoad:function(){
        //初始缩小隐藏
        this.rightNowHide();
        
        /*this.scheduleOnce(function(){
            this.goOutside(4);
        },1)*/
    },

    /**立即隐藏*/
    rightNowHide:function(){
        this.dispose();
        this.node.setPosition(-50,-80);
        this.node.scale=0.1;
        this.node.opacity=0;
    },

    //点击气球时。编辑器关联
    onTouchStart:function(){
        if(this.isOut&&!this.isBackOrOuting){
            //派发点击球事件
            this.node.emit("touchBalloon",this.numNO);
        }
    },

    //出去
    goOutside:function(numNO){
        if(this.isOut)return;
        if(this.node.opacity>0)this.rightNowHide();

        this.isOut=true;
        this.isBackOrOuting=true;


        this.numNO=numNO;

        const duration=0.7;
        var fadeIn=cc.fadeIn(duration*0.5);
        var moveTo=cc.moveTo(duration,0,0);
        var scaleToSeq=cc.sequence( 
            cc.scaleTo(duration,1,1), 
            cc.callFunc(this.onOutComplete,this) 
        );
        this.node.runAction(cc.spawn(fadeIn,moveTo,scaleToSeq));
        //随机一个动物
        var activeChild=this.activeRandomOneChild();
        this.explosionAnim=activeChild.getComponent(cc.Animation);
        this.explosionAnim.defaultClip.wrapMode=cc.WrapMode.Loop;
        this.explosionAnimState=this.explosionAnim.getAnimationState(this.explosionAnim.defaultClip.name);
        this.explosionAnimState.time=0;
        this.explosionAnimState.stop();
        this.explosionAnim.defaultClip.wrapMode=cc.WrapMode.Normal;

        var childButton=activeChild.getChildByName("button");
        childButton.opacity=0;

        //数字
        var numJs=activeChild.getComponentInChildren("Num");//从动物节点返回字节点"数字"的Num脚本
        numJs.goNumNO(numNO);
        this.numNode=numJs.node;
        //激活数字节点
        this.numNode.active=true;

    },
    onOutComplete:function(){
        this.isBackOrOuting=false;
        var duration=3+Math.random()*2;
        this.scheduleOnce(this.comeback,duration);
    },
    
    //回来
    comeback:function(){
        if(!this.isOut)return;
        this.dispose();

        this.isOut=false;
        this.isBackOrOuting=true;
        
        const duration=0.5;
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
        this.isBackOrOuting=false;
        //this.scheduleOnce(function(){this.goOutside(10);},1)
    },

    /**激活随机的一个动物子节点*/
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

    playExplosionAnim:function(){
        cc.log("playExplosionAnim");
        this.numNode.active=false;
        this.unschedule(this.comeback,this);
        this.explosionAnim.defaultClip.wrapMode=cc.WrapMode.Loop;
        this.explosionAnimState.play();
        cc.log("mode",this.explosionAnim.defaultClip.wrapMode);
        this.explosionAnimState.on("lastframe",this.onPlayExplosionAnimEnd,this);
    },

    onPlayExplosionAnimEnd:function(){
        cc.log("onPlayExplosionAnimEnd");
        this.explosionAnimState.time=this.explosionAnim.defaultClip.duration;
        this.explosionAnimState.stop();
        this.explosionAnimState.off("lastframe",this.onPlayExplosionAnimEnd,this);
        this.explosionAnimState=null;
        this.explosionAnim=null;

        //this.comeback();
    },

    update:function(dt){

    },

    dispose:function(){
        this.isOut=false;
        this.isBackOrOuting=false;
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
        if(this.explosionAnimState!=null){
            this.explosionAnimState.off("lastframe",this.onPlayExplosionAnimEnd,this);
            //this.explosionAnimState.time=0;
            this.explosionAnimState.stop();
            this.explosionAnimState=null;
        }
        if(this.numNode!=null){
            this.numNode=null;
        }
        this.explosionAnim=null;
    },
    
    onDestroy:function(){
        this.dispose();
    }
});
