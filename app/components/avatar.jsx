import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-male-sprites/dist/";

const Avatar = ({ seedProp, className }) => {
  let svg = createAvatar(style, {
    seed: seedProp,
  });
  return <span className={`w-12 h-12 flex ${className}`} dangerouslySetInnerHTML={{ __html: svg }}></span>;
};
export default Avatar;
