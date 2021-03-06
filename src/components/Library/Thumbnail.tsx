import React, { memo, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActivityIndicator } from 'react-native';
import { usePopper } from 'react-popper';

import { colors, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Thumbnail as ThumbnailIcon } from '../Icons';

type Props = {
  url: string;
};

const Thumbnail = ({ url }: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const iconRef = useRef();
  const previewRef = useRef();

  const { styles, attributes } = usePopper(iconRef.current, previewRef.current, {
    placement: 'bottom-end',
    strategy: 'fixed',
  });

  const handleMouseEvent = useCallback((show) => setShowPreview(show), [showPreview]);

  return (
    <CustomAppearanceContext.Consumer>
      {(context) => (
        <>
          <a
            ref={iconRef}
            onMouseEnter={() => handleMouseEvent(true)}
            onMouseLeave={() => handleMouseEvent(false)}
            style={{
              marginRight: 10,
              marginTop: 4,
              marginBottom: 4,
              padding: 6,
              paddingBottom: 0,
              minHeight: 30,
              boxSizing: 'border-box',
              overflow: 'hidden',
              textAlign: 'center',
              borderWidth: 1,
              borderRadius: 3,
              borderColor: context.isDark ? darkColors.border : colors.gray2,
              borderStyle: 'solid',
            }}>
            <ThumbnailIcon
              fill={
                context.isDark
                  ? showPreview
                    ? colors.primary
                    : darkColors.pewter
                  : showPreview
                  ? colors.primary
                  : undefined
              }
            />
          </a>
          {createPortal(
            <div ref={previewRef} style={styles.popper} {...attributes.popper}>
              {showPreview && (
                <div className={'preview' + (isLoaded ? ' loaded' : '')}>
                  {isLoaded ? null : <ActivityIndicator size="small" />}
                  <img src={url} onLoad={() => setLoaded(true)} />
                </div>
              )}
            </div>,
            document.querySelector('#__next')
          )}
        </>
      )}
    </CustomAppearanceContext.Consumer>
  );
};

export default memo(Thumbnail);
