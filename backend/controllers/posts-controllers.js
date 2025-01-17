const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const Post = require('../models/post')
const User = require('../models/user')

const getPostById = async (req, res, next) => {
    const postId = req.params.pid

    let post

    try {
        post = await Post.findById(postId)
    } catch (err) {
        const error = new HttpError('Could not find a post.', 500)
        return next(error)
    }

    if (!post) {
        const error = new HttpError('Could not find a post.', 500)
        return next(error)
    }

    res.json({ post: post.toObject({ getters: true }) })
}

const getPostByUserId = async (req, res, next) => {
    const userId = req.params.uid

    let posts

    try {
        posts = await Post.find({ creator: userId })
    } catch (err) {
        const error = new HttpError('Could not find a post.', 500)
        return next(error)
    }

    if (!posts) {
        const error = new HttpError('Could not find a post.', 500)
        return next(error)
    }

    res.json({ posts: posts.map(post => post.toObject({ getters: true })) })
}

const createPost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid Inputs', 422)
    }
    const { title, description, creator } = req.body

    const createdPost = new Post({
        title: title,
        description: description,
        image: req.file.path,
        creator: creator
    })

    let user

    try {
        user = await User.findById(creator)
    } catch (err) {
        const error = new HttpError('Creating Post Failed!', 500)
        return next(error)
    }

    if (!user) {
        const error = new HttpError('Could not find user', 422)
        return next(error)
    }

    try {
        await createdPost.save()
        user.posts.push(createdPost)
        await user.save()
    } catch (err) {
        const error = new HttpError('Creating Post Failed!', 500)
        return next(error)
    }

    res.status(201).json({ post: createdPost })
}

const deletePost = async (req, res, next) => {
    const postId = req.params.pid

    let post

    try {
        post = await Post.findById(postId).populate('creator')
    } catch (err) {
        const error = new HttpError('Could not delete a post', 500)
        return next(error)
    }

    try {
        await post.remove()
        post.creator.posts.pull(post)
        await post.creator.save()
    } catch (err) {
        const error = new HttpError('Could not delete a post', 500)
        return next(error)
    }

    res.json({ message: 'Post Deleted!' })
}

exports.getPostById = getPostById
exports.getPostByUserId = getPostByUserId
exports.createPost = createPost
exports.deletePost = deletePost