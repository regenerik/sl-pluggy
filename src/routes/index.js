const { Router } = require('express');
const router = Router();


// Importando los routers;
const quotes = require("./quotesRoute");
const average = require('./averageRoute');
const slippage = require('./slippageRoute')


// Configurar los routers;
router.use("/quotes", quotes)
router.use('/average', average)
router.use('/slippage', slippage)


module.exports = router;
