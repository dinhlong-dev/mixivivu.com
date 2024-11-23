

const registerService = () => new Promise (async(resolve, reject) => {
    try {
        
    } catch (error) {
        reject(error)
    }
})

export const loginService = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true
        })
        const isCorrectPassword = response && bcrypt.compareSync(password, response.password)
        const token = isCorrectPassword && jwt.sign({ id: response.id, email: response.email }, process.env.SECRET_KEY, { expiresIn: '2d' })
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Login is successfully !' : response ? 'Password is wrong !' : 'email not found !',
            token: token || null
        })

    } catch (error) {
        reject(error)
    }
})