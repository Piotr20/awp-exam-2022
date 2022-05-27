import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-male-sprites/dist/";

const Avatar = ({ seedProp, className }) => {
  let svg = createAvatar(style, {
    seed: seedProp ? seedProp : "default",
  });
  return <span className={`flex ${className}`} dangerouslySetInnerHTML={{ __html: svg }}></span>;
};
export default Avatar;
