const express = require('express')
const { check } = require('express-validator')

const postsControllers = require('../controllers/posts-controllers')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.get('/:pid', postsControllers.getPostById)

router.get('/user/:uid', postsControllers.getPostByUserId)

router.use(checkAuth)

router.post('/',
    fileUpload.single('image'),
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .isLength({ min: 5 })
    ],
    postsControllers.createPost
)

router.delete('/:pid', postsControllers.deletePost)

module.exports = router