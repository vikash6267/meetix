<?php

$API_KEY_SECRET = "mirotalksfu_default_secret";
$MIROTALK_URL = "https://sfu.mirotalk.com/api/v1/join";
//$MIROTALK_URL = "https://meetix.mahitechnocrafts.in/api/v1/join";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $MIROTALK_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);

$headers = [
    'authorization:' . $API_KEY_SECRET,
    'Content-Type: application/json'
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$data = array(
    "room"          => "test",
    "roomPassword"  => false,
    "name"          => "mirotalksfu",
    "avatar"        => false,
    "audio"         => false,
    "video"         => false,
    "screen"        => false,
    "hide"          => false,
    "notify"        => true,
    "duration"      => "unlimited",
    "token"         => array(
        "username"      => "username",
        "password"      => "password",
        "presenter"     => true,
        "expire"        => "1h",
    ),
);
$data_string = json_encode($data);

curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "Status code: $httpcode \n";
$data = json_decode($response);
echo "join: ", $data->{'join'}, "\n";
