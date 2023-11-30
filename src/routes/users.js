const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

const mongoose = require('mongoose')
const { generateToken } = require('../../auth')
const {  JWT_SECRET } = require('../../config')
const { Types : {ObjectId} } = mongoose

const router = express.Router()


router.post('/register', 
[
    body('name')
    .exists()
    .withMessage('이름을 입력하세요')
    .isString()
    .withMessage('이름은 문자만 입력가능합니다')
    .bail(),
body('email')
    .exists()
    .withMessage('이메일을 입력하세요')
    .isEmail()
    .withMessage('이메일 형식이 아닙니다')
    .bail(),
body('userId')
    .exists()
    .withMessage('아이디를 입력하세요')  
    .isString()
    .withMessage('아이디는 문자만 입력가능합니다')
    .bail(),
body('password')
    .exists()
    .withMessage('비밀번호를 입력하세요')
    .isString()
    .withMessage('비밀번호는 문자만 입력가능합니다')
    .bail()
]
,expressAsyncHandler(async(req, res, next)=>{

    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code:400,
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            userId: req.body.userId,
            password: req.body.password
        })
        const newUser = await user.save() // DB에 User 생성
        if(!newUser){
            res.status(401).json({ code:401, message: 'Invalid User Data'})
        }else{
            const { name, email, userId, isAdmin, createdAt } = newUser
            res.cookie('midbar_token', generateToken ,{
                path:'/',
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
            })
            res.json({
                code:200,
                token: generateToken(newUser),
                name, email, userId, isAdmin, createdAt
            })
        }
    }    
}
))

router.post('/login', expressAsyncHandler(async(req, res, next)=>{
    const userId = req.body.id
    const userPw = req.body.pw
    console.log(id, pw)
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
