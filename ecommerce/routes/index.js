const { ObjectId } = require('mongodb');
var express = require('express');
var router = express.Router();
const hbs = require("hbs");
const createConnection = require('../db');
const db = createConnection();
const session = require('express-session');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(session({
  secret: '7YFCpy5CTq8i1KvKFPpiZi3zEDB9VP7Gq62CqxaDs+I=',
  resave: false,
  saveUninitialized: true
}));


/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Connect to the database
    const db = await createConnection();

    // Retrieve products from the database
    const collection = db.collection('product');
    const products = await collection.find().toArray();

    // Convert image data to base64 before rendering the view
    const productsWithBase64 = products.map(product => {
      const base64Image = product.image.toString('base64');
      return { ...product, base64Image };
    });

    // Render the 'index' view and pass product details
    res.render('index', { title: 'Express', products: productsWithBase64 });
  } catch (error) {
    console.error('Error in / route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/head', function(req, res, next) {
  res.render('header', { title: 'Express' });
});



router.get('/pay', function(req, res, next) {
  res.render('payment', { title: 'Express' });
});

router.get('/hea', function(req, res, next) {
  res.render('productdetails', { title: 'Express' });
});

router.get('/he', function(req, res, next) {
  res.render('example', { title: 'Express' });
});



router.get('/user', function(req, res, next) {
  res.render('userreg', { title: 'Express' });
});

router.get('/log', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/log1', function(req, res, next) {
  res.render('login1', { title: 'Express' });
});


router.get('/log2', function(req, res, next) {
  res.render('login2', { title: 'Express' });
});

router.get('/pro', function(req, res, next) {
  res.render('product', { title: 'Express' });
});

// router.get('/mee', function(req, res, next) {
//   res.render('merchantreg', { title: 'Express' });
// });

// router.post('/mer', async (req, res)=> {
//   const {name,address,district,aadhar,gender,age,contact,email,password} = req.body;
//   try {
//     // Connect to the database
//     const db = await createConnection();

//     // Your MongoDB logic goes here
//     const myobj={ name:name, address: address,district:district,aadhar:aadhar,gender:gender,age:age,contact:contact,email:email,password };
//     const result= await db.collection("merchant").insertOne(myobj);
//     console.log("Number of Document inserted: " + result.insertedCount);

//     // Render the merchant registration page
//     res.redirect('/');
//   } catch (error) {
//     console.error("Error in /mer route:", error);
//     next(error); // Pass the error to the error handling middleware
//   }
// });

