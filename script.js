<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>USCIS Case Status Checker</title>
</head>
<body>
  <h1>Check Your Immigration Case Status</h1>

  <input type="text" id="receiptNumber" placeholder="Enter Receipt Number" />
  <button onclick="checkCaseStatus()">Check Status</button>

  <p id="caseStatus"></p>

  <script>
    const clientId = 'YOUR_CLIENT_ID'; // Replace this
    const clientSecret = 'YOUR_CLIENT_SECRET'; // Replace this
    const tokenUrl = 'https://api-int.uscis.gov/oauth/accesstoken';

    async function getAccessToken() {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const data = await response.json();
      return data.access_token;
    }

    async function checkCaseStatus() {
      const receiptNumber = document.getElementById('receiptNumber').value;
      if (!receiptNumber) {
        alert('Please enter a receipt number.');
        return;
      }

      try {
        const token = await getAccessToken();

        const response = await fetch(`https://api-int.uscis.gov/case-status/${receiptNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const result = await response.json();
        console.log(result);

        document.getElementById('caseStatus').textContent =
          result.status || 'Case status not found.';
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('caseStatus').textContent =
          'Error retrieving case status.';
      }
    }
  </script>
</body>
</html>
