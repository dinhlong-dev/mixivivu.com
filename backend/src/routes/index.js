import authRouter from './auth'

const initRoutes = (app) => {
    app.use('/api/v1', authRouter)

    return app.use('/', (req, res) => {
        res.send('server on ....')
    })
}


export default initRoutes