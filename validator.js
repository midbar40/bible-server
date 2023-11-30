const { body } = require('express-validator');

const validate = [
        body('name')
            .isEmpty()
            .withMessage('이름을 입력하세요')
            .isString()
            .withMessage('이름은 문자만 입력가능합니다')
            .bail(),
        body('email')
            .isEmpty()
            .withMessage('이메일을 입력하세요')
            .isEmail()
            .withMessage('이메일 형식이 아닙니다')
            .bail(),
        body('userId')
            .isEmpty()
            .withMessage('아이디를 입력하세요')  
            .isString()
            .withMessage('아이디는 문자만 입력가능합니다')
            .bail(),
        body('password')
            .isEmpty()
            .withMessage('비밀번호를 입력하세요')
            .isString()
            .withMessage('비밀번호는 문자만 입력가능합니다')
            .bail()
        ]

module.exports = validate