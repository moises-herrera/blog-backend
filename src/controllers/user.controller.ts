import { Request, Response } from 'express';
import { RequestExtended } from 'src/interfaces';
import {
  deleteOne,
  findAll,
  findById,
  updateOne,
  verifyUserEmail,
} from 'src/services/user.service';
import { HttpError, handleHttpError } from 'src/utils';

/**
 * Get all users.
 *
 * @param _req The request object.
 * @param res The response object.
 */
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await findAll();
  res.send(users);
};

/**
 * Get a user.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await findById(id);

    res.send(user);
  } catch (error) {
    const httpError =
      error instanceof HttpError
        ? error
        : new HttpError('Internal server error.', 500);

    handleHttpError(res, httpError);
  }
};

/**
 * Update a user.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const responseUser = await updateOne(id, req.body);

    res.send(responseUser);
  } catch (error) {
    const httpError =
      error instanceof HttpError
        ? error
        : new HttpError('Internal server error.', 500);

    handleHttpError(res, httpError);
  }
};

/**
 * Delete a user.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const deleteUser = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const responseUser = await deleteOne(id);

    res.send(responseUser);
  } catch (error) {
    const httpError =
      error instanceof HttpError
        ? error
        : new HttpError('Internal server error.', 500);

    handleHttpError(res, httpError);
  }
};

/**
 * Verify user email.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const verifyEmail = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    const responseUser = await verifyUserEmail(userId);

    res.send(responseUser);
  } catch (error) {
    const httpError =
      error instanceof HttpError
        ? error
        : new HttpError('Internal server error.', 500);

    handleHttpError(res, httpError);
  }
};
