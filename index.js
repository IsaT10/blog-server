const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//blogDb  g5ozt8dTGWj31h76

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfd97zi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const blogsCollection = client.db('blogDB').collection('blogs');
const wishlistCollection = client.db('blogDB').collection('wishlist');
const commentCollection = client.db('blogDB').collection('comment');

async function run() {
  try {
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('blog server is running');
});

// get all blogs

app.get('/api/blogs', async (req, res) => {
  const result = await blogsCollection.find().toArray();
  res.send(result);
});

// get specific category blog

app.get('/api/blogs/category/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  const query = { category: categoryName };
  const result = await blogsCollection.find(query).toArray();
  res.send(result);
});

// get specific blog

app.get('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const result = await blogsCollection.findOne(query);
  res.send(result);
});

//post blog

app.post('/api/blogs', async (req, res) => {
  const data = req.body;
  const result = await blogsCollection.insertOne(data);
  res.send(result);
});

//update blog

app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateBlog = req.body;
  const blog = {
    $set: {
      title: updateBlog.title,
      short_description: updateBlog.short_description,
      long_description: updateBlog.long_description,
      category: updateBlog.category,
      date: updateBlog.date,
      image: updateBlog.image,
    },
  };
  console.log(updateBlog);
  const result = await blogsCollection.updateOne(query, blog, options);
  res.send(result);
});

// get wishlist by user email

app.get('/api/blog/wishlist', async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = {
      email,
    };
  }
  const result = await wishlistCollection.find(query).toArray();
  res.send(result);
});

// get all wishlist

app.get('/api/blog/wishlists', async (req, res) => {
  const result = await wishlistCollection.find().toArray();
  res.send(result);
});

// delete wishlist

app.delete('/api/blog/wishlists/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const result = await wishlistCollection.deleteOne(query);
  res.send(result);
});

// post wishlist

app.post('/api/blog/wishlist', async (req, res) => {
  const data = req.body;
  const result = await wishlistCollection.insertOne(data);
  res.send(result);
});

//get comment data

app.get('/api/blog/comment', async (req, res) => {
  const result = await commentCollection.find().toArray();
  res.send(result);
});

app.get('/api/blog/comment/:blogId', async (req, res) => {
  const { blogId } = req.params;
  const query = { blogId: blogId };
  const result = await commentCollection.find(query).toArray();
  res.send(result);
});

//post comment

app.post('/api/blog/comment', async (req, res) => {
  const data = req.body;
  const result = await commentCollection.insertOne(data);
  res.send(result);
});

app.listen(port, () => {
  console.log(`blog server is running :${port}`);
});
