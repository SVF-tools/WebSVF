const submitCodeFetch = async (code: string, compileOptions: string, executables: string[]) => {
  // Configure API URL based on environment
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const baseUrl = isDevelopment ? 'http://localhost:8080' : 'https://api-broken-moon.fly.dev';
  const url = `${baseUrl}/api/controller`;

  // Define the request body with correct field names (lowercase to match backend)
  const requestBody = {
    input: code,
    compileOptions: compileOptions,
    extraExecutables: executables,
  };

  // return sampleResponse3;
  // Perform the fetch request
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
};

export default submitCodeFetch;
