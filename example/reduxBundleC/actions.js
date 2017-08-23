export function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

export function switchDynamicState(flag) {
  return { type: "SWITCH_DYNAMIC_STATE", flag };
}
