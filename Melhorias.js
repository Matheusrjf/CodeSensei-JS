import { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import eslint from 'eslint4b';
import jsPDF from 'jspdf';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
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
    'no-console': 'warn',
  },
};

function App() {
  const [code, setCode] = useState(defaultCode);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    analyzeCode(code);
  }, []);

  const analyzeCode = (value) => {
    const messages = linter.verify(value, rules);
    setFeedback(messages);
  };

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    analyzeCode(value);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Feedback - CodeSensei JS", 10, 10);
    doc.setFontSize(12);

    if (feedback.length === 0) {
      doc.text("✅ Nenhum problema detectado!", 10, 20);
    } else {
      feedback.forEach((msg, i) => {
        doc.text(`⚠️ ${msg.message} (Linha ${msg.line}, Coluna ${msg.column})`, 10, 20 + i * 10);
      });
    }

    doc.save("relatorio-codesensei.pdf");
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>CodeSensei JS – Revisor de Código</h2>

      <CodeMirror
        value={code}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
        }}
        onBeforeChange={handleCodeChange}
      />

      <div style={{ marginTop: 20 }}>
        <h3>🧠 Feedback</h3>
        {feedback.length === 0 ? (
          <p style={{ color: 'green' }}>✅ Nenhum problema detectado!</p>
        ) : (
          <ul>
            {feedback.map((msg, index) => (
              <li key={index} style={{ color: msg.severity === 2 ? 'red' : 'orange', marginBottom: 8 }}>
                {msg.message} <br />
                <code>Linha {msg.line}, Coluna {msg.column}</code>
              </li>
            ))}
          </ul>
        )}

        <button onClick={exportPDF} style={{ marginTop: 10, padding: '8px 16px', borderRadius: 8 }}>
          📄 Exportar Relatório PDF
        </button>
      </div>
    </div>
  );
}

export default App;
