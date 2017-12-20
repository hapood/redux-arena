import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { DefaultSceneActions } from "../core/types";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import {
  Omit,
  ActionsProps,
  SceneBundleNo,
  SceneBundleNoS,
  SceneBundleNoA,
  SceneBundleNoPP,
  SceneBundleNoAPP,
  SceneBundleNoSA,
  SceneBundleNoSPP,
  SceneBundleNoSAPP
} from "./types";
import {
  defaultPropsPicker,
  defaultActions,
  defaultReducerCreator
} from "./autoFill";

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
function bundleToComponent<P extends PP, PP>(
  bundle: SceneBundleNoSA<P, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (PP)>>;
function bundleToComponent<
  P extends ActionsProps<A>,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoSPP<P, A>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (ActionsProps<A>)>>;
function bundleToComponent<
  P extends S & ActionsProps<DefaultSceneActions<S>>,
  S
>(
  bundle: SceneBundleNoAPP<P, S>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (S & ActionsProps<DefaultSceneActions<S>>)>>;
function bundleToComponent<P extends ActionsProps<DefaultSceneActions<{}>>>(
  bundle: SceneBundleNoSAPP<P>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof (ActionsProps<DefaultSceneActions<{}>>)>>;
function bundleToComponent(bundle: any, extraProps?: ArenaSceneExtraProps) {
  let newBundle = Object.assign(
    {
      propsPicker: defaultPropsPicker,
      actions: defaultActions,
      reducer: defaultReducerCreator(bundle.state)
    },
    bundle
  );
  let WrapperClass: React.SFC<{}> = props => (
    <ArenaScene sceneBundle={newBundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
export default bundleToComponent;
