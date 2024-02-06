const express = require('express');
const router = express.Router();
const { Types: { ObjectId } } = require('mongoose')
const OtpNumber = require('../models/OtpNumber')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

// twilo 연동
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// otp 생성
router.post('/generateOtp', expressAsyncHandler(async (req, res, next) => {
    console.log('otp 생성 리퀘바디', req.body)

    try {
        const user = await User.findOne({ name: req.body.name, mobile: req.body.mobile })

        if (!user) {
            res.json({
                code: 400,
                message: '등록된 사용자가 없습니다.'
            })
        } else {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('code :', code)
        const otpNumber = new OtpNumber({
            name: req.body.name,
            mobile: req.body.mobile,
            code: code,
            count: req.body.count
        })
        await otpNumber.save()
        if (otpNumber && otpNumber.count > 3) {
            res.json({
                code: 400,
                message: '인증 횟수 초과, 잠시 후 다시 시도해주세요.'
            })
        }
        if (otpNumber && otpNumber.count < 4) {
            const convertedPhoneNumber = `+82${req.body.mobile.slice(1)}`;
            client.messages
                .create({
                    body: `인증번호는 ${code} 입니다.`,
                    from: process.env.TWILIO_SENDER_PHONE,
                    to: `${convertedPhoneNumber}`
                })
                .then(message => console.log(message.sid));
            user.authCount = user.authCount + 1
            otpNumber.count = otpNumber.count + 1    
            console.log('유저정보',user)
            await otpNumber.save()
            await user.save()
        }
        if (user.authCount > 9) {
            res.json({
                code: 400,
                message: '인증 횟수 초과, 24시간 후 다시 시도해주세요.'
            })
            // 24시간 후 authCount 초기화
            setTimeout(() => {
                user.authCount = 0
                user.save()
            }, 86400000)
        }
        console.log('otpNumber :', otpNumber)
        return res.json({
            code: 200,
            message: 'otp 생성 성공',
            result: otpNumber
        })
        }
    }
    catch (err) {
        console.log('otp 생성 에러 :', err)
        res.json({
            code: 500,
            message: 'otp 생성 실패',
            err
        })
    }
}))

// otp 확인
router.post('/checkOtp', expressAsyncHandler(async (req, res, next) => {
    console.log('otp 확인', req.body)
    try {
        const authUser = await OtpNumber.findOne({name: req.body.name , mobile: req.body.mobile, otp: req.body.otp})
        if(!authUser){
            res.json({
                code: 400,
                message: '인증번호가 일치하지 않습니다.'
            })
        } else {
            res.json({
                code: 200,
                message: 'otp 확인 성공',
                result: authUser.email
            })
    }}
    catch (err) {
        console.log('otp 확인 에러 :', err)
        res.json({
            code: 500,
            message: 'otp 확인 실패',
            err
        })
    }
}))
    
    
module.exports = router