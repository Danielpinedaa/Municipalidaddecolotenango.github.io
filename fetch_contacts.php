<?php
$servername = "localhost";
$username = "root";
$password = "50410543.";
$dbname = "contactos_db";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT id, name, address, phone, photo, credential FROM contactos";
$result = $conn->query($sql);

$contacts = array();

if ($result->num_rows > 0) {
    // Obtener datos de cada fila
    while($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
} else {
    echo "0 resultados";
}
echo json_encode($contacts);

$conn->close();
?>
