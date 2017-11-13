function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

function clearCnt() {
  return {
    type: 111,
    state: {
      cnt: 0
    }
  };
}

export default { addCnt, clearCnt };
