import mongoose from 'mongoose'

const CommentsScheam = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    belongsTo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('comment', CommentsScheam)

const create = (owner,{ body, belongsTo}) => {
    const comment = new Comment({owner, body, belongsTo})

    return comment.save()
}

const commentsOf = (belongsTo) => {
    return new Promise((resolve, reject) => {
        Comment.find({belongsTo}, (err, comments) => {
            if(err) return reject(err)
            return resolve(comments)
        })
    })
}

const remove = (_id) => {
    return new Promise((resolve, reject) => {
        Comment.deleteOne({_id}, (err) => {
            if(err) return reject(err)
            return resolve('done')
        })
    })
} 

const methods = {
    commands: {
        create,
        remove
    },
    queries: {
        commentsOf
    }
}

export default methods