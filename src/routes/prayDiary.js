const express = require('express')
const mongoose = require('mongoose')
const { Types: { ObjectId }} = mongoose
const router = express.Router()

const PrayDiary = require('../models/PrayDiary')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

// 기도일기 저장
router.post('/saveDiary', expressAsyncHandler(async(req, res, next)=>{
    User.findOne({email: req.body.email})
    .then(user =>{
        if(user){
            const prayDiary = new PrayDiary({
                title: req.body.title,
                detail: req.body.detail,
            })
            return prayDiary.save()
        } else {
            res.json({
                code: 400,
                message: '유저가 존재하지 않습니다.'
            })
        }
        })
    .then(result =>{
        console.log('기도일기 저장 성공', result)
        res.json({
            code: 200,
            message: '기도일기 저장 성공',
            result
        })
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '기도일기 저장 실패',
            err
        })
    })    
}))

// 기도일기 조회
router.post('/getDiary', expressAsyncHandler(async(req, res, next)=>{
    User.findOne({email: req.body.email})
    .then(user =>{
        if(user){
            PrayDiary.find({author: user._id})
            .then(result =>{
                console.log('기도일기 조회 성공', result)
                res.json({
                    code: 200,
                    message: '기도일기 조회 성공',
                    result
                })
            })
        } else {
            res.json({
                code: 400,
                message: '유저가 존재하지 않습니다.'
            })
        }
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '기도일기 조회 실패',
            err
        })
    })
}))

// 기도일기 수정
router.put('/editDiary', expressAsyncHandler(async(req, res, next)=>{
    User.findOneAndUpdate({email: req.body.email})
    .then(user =>{
        if(user){
            PrayDiary.findOneAndUpdate({author: user._id})
            .then(result =>{
                console.log('기도일기 수정 성공', result)
                res.json({
                    code: 200,
                    message: '기도일기 수정 성공',
                    result
                })
            })
        } else {
            res.json({
                code: 400,
                message: '유저가 존재하지 않습니다.'
            })
        }
    })
    .then(result =>{
        console.log('기도일기 수정 성공', result)
        res.json({
            code: 200,
            message: '기도일기 수정 성공',
            result
        })
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '기도일기 수정 실패',
            err
        })
    })
}))

// 기도일기 삭제
router.delete('/deleteDiary', expressAsyncHandler(async(req, res, next)=>{
    User.findOneAndDelete({email: req.body.email})
    .then(user =>{
        if(user){
            PrayDiary.findOneAndDelete({author: user._id})
            .then(result =>{
                console.log('기도일기 삭제 성공', result)
                res.json({
                    code: 200,
                    message: '기도일기 삭제 성공',
                    result
                })
            })
        } else {
            res.json({
                code: 400,
                message: '유저가 존재하지 않습니다.'
            })
        }
    })
    .then(result =>{
        console.log('기도일기 삭제 성공', result)
        res.json({
            code: 200,
            message: '기도일기 삭제 성공',
            result
        })
    })
    .catch(err =>{
        res.json({
            code: 500,
            message: '기도일기 삭제 실패',
            err
        })
    })
}))