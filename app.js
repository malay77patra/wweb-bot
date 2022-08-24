const {MongoClient} = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 8090;
const uri = process.env.MONGO;
const bodyParser = require("body-parser")

const client = new MongoClient(uri);

const db = client.db("wweb");
const collection = db.collection("wweb");
const query = {"name": "qr"};

app.use(bodyParser.json());
/*
app.post('/save', function(req, res) {
  console.log('receiving data ...');

  async function main(){
    try {
      await client.connect();
      await pushData(client);
    }catch (e) {
      console.log(e);
    }finally {
      await client.close();
    }
  }
  main().catch(console.error);

  async function pushData(client) {
    const doc = req.body;
    await collection.insertOne(doc);
  }
  res.json({
    "msg": "received sucvesfully and saved to db"
  });
});*/
app.get('/', function(req, res) {
  console.log("heroku is waking upp...");
  res.send("kya matlab good morning, mai nahi soya hu, hue hue")
});
//
app.listen(port, function(){
  console.log("server is running...."); 
});
