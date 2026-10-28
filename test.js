async function floodHealthCheck() {
  const url = 'http://localhost:3000/api/test';
  const totalRequests = 1000;
  
  console.log(`Starting load test: Sending ${totalRequests} requests...`);
  const startTime = performance.now();

  // Create an array of 1000 fetch promises executed concurrently
  const promises = Array.from({ length: totalRequests }, (_, i) => 
    fetch(url)
      .then(res => ({ id: i, status: res.status, success: true }))
      .catch(err => ({ id: i, error: err.message, success: false }))
  );

  // Wait for all requests to fire and resolve
  const results = await Promise.all(promises);
  const endTime = performance.now();

  // Analyze the results
  const successful = results.filter(r => r.success).length;
  const failed = totalRequests - successful;
  const durationInSeconds = (endTime - startTime) / 1000;

  console.log(`\n--- Results ---`);
  console.log(`Total Time: ${durationInSeconds.toFixed(2)} seconds`);
  console.log(`Successful Requests: ${successful}`);
  console.log(`Failed Requests: ${failed}`);
  console.log(`Requests Per Second: ${(totalRequests / durationInSeconds).toFixed(2)}`);
}

// Execute the function
floodHealthCheck();
