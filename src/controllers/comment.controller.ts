import { Request, Response } from 'express';
import { IStandardObject, RequestExtended } from 'src/interfaces';
import {
  createOne,
  deleteOne,
  findAll,
  findById,
  updateOne,
} from 'src/services/comment.service';
import { handleHttpError } from 'src/utils';

/**
 * Get all comments.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.query;
  const filter: IStandardObject = {};

  if (postId) {
    filter.post = postId;
  }

  const comments = await findAll(filter);
  res.send(comments);
};

/**
 * Get a comment.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await findById(id);

    res.send(comment);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Create an comment.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const createComment = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const comment = await createOne(req.body);

    res.send(comment);
  } catch (error) {
    console.log(error);
    handleHttpError(res, error);
  }
};

/**
 * Update a comment.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const responseComment = await updateOne(id, req.body);

    res.send(responseComment);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Delete a comment.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const deleteComment = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const responseComment = await deleteOne(id);

    res.send(responseComment);
  } catch (error) {
    handleHttpError(res, error);
  }
};
