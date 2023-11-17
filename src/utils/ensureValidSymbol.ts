import stock from '../services/stock'

const ensureValidSymbol = async (symbol: string) => {
    const { data } = await stock.getStocksBySymbol(symbol)

    if ( data.result.length === 0 || !data.result.find( v => v.symbol.toUpperCase() === symbol.toUpperCase() ) ) {
        throw new Error('Invalid symbol')
    }
}

export default ensureValidSymbol