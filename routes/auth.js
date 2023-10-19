const router = require("express").Router();
const UserMVELI = require("../models/user-model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const Token = require("../models/token-model")
const sendEmail = require("./VerifyEmail")
const crypto = require("crypto")

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new UserMVELI({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    isAdmin:req.body.isAdmin,
  });

  try {
    const savedUser = await newUser.save();

    const token = await new Token({
      userId: savedUser._id,
      token:crypto.randomBytes(32).toString("hex")
    }).save();

    const url = `${process.env.BASE_URL}api/auth/${savedUser._id}/verify/${token.token}`
    await sendEmail(savedUser.email, "verify email", `here is the link to activate your account: ${url}`);
    res.status(201).send({message: "an email has been sent to you, check your email to verify"})
  } catch (err) {
    console.log("error occured!!!")
    res.status(500).json(err);
    console.log(err)
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await UserMVELI.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    if(!user.verified){
      let token = await Token.findOne({userId: user._id})
      if (!token.verified){
        token = await new Token({
          userId: user._id,
          token:crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}api/auth/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "verify email", url);

      }
    }
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!"); 

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );

    const { password, ...others } = user._doc;

    res.status(200).json({...others, token});
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});


//VERIFY USER
router.get("/:id/verify/:token", async(req, res)=>{
  try {
    const user = UserMVELI.findOne({
      _id:req.params.id
    });
    if(!user)return res.status(400).send({message:'invalid Link'});

    const token = Token.findOne({
      userId:user._id,
      token:req.params.token
    });
    if(!token)return res.status(400).send({message:'invalid Token'});

    //update user and the token
    await user.updateOne({
      _id:user._id,
      verified:true
    });
    res.status(200).send({message:"you have been successfully verified on auth"})
    await token.deleteOne(); 

  } catch (error) {
    res.status(500).send({message: error})
    
  }
});



//updating the page template
router.get("/:id", async(req, res)=>{
  try {
    const user = UserMVELI.findOne({
      _id:req.params.id
    });
    if(!user)return res.status(400).send({message:'invalid Link'});

    const token = Token.findOne({
      userId:user._id,
      token:req.params.token
    });
    if(!token)return res.status(400).send({message:'invalid Token'});

    //update template
    await user.updateOne({
      _id:user._id,
      verified:true
    });
    res.status(200).send({message:"you have been successfully verified on auth"})
    await token.deleteOne(); 

  } catch (error) {
    res.status(500).send({message: error})
    
  }
});





module.exports = router;
