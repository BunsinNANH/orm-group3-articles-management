require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const data = require("../data.json");

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

// Get all articles
app.get("/articles", (req, res) => {
  res.json(data.articles);
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

// Get all users
app.get("/users", (req, res) => {
  res.json(data.users);
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
app.post("/users", (req, res) => {
  const newUser = req.body;
  newUser.id = data.users.length + 1;
  data.users.push(newUser);
  res.status(201).json(newUser);
});

// Update user by ID
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log({ req });
  const updatedUser = req.body;
  const userIndex = data.users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updatedUser };
    res.json(data.users[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = data.users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    // const deletedUser = data.users[userIndex];
    data.users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully " });
  } else {
    res.status(404).json({ message: "User not found" });
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
