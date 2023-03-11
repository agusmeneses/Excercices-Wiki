<?php
header("Access-Control-Allow-Methods: POST");
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "abc";
$dbname = "db1";


$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
  die("Conexión fallida: " . mysqli_connect_error());
}

$data = json_decode(file_get_contents('php://input'), true);

$ejercicio = isset($data['ejercicio']) ? $data['ejercicio'] : '';
$repeticiones = isset($data['repeticiones']) ? intval($data['repeticiones']) : 0;
$peso = isset($data['peso']) ? intval($data['peso']) : 0;
$fecha = isset($data['fecha']) ? $data['fecha'] : '';

$sql = "INSERT INTO rutina_entrenamiento (ejercicio, repeticiones, peso, fecha) VALUES (?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "siss", $ejercicio, $repeticiones, $peso, $fecha);

if (mysqli_stmt_execute($stmt)) {
  if (mysqli_affected_rows($conn) > 0) {
    echo "Rutina registrada con éxito";
  } else {
    echo "Error al guardar la rutina";
  }
} else {
  echo "Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>