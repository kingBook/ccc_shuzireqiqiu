cc.Class({
    extends: cc.Component,

    properties: {
        aniState:{default:null, visible:false},
        numNO:{default:0,visible:false}
    },

    start:function(){

    },

    initAniState:function(){
        var ani=this.getComponent(cc.Animation);

        this.aniState=ani.play();
        this.aniState.speed=0;
    },
    
     update:function(dt){
         
     },
     
     goNumNO:function(value){
         this.numNO=value;
         if(this.aniState==null)this.initAniState();
         this.aniState.time=value;
         //cc.log("aniState.time:"+this.aniState.time);
     }
});
