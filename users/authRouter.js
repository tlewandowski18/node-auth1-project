const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./userModel")
const { restrict, sessions } = require("../middleware/restrict")

const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {
        const { username } = req.body
        const user = await Users.findBy({ username }).first()
        if (user) {
            return res.status(409).json({
                message: "Username taken"
            })
        }

        const newUser = await Users.add(req.body)
        res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username}).first()
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user || !passwordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }
        req.session.user = user
        res.json({
            message: `Welcome ${username}!`
        })

    } catch(err) {
        next(err)
    }
})

router.get("/users", restrict(), async (req, res, next) => {
    try {
        const users = await Users.find()
        res.json(users)
    } catch(err) {
        next(err)
    }
})

module.exports = router