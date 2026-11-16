import type { NextFunction, Request, Response } from "express";

export const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error", error.message);
  return res.status(500).json({
    message: "Something Went Wrong",
  });
};
