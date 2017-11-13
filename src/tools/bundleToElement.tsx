import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import {
  Omit,
  ActionsProps,
  SceneBundleNo,
  DefaultActions,
  SceneBundleNoS,
  SceneBundleNoA,
  SceneBundleNoPP,
  SceneBundleNoAPP,
  SceneBundleNoSA,
  SceneBundleNoSPP,
  SceneBundleNoSAPP
} from "./types";
import { defaultPropsPicker, defaultActions, defaultReducer } from "./autoFill";

function bundleToElement<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>(
  bundle: SceneBundleNo<P, S, A, PP>,
  props: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<P extends PP, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundleNoS<P, A, PP>,
  props: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<P extends PP, S, PP>(
  bundle: SceneBundleNoA<P, S, PP>,
  props: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<
  P extends S & ActionsProps<A>,
  S,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoPP<P, S, A>,
  props: JSX.IntrinsicAttributes & Omit<P, keyof (S & ActionsProps<A>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (S & ActionsProps<A>)>
>;
function bundleToElement<P extends ActionsProps<DefaultActions<{}>>, PP>(
  bundle: SceneBundleNoSA<P, PP>,
  props: JSX.IntrinsicAttributes &
    Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>
>;
function bundleToElement<
  P extends ActionsProps<A>,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoSPP<P, A>,
  props: JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<A>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<A>)>
>;
function bundleToElement<P extends S & ActionsProps<DefaultActions<S>>, S>(
  bundle: SceneBundleNoAPP<P, S>,
  props: JSX.IntrinsicAttributes &
    Omit<P, keyof (S & ActionsProps<DefaultActions<S>>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>
>;
function bundleToElement<P extends ActionsProps<DefaultActions<{}>>>(
  bundle: SceneBundleNoSAPP<P>,
  props: JSX.IntrinsicAttributes &
    Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>
>;
function bundleToElement(
  bundle: any,
  props: any,
  extraProps?: ArenaSceneExtraProps
) {
  let newBundle = Object.assign(
    {
      propsPicker: defaultPropsPicker,
      actions: defaultActions,
      reducer: defaultReducer
    },
    bundle
  );
  return (
    <ArenaScene sceneBundle={newBundle} sceneProps={props} {...extraProps} />
  );
}

export default bundleToElement;
