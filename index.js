const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//user=carManager
//pass=dMmx74YFO7Dp3vwf

//middle wire
/**
 * https://i.ibb.co/rFq6rk8/BMW.jpg
https://i.ibb.co/pRHRc5q/Chevrolet.jpg
https://i.ibb.co/zbC2XXW/Ford.jpg
https://i.ibb.co/C065xTF/Honda.jpg
https://i.ibb.co/SNsdJRM/Porsche.jpg
https://i.ibb.co/BC6c9Rj/Toyota.jpg
 */
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ded74.mongodb.net/carManager?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("carManager").collection("inventory");
    console.log("connected to db");
    //crud codes
    app.get("/products", async (req, res) => {
      const query = req.query;
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

//root api
app.get("/", (req, res) => {
  res.send("running");
});
app.listen(port, () => {
  console.log("Listening to port");
});
