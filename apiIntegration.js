const fetch = require('node-fetch');

const apiUrl = 'https://rahatikbackend.onrender.com'; 

async function getToken(username, password) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
            },
            body: JSON.stringify({}),
        });

        const result = await response.json();

        if (result.response && result.response.token) {
            console.log('Token:', result.response.token);
            return {
                response: {
                    token: result.response.token,
                },
                messages: [
                    {
                        code: "0",
                        message: "OK",
                    }
                ]
            };
        } else {
            console.error('Error:', result.messages[0].message);
            return {
                response: null,
                messages: [
                    {
                        code: "1",  // Örnek olarak hata kodu, API'ye göre değiştirilmelidir
                        message: "Invalid username or password",
                    }
                ]
            };
        }
    } catch (error) {
        console.error('Error:', error.message);
        return {
            response: null,
            messages: [
                {
                    code: "1",  // Örnek olarak hata kodu, API'ye göre değiştirilmelidir
                    message: "Error",
                }
            ]
        };
    }
}

module.exports = { getToken };