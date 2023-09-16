import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
  IStandardObject,
  PaginationOptions,
  RequestExtended,
  SelectOptions,
} from 'src/interfaces';
import {
  createOne,
  deleteOne,
  findAll,
  findById,
  getLikes,
  likeOne,
  removeLikeOne,
  updateOne,
} from 'src/services/post.service';
import * as userService from 'src/services/user.service';
import { handleHttpError } from 'src/utils';

/**
 * Get all posts.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getPosts = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  const { id: currentUserId } = req;
  const { following, suggested, userId, search, limit, page } = req.query;
  const filter: IStandardObject = {};

  if (following) {
    const followingUsers = await userService.getFollowingIds(
      currentUserId as string
    );
    filter.user = { $in: followingUsers };
  } else if (suggested) {
    filter.user = { $ne: new Types.ObjectId(currentUserId as string) };
  } else if (userId) {
    filter.user = new Types.ObjectId(userId as string);
  } else if (typeof search === 'string') {
    filter.user = { $ne: new Types.ObjectId(currentUserId as string) };
    filter.topic = { $regex: search, $options: 'i' };
  }

  const selectOptions: SelectOptions = {
    include: 'user',
    select:
      'firstName lastName username avatar followers isAccountVerified isFounder',
  };

  const paginationOptions: PaginationOptions = {
    limit: Number(limit) || 10,
    page: Number(page) || 1,
  };

  const posts = await findAll(filter, selectOptions, paginationOptions);
  res.send(posts);
};

/**
 * Get a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await findById(id, 'user');

    res.send(post);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Create a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const createPost = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id: userId } = req;
    const postData = { ...req.body, user: userId };
    const imageBuffer = req.file?.buffer;

    const post = await createOne(postData, imageBuffer);

    res.send(post);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Update a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const updatePost = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { id: userId } = req;
    const postData = { ...req.body, user: userId };
    const imageBuffer = req.file?.buffer;
    const responsePost = await updateOne(id, postData, imageBuffer);

    res.send(responsePost);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Delete a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const deletePost = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const responsePost = await deleteOne(id);

    res.send(responsePost);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Like a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const likePost = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id: userId } = req;
    const { id: postId } = req.params;

    const responsePost = await likeOne(postId, userId as string);

    res.send(responsePost);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Unlike a post.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const unlikePost = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id: userId } = req;
    const { id: postId } = req.params;

    const responsePost = await removeLikeOne(postId, userId as string);

    res.send(responsePost);
  } catch (error) {
    handleHttpError(res, error);
  }
};

/**
 * Get post likes.
 *
 * @param req The request object.
 * @param res The response object.
 */
export const getPostLikes = async (
  req: RequestExtended,
  res: Response
): Promise<void> => {
  try {
    const { id: postId } = req.params;
    const { username, limit, page } = req.query;

    const filter: IStandardObject = {};

    if (username) {
      filter.username = { $regex: username as string, $options: 'i' };
    }

    const paginationOptions: PaginationOptions = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
    };

    const responsePost = await getLikes(postId, filter, paginationOptions);

    res.send(responsePost);
  } catch (error) {
    handleHttpError(res, error);
  }
};
