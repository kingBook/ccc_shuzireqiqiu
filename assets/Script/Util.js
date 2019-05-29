module.exports.getRandomInt0To10List=function(){
    var list=[0,1,2,3,4,5,6,7,8,9,10];
    var randomList=[];
    for(var i=0;i<=10;i++){
        var ranId=(Math.random()*list.length)|0;
        randomList[i]=list[ranId];
        list.splice(ranId,1);
    }
    return randomList;
};
module.exports.getRandomIdList=function(startId,endId){
    var list=[];
    for(var i=startId;i<=endId;i++)list[i]=i;

    var randomList=[];
    const len=list.length;
    for(i=0;i<=len;i++){
        var ranId=(Math.random()*list.length)|0;
        randomList[i]=list[ranId];
        list.splice(ranId,1);
    }
    return randomList;
};