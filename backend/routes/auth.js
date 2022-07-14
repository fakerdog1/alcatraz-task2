import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import Router from "koa-router";
import bcrypt from 'bcrypt'

import profile_data from "../data/profile.js";

const authRouter = new Router({prefix: "/auth"});
let refreshTokens = []

// POST login
authRouter.post("/login", async ctx => {
    const profile = profile_data.find(p => p.username === ctx.request.body.username)

    if (!profile) {
        ctx.status = 403
        return ctx.body = {
            error: ctx.status,
            message: "Forbidden"
        }
    }

    try {
        if (await bcrypt.compare(ctx.request.body.password, profile.password)) {

            ctx.status = 200
            const user = { id: profile.id, name: profile.username } 
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)

            ctx.cookies.set("auth_token", accessToken, {httpOnly: true})
            ctx.cookies.set("renew_token", refreshToken, {httpOnly: true})
        
            ctx.body = {
                code: ctx.status,
                message: "Successful Login"
            }
        }
        else {
            ctx.status = 403
            ctx.body = {
                code: ctx.status,
                message: "Forbidden"
            }
        }
    }
    catch {
        ctx.status = 500
        ctx.body = {
            code: ctx.status,
            message: "Server Error"
        }
    }
})

// POST new token

authRouter.post("/token", ctx => {
    const refreshToken = ctx.cookies.get("renew_token")

    if (refreshToken == null) {
        ctx.status = 401
        return ctx.body = {
            code: ctx.status,
            message: "Unauthorized"
        }
    }

    if (!refreshTokens.includes(refreshToken)){
        ctx.status = 401
        return ctx.body = {
            code: ctx.status,
            message: "Unauthorized"
        }
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            ctx.status = 403
            return ctx.body = {
                code: ctx.status,
                message: "Forbidden"
            }
        }

        const accessToken = generateAccessToken({ id: user.id, username: user.username })
        
        ctx.status = 200
        return ctx.body = {
            code: ctx.status,
            data: accessToken,
            otherdata: { id: user.id, username: user.username }
        }
    }) 
})

// DELETE Logout
authRouter.delete("/logout", ctx => {
    refreshTokens = refreshTokens.filter(c => c !== ctx.cookies.get("renew_token"))

    ctx.cookies.set("auth_cookie")
    ctx.cookies.set("renew_cookie")

    ctx.status = 200
    return ctx.body = {
        code: ctx.status,
        message: "Successfully logged out!"
    }
})


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

export default authRouter