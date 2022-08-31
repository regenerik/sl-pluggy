const axios = require("axios");
const cheerio = require("cheerio");
const {Quotes} = require("./db");
const ambitoUrl: string = "https://mercados.ambito.com//dolar/informal/variacion"
const dolarHoyUrl: string = "https://dolarhoy.com/cotizaciondolarblue"
const cronistaUrl: string = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"

interface Article {
    buy_price?: number;
    sell_price?: number;
    source?: string;
} 


const scraping = async():Promise<void> =>{

    try{
        setInterval(async():Promise<void> => {
            const ambito: Article | undefined = await getAmbitoData()
            const dolarHoy: Article | undefined = await getDolarHoyData()
            const cronista: Article | undefined = await getCronistaData()
            let quotes: Quote[] = (await Quotes.findAll())
            let concat: (Article|undefined)[]=[ambito,dolarHoy,cronista]
            if(!quotes.length){
                await Quotes.bulkCreate(concat)
            }else{
                Quotes.update(ambito, {where:{source:ambitoUrl}})
                Quotes.update(dolarHoy, {where:{source:dolarHoyUrl}})
                Quotes.update(cronista, {where:{source:cronistaUrl}})
            }
            console.log("Scraped")
          }, 10000);

    }catch(err: any){
        console.log(err.message)
    }
}

async function getAmbitoData():Promise<Article |undefined>{
    try{
        const ambitoData: ambito = (await axios.get(ambitoUrl)).data
        const articulo: Article ={
            buy_price:parseFloat(ambitoData.compra.replace(",",".")),
            sell_price:parseFloat(ambitoData.venta.replace(",",".")),
            source: ambitoUrl
        }
        return articulo
    }catch(err:any){
    console.log(err.message)
    }
}

async function getDolarHoyData():Promise<Article |undefined>{
    try{
        let dolarHoyData:string = (await axios.get(dolarHoyUrl)).data

        const $:any = cheerio.load(dolarHoyData)

        let dolarHoyStr:string = $(".value", dolarHoyData).text()
        const articulo: Article ={
            buy_price: parseFloat(dolarHoyStr.slice(1,7)),
            sell_price: parseFloat(dolarHoyStr.slice(8,14)),
            source: dolarHoyUrl
        }
        return articulo;
    }catch(err:any){
        console.log(err.message)
    }
}

async function getCronistaData():Promise<Article |undefined>{
    try{
        let cronistaData:string = (await axios.get(cronistaUrl)).data

        const $:any = cheerio.load(cronistaData)

        let cronistaBuy:string = $(".buy-value", cronistaData).text().replace(",",".")
        let cronistaSell:string = $(".sell-value", cronistaData).text().replace(",",".")

        const articulo: Article ={
            buy_price: parseFloat(cronistaBuy.slice(1,7)),
            sell_price: parseFloat(cronistaSell.slice(1,7)),
            source: cronistaUrl
        }
        return articulo
    }catch(err:any){
        console.log(err.message)
    }

}
//------------------------interfaces para getAmbitoData--------------------------------
    interface ambito{
        compra: string;
        venta: string;
        fecha: string;
        variacion: string;
        "class-variacion": string;
    }
//------------------------interfaces para promedios------------------------------------
interface Quote {
    dataValues:Values;
    _previousDataValues:Values;
    uniqno: number;
    _changed: Set<any>;
    _options:Options;
    isNewRecord: boolean
}
interface Values{
    buy_price: number;
    sell_price: number;
    source: string;
}

interface Options{
    isNewRecord: boolean,
    _schema: null,
    _schemaDelimiter: string,
    raw: boolean,
    attributes: string[]
}
//------------------------Interfaz promedio----------------
interface Average{
    average_buy_price: number;
    average_sell_price: number;
  }

//------------------------Promedio-------------------------




const averageForAll = async():Promise<Average | undefined>=>{
    const quotes:Quote[] = await Quotes.findAll()
    const acum:number = 0
    let average_buy_price:number = parseFloat(((quotes.reduce((sum:number,ele:Quote)=> sum += ele.dataValues.buy_price,acum))/3).toFixed(2))
    let average_sell_price:number = parseFloat(((quotes.reduce((sum:number,ele:Quote)=> sum += ele.dataValues.sell_price,acum))/3).toFixed(2))

    const average:Average ={
        average_buy_price,
        average_sell_price
    };
    return average;
}

module.exports={
    scraping,
    averageForAll
}