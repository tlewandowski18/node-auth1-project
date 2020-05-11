const sessions = {}

function restrict() {
    const authError = {
        message: "Invalid Credentials"
    }
	return async (req, res, next) => {
        try {
            if (!req.session || !req.session.user) {
                return res.status(401).json(authError)
            }
			next()
		} catch(err) {
			next(err)
		}

	}
}

module.exports = {
    sessions,
    restrict
}