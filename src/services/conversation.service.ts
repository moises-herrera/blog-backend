import {
  IConversation,
  IConversationDocument,
  IStandardObject,
  IStandardResponse,
  PaginatedResponse,
  PaginationOptions,
} from 'src/interfaces';
import { Conversation } from 'src/models';
import { HttpError } from 'src/utils';

/**
 * Find all conversations of a user.
 *
 * @param userId The user id.
 * @returns The conversations.
 */
export const findAll = async (
  userId: string,
  paginationOptions?: PaginationOptions
): Promise<PaginatedResponse<IConversationDocument>> => {
  const { page = 1, limit = 10 } = paginationOptions || {};

  const conversationsResult = await Conversation.aggregate<{
    conversations: IConversationDocument[];
    resultsCount: [{ count: number }];
  }>([
    {
      $match: {
        participants: { $in: [userId] },
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    {
      $facet: {
        conversations: [
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
        ],
        resultsCount: [
          {
            $count: 'count',
          },
        ],
      },
    },
  ]);

  const { conversations, resultsCount } = conversationsResult[0];

  const response: PaginatedResponse<IConversationDocument> = {
    data: conversations,
    resultsCount: resultsCount[0]?.count || 0,
    page,
    total: resultsCount[0]?.count || 0,
  };

  return response;
};

/**
 * Find a conversation.
 *
 * @param id The conversation id.
 * @param include The fields to include.
 * @returns The conversation.
 */
export const findOne = async (
  filter: IStandardObject = {},
  include: string = ''
): Promise<IConversationDocument | null> => {
  const conversation = await Conversation.findById(filter).populate(include);

  return conversation;
};

/**
 * Find a conversation by id.
 *
 * @param id The conversation id.
 * @param include The fields to include.
 * @returns The conversation found.
 */
export const findById = async (
  id: string,
  include: string = ''
): Promise<IConversationDocument | null> => {
  const post = await findOne({ _id: id }, include);
  return post;
};

/**
 * Create a new conversation.
 *
 * @param conversation Conversation data.
 * @returns The created conversation.
 */
export const createOne = async (
  conversation: IConversation
): Promise<IStandardResponse<IConversation>> => {
  const conversationCreated = await Conversation.create(conversation);

  const response: IStandardResponse<IConversation> = {
    message: 'Conversación creada correctamente',
    data: conversationCreated,
  };

  return response;
};

/**
 * Update a conversation by id.
 *
 * @param id The conversation id.
 * @param conversation The conversation data.
 * @returns The updated conversation.
 */
export const updateOne = async (
  id: string,
  conversation: IConversation
): Promise<IStandardResponse<IConversation>> => {
  const conversationUpdated = await Conversation.findByIdAndUpdate(
    id,
    conversation,
    { new: true }
  );

  if (!conversationUpdated) {
    throw new HttpError('Conversación no encontrada', 404);
  }

  const response: IStandardResponse<IConversation> = {
    message: 'Conversación actualizada correctamente',
    data: conversationUpdated,
  };

  return response;
};

/**
 * Delete a conversation by id.
 * 
 * @param id The conversation id. 
 * @returns A standard response. 
 */
export const deleteOne = async (
  id: string
): Promise<IStandardResponse<IConversation>> => {
  const conversationDeleted = await Conversation.findByIdAndDelete(id);

  if (!conversationDeleted) {
    throw new HttpError('Conversación no encontrada', 404);
  }

  const response: IStandardResponse<IConversation> = {
    message: 'Conversación eliminada correctamente',
  };

  return response;
};
