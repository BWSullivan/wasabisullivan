// app/test-cloudinary/page.tsx

"use client";

import React, { useEffect, useState } from 'react';

type TestResult = {
  message: string;
  result?: any;
  error?: string;
};

const TestCloudinary: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch('/api/testCloudinary');
        const data = await response.json();
        setTestResult(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setTestResult({ message: 'Error fetching test result', error: error.message });
        } else {
          setTestResult({ message: 'Error fetching test result', error: 'An unknown error occurred' });
        }
      }
    };

    fetchTest();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Cloudinary Test</h1>
      {testResult ? (
        <div>
          <p>{testResult.message}</p>
          {testResult.error && <p style={{ color: 'red' }}>{testResult.error}</p>}
          {testResult.result && (
            <pre>{JSON.stringify(testResult.result, null, 2)}</pre>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TestCloudinary;
