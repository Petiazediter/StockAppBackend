const app = async () => {
    console.log('Hello world!')
}

app()
    .catch(e => console.error(e))
    .then( () => console.log('Shutting down...'))
    .then( () => process.exit())
