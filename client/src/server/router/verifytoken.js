const jwt = require("jsonwebtoken"); //for token
const JWTSEC =
  "f943796f0a956ffde6e21dad239122a0d89be4ce5ad5a35105e5589a312bb718eeb2cdea0d5701ba61ceca514556ca04266bb731a9e474ba5b749e981415e4db";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader;
    jwt.verify(token, JWTSEC, (err, user) => {
      if (err) return res.status(400).json("Some error occured.");
      req.user = user;
      next();
    });
  } else {
    return res.status(400).json("Access token is not valid.");
  }
};

module.exports = { verifyToken };
