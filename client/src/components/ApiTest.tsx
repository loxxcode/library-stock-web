import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      console.log('🧪 Testing API connection...');
      
      // Test 1: Check API base URL
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
        (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://library-stock-web.onrender.com/api');
      
      console.log('🔧 API Base URL:', apiBaseUrl);
      
      // Test 2: Try to reach the books endpoint without auth first
      const booksUrl = `${apiBaseUrl}/books`;
      console.log('🌐 Testing URL:', booksUrl);
      
      const response = await fetch(booksUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🌐 Response status:', response.status);
      console.log('🌐 Response headers:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('🌐 Response text:', responseText);
      
      if (response.status === 401) {
        setTestResult('✅ Backend is reachable but requires authentication (401)');
      } else if (response.ok) {
        setTestResult('✅ Backend is working and returning data');
      } else {
        setTestResult(`❌ Backend returned error: ${response.status} - ${responseText}`);
      }
      
    } catch (error) {
      console.error('🧪 API test failed:', error);
      setTestResult(`❌ Failed to reach backend: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">API Test</h4>
      <Button onClick={testAPI} disabled={loading} size="sm" className="mb-2">
        {loading ? 'Testing...' : 'Test API'}
      </Button>
      {testResult && (
        <div className="text-xs break-words">{testResult}</div>
      )}
    </div>
  );
}
