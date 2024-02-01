const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
const {    
    validateUserName,
    validateUserMobile,
    validateUserEmail,
    validateUserPassword
} = require('../../validator')
const { generateToken } = require('../../auth')
const router = express.Router()

router.post('/register', 
[
    validateUserName(),
    validateUserMobile(),
    validateUserEmail(),
    validateUserPassword()
],expressAsyncHandler(async(req, res, next)=>{
   
    const result = validationResult(req)
    console.log('리퀘바디', req.body)

        if(result.errors.length > 0){
        console.log('에러목록: ', result.errors.map((v)=>v.msg))
        res.json({
            code:400,
            error: result.errors.map((v)=>v.msg)})
    }else{
        const user = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        })
        const newUser = await user.save() // DB에 User 생성
        if(!newUser){
            res.status(401).json({ code:401, message: 'Invalid User Data'})
        }else{
            const { name, mobile, email, isAdmin, createdAt } = newUser
            res.json({
                code:200,
                name,mobile, email, isAdmin, createdAt
            })
        }
    }    
}
))

router.post('/login', expressAsyncHandler(async(req, res, next)=>{
    const userEmail = req.body.email
    const userPw = req.body.password
    console.log('리퀘바디', req.body)
   try{ 
    const users = await User.findOne({
        email: userEmail
    })
    console.log('유저', users)

    if(users === null){
        res.json({
            code : 400,
            message: '아이디와 비밀번호를 확인해주세요'
        })
        console.log('아이디와 비밀번호를 확인해주세요')
    }   
    else if(userEmail !== users.email || userPw !== users.password){
        res.json({
            code : 400,
            message: '아이디와 비밀번호를 확인해주세요'
        })
        console.log('아이디와 비밀번호를 확인해주세요')
    }
    else{
        res.cookie('midbar_token', generateToken(users), {
            path: '/',
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
        
        res.json({
            code: 200,
            token: generateToken(users), 
            user: users.email,
            message: '로그인 성공'
        })
        console.log('로그인 성공')      
    }  
   }catch(err){
    res.json('로그인에러 :', err)
    console.log('로그인에러 :', err)
   }
}))

router.get('/isLogin', expressAsyncHandler(async(req, res, next)=>{
    if(!req.cookies.midbar_token){
        res.json({
            code:400, 
            message: '로그인한 사용자가 없습니다.',
            token: ''
        })
        console.log('로그인한 사용자가 없습니다.')
    }
        else {
            res.json({
                code:200, 
                message: '로그인 중입니다',
                token: req.cookies.midbar_token
            })
            console.log('로그인 중입니다')
        }
 
}))

router.post('/logout', expressAsyncHandler(async(req, res, next)=>{
    res.clearCookie('midbar_token')
    console.log('로그아웃 되었습니다.')
    res.json({
        code:200, 
        message: '로그아웃 되었습니다.',
        token: ''
    })
}))

router.put('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 변경')
}))

router.delete('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 삭제')
}))

module.exports = router
