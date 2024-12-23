import React from "react";
import { NativeModules } from "react-native";
import RegistrationScreen from './components/RegistrationScreen';
const { RNCustomCode } = NativeModules;

export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.replaceScreenComponent("SignupScreen", RegistrationScreen);
};