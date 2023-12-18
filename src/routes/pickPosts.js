const express = require('express');
const router = express.Router();
const { Types : {ObjectId} } = require('mongoose')
const PickPost = require('../models/PickPost')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

// pickPost1 가져오기
router.get('/post1', expressAsyncHandler(async(req, res, next)=>{
    const pickPost1 = await PickPost.find({label: 'post1'})
    try{
        res.json({
            code: 200,
            message: 'pickPost1 가져오기 성공',
            pickPost1
        })
    }
   catch{
        res.json({
            code: 500,
            message: 'pickPost1 가져오기 실패',
            err
        })
   }
}))

// pickPost2 가져오기
router.get('/post2', expressAsyncHandler(async(req, res, next)=>{
    const pickPost2 = await PickPost.find({label: 'post2'})
    try{
        res.json({
            code: 200,
            message: 'pickPost2 가져오기 성공',
            pickPost2
        })
    }
    catch{
        res.json({
            code: 500,
            message: 'pickPost2 가져오기 실패',
            err
        })
    }
}))

// pickPost1 저장하기
router.post('/savePost1', expressAsyncHandler(async(req, res, next)=>{
    const savePickPost1 = new PickPost({
        author: User._id,
        label: req.body.label,
        text: req.body.text
    })
    savePickPost1.save()
    .then(result =>{
        console.log('pickPost1 저장 성공', result)
        res.json({
            code: 200,
            message: 'pickPost1 저장 성공',
            result
        })
    })
    .catch(err =>{
        console.log('pickPost1 저장 실패', err)
        res.json({
            code: 500,
            message: 'pickPost1 저장 실패',
            err
        })
    })
}))
// pickPost2 저장하기
router.post('/savePost2', expressAsyncHandler(async(req, res, next)=>{
    const savePickPost1 = new PickPost({
        author: User._id,
        label: req.body.label,
        text: req.body.text
    })
    savePickPost1.save()
    .then(result =>{
        console.log('pickPost2 저장 성공', result)
        res.json({
            code: 200,
            message: 'pickPost2 저장 성공',
            result
        })
    })
    .catch(err =>{
        console.log('pickPost2 저장 실패', err)
        res.json({
            code: 500,
            message: 'pickPost2 저장 실패',
            err
        })
    })
}))
// pickPost1 수정하기
router.put('/updatePost1', expressAsyncHandler(async(req, res, next)=>{
    const editPickPost1 = await PickPost.findOneAndUpdate({label: 'post1'}, {text: req.body.text})
    try{
        res.json({
            code: 200,
            message: 'pickPost1 수정 성공',
            editPickPost1
        })
    }
    catch{
        res.json({
            code: 500,
            message: 'pickPost1 수정 실패',
            err
        })
    }
}))
// pickPost2 수정하기
router.put('/updatePost2', expressAsyncHandler(async(req, res, next)=>{
    const editPickPost2 = await PickPost.findOneAndUpdate({label: 'post2'}, {text: req.body.text})
    try{
        res.json({
            code: 200,
            message: 'pickPost2 수정 성공',
            editPickPost2
        })
    }
    catch{
        res.json({
            code: 500,
            message: 'pickPost2 수정 실패',
            err
        })
    }
}))
// pickPost1 삭제하기
router.delete('/deletePost1', expressAsyncHandler(async(req, res, next)=>{
    const deletePickPost1 = await PickPost.findOneAndDelete({label: 'post1'})
    try{
        res.json({
            code: 200,
            message: 'pickPost1 삭제 성공',
            deletePickPost1
        })
    }
    catch{
        res.json({
            code: 500,
            message: 'pickPost1 삭제 실패',
            err
        })
    }
}))
// pickPost2 삭제하기
router.delete('/deletePost2', expressAsyncHandler(async(req, res, next)=>{
    const deletePickPost2 = await PickPost.findOneAndDelete({label: 'post2'})
    try{
        res.json({
            code: 200,
            message: 'pickPost2 삭제 성공',
            deletePickPost2
        })
    }
    catch{
        res.json({
            code: 500,
            message: 'pickPost2 삭제 실패',
            err
        })
    }
}))

module.exports = router;