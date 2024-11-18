
export const register = async (req, res) => {
    const { name, phone, password } = req.body

    try {
        if (name || phone || password)
            return res.status(400).json({
                err: 1,
                msg: 'Missing input '
            })

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fall at auth controller: ' + error
        })
    }
}