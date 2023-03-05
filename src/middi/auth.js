const jwt = require("jsonwebtoken")



const authentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, message: "Header token is required !" });
        }
// ================================== verifying token ===========================================================
        jwt.verify(token, 'secrateKey', function (err, decoded) {
            if (err) {
                return res.status(401).send({ message: err.message })
            }
            else {
                req.decodedToken = decoded
                next()
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
module.exports ={authentication}