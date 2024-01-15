import React from 'react'
import { colors} from '../../utils/colors'
import styled from 'styled-components'
import { TextProps } from '../../utils/types';
import { Text } from 'react-native';


const StyledText = styled(Text)`
  font-size: 22px;
  color: ${colors.graydark};
  text-align: left; 
  font-family: WorkSans;
`;

const StyledTextWhite = styled(Text)`
  font-size: 22px;
  color: ${colors.white};
  text-align: left; 
  font-family: WorkSans;
`;


export const SmallText = (props: TextProps) => {
  return (
    <StyledText>{props.children}</StyledText>
  )
}

export const SmallTextWhite = (props: TextProps) => {
  return (
    <StyledTextWhite>{props.children}</StyledTextWhite>
  )
}
