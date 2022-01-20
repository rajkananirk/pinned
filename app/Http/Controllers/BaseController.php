<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;
use DB;

class BaseController extends Controller {

    public function sendResponse($result, $message) {

        if (empty($result)) {

            $response = [
                'success' => true,
                'message' => $message,
            ];
        } else {
            $response = [
                'success' => $result,
                'message' => $message,
            ];
        }

        return response()->json($response, 200);
    }

    public function sendError($error, $errorMessages = [], $code = 404) {
        $response = [
            'success' => false,
            'message' => $error,
        ];


        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }

    public function select($table, $select, $where) {

        $users = \DB::table($table)
                ->select($select)
                ->where($where)
                ->get();
        return $users;
    }

    function update($table, $where, $update) {
        $data = \DB::table($table)
                ->where($where)
                ->update($update);

        return $data;
    }

    function check_existing_email($email, $thirdparty_id) {
        $users = \DB::table('users')
                        ->select('*')
                        ->where([
                            ['email', '=', $email],
                            ['thirdparty_id', '!=', $thirdparty_id],
                        ])
                        ->get()->toArray();
        return $users;
    }

    function get_random_string($length = 10) {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $token = "";
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < $length; $i++) {
            $n = rand(0, $alphaLength);
            $token .= $alphabet[$n];
        }
        return $token;
    }

    function get_random_number($length = 10) {
        $alphabet = "0123456789";
        $token = "";
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < $length; $i++) {
            $n = rand(0, $alphaLength);
            $token .= $alphabet[$n];
        }
        return $token;
    }

    function check_existing_email2($email) {
        $users = \DB::table('users')
                        ->select('*')
                        ->where([
                            ['email', '=', $email],
                        ])
                        ->get()->toArray();
        return $users;
    }

    function login_by_thirdparty_($data, $thirdparty_id) {
        $users = \DB::table('users')
                        ->select('*')
                        ->where('thirdparty_id', '=', $thirdparty_id)
                        ->get()->toArray();

        if (!empty($users)) {

            \DB::table('users')->where('thirdparty_id', '=', $thirdparty_id)
                    ->update($data);
            $data2['is_new_user'] = 0;
        } else {
            \DB::table('users')->insert([$data]);
            $data2['is_new_user'] = 1;
        }

        $data2 = \DB::table('users')
                        ->select('*')
                        ->where('thirdparty_id', '=', $thirdparty_id)
                        ->get()->toArray();

        return $data2;
    }

    function add_device($arr) {
        $where = array(
            'user_id' => $arr['user_id'],
            'device_id' => $arr['device_id'],
            'device_type' => $arr['device_type'],
        );
        $check_device = $this->select('tbl_token', '*', $where)->toArray();

        if ($check_device) {
            $update = array(
                'device_token' => $arr['device_token'],
            );
            $this->update('tbl_token', $where, $update);
        } else {

            $inn = array(
                "device_token" => $arr['device_token'],
                "device_type" => $arr['device_type'],
                "device_id" => $arr['device_id'],
                "user_id" => $arr['user_id'],
            );
            \DB::table('tbl_token')->insert($inn);
        }
    }

    function insert($table, $values) {
        $last_id = DB::table($table)->insertGetId($values);
        return $last_id;
    }

    function delete($table, $where) {
        $last_id = DB::table($table)->where($where)->delete();
        return $last_id;
    }

    function get_user_token($user_id) {
        $q = "SELECT device_token,device_type FROM tbl_token WHERE `user_id` = $user_id";
        $results = DB::select($q);

        return $results;
    }

    // Send Push To Users
    function send_push($push_arr, $msg, $type) {

//        $headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . "AAAAv__jyiQ:APA91bECA5iYs6pof4DBOoczPcd7aTIbXW4qqbnh_Gu8EzJ0A4AdB4cppAu1POAGmATTNpjBQyQFZlzFFfd1VjjUpPUOkUk5fEN7b1FIkdRWtpTDJiJr1hLJ6Z0VoIzzoctIlbkEjXQl"); //old
        $headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . " AAAAFnxdC3Q:APA91bEV7WNstfbkzsq6_061k8T7UYMuNgWZ8XpYuBDV-gJC7JsQMWgFeynyhPW1ibF2nBTM2t6dL9OV4fmS42KBHdakWrnr-2aZyPGdPfJn38_vfAzkXobm4sUBiVXRDNH0gLfipW9w");

        $notification = array('title' => 'Materates', 'text' => $msg, 'type' => $type);

        foreach ($push_arr['device_tokens'] as $token) {

            $arrayToSend = array(
                'to' => $token,
                'data' => $notification
            );

            $json = json_encode($arrayToSend);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
            @$response = curl_exec($ch);

//            echo "<pre>";
//            print_r($response);
        }
    }

    // Send Push To ios Users
    function send_ios_push($push_arr, $msg, $type) {

        $headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . "AAAAv__jyiQ:APA91bECA5iYs6pof4DBOoczPcd7aTIbXW4qqbnh_Gu8EzJ0A4AdB4cppAu1POAGmATTNpjBQyQFZlzFFfd1VjjUpPUOkUk5fEN7b1FIkdRWtpTDJiJr1hLJ6Z0VoIzzoctIlbkEjXQl");

        $notification = array('title' => 'Materates', 'text' => $msg, 'type' => $type);

        foreach ($push_arr['device_tokens'] as $token) {

            $arrayToSend = array('to' => $token, 'data' => $notification, 'notification' => $notification, 'priority' => 'high');

            $json = json_encode($arrayToSend);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
            @$response = curl_exec($ch);

//            echo "<pre>";
//            print_r($response);
        }
    }

}
