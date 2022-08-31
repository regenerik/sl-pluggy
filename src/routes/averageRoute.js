const { Router } = require('express');
const router = Router();
const { averageForAll } = require("../generalControllerss.js")

router.get("/",async(req,res)=>{
    res.send(await averageForAll())
});





module.exports = router;