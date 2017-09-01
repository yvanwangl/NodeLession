let fork = require('child_process').fork;
let cpus = require('os').cpus();
let logger = require('logger');

let server = require('net').createServer();
server.listen(1337);

/**
 * 监测进程重启是否太过频繁
 */
let limit = 10;
let during = 6000;
let restart = [];
let isTooFrequently = function(){
    let time = Date.now();
    let length = restart.push(time);
    if(length>=limit){
        restart = restart.splice(limit*-1);
    }
    return restart.length>=limit && restart[restart.length-1]-restart[0]<during;
};

let workers = {};
let createWorker = function(){
    //判断是否频繁重启进程
    if(isTooFrequently()){
        //记录日志
        logger.error('giveup');
        process.emit('giveup', limit, during);
        return ;
    }
    let worker = fork(`${__dirname}/worker.js`);
    let pid = worker.pid;
    worker.on('message', function(message){
        if(message.act=='suicide'){
            createWorker();
        }
    });
    //监听子进程，如果退出就启动新的进程
    worker.on('exit', function(){
        console.log(`child process: ${pid} exit`);
        delete workers[pid];
    });
    //向子进程传递句柄
    worker.send('server', server);
    workers[pid] = worker;
    console.log(`fork child process: ${pid}`);
};


//启动子进程
cpus.map(cpu=> createWorker());

//如果主进程退出，通知子进程退出
process.on('exit', function(){
    Object.keys(workers).map(pid=> workers[pid].kill());
});