const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
// app.use(
//   cors({
//     origin: ['http://localhost:5173'],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());

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

// const logger = (req, res, next) => {
//   //   console.log('log info', req.method, req.url);
//   next();
// };

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log('in middleware', token);

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized user' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized user' });
    }
    req.user = decoded;

    next();
  });
};

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;

//   //   console.log('tokennnn', token);

//   if (!token) {
//     return res.send({ message: 'You are not authorized' });
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//     if (err) {
//       return res.send({ message: 'You are not authorized' });
//     }

//     req.user = decoded;
//     console.log(decoded);

//     next();
//   });
// };

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

app.patch('/api/blog', async (req, res) => {
  try {
    const { id } = req.query;
    const { rating, reviewedPeople } = req.body;
    console.log(id, rating);
    console.log(reviewedPeople);
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        rating,
        reviewedPeople: reviewedPeople,
      },
    };

    const result = await blogsCollection.updateOne(query, updateDoc);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
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
  // console.log(updateBlog);
  const result = await blogsCollection.updateOne(query, blog, options);
  res.send(result);
});

// get wishlist by user email

app.get('/api/blog/wishlist', async (req, res) => {
  const userEmail = req.query?.email;
  // console.log(userEmail);
  //   console.log('cock', req.cookies);
  //   console.log('owner', req.user);

  //   if (req.user.email !== userEmail) {
  //     return res.status(403).send({ message: 'forbedden user' });
  //   }
  //   //   const tokenEmail = req.user.email;
  //   console.log(userEmail);
  //   console.log(tokenEmail);

  //   if (userEmail !== tokenEmail) {
  //     return res.status(403).send({ message: 'forbiddeen access' });
  //   }
  let query = {};
  if (userEmail) {
    query = {
      email: userEmail,
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
  console.log(data);
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

// app.post('/api/auth/acess-token', async (req, res) => {
//   const user = req.body;
//   console.log(user);

//   const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });

//   console.log(token);
//   res
//     .cookie('token', token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//     })
//     .send({ success: true });
//   //   res
//   //     .cookie('token', token, {
//   //       httpOnly: true,
//   //       secure: true,
//   //       sameSite: 'none',
//   //     })
//   //     .send({ success: true });
// });

app.post('/api/auth/logout', async (req, res) => {
  const email = req.body;
  console.log(email);

  res.clearCookie('token', { maxAge: 0 }).send({ suceeess: true });
});

app.listen(port, () => {
  console.log(`blog server is running :${port}`);
});
