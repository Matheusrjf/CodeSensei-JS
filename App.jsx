import { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import eslint from 'eslint4b';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const linter = new eslint.Linter();

const defaultCode = `function soma(a, b) {
  var resultado = a + b;
  return resultado;
}
`;

const rules = {
  rules: {
    'no-var': 'warn',
    'prefer-const': 'warn',
    'no-unused-vars': 'warn',
    'eqeqeq': 'warn',
  },
};

function App() {
  const [code, setCode] = useState(defaultCode);
  const [feedback, setFeedback] = useState([]);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    const messages = linter.verify(value, rules);
    setFeedback(messages);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>CodeSensei JS – Revisor de Código</h2>

      <CodeMirror
        value={code}
        options={{
          mode: 'javascript',
          theme: 'default',
          lineNumbers: true,
        }}
        onBeforeChange={handleCodeChange}
      />

      <div style={{ marginTop: 20 }}>
        <h3>🧠 Feedback</h3>
        {feedback.length === 0 ? (
          <p>✅ Nenhum problema detectado!</p>
        ) : (
          <ul>
            {feedback.map((msg, index) => (
              <li key={index} style={{ color: msg.severity === 2 ? 'red' : 'orange' }}>
                {msg.message} <br />
                <code>Linha {msg.line}, Coluna {msg.column}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
