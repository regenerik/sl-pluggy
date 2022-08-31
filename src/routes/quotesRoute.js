const { Router } = require('express');
const router = Router();
const {Quotes} = require("../db")

router.get("/",async(req,res)=>{

    res.send(await Quotes.findAll())
    
});





module.exports = router;