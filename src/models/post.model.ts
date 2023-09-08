import { Schema, model } from 'mongoose';
import { IPost, IPostDocument, IPostModel } from 'src/interfaces';

const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    topic: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
        default: [],
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: [],
      }
    ]
  },
  {
    timestamps: true,
  }
);

PostSchema.statics.buildPost = (post: IPost) => {
  return new Post(post);
};

const Post = model<IPostDocument, IPostModel>(
  'posts',
  PostSchema
);

export default Post;