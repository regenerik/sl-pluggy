const { Router } = require('express');
const router = Router();
const {Quotes} = require("../db")
const { averageForAll } = require("../generalControllerss.js")

router.get("/",async(req,res)=>{
    let quotes = await Quotes.findAll()
    let averages = await averageForAll()


    quotes = quotes.map((e)=>{
        return{
            buy_price_slippage:parseFloat((e.dataValues.buy_price - averages.average_buy_price).toFixed(2)),
            sell_price_slippage:parseFloat((e.dataValues.sell_price - averages.average_sell_price).toFixed(2)),
            source: e.dataValues.source
        }
    })
    res.send(quotes)
});





module.exports = router;