const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

const mongoose = require('mongoose')
const { Types : {ObjectId} } = mongoose

const router = express.Router()

router.post('/register', expressAsyncHandler(async(req, res, next)=>{
    const userName = req.body.name
    const userId = req.body.userId
    const userEmail= req.body.email
    const userPw = req.body.password
    // form exp
    try{
        const users = await User.find({})
        res.status(200).json({
            code: 200,
            message: '회원가입 서버 응답'
        })
        if(userEmail == users.email){ // 이메일은 unique 설정되어있으니 버튼없어도 되나?
            res.json('이미 존재하는 이메일 입니다') 
            console.log('이미 존재하는 이메일 입니다')
        }
        else if(userId == users.userId){  // 아이디 중복체크 버튼 있어야함
            res.json('이미 존재하는 아이디 입니다') 
            console.log('이미 존재하는 아이디 입니다')
        } 
        else if(!userName || !userEmail || !userName || !userPw){ 
            res.json('정보를 모두 입력해주세요') 
            console.log('정보를 모두 입력해주세요')
        }
        else
        {
            const userData = {
                id: userId,

            }
            console.log('가입이 가능합니다')

        }
    }catch(error){
        console.log(error)
        res.status(500).json({error, code:500, message: '오류발생'})
    }
}))

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
    res.json('로그아웃')
}))

router.put('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 변경')
}))

router.delete('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 삭제')
}))

module.exports = router