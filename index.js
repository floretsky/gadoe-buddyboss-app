import React from 'react';
import { View } from "react-native";
import RegistrationScreen from './components/RegistrationScreen';

export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.replaceScreenComponent(
    'SignupScreen',
    RegistrationScreen
  );
};
