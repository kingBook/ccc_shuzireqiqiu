cc.Class({
    extends: cc.Component,

    properties: {
        animalJs:{default:null,visible:false},//animal字节点挂的脚本Animal.js
        mainJs:{default:null,visible:false}
    },

    onLoad:function(){
        this.animalJs=this.node.getChildByName("animal").getComponent("Animal");
        this.animalJs.node.on("touchBalloon",this.onTouchBalloon,this);
        //this.animalJs.goOutside(3);//test

        this.mainJs=cc.find("Main").getComponent("Main");
    },

    start:function(){

    },

    rightNowHideAnimal:function(){
        this.animalJs.rightNowHide();
    },

    /**点击气球*/
    onTouchBalloon:function(numNO){
        cc.log("window click:",numNO);
        if(numNO==this.mainJs.needFindNumber){
            this.animalJs.playExplosionAnim();
        }else{
            this.animalJs.playExplosionAnim();//test
        }
    },

    /**伸出去*/
    goOutside:function(numNO){
        this.animalJs.goOutside(numNO);
    },

    /**缩回来*/
    comeback:function(){
        this.animalJs.comeback();
    },

    /**是否伸出*/
    getIsOut:function(){
         return this.animalJs.isOut;
    },

    getIsBackOrOuting:function(){
        return this.animalJs.isBackOrOuting;
    },

    /**窗口显示的数字*/
    getNumNO:function(){
       return this.animalJs.numNO;
    },

    onDestroy:function(){
        this.animalJs.node.off("touchBalloon",this.onTouchBalloon,this);
    }




    
    
});
