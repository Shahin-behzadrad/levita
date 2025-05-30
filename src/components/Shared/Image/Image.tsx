import clsx from 'clsx';
import React, { CSSProperties, useState } from 'react';
import classes from './Image.module.scss';
import NextImage from 'next/image';

import avatar from '@/public/static/images/avatars/avatarPlaceholder.svg';

interface ImageComponentProps {
  src?: string | undefined;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  onClick?: () => void;
  caption?: string;
  hasPlaceholder?: boolean;
  shape?: 'circle' | 'square' | 'default';
  style?: CSSProperties;
  imageClassName?: string;
}

const Image: React.FC<ImageComponentProps> = ({
  style,
  src,
  alt = 'image',
  width = 40,
  height = 40,
  className,
  onClick,
  caption,
  imageClassName,
  hasPlaceholder = true,
  shape = 'circle',
  fill = false,
  ...props
}) => {
  const [placeholder, setPlaceHolder] = useState<boolean>(hasPlaceholder);

  const handleImageError = () => {
    if (hasPlaceholder) {
      setPlaceHolder(true);
    }
  };

  const handleImageLoad = () => {
    setPlaceHolder(false);
  };

  return (
    <div
      className={clsx(className, classes.imageContainer)}
      onClick={onClick}
      style={style}
    >
      <NextImage
        src={src ?? avatar}
        alt={alt}
        fill={fill}
        width={fill ? 0 : width}
        height={fill ? 0 : height}
        {...props}
        className={clsx(classes.image, imageClassName, {
          [classes.circularImage]: shape === 'circle',
          [classes.squarImage]: shape === 'square',
          [classes.defaulImage]: shape === 'default',
          [classes.placeholder]: placeholder
        })}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {caption && <span className={classes.imageCaption}>{caption}</span>}
    </div>
  );
};

export default Image;
