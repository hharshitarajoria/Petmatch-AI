import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { ApiSuccessResponse } from '../types';
import { AuthResponseData } from '../types/auth.types';

export async function register(
  req: Request<unknown, unknown, RegisterInput>,
  res: Response<ApiSuccessResponse<AuthResponseData>>
): Promise<void> {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
}

export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response<ApiSuccessResponse<AuthResponseData>>
): Promise<void> {
  const result = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
}
