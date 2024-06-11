require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const data = require("../data.json");
const bcrypt = require('bcrypt');

const moment = require('moment');
const currentDate = moment().format('yyyy-MM-DD hh:mm:ss');

app.use(express.static("public"));
app.use(express.json());

app.get("/", (_req, res) => {
  const imageUrl = `/assets/images/download.webp`;

  const htmlResponse = `
    <h1>Hello World!</h1>
    <img src="${imageUrl}" alt="Your Image">
  `;

  res.send(htmlResponse);
});

// Get all User with pagination
app.get("/users", (req, res) => {
const users = data["users"];
  let { pageSize, page } = req.query;
  pageSize = pageSize !== undefined ? parseInt(pageSize): 10;
  page = page !== undefined ? parseInt(page): 1;
  const filteredUser = [];
  for(let i=page; i<(page+pageSize) && i<users.length; i++){
    filteredUser.push(users[i]);
  }
  const totalPage = Math.ceil(users.length/pageSize);
  res.json({
    totalRecords: data.users.length,
    pageSize,
    page,
    totalPage,
    nextPage: page < totalPage,
    users:filteredUser,
  });
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = data.users.find((user) => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  let {username, password, is_admin,role_id, firstname, lastname, email} = req.body;
  let users = data["users"];
  let user_details = data["user_details"];
  let userId = users.length + 1;
  is_admin = is_admin === undefined ? false: true;
  role_id = role_id === undefined ? 2: 1;
  password = password.toString();
  function filterExistUser(arr, query) {
    if(username !== undefined){
      return arr.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
    }
  }
  function filterExistUserDetails(arr, query) {
    if(email !== undefined){
      return arr.filter((user_detail) => user_detail.email.toLowerCase().includes(query.toLowerCase()));
    }
  }
  if (username === undefined) {
    res.status(404).json({ error: "Username required!" });
  }else if (password === undefined) {
    res.status(404).json({ error: "Password required!" });
  }else if (firstname === undefined) {
    res.status(404).json({ error: "Firstname required!" });
  }else if (lastname === undefined) {
    res.status(404).json({ error: "Lastname required!" });
  }else if (email === undefined) {
    res.status(404).json({ error: "Email required!" });
  }else if (username !== undefined && filterExistUser(users, username).length !== 0) {
    res.status(404).json({ error: "Username already existed!" });
  }else if (email !== undefined && filterExistUserDetails(user_details, email).length !== 0) {
    res.status(404).json({ error: "User email already existed!" });
  } else {
    const newUser = { 
      id: userId,
      username: username.toLocaleLowerCase(), 
      password: await hashPassword(password),
      is_admin,
      role_id,
    };
    users.push(newUser);
    let userDetail = {
      id: user_details.length + 1,
      firstname,
      lastname,
      email:email.toLocaleLowerCase(),
      user_id: userId,
      created_at: currentDate,
      updated_at: currentDate,
    }
    user_details.push(userDetail);
    res.status(201).json({users:newUser, user_details:userDetail});
  }
});
// Search User
app.get("/search/users" , (req, res) =>{
  const username = req.query.username;
  const users = data["users"];
  let {pageSize, page} = req.query;
  pageSize = 10;
  page = 1;
  // filter users function
  function filterUsers(arr, query) {
    return arr.filter((el) => el.username.toLowerCase().includes(query.toLowerCase()));
  }
  // filter users with pagination
  let filterUsersData = filterUsers(users,username);
  let totalPage = Math.ceil(filterUsersData.length/pageSize);
  if (filterUsersData.length !== 0) {
    res.json({
      totalRecords: filterUsersData.length,
      pageSize,
      page,
      totalPage,
      nextPage: page < totalPage,
      users:filterUsersData,
    });
  } else {
    res.status(404).json({ error: "User not found!" });
  }
})
// Hash user password
async function hashPassword (password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })
  return hashedPassword
}
// User Register
app.post('/register', async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  let users = data["users"];
  let user_details = data["user_details"];
  let userId = users.length + 1;
  function filterExistUser(arr, query) {
    if(username !== undefined){
      return arr.filter((el) => el.username.toLowerCase().includes(query.toLowerCase()));
    }
  }
  function filterExistUserDetails(arr, query) {
    if(email !== undefined){
      return arr.filter((el) => el.email.toLowerCase().includes(query.toLowerCase()));
    }
  }
  if (username === undefined) {
    res.status(404).json({ error: "Username required!" });
  }else if (password === undefined) {
    res.status(404).json({ error: "Password required!" });
  }else if (firstname === undefined) {
    res.status(404).json({ error: "Firstname required!" });
  }else if (lastname === undefined) {
    res.status(404).json({ error: "Lastname required!" });
  }else if (email === undefined) {
    res.status(404).json({ error: "Email required!" });
  }else if (username !== undefined && filterExistUser(users,username).length !== 0) {
    res.status(404).json({ error: "Username already existed!" });
  }else if (email !== undefined && filterExistUserDetails(user_details, email).length !== 0) {
    res.status(404).json({ error: "User email already existed!" });
  } else {
    const newUser = { 
      id: userId,
      username: username.toLocaleLowerCase(), 
      password: await hashPassword(password),
      is_admin: false,
      role_id: 2,
    };
    users.push(newUser);
    let userDetail = {
      id: user_details.length + 1,
      firstname,
      lastname,
      email:email.toLocaleLowerCase(),
      user_id: userId,
      created_at: currentDate,
      updated_at: currentDate,
    }
    user_details.push(userDetail);
    res.status(201).json({users:newUser, user_details:userDetail});
  }
});
// Update user and User details by User ID
app.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const getUserDetails = data["user_details"].find((user_details) => user_details.user_id === id);
  const getUser = data["users"].find((user) => user.id === id);
  const username = req.body.username === undefined ? getUser.username.toLocaleLowerCase(): req.body.username.toLocaleLowerCase();
  const password = req.body.password === undefined ? getUser.password : req.body.password;
  const is_admin = req.body.is_admin === undefined ? getUser.is_admin : req.body.is_admin;
  const role_id = req.body.role_id === undefined ? getUser.role_id : req.body.role_id;
  let firstname = req.body.firstname === undefined ? getUserDetails.firstname : req.body.firstname;
  let lastname = req.body.lastname === undefined ? getUserDetails.lastname : req.body.lastname;
  let email = req.body.email === undefined ? getUserDetails.email.toLocaleLowerCase() : req.body.email.toLocaleLowerCase();
  const updated_at = currentDate;
  
  let updateUserDetails = {firstname,lastname,email,updated_at}
  let updatedUser = {
    username: username.toLocaleLowerCase(),
    password: password !== undefined ? await hashPassword(password) : password,
  };

  const userDetailsIndex = data["user_details"].findIndex((user_details) => user_details.user_id === id);
  const userIndex = data["users"].findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updatedUser };
    if (userDetailsIndex !== -1) {
      data.user_details[userDetailsIndex] = { ...data.user_details[userDetailsIndex], ...updateUserDetails };
      res.json({
        users:data.users[userIndex],
        user_details:data.user_details[userDetailsIndex],
      })
    } else {
      res.json(data.users[userIndex]);
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = data["users"].findIndex((user) => user.id === id);
  const userDetailsIndex = data["user_details"].findIndex((user_details) => user_details.user_id === id);

  if (userIndex !== -1 && userDetailsIndex !== -1) {
    data["users"].splice(userIndex, 1);
    data["user_details"].splice(userDetailsIndex, 1);
    res.json({ message: "User deleted successfully " });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Search user with user details 

app.get("/search/users/details" , (req, res) =>{
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  let {pageSize, page} = req.query;
  pageSize = 10;
  page = 1;
  const userDetails = data["user_details"];
  const users = data["users"];
  // filter users function
  let stringSearch = firstname !== undefined ? firstname : lastname;
  function filterUserDetails(arr, query) {
    if(firstname !== undefined){
      return arr.filter((el) => el.firstname.toLowerCase().includes(query.toLowerCase()));
    }else if(lastname !== undefined){
      return arr.filter((el) => el.lastname.toLowerCase().includes(query.toLowerCase()));
    }
  }
  // filter users with pagination
  let userDetailsDataFiltered = filterUserDetails(userDetails,stringSearch);
  let userDatailData = JSON.stringify(userDetailsDataFiltered);
  let userJson = JSON.parse(userDatailData)
  let userDetailsResult = [];
  userJson.forEach(element => {
    user = users.find((user) => user.id === element.user_id);
    let userDetails ={
      id: user.id,
      username: user.username,
      password: user.password,
      is_admin: user.is_admin,
      role_id: user.role_id,
      firstname: element.firstname,
      lastname: element.lastname,
      email: element.email,
      created_at: element.created_at,
      updated_at: element.updated_at,
    }
    userDetailsResult.push(userDetails);
  });
  let totalPage = Math.ceil(userDetailsResult.length/pageSize);
  if (userDetailsResult.length !== 0) {
    res.json({
      totalRecords: userDetailsResult.length,
      pageSize,
      page,
      totalPage,
      nextPage: page < totalPage,
      user_details:userDetailsResult,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
})

// Get User Details
app.get("/users/details/:id", (req, res) =>{
  const id = parseInt(req.params.id);
  const user = data.users.find((user) => user.id === id);
  const userDetail = data["user_details"].find((user_details) => user_details.user_id === id);
  const userDataDetails = {users: user, user_details: userDetail}
  if (user !== undefined && userDetail !== undefined) {
    res.json(userDataDetails);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/**
 * Articles Routes
 */
// Get all articles
app.get("/articles", (req, res) => {
  return res.json(paginationFuntion(data.articles,data.articles, 1, 10))
});

// Get article by ID
app.get("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const article = data.articles.find((article) => article.id === id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// Create a new article
app.post("/articles", (req, res) => {
  const newArticle = req.body;
  newArticle.id = data.articles.length + 1;
  data.articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Update article by ID
app.put("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedArticle = req.body;
  const articleIndex = data.articles.findIndex((article) => article.id === id);

  if (articleIndex !== -1) {
    data.articles[articleIndex] = {
      ...data.articles[articleIndex],
      ...updatedArticle,
    };
    res.json(data.articles[articleIndex]);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});
// Delete article by ID
app.delete("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const articleIndex = data.articles.findIndex((article) => article.id === id);

  if (articleIndex !== -1) {
    // const deletedArticle = data.articles[articleIndex];
    data.articles.splice(articleIndex, 1);
    res.json({ message: "Article deleted successfully " });
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// advance search

// Helper function to filter articles based on query parameters
function filterArticles(query, articles) {
  return articles.filter((article) => {
    return (
      (query.created_by
        ? article.created_by.toLowerCase().toString().includes(query.created_by.toLowerCase())
        : true) &&
      (query.is_published
        ? article.is_published.toString() === query.is_published.toLowerCase()
        : true) &&
      (query.content
        ? article.content.toLowerCase().toString().includes(query.content.toLowerCase())
        : true) &&
      (query.title
        ? article.title.toLowerCase().toString().includes(query.title.toLowerCase())
        : true)
    );
  });
}
// Route to handle search
app.get("/search/articles/list", (req, res) => {
  const {
    created_by = "",
    is_published = "true",
    title = "",
    content = "",
    page = 1,
  } = req.query;
  const pageSize = 10;

  // Filter articles based on query parameters
  let filteredArticles = filterArticles(
    { created_by, is_published, title, content },
    data.articles
  );

  // Paginate the filtered articles
  const start = (page - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(start, start + pageSize);
  res.json(paginationFuntion(filteredArticles, paginatedArticles, page, pageSize ));
});

function paginationFuntion(filteredArticles, paginatedArticles, page, pageSize){
  return {
    page: parseInt(page, 10),
    pageSize,
    total: filteredArticles.length,
    total_page: Math.ceil(filteredArticles.length / 10),
    articles: paginatedArticles,
  }
}
