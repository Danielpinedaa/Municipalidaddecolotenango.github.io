<?php
// Mostrar todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost"; // Usualmente es "localhost"
$username = "root"; // Reemplaza con tu usuario de MySQL
$password = "50410543."; // Deja esto en blanco si no hay contraseña
$dbname = "contactos_db"; // Asegúrate de que este sea el nombre exacto de la base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo "Formulario recibido.<br>";

    $name = $_POST['name'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];

    // Ruta para guardar las imágenes
    $target_dir = "images/";

    // Subir la foto del contacto
    $photo = $target_dir . basename($_FILES["photo"]["name"]);
    if (move_uploaded_file($_FILES["photo"]["tmp_name"], $photo)) {
        echo "Foto del contacto subida correctamente.<br>";
    } else {
        echo "Error al subir la foto del contacto.<br>";
    }

    // Subir la foto de la credencial
    $credential = $target_dir . basename($_FILES["credential"]["name"]);
    if (move_uploaded_file($_FILES["credential"]["tmp_name"], $credential)) {
        echo "Credencial subida correctamente.<br>";
    } else {
        echo "Error al subir la credencial.<br>";
    }

    // Guardar los datos en la base de datos
    $sql = "INSERT INTO contactos (name, address, phone, photo, credential) VALUES ('$name', '$address', '$phone', '$photo', '$credential')";

    if ($conn->query($sql) === TRUE) {
        echo "Nuevo contacto agregado exitosamente";
    } else {
        echo "Error en la consulta SQL: " . $conn->error;
    }
}

// Cerrar la conexión
$conn->close();
?>
