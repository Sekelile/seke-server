const Items = require('./models/Items')

const POST = 'post';
const GET = 'get';
const DELETE = 'delete';
const PUT = 'put';

const pong = (req,res) => {
    res.send('PONG')
}

const routes = [
    {
        path: '/item',
        method: POST,
        handler: Items.create
    },
    {
        path: '/item/:bar_code',
        method: GET,
        handler: Items.getOne
    },
    {
        path:'/item',
        method:PUT,
        handler: Items.buy
    },
    {
        path:'/item',
        method:GET,
        handler: Items.get
    },
    {
      path:'/ping',
      method:GET,
      handler:pong
    }
]

const server = (app,io) => {
    routes.forEach(({method, path, handler}) => {
        app[method](path, handler)
    })

    io.on('connection', async function(socket){
        console.log('a user connected');
        socket.emit('incwancwa','Leshisako')
        let items = await Items.model.find({})
        socket.emit('items',items)
        Items.listener.on("pay",async _=>{
            let items = await Items.model.find({})
            socket.emit('items',items)
        })
        Items.listener.on("created",(document)=>{
            console.log("Item event")
            socket.emit('item',document)
        })
    });
}

exports.server = server
