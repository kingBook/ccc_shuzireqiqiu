var Util=require("Util");
cc.Class({
    extends: cc.Component,

    properties: {
        startTipSound:{default:null,type:cc.AudioClip},//游戏开始前的提示音效
        pleaseFindNumSounds:{default:[],type:[cc.AudioClip]},//请找到数字x音效列表
        windowsNode:{default:null,type:cc.Node},//所有窗口节点
        balloonNode:{default:null,type:cc.Node},//气球节点
        windowJsList:{default:[],type:[cc.Node],visible:false},//所有窗口挂的脚本
        volume:{default:1,visible:false},//音量
        needFindNumber:{default:0,visible:false}//当前需要找的数字
    },

    onLoad:function(){
        this.initWindowJsList();

    },

    start:function(){
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
        //开始前设置
        this.balloonNode.y=-230;
        this.setVolume(1);
        for(var i=0;i<this.windowJsList.length;i++){
            this.windowJsList[i].rightNowHideAnimal();
        }
        //
       /* if(isPlayStartTipSound){
            var audioId=cc.audioEngine.playEffect(this.startTipSound,false);
            cc.audioEngine.setFinishCallback(audioId,this.promptNeedFindNumber);
        }else{
            this.promptNeedFindNumber();
        }*/
        this.promptNeedFindNumber();//test
    },
   /* reStartGame:function(){

    },*/

    /**提示需要找的数字*/
    promptNeedFindNumber:function(){
        this.needFindNumber=this.getRandomInt0To10();

        var numAudioClip=this.pleaseFindNumSounds[this.needFindNumber];
        cc.audioEngine.playEffect(numAudioClip);

        this.delayDisplayNumber();

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
                windowJs.goOutside(this.getRandomInt0To10());
                this.delayDisplayNumber();
                break;
            }
        }
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
    }


});
