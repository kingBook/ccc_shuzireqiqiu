/**热气球 */
cc.Class({
    extends: cc.Component,

    properties: {
        sounds:{default:[],type:[cc.AudioClip]},
        mainJs:{default:null,visible:false},
        originY:{default:NaN,visible:false},
        goUpdistance:{default:100},
        outY:{default:860,visible:false},
        elephantAnim:{default:null,type:cc.Animation},
        recordGoUpY:{default:NaN,visible:false},
    },
    
    onLoad:function(){
        this.mainJs=cc.find("Main").getComponent("Main");
        
    },
    
    init:function(){
        this.dispose();
        this.recordGoUpY=NaN;
        this.node.y=-230;
        this.originY=this.node.y;
        this.elephantAnim.play("elephantHappy");
    },
    
    /**上升*/
    goUp:function(){
        var duration=0.7;
        var y=this.node.y+this.goUpdistance;
        var isAtBottom=this.node.y<=this.originY;
        if(isAtBottom&&!isNaN(this.recordGoUpY)){
            y=this.recordGoUpY;//在底部时，上升到上一次的高度
        }
        var moveTo=cc.moveTo(duration,this.node.x,y);
        var callFunc=cc.callFunc(this.onGoUpEnd,this);
        this.node.runAction(cc.sequence(moveTo,callFunc));
        this.recordGoUpY=y;
        this.elephantAnim.play("elephantHappy");
        
        cc.audioEngine.playEffect(this.sounds[0]);//热气球上升
    },
    onGoUpEnd:function(){
        this.mainJs.promptNeedFindNumber();
        cc.log("onGoUpEnd");
    },
    /**飞出去*/
    goOut:function(){
        var duration=1;
        var moveTo=cc.moveTo(duration,this.node.x,this.outY);
        var callFunc=cc.callFunc(this.onGoOutEnd,this);
        this.node.runAction(cc.sequence(moveTo,callFunc));
        this.elephantAnim.play("elephantBye");
        
        cc.audioEngine.playEffect(this.sounds[2]);//热气球飞走了
        
        this.scheduleOnce(()=>{this.mainJs.startGame(true);},2);
    },
    onGoOutEnd:function(){
        cc.log("onGoOutEnd");
    },
    
    /**下降 */
    goDown:function(){
        var duration=0.7;
        var y=Math.max(this.node.y-this.goUpdistance,this.originY);
        var moveTo=cc.moveTo(duration,this.node.x,y);
        var callFunc=cc.callFunc(this.onGoDownEnd,this);
        this.node.runAction(cc.sequence(moveTo,callFunc));
        this.elephantAnim.play("elephantSad");
        
        cc.audioEngine.playEffect(this.sounds[1]);//热气球下降
    },
    onGoDownEnd:function(){
        
        cc.log("onGoDownEnd");
    },
    /**下降到底部 */
    goDownBottom:function(){
        var duration=0.7;
        var moveTo=cc.moveTo(duration,this.node.x,this.originY);
        var callFunc=cc.callFunc(this.onGoDownBottom,this);
        this.node.runAction(cc.sequence(moveTo,callFunc));
        this.elephantAnim.play("elephantSad");
        
        cc.audioEngine.playEffect(this.sounds[1]);//热气球下降
    },
    onGoDownBottom:function(){
        cc.log("onGoDownBottom");
        //点错了，语音重新提示要找的数字
        //this.mainJs.playNeedFindNumberSound();
    },
    
    
    
    
    dispose:function(){
        this.node.stopAllActions();
    },

    onDestroy:function(){
        dispose();
    }
});
