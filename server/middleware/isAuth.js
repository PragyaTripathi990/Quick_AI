import jwt from 'jsonwebtoken';
// isAuth checks if the request has a valid JWT token in cookies.
// Register/Login/Logout = making and giving someone a ticket.

// isAuth = the ticket checker at the entrance of a concert.
// You can’t enter the concert (protected route) without showing the ticket (valid JWT).

const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({message : "Unauthorized"})
        }
        const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifiedToken.userId;

        // Think of isAuth like a security guard at the entrance of multiple rooms in a building:
        // Without middleware → you hire a separate guard for every room (inefficient).
        // With middleware → one guard function is reused everywhere, just stationed at each door.
        next();
    } catch (errors) {
        return res.status(400).json({message: "Unauthorized"})
    }
}
export default isAuth;