const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

/**
user=carManager
pass=dMmx74YFO7Dp3vwf
 
https://i.ibb.co/rFq6rk8/BMW.jpg
https://i.ibb.co/pRHRc5q/Chevrolet.jpg
https://i.ibb.co/zbC2XXW/Ford.jpg
https://i.ibb.co/C065xTF/Honda.jpg
https://i.ibb.co/SNsdJRM/Porsche.jpg
https://i.ibb.co/BC6c9Rj/Toyota.jpg
 */

//middle wire
const cors = require("cors");
app.use(cors());
app.use(express.json());

//jwt token verify
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    console.log("decoded", decoded);
    req.decoded = decoded;
    next();
  });
}

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

    //-------------CRUD operation--------------//
    //load all products
    app.get("/products", async (req, res) => {
      const query = req.query;
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //load single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    // POST
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    //delete product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    //get single user item
    app.get("/products", verifyJWT, async (req, res) => {
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = { email: email };
        const product = productCollection.find(query);
        const result = await product.toArray();
        res.send(result);
      } else {
        res.status(403).send({ message: "forbidden access" });
      }
    });
    //create jwt
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });
    //update
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const product = await productCollection.findOne(filter);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity:
            parseInt(updatedQuantity.quantity) + parseInt(product.quantity),
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const product = await productCollection.findOne(filter);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: parseInt(product.quantity) - 1,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
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
