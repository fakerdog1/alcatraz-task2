import Router from "koa-router";
import jwt from 'jsonwebtoken'
import comment_data from "../data/comment.js";
import thread_data from "../data/thread.js";
import profile_data from "../data/profile.js";

const commentRouter = new Router({prefix: "/comment"});

// CREATE comment
commentRouter.post("/:threadid", authenticate, ctx => {
    const thread = thread_data.find(t => t.id === parseInt(ctx.params.threadid))
    if (!thread) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread does not exist!"
        }
    }

    const profile = profile_data.find(p => p.id === ctx.request.user.id)
    if (!profile) {
        ctx.status = 401
        return ctx.body = {
            code: ctx.status,
            message: "Unauthorized"
        }
    }

    const timeInMs = Date.now()
    const date = new Date(timeInMs) 
    var parentComment = null
    var commentIdDepth = {
        id: null,
        depth: -1
    }

    if (ctx.request.body.commentID) {
        parentComment = comment_data.find(c => c.id === ctx.request.body.commentID)

        if (parentComment) {
            commentIdDepth = {
                id: ctx.request.body.commentID,
                depth: parentComment.depth
            }
        }
    }

    const new_comment = {
        id: comment_data[comment_data.length - 1].id + 1,
        text: ctx.request.body.text,
        date_created: date.toUTCString(),
        date_updated: null,
        upvotes: 0,
        depth: commentIdDepth.depth + 1,
        ownerID: ctx.request.user.id,
        threadID: ctx.params.threadid,
        commentID: commentIdDepth.id
    }

    comment_data.push(new_comment)

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: new_comment
    }


})

// GET all comments to a thread
commentRouter.get("/thread/:id", ctx => {
    const comments = comment_data.filter(c => c.threadID === ctx.params.id)

    if (!comments) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Thread has no comments"
        }
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: comments
    }
})

// GET all comments by user
commentRouter.get("/user/:username", ctx => {
    const profile = profile_data.find(p => p.username === ctx.params.username)
    if (!profile) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "User does not exist!"
        }
    }

    const comments = comment_data.filter(c => c.ownerID === profile.id)
    if (!comments) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "User has no comments"
        }
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: comments
    }
})

// UPDATE comment by id
commentRouter.put("/:id", authenticate, ctx => {
    const profile = profile_data.find(p => p.id === ctx.request.user.id)
    if (!profile) {
        ctx.ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Profile not found!"
        }
    }

    const comment = comment_data.find(c => c.id === parseInt(ctx.params.id))
    if (!comment) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Comment not found!"
        }
    }

    if (comment.ownerID !== ctx.request.user.id) {
        ctx.status = 403
        return ctx.body = {
            code: ctx.status,
            message: "Forbidden"
        }
    }

    const index = comment_data.indexOf(comment)
    const timeInMs = Date.now()
    const date = new Date(timeInMs) 
    
    if (ctx.request.body.text) {
        comment_data[index].text = ctx.request.body.text
    }
    
    comment_data[index].date_updated = date.toUTCString()

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: comment_data[index]
    }

})

// UPDATE comment by id (LIKES/DISLIKES ONLY)
commentRouter.put("/votes/:id/:type", authenticate, ctx => {
    const comment = comment_data.find(c => c.id === parseInt(ctx.params.id))

    if (!comment) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Comment not found!"
        }
    }

    const profile = profile_data.find(p => p.id === ctx.request.user.id)
    if (!profile) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Profile not found"
        }
    }

    const index = comment_data.indexOf(comment)

    if (ctx.params.type === "like") {
        comment_data[index].upvotes ++
    }
    else if (ctx.params.type === "dislike") {
        comment_data[index].upvotes --
    }

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        data: comment_data[index]
    }
})

commentRouter.delete("/:id", authenticate, ctx => {
    const comment = comment_data.find(c => c.id === parseInt(ctx.params.id))

    if (!comment) {
        ctx.status = 404
        return ctx.body = {
            code: ctx.status,
            message: "Comment not found!"
        }
    }

    if (comment.ownerID !== ctx.request.user.id) {
        ctx.status = 403
        return ctx.body = {
            code: ctx.status,
            message: "Forbidden"
        }
    }

    if (comment.text === "Message was deleted!") {
        ctx.status = 409
        return ctx.body = {
            code: ctx.status,
            message: "Comment is already Deleted"
        }
    }

    // intead of deleting the whole comment thread, set comment text to be message deleted and keep the thread (too much computation to be done without db cascade)
    comment_data[comment_data.indexOf(comment)].text = "Message was deleted!"
    comment_data[comment_data.indexOf(comment)].upvotes = 0

    ctx.status = 200
    ctx.body = {
        code: ctx.status,
        message: "Comment Deleted!"
    }

})


// middleware JWT authentication

function authenticate(ctx, next) {
    const token = ctx.cookies.get("auth_token")

    if (token === null) {
        ctx.status = 401
        ctx.body = {
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

export default commentRouter