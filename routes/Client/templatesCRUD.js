
const express = require("express");
const router = express()
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const Token = require("../../models/Clients/clientToken")
const sendEmail = require("../VerifyEmail")
const crypto = require("crypto")

const Login = require('../../models/Clients/TEMP/login');
const Register = require('../../models/Clients/TEMP/register');
const ResetPassword = require('../../models/Clients/TEMP/resetpassword');
const XHomePage = require('../../models/Clients/TEMP/homepage');
const XProductPage = require('../../models/Clients/TEMP/product');
const XProductsPage = require('../../models/Clients/TEMP/products');
const OrderTracking = require('../../models/Clients/TEMP/orderTracking');
const Orders = require('../../models/Clients/TEMP/order');
const PrivacyPolicy = require('../../models/Clients/TEMP/privacyPolicy');
const RefundsPolicy = require('../../models/Clients/TEMP/refundPolicy');
const Refunds = require('../../models/Clients/TEMP/refund');
const Profile = require('../../models/Clients/TEMP/profile');
const Careers = require('../../models/Clients/TEMP/careers');
const XErrors = require('../../models/Clients/TEMP/errors');
const Search = require('../../models/Clients/TEMP/search');


const defaultsTemplate = 'eyJST09UIjp7InR5cGXECHJlc29sdmVkTmFtZSI6IkNvbnRhaW5lcjIifSwiaXNDYW52YXMiOmZhbHNlLCJwcm9wc8Q3YmFja2dyb3VuZCI6IiNlxQEiLCJwYWRkaW5nIjo1MH0sImRpc3BsYXnSWywiY3VzdG9tIjp7fSwiaGlkZGVuyWRub2RlcyI6W10sImxpbmtlZE7GEXsidGV4dCI6ImRCcG5rWUF1dVcifcRmyg//ANjEfUJvdHRvbe8A3nRydesA3foAusg97gDAcGFyZW7kAJnlAVz5ANAiaXprVkl2aEpVZiLxANzkAMnLIPoAyVTkAQT9AZvnASZZb3UgY2FuIGVkaXQgdGhpcyZuYnNwOyIsImZvbnRTaXplIjoxNfEA7MVg9wDg6wFq/wG27QDafQ=='

const Client = require("../../models/Clients/clients");

