'use strict'

const shopModel = require('../models/shop.model')

class AccessService{

    static signUp = async ({name,email,password})=>{
        try {
            // step1: check email exists??

            const hodelShop = await shopModel.findOne({email}).lean()
            
        } catch (error) {
            return {
                code:'xxx',
                message:error.message,
                status:'error'
            }
        }
    }
}


module.exports = AccessService