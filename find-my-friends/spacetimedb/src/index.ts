import { schema, table, t } from 'spacetimedb/server';


// define user table

const user = table(
  {name:'user',public: true},
  {
    identity: t.identity().primaryKey(),
    name: t.string(),
    lat: t.f64(),
    lng: t.f64(),
    online: t.bool()
  }
)

const spacetimedb = schema({
  user
});
export default spacetimedb;


export const onConnect = spacetimedb.clientConnected(_ctx => {
  const me =  _ctx.db.user.identity.find(_ctx.sender);
  if(me) {
    _ctx.db.user.identity.update({...me, online: true})
  }else{
    _ctx.db.user.insert({ identity: _ctx.sender, online: true, lat: 51.505, lng: -0.09, name: '' })
  }
});

export const onDisconnect = spacetimedb.clientDisconnected(_ctx => {
  const me =  _ctx.db.user.identity.find(_ctx.sender);
  if(me) {
    _ctx.db.user.identity.update({...me, online: false})
  }
});


export const setName = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    const me = ctx.db.user.identity.find(ctx.sender);
    if(me) {
      ctx.db.user.identity.update({ ...me, name });
    }
  }
);

export const updateLocation = spacetimedb.reducer(
  { lat: t.f64(), lng: t.f64() },
  (ctx, { lat, lng }) => {
    const me = ctx.db.user.identity.find(ctx.sender);
    if(me) {
      ctx.db.user.identity.update({ ...me, lat, lng });
    }
  }
);

