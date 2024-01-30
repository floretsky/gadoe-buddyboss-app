import RegistrationScreen from './components/RegistrationScreen';

export const applyCustomCode = (externalCodeSetup) => {
  // call custom code api here
  externalCodeSetup.navigationApi.replaceScreenComponent(
    'SignupScreen',
    RegistrationScreen
  );
};
