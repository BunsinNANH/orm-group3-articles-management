require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Articles Routes
 */
// Get all articles
const getAllArticles = async (req, res) => {
    const articles = await prisma.article.findMany();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(articles)
    // return res.json(paginationFuntion(data.articles, data.articles, 1, 10))
};

// Get article by ID
const getArticleById = async (req, res) => {
    const id = parseInt(req.params.id);
    const article = await prisma.article.findFirst({where:{id:id}});
    if (article.length !== 0) {
        res.json(article);
    } else {
        res.status(404).json({ message: "Article not found" });
    }
};

// Create a new article
const createArticle = async (req, res) => {
    const {title, contents, createdByUserId, isPublished = false} = req.body;
    if (title === undefined) {
        res.json({message:"Title field is required!"})
    } else if(contents === undefined){
        res.json({message:"Contents field is required!"})
    }else{
        await prisma.article.create({
            data:{
                title,
                contents,
                createdByUserId: parseInt(createdByUserId),
                isPublished
            }
        });
        res.status(201).json({message:"Article created successfully!"})
    }
};

// Update article by ID
const updateArticleById = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, contents,createdByUserId, isPublished} = req.body;
    const article = await prisma.article.findFirst({where: {id: id}});
    if (article.length === 0) {
        res.status(404).json({message:"Article not found!"})
    }else{
        await prisma.article.update({
            data:{
                title,
                contents,
                createdByUserId,
                isPublished
            },where: {id: id},
        });
        res.status(201).json({message: "Article updated successfully!"})
    }
};
// Delete article by ID
const deleteArticleById = async (req, res) => {
    const id = parseInt(req.params.id);
    const article = await prisma.article.findFirst({where: {id:id}});

    if (article.length === 0) {
        res.status(404).json({ message: "Article not found" });
    } else {
        await prisma.article.delete({where: {id: article.id}})
        res.json({ message: "Article deleted successfully " });
    }
};

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
// Route to handle search /search/articles/list"
const searchArticles = async (req, res) => {
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
    res.json(paginationFuntion(filteredArticles, paginatedArticles, page, pageSize));
};

function paginationFuntion(filteredArticles, paginatedArticles, page, pageSize) {
    return {
        page: parseInt(page, 10),
        pageSize,
        total: filteredArticles.length,
        total_page: Math.ceil(filteredArticles.length / 10),
        articles: paginatedArticles,
    }
}

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    deleteArticleById,
    updateArticleById,
    searchArticles,
}