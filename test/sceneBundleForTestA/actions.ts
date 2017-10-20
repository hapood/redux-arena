export function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

export function addCntBySaga() {
  return {
    type: "ADD_CNT_BY_SAGA"
  };
}

export function addSagaCnt() {
  return {
    type: "ADD_SAGA_CNT"
  };
}

export default {
  addCnt,
  addCntBySaga,
  addSagaCnt
};
