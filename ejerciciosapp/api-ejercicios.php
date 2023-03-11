<?php
header("Access-Control-Allow-Methods: GET, POST");
header('Access-Control-Allow-Origin: *');

$grupo = $_GET['grupo'];
$url = 'https://api.api-ninjas.com/v1/exercises?muscle='.$grupo;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'X-Api-Key: l3j//Z004JRV7+W+upLXIg==9Ez0lC6nuznhRdVM'
));
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);

// Devolver la respuesta como un JSON válido
header('Content-Type: application/json');
echo json_encode($data);

?>