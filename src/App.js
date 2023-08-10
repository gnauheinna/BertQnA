import React, { useRef, useEffect, useState } from "react";
import "./App.css";

import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Fragment } from "react";

const App = () => {
  // references and state hooks
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // Load Tensorflow Model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model loaded.");
  };

  // Questions Handleer
  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("Question submitted.");
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, passage);
      setAnswer(answers);
      console.log(answers);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {model == null ? ( // checks if model loaded
          <div>
            <div>Model Loading</div>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          // If our model has loaded
          <Fragment>
            Passage
            <textarea ref={passageRef} rows="30" cols="100"></textarea>
            Ask a Question
            <input
              ref={questionRef}
              onKeyDown={answerQuestion}
              size="80"
            ></input>
            Answers
            {answer // Ternary check
              ? answer.map((ans, idx) => (
                  <div key={idx}>
                    <b>Answer {idx + 1} -</b>
                    {ans.text} ({Math.floor(ans.score * 100) / 100})
                  </div>
                ))
              : ""}
          </Fragment>
        )}
      </header>
    </div>
  );
};

export default App;
