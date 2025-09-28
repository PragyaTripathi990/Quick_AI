import jwt from "jsonwebtoken";

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},
             process.env.JWT_SECRET,
              {expiresIn: '10d'})
        return token
    } catch (errors) {
        console.error("Token generation error:", errors);
    }
}

export default genToken;
