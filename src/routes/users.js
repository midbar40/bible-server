const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const {    
    validateUserName,
    validateUserEmail,
    validateUserPassword
} = require('../../validator')
const mongoose = require('mongoose')
const { generateToken } = require('../../auth')
const {  JWT_SECRET } = require('../../config')
const { Types : {ObjectId} } = mongoose

const router = express.Router()


router.post('/register', 
[
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
],expressAsyncHandler(async(err, req, res, next)=>{
   
    const result = validationResult(req)
    console.log('에러내용', err)
    // if (err.name === 'MongoServerError' && err.code === 11000) {
    //     // Duplicate username
    //     return res.status(422).send({ succes: false, message: '이미 존재하' });
    // }
        if(result.errors.length > 0){
        console.log('에러목록: ', result.errors.map((v)=>v.msg))
        res.json({
            code:400,
            error: result.errors.map((v)=>v.msg)})
    }else{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        const newUser = await user.save() // DB에 User 생성
        if(!newUser){
            res.status(401).json({ code:401, message: 'Invalid User Data'})
        }else{
            const { name, email, isAdmin, createdAt } = newUser
            res.json({
                code:200,
                name, email, isAdmin, createdAt
            })
        }
    }    
}
))

router.post('/login', expressAsyncHandler(async(req, res, next)=>{
    const userId = req.body.email
    const userPw = req.body.pw
   try{ 
    const users = await User.find({})
    if(!users.userId){
        res.json('존재하지 않는 아이디 입니다')
        console.log('존재하지 않는 아이디 입니다')
    }else if(userId !== users.userId || userPw !== users.password){
        res.json('아이디와 비밀번호를 확인해주세요')
        console.log('아이디와 비밀번호를 확인해주세요')
    }
    else{
        res.json('로그인 성공')
        console.log('로그인 성공')        
    }
   }catch(err){
    res.json(err)
    console.log(err)
   }
}))

router.post('/logout', expressAsyncHandler(async(req, res, next)=>{
    res.clearCookie('midbar_token').redirect('/')
    res.json('로그아웃')
}))

router.put('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 변경')
}))

router.delete('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 삭제')
}))

module.exports = router
