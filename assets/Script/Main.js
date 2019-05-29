cc.Class({
    extends: cc.Component,

    properties: {
        startTipSound:{default:null,type:cc.AudioClip},
        windowsNode:{default:null,type:cc.Node},
        balloonNode:{default:null,type:cc.Node},
        windowJsList:{default:[],type:[cc.Node],visible:false}
    },

    onLoad:function(){
        this.initWindowJsList();
    },

    start:function(){

    },

    initWindowJsList:function(){
        const childrenCount=this.windowsNode.childrenCount;
        for(var i=0;i<childrenCount;i++){
            var windowJs=this.windowsNode.children[i].getComponent("Window");
            this.windowJsList.push(windowJs);
        }
    },

    startGame:function(){
        this.balloonNode.y=-230;
    },

    update: function (dt) {
        
    }
});
