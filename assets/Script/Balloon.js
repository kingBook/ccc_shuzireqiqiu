
/**热气球 */
cc.Class({
    extends: cc.Component,

    properties: {
        sounds:{default:[],type:[cc.AudioClip]},
        mainJs:{default:null,visible:false},
        originY:{default:NaN,visible:false},
        elephantAnim:{default:null,type:cc.Animation},
        recordGoUpY:{default:NaN,visible:false},
        outY:{default:1200,serializable:false,visible:false},
        goUpdistance:{default:150,serializable:false,visible:false}
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
            y=this.recordGoUpY+this.goUpdistance;//在底部时，上升到上一次的高度+每次上升的高度
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
    },
    /**飞出去*/
    goOut:function(){
        var duration=1;
        var moveTo=cc.moveTo(duration,this.node.x,this.outY);
        var callFunc=cc.callFunc(this.onGoOutEnd,this);
        this.node.runAction(cc.sequence(moveTo,callFunc));
        this.elephantAnim.play("elephantBye");
        
        cc.audioEngine.playEffect(this.sounds[2]);//热气球飞走了
        
    },
    onGoOutEnd:function(){
        this.mainJs.gameWin();
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
        
    },
    
    
    
    
    dispose:function(){
        this.node.stopAllActions();
    },

    onDestroy:function(){
        dispose();
    }
});
