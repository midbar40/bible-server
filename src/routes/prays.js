const express = require('express')
const Pray = require('../models/Pray')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

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