import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import Router from "koa-router";
import profile_data from "../data/profile.js";
import bcrypt from 'bcrypt'

const profileRouter = new Router({prefix: "/profile"});

// CREATE new profile
profileRouter.post("/", async ctx => {
    const profile = profile_data.find(p => p.username === ctx.request.body.username)
    
    if (profile) {
        ctx.status = 409
        return ctx.body = {
            error: ctx.status,
            message: "Conflict! Profile with this username already exists"
        }
    }

    try {
        // password encryption
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(ctx.request.body.password, salt)

        var idPush = 1
        if (profile_data.length !== 0) {
            idPush = profile_data[profile_data.length - 1].id + 1
        }

        profile_data.push(
            {
                id: idPush,
                username: ctx.request.body.username,
                password: hashedPassword
            }
        )
            
        ctx.status = 201
        ctx.body = {
            code: ctx.status,
            message: "Account created"
        }
    }
    catch {
        ctx.status = 500
        ctx.body = {
            code: ctx.status,
            message: "Internal Server Error"
        }
    }

})

// GET profile by id
profileRouter.get("/user/:id", ctx => {
    // add profile check
    const profile = profile_data.find(p => p.id === parseInt(ctx.params.id))
    if (!profile) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Profile not found!"
        }
    }

    const dataProfile = profile
    delete dataProfile["password"]
    
    ctx.body = {
        code: 200,
        data: dataProfile
    }

})

// SEARCH profiles by username match
profileRouter.get("/search", ctx => {
    const search = profile_data.filter(s => s.username.includes(ctx.request.body.username))

    if (search.length===0) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status, 
            message: "No mathcing profiles found"
        }
    }
    
    ctx.body = {
        code: 200,
        data: search
    }
    
})


profileRouter.delete("/", authenticate, ctx => {
    const profile = profile_data.find(p => p.id === ctx.request.user.id)

    if (!profile) {
        ctx.status = 403
        return ctx.body = {
            code: ctx.status, 
            message: "Forbidden"
        }
    }

    profile_data.splice(profile_data.indexOf(profile), 1)

    ctx.body = {
        code: 200,
        message: "Profile deleted!"
    }
})



// middleware JWT authentication

function authenticate(ctx, next) {
    // Bearer {jwt_token} fromat
    const token = ctx.cookies.get("auth_token")

    if (token === null) {
        ctx.status = 401
        return ctx.body = {
            code: ctx.status,
            message: "Unautorized"
        }
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            ctx.status = 403
            return ctx.body = {
                code: ctx.status,
                message: "Forbidden"
            }
        }

        ctx.request.user = user
        next()
    })
}

export default profileRouter
