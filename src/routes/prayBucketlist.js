const express = require('express')
const PrayBucketlist = require('../models/PrayBucketlist')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

// 기도버킷리스트 저장
router.post('/', expressAsyncHandler(async(req, res, next)=> {
    const prayBucketlist = new PrayBucketlist({
        number: req.body.number,
        detail: req.body.detail,
        createdAt: Date.now(),
})
    const newPrayBucketlist = await prayBucketlist.save()
    if(!newPrayBucketlist){
        res.status(401).json({ code:401, message: '기도 버킷리스트 저장 실패'})
    }else{
        const { number, detail, createdAt } = newPrayBucketlist
        res.json({
            code:200,
            message: '기도 버킷리스트 저장 성공',
            number, detail, createdAt
        })
    }
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