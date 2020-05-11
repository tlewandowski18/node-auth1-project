const express = require("express")
const authRouter = require("./users/authRouter")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const dbConfig = require("./database/config")

const server = express()

server.use(express.json())
server.use(session({
	name: "token", 
	resave: false, 
	saveUninitialized: false, 
	secret: process.env.COOKIE_SECRET || "secret", 
	cookie: {
		httpOnly: true
	},
	store: new KnexSessionStore({
		knex: dbConfig, 
		createTable: true 
	})
}))

server.use("/api", authRouter)


const port = process.env.PORT || 4000

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "something went wrong"
    })
})

server.listen(port, () => {
    console.log(`Running at http:localhost:${port}`)
})