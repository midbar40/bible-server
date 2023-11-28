// 전역변수
const express = require('express')
const Bible  = require('../models/Bible')
const expressAsyncHandler = require('express-async-handler')

const mongoose = require('mongoose')
const { Types : {ObjectId} } = mongoose

const router = express.Router()

// 성경전문조회
router.get('/', expressAsyncHandler(async(req, res) => {
    console.log(req.query)
    try{
    const bibles = await Bible.find({})
    res.status(200).json({ code: 200, message: '성경조회 성공', bibles})
    // console.log(bibles)
} catch(err){
    res.status(500).send()
}
}))

// 시편조회
router.get('/psalms', expressAsyncHandler(async(req, res)=> {
    // 전체 리스트
try{
    const { title } = req.query
    // console.log(title)
    const psalms = await Bible.find({title: "시편"})
    res.status(200).json({code:200, message: '시편조회 성공', psalms})
}catch(err){
    res.status(500).send()
    console.log(err)
}

})) 
//성경구절추가
router.post('/', expressAsyncHandler(async(req, res) => {
    const searchedBible = await Bible.find({ })
    if(searchedBible){
        res.status(204).json({ code:204, message: '이미 있는 구절입니다'})
    }else{
        const bible = new Bible({
            book: req.body.book,
            chapter : req.body.chapter,
            verse : req.body.verse,
            content: req.body.content,
        })
        const newBible = await bible.save()
    
            res.status(201).json({
                code: 201,
                message: 'New Bible created',
                newBible, 
            })
            console.log('성경이 추가되었습니다')
        
    }
}))

module.exports = router