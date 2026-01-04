const app = require("./src/app");

const PORT = process.env.PORT || 3058
const server = app.listen(PORT, ()=>{
    console.log(`WSV wellome with port ${PORT}`)
})

process.on('SIGINT', ()=>{
    server.close(()=>console.log('Exit server Express'))
    // Thông báo khi server bị crack
})