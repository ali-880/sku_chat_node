const Joi = require("joi")

const userRegisterValidation=(data)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        lastName:Joi.string().required(),
        password:Joi.string().min(6).max(20).required(),
        studentNumber:Joi.string().min(9).max(9).required(),
        role:Joi.string().required(),
        group:Joi.string().required(),
        enteringYear:Joi.number().required(),

    })
    const valid=schema.validate(data);
    if(valid.error){
        return valid.error.message;
    }
}
module.exports.userRegisterValidation=userRegisterValidation