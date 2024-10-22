<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire de login</title>
</head>
<body>
    <form action="./loginTraitement.php" method="POST">
        Nom:<input type="text" name="nom" required>
        Email:<input type="email" name="email" required>
        <input type="submit" value="Envoyer">
    </form>
    
</body>
</html>