const cors = require("cors");
const articleRoutes = require("express").Router();
const articleControllers = require("../controllers/ArticleController");
// const authMiddleware = require("../middlewares/authMiddleware");

articleRoutes.use(cors())
articleRoutes.get("/articles", articleControllers.getAllArticles);

articleRoutes.get("/articles/:id", articleControllers.getArticleById);
articleRoutes.put("/articles/:id", articleControllers.updateArticleById);

articleRoutes.post("/articles", articleControllers.createArticle);

articleRoutes.delete("/articles/:id", articleControllers.deleteArticleById);
articleRoutes.get("/search/articles/list", articleControllers.searchArticles);
module.exports = articleRoutes;