'use strict'

const mongoose  = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
// count connect
const countConnect = ()=>{
    const numConnections = mongoose.connections.length

    console.log(`Number of connections: ${numConnections}`)
}

// check over load

const checkOverload = ()=>{
    setInterval(()=>{
    const numConnectionS = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number connections based on number osf cores
    const maxConnections = numCores*5
    console.log(`Active connections: ${numConnectionS}`)
    console.log(`Memory usage: ${memoryUsage/1024/1024} MB`)
    if(numConnectionS>maxConnections){
        console.log(`Connections overload detected`)
        // notify.send(...)
    }


    },_SECONDS)//Monior every 5 seconds
}

module.exports={
    checkOverload,
    countConnect
}