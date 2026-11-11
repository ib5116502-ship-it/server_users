import jwt from "jsonwebtoken"

const JWT_SECRET = "super_secret_key_123"
const JWT_EXPIRES_IN = "24h";

class TokenService{
    generateToken(payload){
        return jwt.sign(payload , JWT_SECRET , {expiresIn: JWT_EXPIRES_IN})
        
    }

    validateAccessToken(token){
        try{
                return jwt.verify(token , JWT_SECRET)
        }catch(err){
                return null
        }
    }
}
export default new TokenService();