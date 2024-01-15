import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

//Use this to add in horizontal or vertical spacing between elements

interface Props {
    horizontal: boolean,
    size: number
}

const Spacer = (props: Props) => {
  const defaultValue = 'auto';

  return (
    <View
      style={{
        width: props.horizontal ? props.size : defaultValue,
        height: !props.horizontal ? props.size : defaultValue,
      }}
    />
  );
};

Spacer.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  horizontal: PropTypes.bool,
};

Spacer.defaultProps = {
  horizontal: false,
};

export default Spacer;