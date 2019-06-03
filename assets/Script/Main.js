const Util=require("Util");
const ChildMittPlugin = require('child-mitt-plugin');
cc.Class({
    extends: cc.Component,

    properties: {
        startTipSound:{default:null,type:cc.AudioClip},//游戏开始前的提示音效
        pleaseFindNumSounds:{default:[],type:[cc.AudioClip]},//请找到数字x音效列表
        numSounds:{default:[],type:[cc.AudioClip]},//数字音效列表
        balloonOutSounds:{default:[],type:[cc.AudioClip]},//气球出来时音效
        rightErrorSounds:{default:[],type:[cc.AudioClip]},//正确，错误音效
        windowsNode:{default:null,type:cc.Node},//所有窗口节点
        balloonNode:{default:null,type:cc.Node},//气球节点
        windowJsList:{default:[],type:[cc.Node],visible:false},//所有窗口挂的脚本
        volume:{default:1,visible:false},//音量
        needFindNumber:{default:0,visible:false},//当前需要找的数字
        createCount:{default:0,visible:false},
        balloonJs:{default:null,visible:false},
        clickErrorCount:{default:NaN,visible:false},//错误计数
        clickContinuousErrorCount:{default:NaN,visible:false},//连续错误计数
        needFindNumTotal:{default:5,type:cc.Integer},//游戏中一共需要找多少个数字
        rightNumCount:{default:0,visible:false},//正确点击数字计数
        mouseCusor:{default:null,type:cc.Node},
        canvasNode:{default:null,type:cc.Node},
        errorTipNode:{default:null,type:cc.Node},//下边提示的要找的数字
        errorTipHighlightNode:{default:null,type:cc.Node},//下边用于高亮数字的节点
        errorTipRecordY:{default:0,serializable:false,visible:false},
        clickStartGameNode:{default:null,type:cc.Node},
        alphaMaskSplashNode:{default:null,type:cc.Node},
        isGameing:{default:false,serializable:false,visible:false},
        plugin:{default:null,serializable:false,visible:false}
    },

    onLoad:function(){
        this.initWindowJsList();
        this.balloonJs=cc.find("Canvas/balloon").getComponent("Balloon");
        this.canvasNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchHandler,this,true);
        this.canvasNode.on(cc.Node.EventType.TOUCH_START,this.onTouchHandler,this,true);
        this.canvasNode.on(cc.Node.EventType.TOUCH_END,this.onTouchHandler,this,true);
        this.canvasNode.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchHandler,this,true);
        this.canvasNode.on(cc.Node.EventType.MOUSE_MOVE,this.onTouchHandler,this,true);
        //
        this.errorTipRecordY=this.errorTipNode.y;
        this.isGameing=false;
        //初始化Communicate Plugin for Child
        this.initPlugin();
        
    },
    
    initPlugin:function(){
        cc.log("initPlugin");
        this.plugin=new ChildMittPlugin({
            onInit:({config})=>{
                setVolume(config.volume);
                this.startGame(true); 
            },
            onRestart:()=>{
                cc.log("== onRestart ==");
                this.startGame(true); 
            },
            onPause:()=>{
                cc.audioEngine.pauseAll();
            },
            onResume:()=>{
                cc.audioEngine.resumeAll();
            },
            onVolumeChange:({config})=>{
                setVolume(config.volume);
            },
            onHint:()=>{
                //cc.audioEngine.playEffect(this.rightErrorSounds[1]);
            }
        });
        // emit主动推送消息
        this.plugin.loaded();
    },
    
    start:function(){
        this.init();
    },
    
    init:function(){
        //显示半透明屏幕
        this.alphaMaskSplashNode.active=true;
        //显示“点击开始游戏”
        this.clickStartGameNode.active=true;
        this.canvasNode.on(cc.Node.EventType.TOUCH_START,this.onStartTouchHandler,this,true);
    },
    
    onStartTouchHandler:function(){
        this.canvasNode.off(cc.Node.EventType.TOUCH_START,this.onStartTouchHandler,this,true);
        this.alphaMaskSplashNode.active=false;
        this.clickStartGameNode.active=false;
        //开始游戏
        this.startGame(true);
    },

    initWindowJsList:function(){
        const childrenCount=this.windowsNode.childrenCount;
        for(var i=0;i<childrenCount;i++){
            var windowJs=this.windowsNode.children[i].getComponent("Window");
            this.windowJsList.push(windowJs);
        }
    },

    /**开始游戏*/
    startGame:function(isPlayStartTipSound){
        this.plugin.gameStart();
        //开始前设置
        this.errorTipNode.stopAllActions();
        this.errorTipHighlightNode.stopAllActions();
        cc.audioEngine.stopAll();
        this.errorTipNode.stopAllActions();
        this.errorTipNode.y=this.errorTipRecordY;
        this.rightNumCount=0;
        this.clickErrorCount=0;
        this.clickContinuousErrorCount=0;
        this.createCount=0;
        this.balloonNode.getComponent("Balloon").init();
        this.setVolume(1);
        this.mouseCusor.active=true;
        this.isGameing=true;
        for(var i=0;i<this.windowJsList.length;i++){
            this.windowJsList[i].rightNowHideAnimal();
        }
        //
        if(isPlayStartTipSound){
            var audioId=cc.audioEngine.playEffect(this.startTipSound,false);
            cc.audioEngine.setFinishCallback(audioId,()=>{this.promptNeedFindNumber();});
        }else{
            this.promptNeedFindNumber();
        }
        //this.promptNeedFindNumber();//test
    },
    
    /**找完所有数字，热气球飞走执行*/
    gameWin:function(){
        this.plugin.gameOver({duration:50,failTime:1});
        this.isGameing=false;
        this.mouseCusor.active=false;
        this.errorTipNode.stopAllActions();
        this.errorTipHighlightNode.stopAllActions();
        
    },

    /**提示需要找的数字*/
    promptNeedFindNumber:function(){
        this.stopDelayDisplayNumber();
        this.needFindNumber=this.getRandomInt0To10();
        
        this.playNeedFindNumberSound();

        this.delayDisplayNumber();

    },
    
    playNeedFindNumberSound:function(){
        var numAudioClip=this.pleaseFindNumSounds[this.needFindNumber];
        cc.audioEngine.playEffect(numAudioClip);
    },

    delayDisplayNumber:function(){
        var delay=0.5+Math.random();
        this.scheduleOnce(function(){
            this.displayNumber();
        },delay);
    },

    displayNumber:function(){
        var ranIdList=Util.getRandomIdList(0,this.windowJsList.length-1);
        for(var i=0;i<ranIdList.length;i++){
            var id=ranIdList[i];
            var windowJs=this.windowJsList[id];
            if(windowJs.getIsBackOrOuting()==false){
                var numNO=this.getRandomInt0To10();
                this.createCount++;
                if(this.createCount>=Util.getRandomIntID(3,5)){
                if(!this.getOutSideWindowsHasNeedNumber()){
                        this.createCount=0;
                        numNO=this.needFindNumber;
                }}
                windowJs.goOutside(numNO);
                this.delayDisplayNumber();
                break;
            }
        }
    },
    
    stopDelayDisplayNumber:function(){
        this.unscheduleAllCallbacks();
    },
    
    getOutSideWindowsHasNeedNumber:function(){
        var result=false;
        for(var i=0;i<this.windowJsList.length;i++){
            var window=this.windowJsList[i];
            if(!window.getIsOut())continue;
            if(window.getNumNO()==this.needFindNumber){
                result=true;
                break;
            }
        }
        return result;
    },

    update: function (dt) {
        
    },

    /**设置全局音量*/
    setVolume:function(value){
        this.volume=value;
        cc.audioEngine.setEffectsVolume(this.volume);
        cc.audioEngine.setMusicVolume(this.volume);
    },

    getRandomInt0To10:function(){
        return (Math.random()*11)|0;
    },
    
    playNumSound:function(numNO){
        var clip=this.numSounds[numNO];
        cc.audioEngine.playEffect(clip);
    },
    
    onTouchHandler:function(e){
        var pos=e.getLocation();
        pos=this.canvasNode.convertToNodeSpaceAR(pos);
        //cc.log(pos);
        if(this.isGameing){
            this.mouseCusor.setPosition(pos);
        }
    },
    
    /**底部提示数字面板 */
    displayErrorTipPanel:function(){
        this.errorTipNode.stopAllActions();
        this.errorTipHighlightNode.stopAllActions();
        this.errorTipHighlightNode.active=true;
        this.errorTipHighlightNode.runAction(cc.hide());
        
        const inY=-58;
        const duration=0.3;
        this.errorTipNode.y=this.errorTipRecordY;
        
        var numJs=this.errorTipNode.getComponentInChildren("Num");
        numJs.goNumNO(this.needFindNumber);
        
        var moveIn=cc.moveTo(duration,this.errorTipNode.x,inY);
        
        var toggleVisibleSeq=cc.sequence(cc.toggleVisibility(),cc.delayTime(0.2),cc.toggleVisibility(),cc.delayTime(0.2),
                                         cc.toggleVisibility(),cc.delayTime(0.2),cc.toggleVisibility());
        var callFunc=cc.callFunc(()=>{
            this.errorTipHighlightNode.runAction(toggleVisibleSeq);
        });
        
        var delayTime=cc.delayTime(1);//停留时间
        
        var moveOut=cc.moveTo(duration,this.errorTipNode.x,this.errorTipRecordY);
        this.errorTipNode.runAction(cc.sequence(moveIn,callFunc,delayTime,moveOut));
        
        this.playNeedFindNumberSound();
    },
    
    onDestroy:function(){
        this.errorTipNode.stopAllActions();
        this.errorTipHighlightNode.stopAllActions();
        this.canvasNode.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchHandler,this,true);
        this.canvasNode.off(cc.Node.EventType.TOUCH_START,this.onTouchHandler,this,true);
        this.canvasNode.off(cc.Node.EventType.TOUCH_END,this.onTouchHandler,this,true);
        this.canvasNode.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchHandler,this,true);
        this.canvasNode.off(cc.Node.EventType.MOUSE_MOVE,this.onTouchHandler,this,true);
        this.canvasNode.off(cc.Node.EventType.TOUCH_START,this.onStartTouchHandler,this,true);
        this.unscheduleAllCallbacks();
    }


});
