export default {
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-2.7em",
    marginLeft: "-2.7em",
    width: "5.4em",
    height: "5.4em",
    backgroundColor: "white"
  },

  hill: {
    position: "absolute",
    width: "7.1em",
    height: "7.1em",
    top: "1.7em",
    left: "1.7em",
    backgroundColor: "transparent",
    borderLeft: ".25em solid #00B7C6",
    transform: "rotate(45deg)"
  },

  "hill:after": {
    content: "''",
    position: "absolute",
    width: "7.1em",
    height: "7.1em",
    left: "0",
    backgroundColor: "white"
  },

  box: {
    position: "absolute",
    left: "0",
    bottom: "-.1em",
    width: "1em",
    height: "1em",
    backgroundColor: "transparent",
    border: ".25em solid #00B7C6",
    borderRadius: "15%",
    transform: "translate(0, -1em) rotate(-45deg)",
    animation: "push 2.5s cubic-bezier(.79, 0, .47, .97) infinite"
  },

  "@keyframes push": {
    "0%": {
      transform: "translate(0, -1em) rotate(-45deg)"
    },
    "5%": {
      transform: "translate(0, -1em) rotate(-50deg)"
    },
    "20%": {
      transform: "translate(1em, -2em) rotate(47deg)"
    },
    "25%": {
      transform: "translate(1em, -2em) rotate(45deg)"
    },
    "30%": {
      transform: "translate(1em, -2em) rotate(40deg)"
    },
    "45%": {
      transform: "translate(2em, -3em) rotate(137deg)"
    },
    "50%": {
      transform: "translate(2em, -3em) rotate(135deg)"
    },
    "55%": {
      transform: "translate(2em, -3em) rotate(130deg)"
    },
    "70%": {
      transform: "translate(3em, -4em) rotate(217deg)"
    },
    "75%": {
      transform: "translate(3em, -4em) rotate(220deg)"
    },
    "100%": {
      transform: "translate(0, -1em) rotate(-225deg)"
    }
  }
};