//client registration with email verification, default templates
router.post("/clients", async (req, res) => {
  try {
    const newUser = new Client({
      companyName: req.body.companyName,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
      isAdmin:req.body.isAdmin,
    });
  
    
      const savedUser = await newUser.save();
  
      const token = await new Token({
        userId: savedUser._id,
        token:crypto.randomBytes(32).toString("hex")
      }).save();

      const url = `${process.env.BASE_URL}api/auth/${savedUser._id}/verify/${token.token}`
      await sendEmail(savedUser.email, "verify email", url);

      //creating default pages
      const pageSchemas = [
        {
          schema: Login,
          title: "Login Page",
          template: defaultsTemplate
        },
        {
          schema: Register,
          title: "Register Page",
          template: defaultsTemplate
        },
        {
          schema: ResetPassword,
          title: "Reset Password Page",
          template: defaultsTemplate
        },
        {
          schema: XHomePage,
          title: "Home Page",
          template: defaultsTemplate
        },
        {
          schema: XProductPage,
          title: "Product Page",
          template: defaultsTemplate
        },
        {
          schema: XProductsPage,
          title: "Products Page",
          template: defaultsTemplate
        },
        {
          schema: Orders,
          title: "Orders Page",
          template: defaultsTemplate
        },
        {
          schema: OrderTracking,
          title: "Order Tracking Page",
          template: defaultsTemplate
        },
        {
          schema: PrivacyPolicy,
          title: "Privacy Policy Page",
          template: defaultsTemplate
        },
        {
          schema: RefundsPolicy,
          title: "Refunds Policy Page",
          template: defaultsTemplate
        },
        {
          schema: Refunds,
          title: "Refunds Page",
          template: defaultsTemplate
        },
        {
          schema: Profile,
          title: "Profile Page",
          template: defaultsTemplate
        },
        {
          schema: Careers,
          title: "Careers Page",
          template: defaultsTemplate
        },
        {
          schema: XErrors,
          title: "404 Page",
          template: defaultsTemplate
        },
        {
          schema: Search,
          title: "Search Page",
          template: defaultsTemplate
        }
      ];
  
      for (const pageSchema of pageSchemas) {
        const page = await new pageSchema.schema({
          title: pageSchema.title,
          template: pageSchema.template,
          author: newUser._id
        });
        page.save();
      }

      res.status(201).send( {message: "an email has been sent to you, please verify"})


    } catch (err) {
      console.log("error occured!!!")
      res.status(500).json(err);
      console.log(err)
    }

   

    
  // } catch (err) {
  //   res.status(400).send(err);
  // }
});
router.post("/updateStats", async (req, res) => {


  try {

    const user = await Client.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Wrong credentials!" });
    }
    let token = await Token.findOne({ userId: user._id });

    
    const login = await Login.find({ author: user._id }).lean();
    const register = await Register.find({ author: user._id }).lean();
    const resetPassword = await ResetPassword.find({ author: user._id }).lean();
    const home = await XHomePage.find({ author: user._id }).lean();
    const product = await XProductPage.find({ author: user._id }).lean();
    const products = await XProductsPage.find({ author: user._id }).lean();
    const orderTracking = await OrderTracking.find({ author: user._id }).lean();
    const orders = await Orders.find({ author: user._id }).lean();
    const privacyPolicy = await PrivacyPolicy.find({ author: user._id }).lean();
    const refundsPolicy = await RefundsPolicy.find({ author: user._id }).lean();
    const refunds = await Refunds.find({ author: user._id }).lean();
    const profile = await Profile.find({ author: user._id }).lean();
    const careers = await Careers.find({ author: user._id }).lean();
    const errors = await XErrors.find({ author: user._id }).lean();
    const search = await Search.find({ author: user._id }).lean();

    const { ...others } = user._doc;

    res.status(200).json({ ...others, token,templates:[login,register,resetPassword, home, product, products, orderTracking, orders, privacyPolicy, refundsPolicy, refunds, profile, careers, errors, search] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    
  }


})

// client login
router.post("/login", async (req, res) => {
  try {
    const user = await Client.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Wrong credentials!" });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json({ message: "Wrong credentials!" });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }

      const url = `${process.env.BASE_URL}api/auth/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "verify email", url);
      
      return res.status(401).json({
        message:
          "Your email address is not verified. Please check your email and verify your account.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const login = await Login.find({ author: user._id }).lean();
    const register = await Register.find({ author: user._id }).lean();
    const resetPassword = await ResetPassword.find({ author: user._id }).lean();
    const home = await XHomePage.find({ author: user._id }).lean();
    const product = await XProductPage.find({ author: user._id }).lean();
    const products = await XProductsPage.find({ author: user._id }).lean();
    const orderTracking = await OrderTracking.find({ author: user._id }).lean();
    const orders = await Orders.find({ author: user._id }).lean();
    const privacyPolicy = await PrivacyPolicy.find({ author: user._id }).lean();
    const refundsPolicy = await RefundsPolicy.find({ author: user._id }).lean();
    const refunds = await Refunds.find({ author: user._id }).lean();
    const profile = await Profile.find({ author: user._id }).lean();
    const careers = await Careers.find({ author: user._id }).lean();
    const errors = await XErrors.find({ author: user._id }).lean();
    const search = await Search.find({ author: user._id }).lean();


    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token, templates:[login,register,resetPassword, home, product, products, orderTracking, orders, privacyPolicy, refundsPolicy, refunds, profile, careers, errors, search] });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find({});
    res.send(clients);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a client by ID
router.get("/clients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (err) {
    res.status(500).send(err);
  }
});





// Update a client by ID
router.patch("/clients/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id is:", id)
  console.log('req.body is:', req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = [    "companyName",    "email",    "password",    "img",    "templateExample",  ];
  const isValidUpdate = updates.every((update) =>


    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const client = await Client.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!client) {
      return res.status(404).send({ error: "no person of this ID" });
    }
    res.send(client);
    console.log("client is: ", client)
  } catch (err) {
    res.status(400).send(err);
  }
});




// Delete a client by ID
router.delete("/clients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (err) {
    res.status(500).send(err);
  }
});



module.exports = router;

