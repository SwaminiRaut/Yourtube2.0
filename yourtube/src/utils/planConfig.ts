const plans={
    free:{
        maxWatchTime: 5,
        price:0,
        watchTimeInfo:"Watch up to 5 minutes per video",
    },
    bronze:{
        maxWatchTime:7,
        price:10,
        watchTimeInfo:"Watch up to 7 minutes per video",
    },
    silver:{
        maxWatchTime:10,
        price:50,
        watchTimeInfo:"Watch up to 10 minutes per video",
    },
    gold:{
        maxWatchTime:null,
        price:100,
        watchTimeInfo:"Unlimited watch time",
    }
};
export default plans;