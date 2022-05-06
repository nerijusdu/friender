import type { ImageProps} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

export type UserImageProps = ImageProps & {
  size?: 'md' | 'lg';
}

const UserImage : React.FC<UserImageProps> = (props) => {
  return (
    <Image
      src="/profile.jpg"
      rounded="full"
      w={props.size === 'lg' ? '100px' : '50px'}
      h={props.size === 'lg' ? '100px' : '50px'}
      {...props}
    />
  );
};

export default UserImage;
