import { randParagraph, randSentence } from "@ngneat/falso";
import { Post } from "../interfaces/post.interface";

const generatePost = (userId?: number): Post => {
  return {
    user_id: userId,
    title: randSentence({ maxCharCount: 100 }),
    body: randParagraph(),
  };
};

export default generatePost;