router.post('/us', async (req, res)=> {
  const {name,contact,email,password} = req.body;
  try {
    // Connect to the database
    const db = await createConnection();

    // Your MongoDB logic goes here
    const myobj={ name:name,contact:contact,email:email,password };
    const result= await db.collection("user").insertOne(myobj);
    console.log("Number of Document inserted: " + result.insertedCount);

    // Render the merchant registration page
    res.redirect('/');
  } catch (error) {
    console.error("Error in /mer route:", error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.post('/log123', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Check if the user with the provided credentials exists
    const user = await db.collection('user').findOne({ email, password });

    if (user) {
      // Store user details in the session
      req.session.user = user;

      // Retrieve products from the database
      const collection = db.collection('product');
      const products = await collection.find().toArray();

      // Convert image data to base64 before rendering the view
      const productsWithBase64 = products.map(product => {
        const base64Image = product.image.toString('base64');
        return { ...product, base64Image };
      });

      // Successful login
      res.render('userhome', { title: 'Dashboard', user, products: productsWithBase64 });
    } else {
      // Invalid credentials
      res.render('login', { title: 'Login', error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/userhome', async function(req, res) {
  try {
    // Check if there is an active session
    if (req.session.user) {
      // Session exists, fetch user information
      const user = req.session.user;

      // Connect to the database
      const db = await createConnection();

      // Fetch product details
      const collection = db.collection('product');
      const products = await collection.find().toArray();

      // Convert image data to base64 before rendering the view
      const productsWithBase64 = products.map(product => {
        const base64Image = product.image.toString('base64');
        return { ...product, base64Image };
      });

      // Render the user homepage with user information and products
      res.render('userhome', { title: 'Home', user, products: productsWithBase64 });
    } else {
      // No active session, redirect to login page
      res.render('login', { title: 'Login', error: 'Session expired. Please log in again.' });
    }
  } catch (error) {
    console.error('Error in /userhome route:', error);
    // Handle the error, e.g., redirect to an error page
    res.render('error', { title: 'Error', error: 'Internal Server Error' });
  }
});



router.post('/log124', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Check if the user with the provided credentials exists
    const user = await db.collection('merchant').findOne({ email, password });

    if (user) {
      req.session.user = user;
      const collection = db.collection('product');
      const products = await collection.find().toArray();

      // Convert image data to base64 before rendering the view
      const productsWithBase64 = products.map(product => {
        const base64Image = product.image.toString('base64');
        return { ...product, base64Image };
      });

      // Successful login
      res.render('mechanthome', { title: 'Dashboard',user, products: productsWithBase64});
    } else {
      // Invalid credentials
      res.render('login1', { title: 'Login', error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/merchant1', async function(req, res) {
  try {
    // Check if there is an active session
    if (req.session.user) {
      // Session exists, fetch user information
      const user = req.session.user;

      // Connect to the database
      const db = await createConnection();

      // Fetch product details
      const collection = db.collection('product');
      const products = await collection.find().toArray();

      // Convert image data to base64 before rendering the view
      const productsWithBase64 = products.map(product => {
        const base64Image = product.image.toString('base64');
        return { ...product, base64Image };
      });

      // Render the merchant homepage with user information and products
      res.render('mechanthome', { title: 'Home', user, products: productsWithBase64 });
    } else {
      // No active session, redirect to login page
      res.render('login1', { title: 'Login', error: 'Session expired. Please log in again.' });
    }
  } catch (error) {
    console.error('Error in /merchant1 route:', error);
    // Handle the error, e.g., redirect to an error page
    res.render('error', { title: 'Error', error: 'Internal Server Error' });
  }
});


router.post('/log126', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Check if the user with the provided credentials exists
    const user = await db.collection('admin').findOne({ email, password });

    if (user) {
      req.session.user = user;
      // Successful login
      res.render('admin', { title: 'Dashboard', username: user.username });
    } else {
      // Invalid credentials
      
      res.render('login2', { title: 'Login', error: 'Invalid credentials' ,showAlert: true });
      
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/adminn', function(req, res) {
  // Check if there is an active session
  if (req.session.user) {
    // Session exists, render the homepage with user information
    const username = req.session.user.username;
    res.render('admin', { title: 'Home', username });
  } else {
    // No active session, render the homepage without user information
    res.render('login2', { title: 'Home', username: null });
  }
});


router.get('/logout', function(req, res, next) {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return next(err);
    }
    res.redirect('/');
  });
});


// 
router.get('/merchant/register', function(req, res, next) {
  res.render('merchantreg', { title: 'Merchant Registration' });
});

router.post('/merchant/register', async function(req, res, next) {
  const { name, address, district, aadhar, gender, age, contact, email, password } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Save merchant details to a temporary collection
    await db.collection('pendingMerchants').insertOne({
      name, address, district, aadhar, gender, age, contact, email, password
    });

    res.render('index', { title: 'Merchant Registration Pending' });
  } catch (error) {
    console.error('Error in /merchant/register route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/admin/pendingMerchants', async function(req, res, next) {
  try {
    // Connect to the database
    const db = await createConnection();

    // Retrieve pending merchant registrations
    const pendingMerchants = await db.collection('pendingMerchants').find().toArray();

    res.render('adminPendingMerchants', { title: 'Pending Merchant Registrations', pendingMerchants });
  } catch (error) {
    console.error('Error in /admin/pendingMerchants route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.post('/admin/approveMerchant/:id', async function(req, res, next) {
  const merchantId = req.params.id;

  try {
    // Connect to the database
    const db = await createConnection();

    // Retrieve the merchant details
    const merchant = await db.collection('pendingMerchants').findOne({ _id: new ObjectId(merchantId) });

    if (merchant) {
      // Move the merchant details to the main merchant collection
      await db.collection('merchant').insertOne(merchant);

      // EMAIL SENDING CODE


      // Remove the merchant from the temporary collection
      await db.collection('pendingMerchants').deleteOne({ _id: new ObjectId(merchantId) });

      res.redirect('/admin/pendingMerchants');
    } else {
      res.status(404).send('Merchant not found');
    }
  } catch (error) {
    console.error('Error in /admin/approveMerchant route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.post('/admin/rejectMerchant/:id', async function(req, res, next) {
  const merchantId = req.params.id;

  try {
    // Connect to the database
    const db = await createConnection();

    // Retrieve the merchant details
    const merchant = await db.collection('pendingMerchants').findOne({ _id: new ObjectId(merchantId) });

    if (merchant) {
      // Remove the merchant from the temporary collection
      await db.collection('pendingMerchants').deleteOne({ _id: new ObjectId(merchantId) });

      res.redirect('/admin/pendingMerchants');
    } else {
      res.status(404).send('Merchant not found');
    }
  } catch (error) {
    console.error('Error in /admin/rejectMerchant route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

// 

// 
router.get('/produc/:id', function(req, res, next) {
  mer= req.params.id;

  res.render('product', { title: 'Add Product' ,mer});
});

router.post('/pro1', upload.single('image'), async function(req, res, next) {
  try {
    const db = await createConnection();
    const merchant_id=req.session.user._id;
    const { productName, category, quantity, amount, productDetails,totalAmount } = req.body;
    const image = req.file.buffer;

    const collection = db.collection('product');
    await collection.insertOne({
      merchant_id,
      productName,
      category,
      quantity: parseInt(quantity),
      amount: parseFloat(amount),
      productDetails,
      totalAmount:parseFloat(totalAmount),
      image
    });

    res.redirect(`/produc/${merchant_id}`);
  } catch (error) {
    console.error("Error in /pro1 route:", error);
    res.render('error', { error });
  }
});
// 

router.get('/prod', async function(req, res, next) {
  try {
    const db = await createConnection();

    const collection = db.collection('product');
    const products = await collection.find().toArray();

    // Convert image data to base64 before rendering the view
    const productsWithBase64 = products.map(product => {
      const base64Image = product.image.toString('base64');
      return { ...product, base64Image };
    });

    res.render('products', { title: 'Product List', products: productsWithBase64 });
  } catch (error) {
    console.error("Error in /produc route:", error);
    res.render('error', { error });
  }
});

router.get('/userdet', async function(req, res, next) {
  try {
    // Connect to the database
    const db = await createConnection();

    // Retrieve pending merchant registrations
    const user = await db.collection('user').find().toArray();

    res.render('userdetails', { title: 'Pending Merchant Registrations', user });
  } catch (error) {
    console.error('Error in /admin/pendingMerchants route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/merdtails', async function(req, res, next) {
  try {
    // Connect to the database
    const db = await createConnection();

    // Fetch all documents from the pendingMerchants collection
    const Merchant = await db.collection('merchant').find({}).toArray();

    // Render the data in a table
    res.render('merchantdetail', { title: 'Pending Merchants', merchants:Merchant });
  } catch (error) {
    console.error('Error in /merchant/pending route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});



router.get('/Userprofile/:userId', async function(req, res, next) {
  const userId = req.params.userId;

  try {
    // Connect to the database
    const db = await createConnection();

    // Fetch the user with the specified ID
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });

    // Render the user profile template with the user data
    res.render('userProfile', { title: 'User Profile', user });
  } catch (error) {
    console.error('Error in /Userprofile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});


router.get('/merprofile/:userId', async function(req, res, next) {
  const userId = req.params.userId;

  try {
    // Connect to the database
    const db = await createConnection();

    // Fetch the user with the specified ID
    const user = await db.collection('merchant').findOne({ _id: new ObjectId(userId) });

    // Render the user profile template with the user data
    res.render('merchantpro', { title: 'User Profile', user });
  } catch (error) {
    console.error('Error in /Userprofile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/prolist', async function(req, res, next) {
  try {
    const db = await createConnection();

    const collection = db.collection('product');
    const products = await collection.find().toArray();

    // Convert image data to base64 before rendering the view
    const productsWithBase64 = products.map(product => {
      const base64Image = product.image.toString('base64');
      return { ...product, base64Image };
    });

    res.render('productlist', { title: 'Product List', products: productsWithBase64 });
  } catch (error) {
    console.error("Error in /produc route:", error);
    res.render('error', { error });
  }
});


router.get('/useedit/:id', async function(req, res, next) {
  const userId = req.params.id;

  try {
    // Connect to the database
    const db = await createConnection();

    // Fetch the user with the specified ID
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });

    if (user) {
      res.render('useredit', { title: 'Edit Profile', user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error in /editProfile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

// Handle form submission for updating the user profile
router.post('/editProfile/:id', async function(req, res, next) {
  const userId = req.params.id;
  const { name, contact } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Update the user profile
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, contact } }
    );

    console.log('Number of Document updated: ' + result.modifiedCount);

    // Redirect to the user profile page after updating
    res.redirect(`/userProfile/${userId}`);
  } catch (error) {
    console.error('Error in /editProfile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/merchant/editProfile/:id', async function(req, res, next) {
  const merchantId = req.params.id;

  try {
    // Connect to the database
    const db = await createConnection();

    // Fetch the merchant with the specified ID
    const merchant = await db.collection('merchant').findOne({ _id: new ObjectId(merchantId) });

    if (merchant) {
      res.render('merchantedit', { title: 'Edit Merchant Profile', merchant });
    } else {
      res.status(404).send('Merchant not found');
    }
  } catch (error) {
    console.error('Error in /merchant/editProfile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

// Handle form submission for updating the merchant profile
router.post('/merchants/editProfiles/:id', async function(req, res, next) {
  const merchantId = req.params.id;
  const { name, address, district, aadhar, gender, age, contact } = req.body;

  try {
    // Connect to the database
    const db = await createConnection();

    // Update the merchant profile
    const result = await db.collection('merchant').updateOne(
      { _id: new ObjectId(merchantId) },
      { $set: { name, address, district, aadhar, gender, age, contact } }
    );

    console.log('Number of Document updated: ' + result.modifiedCount);

    // Redirect to the merchant profile page after updating
    res.redirect(`/merprofile/${merchantId}`);
  } catch (error) {
    console.error('Error in /merchant/editProfile route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/orde/:id', async function(req, res, next) {
  const protId = req.params.id;
  
  try {
    // Connect to the database
    const db = await createConnection();

    // Get user_id from the session
    const userId = req.session.user._id;

    // Fetch the product with the specified ID
    const product = await db.collection('product').findOne({ _id: new ObjectId(protId) });

    if (product) {
      res.render('ordered', { title: 'Order Details', product, userId });
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error in /orde/:id route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});



router.post('/ordere', async function(req, res, next) {
  const { producid, userid, merchantid, quantity, totalAmount,name,mobile,email,address } = req.body;

  try {
    // Get the current date
    const currentDate = new Date();
    
    // Connect to the database
    const db = await createConnection();

    // Save order details to the 'orders' collection
    await db.collection('orders').insertOne({
      producid,
      userid,
      merchantid,
      quantity,
      totalAmount,
      name,
      mobile,
      email,
      address,
      orderDate: currentDate
    });

    // Subtract ordered quantity and total amount from the product table
    await db.collection('product').updateOne(
      { _id: new ObjectId(producid) },
      { 
        $inc: {
          quantity: -quantity, // Decrement the 'quantity' field by the ordered quantity
          totalAmount: -parseFloat(totalAmount) // Convert 'totalAmount' to a float and decrement by the ordered total amount
        }
      }
    );

    res.render('payment', { title: 'Order Successful' });
  } catch (error) {
    console.error('Error in /ordere route:', error);
    next(error); // Pass the error to the error handling middleware
  }
});


module.exports = router;
