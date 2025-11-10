window.onload = function() {
    fetch('user.json') // 1. Fetch the file
      .then(response => response.json()) // 2. Parse the JSON text
      .then(data => {
        // 3. 'data' is now a real JS object
        console.log(data); // {username: "Kejkaew", ...}
        
        // 4. Use the data
        var nameDiv = document.getElementById("name");
        nameDiv.innerHTML = data.username;
      })
      .catch(error => {
        // Always include a catch block!
        console.error("Error fetching data:", error);
      });
  };