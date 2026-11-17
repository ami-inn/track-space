we using spacetime for this project.

what it do is help us track time and dates accurately across different time zones. database, websocket layer and server together can use spacetime to ensure consistent time handling.


spacetime is a a database and server rolled in to one.
how it works is that it keeps track of the current time and date, and automatically adjusts for different time zones. this way, all parts of the system can rely on a single source of truth for time.

tables: wher our data lives
reducers: the only way to change data in the tables, functions inside the database
subscriptions: how everyone finds out, our apps subscribe to changes in the tables.when any row in a table changes, all subscribed apps get notified automatically.

where does this actually run?
it runs wherever your database and server are running. since spacetime handles both, it can be deployed on your server infrastructure, and your apps will connect to it to get consistent time and data updates.



to initialize the project  spacetime init find-my-friends --template nextjs-ts --local

✓ Created ./find-my-friends/spacetime.local.json

Next steps:
  cd ./find-my-friends
  npm install
  spacetime publish --module-path spacetimedb --server local find-my-friends-q4fsb
  spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb
  npm run dev
