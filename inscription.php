<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire d'inscription</title>
</head>
<body>
    <form id="inscriptionForm" action="./inscriptionTraitement.php" method="POST">
        Nom:<input class="form-control" type="text" id="user" name="user" required >
        Email:<input class="form-control" type="email" id="email" name="email" required >
        <button id="inscription-btn" type="submit">S'inscrire</button>
    </form>
</body>
</html>