import { NextFunction, Request, Response } from "express";
import verifyToken from "./auth";

const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Use the verifyToken middleware to check if the token is valid
  verifyToken(req, res, () => {
    if (req.isAdmin) {
      return next(); // User is an admin, proceed to the next middleware
    }
    return res.status(403).json({ message: "Access denied" }); // User is not an admin
  });
};

export default verifyTokenAdmin;
