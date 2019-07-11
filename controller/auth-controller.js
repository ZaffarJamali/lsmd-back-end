const express = require('express');
const authService = require('./../services/service-factory').serviceFactory.getAuthService();

const authCtrl = express.Router();


authCtrl.use((req, res, next) => {
    res.contentType('application/json');
    next();
  });

  authCtrl.get('/get-profile',authenticate, async(req, res, next)=>{
    
    try{
        let profile = await authService.getProfile(req.user.uid);
        return res.status(200).send(profile);

    }catch(err){
        
        next(err);
    }

});

module.exports = {authCtrl};