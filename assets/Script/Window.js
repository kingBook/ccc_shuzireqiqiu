cc.Class({
    extends: cc.Component,

    properties: {
        animalJs:{default:null,visible:false}
        
    },

    onLoad:function(){
        this.animalJs=this.node.getChildByName("animal").getComponent("Animal");
        this.animalJs.node.on("touchBalloon",this.onTouchBalloon,this);
        this.animalJs.goOutside(3);
    },


    start:function(){

    },

    onTouchBalloon:function(numNO){
        cc.log("window click:",numNO);
    },

    onDestroy:function(){
        this.animalJs.node.off("touchBalloon",this.onTouchBalloon,this);
    }

    
    
    
});
