let http = require('http');
let logger = require('logger');

let server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`handle by child process, pid is: ${process.pid}`);
    throw new Error('throw expection');
});

let worker;
process.on('message', function(m, tcp){
    if(m==='server'){
        worker = tcp;
        worker.on('connection', function(socket){
            server.emit('connection', socket);
        });
    }
});

process.on('uncaughtException', function(err){
    //记录日志
    logger.error(err);
    //发布一个自杀信号
    process.send({act: 'suicide'});
    //停止接收新的连接
    worker.close(function(){
        //所有连接断开后，退出进程
        process.exit(1);
    });
    //如果是长连接，设置一个超时时间，强制退出进程
    setTimeout(function(){
        process.exit(1);
    },5000);
});

