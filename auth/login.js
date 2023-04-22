// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// var validator = require("email-validator");
// dotenv = require("dotenv").config();

// const User = require("../models/User");

// // make a api for login user
// const LoginUser = async (req, res) => {
//     // read the username, password from the request body give code
//     const { email, password } = req.body;
  
//     // check whether all the fields are filled or not
//     if (!email || !password) {
//       return res.status(400).send({
//         error: "Please fill all the fields.",
//       });
//     }
  
//     // check whether is existed or not
//     try {
//       const existingUserEmail = await User.findOne({ email });
//       if (!existingUserEmail) {
//         return res.status(409).send({
//           error: "Invalid credentials in email.",
//         });
//       }
  
//       // check whether the password is correct or not
//       const isPasswordCorrect = await bcrypt.compare(
//         password,
//         existingUserEmail.password
//       );
//       if (!isPasswordCorrect) {
//         return res.status(400).send({
//           error: "Invalid credentials in password.",
//         });
//       }
  
//       // Generate a JWT token for the user
//       const token = jwt.sign(
//         { userId: existingUserEmail._id },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRY }
//       );
  
//       existingUserEmail.password = undefined;
//       res.status(200).send({
//           "message":"User logged in successfully.",
//           "user": existingUserEmail,
//           "token": token,
//       });
//       } catch(err){
//           console.log(err);
//           res.status(500).send({
//               "message":"Server error! Try again later.",
//               "error": err
//           });
//       };
//   }


// // make api for user logout
// const LogoutUser = async (req, res) => {
//     // expire the jwt token for the user
//     try{
//         res.clearCookie("jwt");
//         await req.user.save();
//         res.status(200).send({
//             "message":"User logged out successfully.",
//         });
//     } catch(err){
//         console.log(err);
//         res.status(500).send({
//             "message":"Server error! Try again later.",
//             "error": err
//         });
//     }
// }
 

  

// module.exports = {
//     LoginUser,
//     LogoutUser
// }