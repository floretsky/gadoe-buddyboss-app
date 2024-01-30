import {Observable} from "rxjs";
import React from "react";
import {View} from "react-native";
import PageScreen from '@src/containers/Custom/PageScreen';

export const applyCustomCode = externalCodeSetup => {
	// call custom code api here

    externalCodeSetup.indexJsApi.addIndexJsFunction(() => {
		console.log("function from external set upo");
	});

	const reducerName = "external reducer";

	externalCodeSetup.reduxApi.addReducer(
		reducerName,
		(s = {type: "demo"}, a) => s
	);

	externalCodeSetup.reduxApi.addEpic("external epic", actions =>
		Observable.empty()
	);

	externalCodeSetup.reduxApi.wrapEpic(
		"loadHomeScreen",
		epic => (actions, store, dep) => epic(actions, store, dep)
	);

	externalCodeSetup.reduxApi.wrapReducer(
		"homeScreen",
		reducer => (state = reducer(undefined, {type: "demo"}), a) =>
			reducer(state, a)
	);

	externalCodeSetup.reduxApi.addPersistorConfigChanger(config => ({
		...config,
		whitelist: [...config.whitelist, reducerName]
	}));

	externalCodeSetup.navigationApi.addNavigatorCreatedCallback(navigator => {
		//debugger;

		let dispatch = navigator.dispatch;
		console.log("navigator created");
	});

  const registrationPageUrl = 'https://gadoe:gadoe@community.clockworkwp.com/gadoe-community-registration/';
  const registrationPageLabel = 'Create an Account - GaDOE Community';

	externalCodeSetup.navigationApi.replaceScreenComponent("SignupScreen", () => (
		<View style={{ flex: 1 }}>
      <PageScreen
        url={registrationPageUrl}
        openExternal={false}
        label={registrationPageLabel}
      />
    </View>
	));

	externalCodeSetup.cssApi.addGlobalStyle("container", {
		backgroundColor: "white"
	});
};
