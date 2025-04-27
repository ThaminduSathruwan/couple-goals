import jwt, {JwtPayload} from 'jsonwebtoken';
import { User } from '@prisma/client'; // Assuming User is the type from your Prisma model

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Function to verify the token and return decoded user
export const verifyToken = (token: string): User | JwtPayload => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Type narrowing: check if decoded token contains the necessary user properties
        if (isUser(decoded)) {
            return decoded; // Safe to return as a User
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (err) {
        throw new Error('Token verification failed');
    }
};

// Type guard to check if the decoded token is a valid User
function isUser(decoded: JwtPayload | string): decoded is User {
    return (decoded as User).id !== undefined && (decoded as User).email !== undefined;
}

// Middleware to check if the user is authenticated
export const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header (Bearer token)

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach decoded user to request object
        next(); // Proceed to the next middleware or handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, token is invalid or expired' });
    }
};
