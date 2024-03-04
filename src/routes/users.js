const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

// express-validator
const { validationResult } = require('express-validator')
const {    
    validateUserName,
    validateUserMobile,
    validateUserEmail,
    validateUserPassword
} = require('../../validator')

// 토큰 생성
const { generateToken } = require('../../auth')

// 비밀번호 암호화(해싱)
const bcrypt = require('bcrypt')

// twilo 연동
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// 라우터 설정
const router = express.Router()

// 비밀번호 암호화(해싱)
async function hashPassword(password){
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.log('Hashing failed', error)
        throw new Error('Hashing failed', error)
    }
}

// 회원가입 
router.post('/register', 
[
    validateUserName(),
    validateUserMobile(),
    validateUserEmail(),
    validateUserPassword()
],expressAsyncHandler(async(req, res, next)=>{
   
    const result = validationResult(req)
    const password = req.body.password
    const passwordConfirm = req.body.passwordConfirm

    console.log('리퀘바디', req.body)

        if(result.errors.length > 0){
        console.log('에러목록: ', result.errors.map((v)=>v.msg))
        res.json({
            code:400,
            error: result.errors.map((v)=>v.msg)})
    }else if(password !== passwordConfirm){
        res.json({
            code:400,
            message: '비밀번호와 비밀번호 확인창 입력내용이 일치하지 않습니다.'
        })
        return
    }
    else{
        const hashedPassword = await hashPassword(password)
        const user = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: hashedPassword,
            passwordConfirm: hashedPassword
        })
       
        const newUser = await user.save() // DB에 User 생성
        if(!newUser){
            res.status(401).json({ code:401, message: 'Invalid User Data'})
        } else{
            const { name, mobile, email, isAdmin, createdAt } = newUser
            res.json({
                code:200,
                name,mobile, email, isAdmin, createdAt
            })
        }
    }    
}
))

// 로그인
router.post('/login', expressAsyncHandler(async(req, res, next)=>{
    const userEmail = req.body.email
    const userPw = req.body.password
    console.log('리퀘바디', req.body)
   try{ 
    const users = await User.findOne({
        email: userEmail
    })
    console.log('유저', users)
    const passwordMatch = await bcrypt.compare(userPw, users.password)
    console.log('userPw :',userPw, 'users.password :', users.password)

    if(users === null){
        res.json({
            code : 400,
            message: '아이디와 비밀번호를 확인해주세요'
        })
        console.log('아이디와 비밀번호를 확인해주세요')
    }   
    else if(userEmail !== users.email || !passwordMatch){
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

// 로그인 상태 확인
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

// 로그아웃
router.post('/logout', expressAsyncHandler(async(req, res, next)=>{
    res.clearCookie('midbar_token')
    console.log('로그아웃 되었습니다.')
    res.json({
        code:200, 
        message: '로그아웃 되었습니다.',
        token: ''
    })
}))

// 비밀번호 찾기
router.post('/findPw', expressAsyncHandler(async(req, res, next)=>{
    const userEmail = req.body.userId
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hashPassword(tempPassword)
    console.log('tempPassword: ',tempPassword)
    console.log('리퀘바디', req.body.userId)
    try{
        const users = await User.findOne({email: userEmail})
        if(!users){
            res.json({
                code: 400,
                message: '가입된 회원이 아닙니다.'
            })
            console.log('가입된 회원이 아닙니다.')
        } else{
            users.password = hashedPassword
            const temporaryPw= await users.save()
            res.json({
                code: 200,
                message: '임시 비밀번호가 발급되었습니다.',
                userData : users.mobile
            })
            // 트윌로 통해서 문자전송
            const convertedPhoneNumber = `+82${users.mobile.slice(1)}`;
            client.messages
                .create({
                    body: `임시비밀번호 ${tempPassword} 로그인 후 비밀번호를 변경해주세요.`,
                    from: process.env.TWILIO_SENDER_PHONE,
                    to: `${convertedPhoneNumber}`
                })
                .then(message => console.log(message.sid));
        }
    }catch(err){
        res.json({
            code: 400, 
            message: '비밀번호 찾기 에러',
        })
        console.log('비밀번호 찾기 에러 :', err)
    }
}))


router.put('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 변경')
}))

router.delete('/:id', expressAsyncHandler(async(req, res, next)=>{
    res.json('사용자정보 삭제')
}))

module.exports = router
