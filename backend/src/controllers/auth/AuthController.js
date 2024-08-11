const { PrismaClient } = require("@prisma/client");
const jwtLib = require("../../utils/jwtUtil");
const bcrypt = require("bcrypt");
const { verify } = require("jsonwebtoken");

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).send({ message: "Username and password required" });
  }
  const foundUser = await prisma.user.findFirst({ where: { username: username} });
  if(!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).send({ message: "Username or password incorrect" });
  }
  return res.status(200).send({ token: jwtLib.generateToken(foundUser.id), message: "Login successful" });
}


// const profile = async (req, res) => {
//   const token = req.body;
//   return res.status(200).send({data: verify(String(token))})
  // console.log(verify(String(token)));
  // const foundUser = await prisma.user.findUnique({ where: { id: loginId }});
  // const { password: _, ...noPassUserData } = foundUser;
  // return res.status(200).send({ result: noPassUserData, message: "found user" });  
// }

module.exports = {
  login
  // profile
};