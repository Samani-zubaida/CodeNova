const fs = require('fs');
let content = fs.readFileSync('frontend/src/game/QuizRunner.jsx', 'utf8');

// Replace the useEffect completely
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?\}, \[subject, levelId\]\);/,
  `useEffect(() => {
    if (competitionData) {
      // Map competition questions to the QuizRunner format
      const mappedQs = competitionData.questions.map(q => ({
        ...q,
        type: 'code-editor',
        question: q.title,
        explanation: q.description
      }));
      setQuestions(mappedQs);
      if (mappedQs.length > 0) {
        setCodeValue(mappedQs[0].initialCode || '');
      }
      setLoading(false);
    } else {
      fetch(\`http://localhost:5000/api/levels/\${subject}/\${levelId}\`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch level data');
          return res.json();
        })
        .then(data => {
          setQuestions(data);
          if (data[0]?.type === 'code-editor') {
            setCodeValue(data[0].initialCode || '');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [subject, levelId, competitionData]);`
);

fs.writeFileSync('frontend/src/game/QuizRunner.jsx', content);
