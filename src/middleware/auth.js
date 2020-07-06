const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // TODO: Fetch token form user header and Payload/data for verification
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Payload", decodedPayload); //   { _id: '5ef7573d9f739d1859a6a760', iat: 1593455149 }
    // console.log("token-->", token);

    // TODO: Finding user by the payload_id and token of particular user
    const user = await User.findOne({
      _id: decodedPayload._id,
      //FIXME:
      "tokenSet.token": token,
    });
    // TODO: Checking user exists ?
    if (!user) {
      throw new TypeError("user does not Exists");
    }

    req.authToken = token;
    //  TODO: Giving route handler access to user db + Sending authenticated user back to router
    req.authUser = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
