cc.Class({
    extends: cc.Component,
    properties: {
        isOut:{default:false,visible:false}
    },
    
    start () {
        //初始缩小隐藏
        this.node.setPosition(-50,-80);
        this.node.scale=0.1;
        this.node.opacity=0;
        this.isOut=false;
        
        this.scheduleOnce(this.gotoOutside,1)
    },
    //出去
    gotoOutside(){
        if(this.isOut)return;
        this.isOut=true;
        
        const duration=1;
        this.node.runAction(cc.fadeIn(duration*0.5));
        this.node.runAction(cc.moveTo(duration, cc.v2(0,0)));
        this.node.runAction( 
            cc.sequence( 
                cc.scaleTo(duration,1,1), 
                cc.callFunc(this.onOutComplete,this) 
            )
        );
        //随机一个动物
        this.activeRandomOneChild();
    },
    onOutComplete(){
        this.scheduleOnce(this.comeback,1);
    },
    
    //回来
    comeback(){
        if(!this.isOut)return;
        this.isOut=false;
        
        const duration=1;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(duration*0.8),
                cc.fadeOut(duration*0.2)
            )
        );
        this.node.runAction(cc.moveTo(duration, cc.v2(-50,-80)));
        this.node.runAction( 
            cc.sequence( 
                cc.scaleTo(duration,0.1,0.1), 
                cc.callFunc(this.onBackComplete,this) 
            )
        );
    },
    
    onBackComplete(){
        this.scheduleOnce(this.gotoOutside,1)
    },
    
    activeRandomOneChild(){
        const randomId=Math.random()*this.node.childrenCount|0;
        cc.log(this.node.children);
        for(var i=0;i<this.node.childrenCount;i++){
            this.node.children[i].active=(i==randomId);
        }
    },
    
    onDestroy(){
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
    }
});
