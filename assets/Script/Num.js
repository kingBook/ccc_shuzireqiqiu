cc.Class({
    extends: cc.Component,

    properties: {
        animState:{default:null, visible:false}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       var anim=this.getComponent(cc.Animation);
       
       this.animState=anim.play();
       this.animState.speed=0;
       this.gotoNum(10);
    },
    
     update (dt) {
         
     },
     
     gotoNum(num){
         this.animState.time=num;
         cc.log(this.animState.time);
     }
});
