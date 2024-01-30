import { React } from 'react';
import RegistrationScreen from './components/RegistrationScreen';

export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.replaceScreenComponent(
    'SignupScreen',
    RegistrationScreen
  );
};