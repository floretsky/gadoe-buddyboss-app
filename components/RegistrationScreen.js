import React from "react";
import {View} from "react-native";
import { registrationPageUrl, registrationPageLabel } from '../data';

import PageScreen from "@src/containers/Custom/PageScreen";

const RegistrationScreen = (props) => (
  <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
    <PageScreen
      url={registrationPageUrl}
      openExternal={false}
      label={registrationPageLabel}
    />
  </View>
);

RegistrationScreen.navigationOptions = { header: null };

export default RegistrationScreen;