require("dotenv").config();
const express = require("express");
const bcrypt = require('bcrypt');
const env = require("../constants");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all User with paginatio
const getAllUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy:{id: "asc" },
        include:{profile:true}, 
    });
    let { pageSize, page } = req.query;
    pageSize = pageSize !== undefined ? parseInt(pageSize) : 10;
    page = page !== undefined ? parseInt(page) : 1;
    const filteredUser = [];
    for (let i = 0;i < users.length; i++) {
        const {password:_, ...userData} = users[i];
        filteredUser.push(userData);
    }
    const totalPage = Math.ceil(users.length / pageSize);
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
        totalRecords: users.length,
        pageSize,
        page,
        totalPage,
        nextPage: page < totalPage,
        users: filteredUser,
    });
};

// Get user by ID
const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findFirst({ where: { id: id }, include:{profile:true}});
    const {password:_, ...userData} = user;
    if (user) {
        res.json(userData);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
// Create Role
// app.post("/roles", async (req, res) => {
//     let { role } = req.body;
//     const newRole = await prisma.role.create({
//         data: { role }
//     });
//     res.send(newRole);
// })
// Create a new user
const createUser = async (req, res) => {
    let { username, password, is_admin, role_id, firstname, lastname, email } = req.body;
    let users = await prisma.user.findMany();
    let userProfile = await prisma.profile.findMany();
    is_admin = is_admin === undefined ? false : true;
    role_id = role_id === undefined ? 2 : 1;
    // let userRole = await prisma.role.findFirst({where:{id: parseInt(role_id)}});
    password = password.toString();
    function filterExistUser(arr, query) {
        if (username !== undefined) {
            return arr.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
        }
    }
    function filterExistUserDetails(arr, query) {
        if (email !== undefined) {
            return arr.filter((user_detail) => user_detail.email.toLowerCase().includes(query.toLowerCase()));
        }
    }
    if (username === undefined) {
        res.status(404).json({ error: "Username required!" });
    } else if (password === undefined) {
        res.status(404).json({ error: "Password required!" });
    } else if (firstname === undefined) {
        res.status(404).json({ error: "Firstname required!" });
    } else if (lastname === undefined) {
        res.status(404).json({ error: "Lastname required!" });
    } else if (email === undefined) {
        res.status(404).json({ error: "Email required!" });
    } else if (username !== undefined && filterExistUser(users, username).length !== 0) {
        res.status(404).json({ error: "Username already existed!" });
    } else if (email !== undefined && filterExistUserDetails(userProfile, email).length !== 0) {
        res.status(404).json({ error: "User email already existed!" });
    } else {
        // Create New User
        const newUser = await prisma.user.create({
            data: {
                username: username.toLocaleLowerCase(),
                password: await hashPassword(password),
                isAdmin: is_admin,
                // roleId: role_id,
            }
        });
        // Create User Profile
        await prisma.profile.create({
            data: {
                firstname,
                lastname,
                email: email.toLocaleLowerCase(),
                userId: newUser.id,
            }
        })
        res.set('Access-Control-Allow-Origin', '*');
        res.status(201).json({ message: "User created successfully!" });
    }
};

// Hash user password
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
    return hashedPassword
}
// User Register
const userRegistration = async (req, res) => {
    const { username, password, firstname, lastname, email } = req.body;
    let users = await prisma.user.findMany();
    let userProfile = await prisma.profile.findMany();
    function filterExistUser(arr, query) {
        if (username !== undefined) {
            return arr.filter((el) => el.username.toLowerCase().includes(query.toLowerCase()));
        }
    }
    function filterExistUserDetails(arr, query) {
        if (email !== undefined) {
            return arr.filter((el) => el.email.toLowerCase().includes(query.toLowerCase()));
        }
    }
    if (username === undefined) {
        return res.status(404).json({ error: "Username required!" });
    } else if (password === undefined) {
        return res.status(404).json({ error: "Password required!" });
    } else if (firstname === undefined) {
        return res.status(404).json({ error: "Firstname required!" });
    } else if (lastname === undefined) {
        return res.status(404).json({ error: "Lastname required!" });
    } else if (email === undefined) {
        return res.status(404).json({ error: "Email required!" });
    } else if (username !== undefined && filterExistUser(users, username).length !== 0) {
        return res.status(404).json({ error: "Username already existed!" });
    } else if (email !== undefined && filterExistUserDetails(userProfile, email).length !== 0) {
        return res.status(404).json({ error: "User email already existed!" });
    } else {
        const newUser = await prisma.user.create({
            data: {
                username: username.toLocaleLowerCase(),
                password: await hashPassword(password),
            }
        });
        await prisma.profile.create({
            data: {
                firstname,
                lastname,
                email: email.toLocaleLowerCase(),
                userId: newUser.id,
            }
        })
        return res.status(201).json({ message:"Registeration successfully!" });
    }
};
// Update user and User details by User ID
const updateUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const userProfile = await prisma.profile.findFirst({ where: { userId: id } });
    const user = await prisma.user.findFirst({ where: { id: id } });
    const username = req.body.username === undefined ? user.username.toLocaleLowerCase() : req.body.username.toLocaleLowerCase();
    const is_admin = req.body.is_admin === undefined ? user.isAdmin : req.body.is_admin;
    const role_id = req.body.role_id === undefined ? user.roleId : req.body.role_id;
    let firstname = req.body.firstname === undefined ? userProfile.firstname : req.body.firstname;
    let lastname = req.body.lastname === undefined ? userProfile.lastname : req.body.lastname;
    let email = req.body.email === undefined ? userProfile.email.toLocaleLowerCase() : req.body.email.toLocaleLowerCase();
    if (user.length !== 0) {
        if (user.username === username) {
            res.status(404).json({ error: "Username already existed!" });
        } else if (userProfile.email === email) {
            res.status(404).json({ error: "User email already existed!" });
        } else {
            await prisma.user.update({
                data: {
                    username,
                    isAdmin: is_admin,
                    roleId: role_id,
                }, where: { id: id }
            })
            await prisma.profile.update({
                data: {
                    firstname,
                    lastname,
                    email,
                }, where: { userId: id }
            })
            
            res.status(201).json({ message: "User updated successfully!" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (user.length !== 0) {
      await prisma.user.delete({where:{id:id}})
      res.json({ message: "User deleted successfully " });
    } else {
      res.status(404).json({ message: "User not found" });
    }
};

// Search User
const searchUsers = async (req, res) => {
    const {username, firstname, lastname, pageSize = 10, page =1 } = req.query;
    const users = await prisma.user.filter(`SELECT * FROM User WHERE username LIKE ${username}`);
    console.log(users)
    // filter users function
    // function filterUsers(arr, query) {
    //     return arr.filter((el) => el.username.toLowerCase().includes(query.toLowerCase()));
    // }
    // // filter users with pagination
    // let filterUsersData = filterUsers(users, username);
    // let totalPage = Math.ceil(filterUsersData.length / pageSize);
    // if (filterUsersData.length !== 0) {
    //     res.json({
    //         totalRecords: filterUsersData.length,
    //         pageSize,
    //         page,
    //         totalPage,
    //         nextPage: page < totalPage,
    //         users: filterUsersData,
    //     });
    // } else {
    //     res.status(404).json({ error: "User not found!" });
    // }
};

// Search user with user details 

module.exports = {
    getAllUsers,
    deleteUserById,
    createUser,
    getUserById,
    updateUserById,
    userRegistration,
    searchUsers,
  };
