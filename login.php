 <!DOCTYPE html> <!--ok avec login.html -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire de login</title>
</head>
<body>
    <form id="loginForm" action="./loginTraitement.php" method="POST">
        Nom:<input type="text" id="user" name="user" required>
        <!-- Email:<input type="email" name="email" required> -->
        <button id="login-btn" type="submit">Log in</button>
    </form>
    
</body>
</html>