import Router from "koa-router";
import jwt from 'jsonwebtoken'
import profile_data from "../data/profile.js";
import thread_data from "../data/thread.js"
import comment_data from "../data/comment.js";

const threadRouter = new Router({prefix: "/thread"});

// CREAT new thread
threadRouter.post("/", authenticate, ctx => {
    const timeInMs = Date.now()
    const date = new Date(timeInMs) 

    var new_thread = {
        id: thread_data[thread_data.length - 1].id + 1,
        title: ctx.request.body.title,
        text: ctx.request.body.text,
        upvotes: 0, // initialize at 0 upvotes
        date_created: date.toUTCString(),
        date_updated: null, 
        ownerID: ctx.request.user.id
    }

    thread_data.push(new_thread)

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: new_thread
    }
    
    
})

// GET thread by id
threadRouter.get("/single/:id", ctx => {
    const thread = thread_data.find(t => t.id === parseInt(ctx.params.id))
    if (!thread) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread does not exist!"
        }
    }
    
    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: thread
    }

})

// GET all threads
threadRouter.get("/all", ctx => {
    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: thread_data
    }
})

// GET all threads created by user
threadRouter.get("/all/:userid", ctx => {
    const threads = thread_data.filter(t => t.ownerID === parseInt(ctx.params.userid))

    if (!threads) {
        ctx.status = 200
        return ctx.body = {
            code: ctx.status,
            data: []
        }
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: threads
    }
})

// SEARCH thread by string match in title
threadRouter.post("/search", ctx => {
    const search = thread_data.filter(s => s.title.includes(ctx.request.body.title))

    if (!search) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "No mathcing threads found"
        }
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: search
    }
})

// UPDATE thread by id
threadRouter.put("/:id", authenticate, ctx => {
    const thread = thread_data.find(t => t.id === parseInt(ctx.params.id))

    if (!thread) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread not found!"
        }
    }

    if (thread.ownerID !== ctx.request.user.id) {
        ctx.status = 403
        return ctx.body = {
            code: ctx.status,
            message: "Forbidden"
        }
    }

    const index = thread_data.indexOf(thread)
    const timeInMs = Date.now()
    const date = new Date(timeInMs) 
    
    // add so you cant update if youre sending the same data

    if (ctx.request.body.title) {
        thread_data[index].title = ctx.request.body.title
    }

    if (ctx.request.body.text) {
        thread_data[index].text = ctx.request.body.text
    }
    
    thread_data[index].date_updated = date.toUTCString()

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: thread_data[index]
    }

})

// UPDATE thread by id (LIKES/DISLIKES ONLY)
threadRouter.put("/votes/:id", authenticate, ctx => {
    const thread = thread_data.find(t => t.id === parseInt(ctx.params.id))

    if (!thread) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread not found!"
        }
    }

    const profile = profile_data.find(t => t.id === ctx.request.user.id)
    if (!profile) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "User not found"
        }
    }

    const index = thread_data.indexOf(thread)

    if (ctx.request.body.type === "like") {
        thread_data[index].upvotes ++
    }
    else if (ctx.request.body.type === "dislike") {
        thread_data[index].upvotes --
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: thread_data[index]
    }

})

// DELETE thread by id
threadRouter.delete("/:id", authenticate ,ctx => {
    const thread = thread_data.find(t => t.id === parseInt(ctx.params.id))

    if (!thread) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread not found!"
        }
    }

    if (thread.ownerID !== ctx.request.user.id) {
        ctx.status = 403
        return ctx.body = {
            code: ctx.status,
            message: "Forbidden"
        }
    }

    thread_data.splice(thread_data.indexOf(thread), 1)

// ONDELETE cascade
    const comments = comment_data.filter(c => c.threadID === thread.id)

    if (comments) {
        for (let comment of comments) {
            comment_data.splice(comment_data.indexOf(comment))
        }
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        message: "Thread Deleted!"
    }

 
})

// middleware JWT authentication

function authenticate(ctx, next) {
    // Bearer {jwt_token} fromat
    const token = ctx.cookies.get("auth_token")

    if (token == "" || token === null) {
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

export default threadRouter