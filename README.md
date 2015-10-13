# couchdb-graphql-demo

This repo contains an example of using GraphQL with CouchDB, for the purposes of testing next generation data fetching within our apps, especially ESDB.

## Database setup

1. Install CouchDB. It is a simple install for the mac. Once installed start it up.
2. Start Futon, the GUI front end of CouchDB. This is done by navigating to: http://127.0.0.1:5984/_utils/index.html
3. Make an "esdb" database within Futon
4. Install babel-node `npm install --global babel`
5. Run the input script to import some contacts from ESDB into CouchDB `babel-bode import.js`. Check the data in Futon to see if it imported correctly.
6. Upload our database views: `curl -X PUT http://127.0.0.1:5984/esdb/_design/esdb  --data-binary @couchdb/design.json`
NOTE: If you want to update the views, you will need to add a `_rev` property to the couchdb/design.json file to specify the current version. You can find the current version in Futon.

## Running the GraphQL server

Now that the database is setup, run the GraphQL server by running:

```
babel-node index.js
```

Then navigate to the GraphiQL web client at:
http://localhost:8080/graphql

## Example query

```
query ESDB {
  contact(id: "contact-982") {
    id
    first_name
    last_name
    location {
      short_name
      full_name
    }
  }
}
```

