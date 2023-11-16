import axios from 'axios'

interface SearchResults {
    count: number
    result: Record<string, any>[]
}

const ensureValidSymbol = async (symbol: string) => {
    const { data } = await axios.get<SearchResults>(`https://www.finnhub.io/api/v1//search?q=${symbol}`, {
        headers: {
            'X-Finnhub-Token': process.env.STOCK_API_KEY  || ''
        }
    })

    if ( data.result.length === 0 || !data.result.find( v => v.symbol.toUpperCase() === symbol.toUpperCase() ) ) {
        throw new Error('Invalid symbol')
    }
}

export default ensureValidSymbol