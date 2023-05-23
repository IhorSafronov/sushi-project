<?php
// Получаем данные из POST-запроса
$name = $_POST['name'];
$phone = $_POST['phone'];
$address = $_POST['address'];

echo "Имя: " . $name . "<br>";
echo "Телефон: " . $phone . "<br>";
echo "Адрес: " . $address . "<br>";

// Открываем файл и декодируем его содержимое из JSON
$file = "clients-db.json";
$data = json_decode(file_get_contents($file), true);

// Добавляем новые данные
$data[] = [
    'name' => $name,
    'phone' => $phone,
    'address' => $address
];

// Кодируем данные в формат JSON и записываем их в файл
file_put_contents($file, json_encode($data));

// Отправляем ответ об успешном сохранении данных
header('Content-Type: application/json');
echo json_encode(array('success' => true));
?>