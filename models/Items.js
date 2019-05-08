const {
  mongoose
} = require( './db' );
const bcrypt = require( 'bcryptjs' )
const Schema = mongoose.Schema;
const events = require( 'events' );
const eventEmitter = new events.EventEmitter();
const listener = eventEmitter


var itemSchema = new Schema( {
  name: String,
  price: Number,
  bar_code: String,
  quantity: Number,
  bought: Number
} );

const Item = mongoose.model( 'Item', itemSchema )
const create = async( req, res ) => {
  const {
    name, price, bar_code, quantity
  } = req.body;
  try {
    const existing_item = await Item.findOne( {
      bar_code
    } )
    if ( existing_item ) {
      existing_item.quantity+=quantity
      await existing_item.save()
      return res.send( existing_item )
    }
    const items = await Item.create( {
      name, price, bar_code, quantity
    } )
    eventEmitter.emit( 'created', items )
    res.send( items )
  } catch ( e ) {
    res.status( 400 )
      .send( e.message )
  }
}

const buy = async( req, res ) => {
  const items = req.body;
  const _items = []
  console.log( items )
  for ( let _item of items ) {
    const item = await Item.findOne( {
      bar_code: _item
    } )
    if ( item.quantity > 0 ) {
      item.quantity--;
      if ( item.bought ) {
        item.bought++;
      } else {
        item.bought = 1
      }
      _items.push( item )
      await item.save();
    }
  }
  res.send( _items )
  eventEmitter.emit( "pay" )
}

const remove = async( req, res ) => {
  try {
    const {
      bar_code
    } = req.params
    const result = await Item.remove( {
      bar_code
    } )
    res.send( result )
  } catch ( e ) {
    res.send( e.message )
  }

}


const getOne = async( req, res ) => {
  console.log( req.params )
  try {
    const {
      bar_code
    } = req.params
    const item = await Item.findOne( {
      bar_code
    } )
    if ( item ) {
      console.log( "Item", item )
      res.send( item )
    } else {
      console.log( "No Item" )
      res.status( 404 )
        .send( "Item with bar code not found" )
    }
  } catch ( e ) {
    console.log( e )
    res.status( 500 )
      .send( e.message )
  }
}

const get = async( req, res ) => {
  try {
    const items = await Item.find()
    console.log( items )
    res.send( items )
  } catch ( e ) {
    res.status( 500 )
      .send( e.message )
  }
}

const postSave = async( callback ) => {
  console.log( "Post Save", callback )

  itemSchema.post( 'save', ( doc, next ) => {
    console.log( "Post Save", callback )
  } )
}

itemSchema.pre( 'save', ( doc, next ) => {
  console.log( "Post Save", doc )
  next()
} )

module.exports = {
  create, buy, remove, get, getOne, postSave, listener, model: Item
}
