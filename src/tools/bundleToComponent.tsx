import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import {
  Omit,
  ActionsProps,
  DefaultActions,
  SceneBundleNo,
  SceneBundleNoS,
  SceneBundleNoA,
  SceneBundleNoPP,
  SceneBundleNoAPP,
  SceneBundleNoSA,
  SceneBundleNoSPP,
  SceneBundleNoSAPP
} from "./types";
import { defaultPropsPicker, defaultActions, defaultReducer } from "./commons";

function bundleToComponent<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>(
  bundle: SceneBundleNo<P, S, A, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<P extends PP, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundleNoS<P, A, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<P extends PP, S, PP>(
  bundle: SceneBundleNoA<P, S, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<
  P extends S & ActionsProps<A>,
  S,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoPP<P, S, A>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (S & ActionsProps<A>)>>;
function bundleToComponent<P extends ActionsProps<DefaultActions<{}>>, PP>(
  bundle: SceneBundleNoSA<P, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>>;
function bundleToComponent<
  P extends ActionsProps<A>,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoSPP<P, A>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (ActionsProps<A>)>>;
function bundleToComponent<P extends S & ActionsProps<DefaultActions<S>>, S>(
  bundle: SceneBundleNoAPP<P, S>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (S & ActionsProps<DefaultActions<S>>)>>;
function bundleToComponent<P extends ActionsProps<DefaultActions<{}>>>(
  bundle: SceneBundleNoSAPP<P>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (ActionsProps<DefaultActions<{}>>)>>;
function bundleToComponent(
  bundle: any,
  extraProps?: ArenaSceneExtraProps
): any {
  let newBundle = Object.assign(
    {
      propsPicker: defaultPropsPicker,
      actions: defaultActions,
      reducer: defaultReducer
    },
    bundle
  );
  let WrapperClass: React.SFC<{}> = props => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
export default bundleToComponent;
