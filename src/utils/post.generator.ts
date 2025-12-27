import { randParagraph, randSentence } from "@ngneat/falso";
import { Post } from "../interfaces/post.interface";

const generatePost = (userId?: number): Post => {
  return {
    user_id: userId,
    title: randSentence(),
    body: randParagraph(),
  };
};

export default generatePost;
