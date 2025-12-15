import React from 'react';
import { View } from 'react-native';
import PageScreen from '@src/containers/Custom/PageScreen';

const RegistrationScreen = (props) => {
  const link = 'https://community.gadoe.org/gadoe-community-registration/';
  const label = 'Create an Account - GaDOE Community';

  return (
    <View style={{ flex: 1 }}>
      <PageScreen url={link} openExternal={false} label={label} />
    </View>
  );
};

export default RegistrationScreen;