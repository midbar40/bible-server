const express = require('express')
const PrayBucketlist = require('../models/PrayBucketlist')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

// 기도버킷리스트 저장
router.post('/saveBucket', expressAsyncHandler(async(req, res, next)=> {
    User.findOne({email: req.body.email})
    .then(user =>{
        if(user){
            const prayBucketlist = new PrayBucketlist({
                number: req.body.number,
                detail: req.body.detail,
                author: user._id
            })
            return prayBucketlist.save()
        } else{
            res.json({
                code: 400,
                message: '유저가 존재하지 않습니다.'
            })
        }
    })
    .then(result =>{
        console.log('기도버킷리스트 저장 성공', result)
        res.json({
            code: 200,
            message: '기도버킷리스트 저장 성공',
            result
        })
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '기도버킷리스트 저장 실패',
            err
        })
    })


}))
   




router.post('/getBucket', expressAsyncHandler(async(req, res, next)=>{
    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            PrayBucketlist.find({author: user._id})
            .then(result =>{
                console.log('기도버킷리스트 조회 성공', result)
                res.json({
                    code: 200,
                    message: '기도버킷리스트 조회 성공',
                    result
                })
            })
            .catch(err =>{
                res.json({
                    code: 500,
                    message: '기도버킷리스트 조회 실패',
                    err
                })
            })
        }
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '유저가 존재하지 않습니다.',
            err
        })
    })
}))

router.get('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('특정 기도제목 조회')
}))

router.post('/', expressAsyncHandler(async(req, res, next)=>{
    res.json('새로운 기도제목 추가')
}))

router.put('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('특정 기도제목 변경')
}))

router.delete('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('특정 기도제목 삭제')
}))

module.exports = router