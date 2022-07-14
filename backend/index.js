import dotenv from 'dotenv'
dotenv.config()

import Koa from "koa"
import bodyParser from "koa-bodyparser"
import Router from "koa-router"
import cors from "koa-cors"

import threadRouter from "./routes/thread.js";
import profileRouter from "./routes/profile.js"
import commentRouter from "./routes/comment.js"
import authRouter from './routes/auth.js'

const app = new Koa();

app.use(bodyParser());
app.use(cors())

const routerArray = [commentRouter, profileRouter, threadRouter, authRouter]

for (let router of routerArray) {
    app.use(router.routes()).use(router.allowedMethods())
}

app.listen(process.env.PORT, console.log(`Server is running on port ${process.env.PORT}`));
