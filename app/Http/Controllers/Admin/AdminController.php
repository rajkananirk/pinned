<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use DB;
use Auth;
use App\admin;
use Session;
use Validator;
use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Redirect;

class AdminController extends BaseController {

    //
    function Admin(Request $request) {
        if (empty($request->session()->has('login'))) {
            return view('Admin/Adminlogin');
        } else {
            return Redirect::to('Dashboard');
        }
    }

    function admin_login(Request $request) {
        $email = $request->email;
        $password = md5($request->password);

        $login = admin::where(['email' => $email, 'password' => $password])->first();

        if (!empty($login)) {

            //Store Session
            $request->session()->put('login', 'login');

            return Redirect::to('Dashboard');
        } else {
            return back()->with('error', 'Email Or Password Wrong!');
        }
    }

    //Logout
    function logout(Request $request) {
        Session::forget('login');
        if (!Session::has('login')) {
            return Redirect::to('/Admin');
        }
    }

    function Dashboard(Request $request) {

//        $data = DB::select("select (SELECT COUNT(id) from users WHERE user_role = 1)as total_customer, (SELECT COUNT(id) from users WHERE user_role = 2)as total_provider from users limit 1");
        $data = User::
                get()->count();

        return view("Admin/Dashboard")->with(compact('data'));
    }

    //list user
    function list_user(Request $request) {


        $data = User::where(['is_active' => 1])->get();

        return view("Admin/User")->with(compact('data'));

//        return view("Admin/User");
    }

    function check_session(Request $request) {
        if (empty($request->session()->has('login'))) {
            return Redirect::to('/Admin');
        }
    }

    //Block User
    function block_user($user_id) {
        $where['id'] = $user_id;
        $update['is_blocked'] = 1;
        $this->update('users', $where, $update);

        //logout this user from all device
        $where2['user_id'] = $user_id;
        $update2['revoked'] = 1;
        $this->update('oauth_access_tokens', $where2, $update2);

        //delete all device token
        $this->delete('tbl_token', $where2);

        return redirect()->back()->with('success', 'User Blocked Successfully');
    }

    //UnBlock User
    function unblock_user($user_id) {
        $where['id'] = $user_id;
        $update['is_blocked'] = 0;
        $user_id = $this->update('users', $where, $update);
        return redirect()->back()->with('success', 'User UnBlocked Successfully');
    }

    //Delete User
    function delete_user($user_id) {
        $where['id'] = $user_id;
        $update['is_active'] = 0;
        $user_id = $this->update('users', $where, $update);


//        $user_id = User::where('id', $user_id)->update(['is_active' => 0]);
//        print_r($user_id);
//        exit;
        //logout this user from all device
        $where2['user_id'] = $user_id;
        $update2['revoked'] = 1;
        $this->update('oauth_access_tokens', $where2, $update2);

        //delete all device token
        $this->delete('tbl_token', $where2);

//        print_r($user_id);


        return redirect()->back()->with('success', 'User Deleted Successfully');
    }

}
