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


const server = (app) => {
    routes.forEach(({method, path, handler}) => {
        app[method](path, handler)
    })
}

exports.server = server
