const axios = require("axios");
const cheerio = require("cheerio");
const {Quotes} = require("./db");
const ambitoUrl = "https://mercados.ambito.com//dolar/informal/variacion"
const dolarHoyUrl = "https://dolarhoy.com/cotizaciondolarblue"
const cronistaUrl = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"

const scraping = async() =>{

    try{
        setInterval(async() => {
            const ambito = await getAmbitoData()
            const dolarHoy = await getDolarHoyData()
            const cronista = await getCronistaData()
            let quotes = (await Quotes.findAll())
            if(!quotes){
                await Quotes.bulkCreate([ambito,dolarHoy,cronista])
            }else{
                Quotes.update(ambito, {where:{source:ambitoUrl}})
                Quotes.update(dolarHoy, {where:{source:dolarHoyUrl}})
                Quotes.update(cronista, {where:{source:cronistaUrl}})
            }
            console.log("Scraped")
          }, 4000);

    }catch(err){
        console.log(err.message)
    }
}

async function getAmbitoData(){
    try{
        const ambitoUrl = "https://mercados.ambito.com//dolar/informal/variacion"
        const ambitoData = (await axios.get(ambitoUrl)).data
        return{
            buy_price:parseFloat(ambitoData.compra.replace(",",".")),
            sell_price:parseFloat(ambitoData.venta.replace(",",".")),
            source: ambitoUrl
        }
    }catch(err){
    console.log("ambito"+err)
    }
}

async function getDolarHoyData(){
    try{
        const dolarHoyUrl = "https://dolarhoy.com/cotizaciondolarblue"
        let dolarHoyData = (await axios.get(dolarHoyUrl)).data

        const $ = cheerio.load(dolarHoyData)

        let dolarHoyStr = $(".value", dolarHoyData).text()

        return{
            buy_price: parseFloat(dolarHoyStr.slice(1,7)),
            sell_price: parseFloat(dolarHoyStr.slice(8,14)),
            source: dolarHoyUrl
        }
    }catch(err){
        console.log("dolarHoy"+err)
    }
}

async function getCronistaData(){
    try{
        const cronistaUrl = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
        let cronistaData = (await axios.get(cronistaUrl)).data

        const $ = cheerio.load(cronistaData)

        let cronistaBuy = $(".buy-value", cronistaData).text().replace(",",".")
        let cronistaSell = $(".sell-value", cronistaData).text().replace(",",".")
    
        return{
            buy_price: parseFloat(cronistaBuy.slice(1,7)),
            sell_price: parseFloat(cronistaSell.slice(1,7)),
            source: cronistaUrl
        }
    }catch(err){
        console.log("cronista"+err)
    }

}

//------------------------Promedio-------------------------

const averageForAll = async()=>{
    const quotes = await Quotes.findAll()
    console.log(quotes)
    const acum = 0
    let average_buy_price = parseFloat(((quotes.reduce((sum,ele)=> sum += ele.dataValues.buy_price,acum))/3).toFixed(2))
    let average_sell_price = parseFloat(((quotes.reduce((sum,ele)=> sum += ele.dataValues.sell_price,acum))/3).toFixed(2))
    console.log(typeof average_sell_price)
    return {average_buy_price,average_sell_price};
}

module.exports={
    scraping,
    averageForAll
}