const express = require('express')
const PrayBucketlist = require('../models/PrayBucketlist')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

// 기도버킷리스트 저장
router.post('/', expressAsyncHandler(async(req, res, next)=> {
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
   




router.get('/', expressAsyncHandler(async(req, res, next)=>{
    res.json('전체 기도목록 조회')
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