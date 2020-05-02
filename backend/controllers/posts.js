const Post = require('../model/post');

exports.addPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        currentDate: req.body.currentDate,
        userId: req.userData.userId,
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id,
            },
        });
    });
};
exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find({ userId: req.userData.userId });
    let fetchedDocuments;
    if (pageSize && currentPage + 1) {
        postQuery.skip(pageSize * currentPage).limit(pageSize);
    }
    postQuery
        .then((documents) => {
            fetchedDocuments = documents;
            return Post.countDocuments({ userId: req.userData.userId });
        })
        .then((count) => {
            fetchedDocuments = fetchedDocuments.map((x) => {
                return {
                    id: x._id,
                    userId: x.userId,
                    title: x.title,
                    content: x.content,
                    imagePath: x.imagePath,
                    currentDate: x.currentDate,
                };
            });
            if (fetchedDocuments) {
                res.status(200).json({
                    posts: fetchedDocuments,
                    maxPosts: count,
                });
            } else {
                res.status(404).json({
                    message:
                        'Posts could not be found. Maybe you have deleted them',
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message:
                    'Posts could not be fetched from database. Please check your internet connection',
            });
        });
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message:
                        'Post with id ' +
                        req.params.id +
                        ' could not be found. Maybe you have deleted the post',
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message:
                    'Post could not be fetched from database (Id: ' +
                    req.params.id +
                    ' ). Please check your internet connection',
            });
        });
};

exports.updatePosts = (req, res, next) => {
    imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then((result) => {
            res.status(200).json({
                message: 'update successful',
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'The update failed',
            });
        });
};

exports.deletePosts = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, userId: req.userData.userId })
        .then((result) => {
            res.status(200).json({
                message: 'Post has been deleted',
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'The id could not be found in the database',
            });
        });
};
