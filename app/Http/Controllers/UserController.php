<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Validator;
use App\User;
use DB;
use Auth;
use App\Model\tbl_social_link;
use App\Model\tbl_token;
use App\Model\tbl_user_social_link;
use App\Model\tbl_user_reciept;
use App\Model\tbl_user_view;
use App\Events\UpdateCount;
use App\Events\SendNumber;
use App\Events\SendVenmo;
use JeroenDesloovere\VCard\VCard;

class UserController extends vCard {

       function index(Request $req, $name) {

              $data = DB::table('users')
                              ->where('username', "$name")
                              ->get()->first();
              if (empty($data)) {
                     return response()->json(['status' => 0, 'msg' => 'Dont Be OverSmart'], 200);
              }

              $data2 = DB::table('tbl_social_link')
                      ->Join('tbl_user_social_link', function ($join) use ($data) {
                             $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                             $join->where('tbl_user_social_link.user_id', $data->id);
                      })
                      ->get();
              if (empty($data2)) {
                     $data2 = DB::table('tbl_social_link')
                                     ->Join('tbl_user_social_link', function ($join) use ($data) {
                                            $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                            $join->where('tbl_user_social_link.user_id', $data->id);
                                     })
                                     ->get()->first();
              }
              return view('airpawnd', ['data' => $data, 'social' => $data2,]);
       }

       function login_by_thirdparty(Request $request) {

              $rule = [
                  'thirdparty_id' => 'required',
                  'device_token' => 'required',
                  'device_type' => 'required',
                  'device_id' => 'required',
                  'username' => 'required',
                  'email' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {
                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 200);
              }
              $check_fb_id = User::where('thirdparty_id', $request->get('thirdparty_id'))->first();

              $username = $this->check_user_name($request->input('username'));

              if (empty($check_fb_id)) {
                     $email = $request->input('email');
                     $check_email = $this->check_email($email);

                     if ($check_email) {
                            return response()->json(['status' => 0, 'msg' => 'Email Already Exist',], 200);
                     }

                     $user = new User();
                     $user->thirdparty_id = $request->input('thirdparty_id');
                     $user->username = $username;
                     $user->name = $request->input('username');
                     $user->email = $email;
                     $user->profile_pic = $request->input('profile_pic');
                     $user->save();
                     $user_id = $user->id;

                     $device = array(
                         'user_id' => $user_id,
                         'device_token' => $request->input('device_token'),
                         'device_type' => $request->input('device_type'),
                         'device_id' => $request->input('device_id')
                     );

                     $this->add_device($device);
                     $where['id'] = $user_id;
                     $user_data = User::where($where)->first()->toArray();
                     $res = array_merge($user_data, $device);
                     $success['token'] = $user->createToken('signup')->accessToken;
                     $success['user'] = $res;

                     return response()->json(['status' => 1, 'msg' => 'Login successfully.', 'data' => $success], 200);
              } else {

                     $success = $check_fb_id->createToken('signup')->accessToken;

                     $user = User::select(array('*', 'id as id'))->where(['thirdparty_id' => $request->get('thirdparty_id')])->first()->toArray();

                     User::where(['thirdparty_id' => $request->get('thirdparty_id')])
                             ->update(['name' => $request->input('username')]);

                     $device = array(
                         'user_id' => $user['id'],
                         'device_token' => $request->input('device_token'),
                         'device_type' => $request->input('device_type'),
                         'device_id' => $request->input('device_id')
                     );

                     $this->add_device($device);
                     $user2 = User::select(array('*', 'id as id'))->where(['thirdparty_id' => $request->get('thirdparty_id')])->first()->toArray();

                     $res = array_merge($user2, $device);

                     $datas = array('token' => $success, 'user' => $res);

                     return response()->json(['status' => 1, 'msg' => 'Login successfully.', 'data' => $datas], 200);
              }
       }

       function logout(Request $request) {

              $rule = [
                  'device_id' => 'required',
              ];
              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $device_id = $request->input('device_id');

              $accessToken = Auth::user()->token();

              DB::table('oauth_refresh_tokens')
                      ->where('access_token_id', $accessToken->id)
                      ->update([
                          'revoked' => true
              ]);

              $userId = Auth::id();

              Tbl_token::where(['device_id' => $device_id, 'user_id' => $userId])->delete();

              $accessToken->revoke();

              return response()->json(['status' => 1, 'msg' => 'Logout Successfully'], 200);
       }

       function update_profile(Request $request) {

              $userId = Auth::id();
              $name = $request->input('name');
              $email = $request->input('email');
              $user_bio = $request->input('user_bio');

              if ($name != "" || $name != null) {
                     $update_data['name'] = $name;
              }

              if ($email) {
                     $update_data['email'] = $email;
              }

              if ($user_bio) {
                     $update_data['user_bio'] = $user_bio;
              }

              if ($request->hasFile('profile_pic')) {
                     $random_no = $this->get_random_number(6);
                     $imageName = time() . $random_no . '.' . request()->profile_pic->getClientOriginalExtension();
                     request()->profile_pic->move(public_path('uploads'), $imageName);
                     $update_data['profile_pic'] = 'https://app.pinned.eu/pinned/public/uploads/' . $imageName;
              }

              if ($request->hasFile('background_profile_pic')) {
                     $imageName = time() . '.' . request()->background_profile_pic->getClientOriginalExtension();
                     request()->background_profile_pic->move(public_path('uploads'), $imageName);

                     $update_data['background_profile_pic'] = 'https://app.pinned.eu/pinned/public/uploads/' . $imageName;
              }

              $where = array('id' => $userId);

              if (!empty($update_data)) {
                     $update = User::where('id', $userId)->update($update_data);
              }

              $user_data = $this->select('users', '*', $where)->first();

              return response()->json(['status' => 1, 'msg' => 'Profile Updated Successfully', 'data' => $user_data], 200);
       }

       function get_user_detail(Request $request) {
              $userId = Auth::id();
              $where = array('id' => $userId);
              $user_data = $this->select('users', '*', $where)->first();
              return response()->json(['status' => 1, 'msg' => 'Get User Data Successfully', 'data' => $user_data], 200);
       }

       function add_business_info(Request $request) {
              $userId = Auth::id();

              if ($request->input('business_name') || $request->input('business_name') != null || $request->input('business_name') != "") {
                     $update_data['business_name'] = $request->input('business_name');
              } else {
                     $update_data['business_name'] = "";
              }
              if ($request->input('business_website') || $request->input('business_website') != null || $request->input('business_website') != "") {
                     $update_data['business_website'] = $request->input('business_website');
              } else {
                     $update_data['business_website'] = "";
              }
              if ($request->input('business_phone') || $request->input('business_phone') != null || $request->input('business_phone') != "") {
                     $update_data['business_phone'] = $request->input('business_phone');
              } else {
                     $update_data['business_phone'] = "";
              }
              if ($request->input('business_email') || $request->input('business_email') != null || $request->input('business_email') != "") {
                     $update_data['business_email'] = $request->input('business_email');
              } else {
                     $update_data['business_email'] = "";
              }
              if ($request->hasFile('business_profile_pic')) {
                     $imageName = time() . '.' . request()->business_profile_pic->getClientOriginalExtension();
                     request()->business_profile_pic->move(public_path('uploads'), $imageName);
                     $update_data['business_profile_pic'] = 'https://app.pinned.eu/pinned/public/uploads/' . $imageName;
              }

              if (!empty($update_data)) {
                     User::where('id', $userId)->update($update_data);
              }

              $data = User::select(array('business_name', 'business_profile_pic', 'business_website', 'business_phone', 'business_email'))->where('id', $userId)->get()->first();
              return response()->json(['status' => 1, 'msg' => 'Business Profile Added Successfully', 'data' => $data], 200);
       }

       function edit_business_info(Request $request) {

              $userId = Auth::id();

              if ($request->input('business_name')) {
                     $update_data['business_name'] = $request->input('business_name');
              } else {
                     $update_data['business_name'] = " ";
              }
              if ($request->input('business_website')) {
                     $update_data['business_website'] = $request->input('business_website');
              } else {
                     $update_data['business_website'] = "ds ";
              }
              if ($request->input('business_phone')) {
                     $update_data['business_phone'] = $request->input('business_phone');
              } else {
                     $update_data['business_phone'] = " ";
              }
              if ($request->input('business_email')) {
                     $update_data['business_email'] = $request->input('business_email');
              } else {
                     $update_data['business_email'] = " ";
              }
              if ($request->hasFile('business_profile_pic')) {
                     $imageName = time() . '.' . request()->business_profile_pic->getClientOriginalExtension();
                     request()->business_profile_pic->move(public_path('uploads'), $imageName);
                     $update_data['business_profile_pic'] = 'https://app.pinned.eu/pinned/public/uploads/' . $imageName;
              }

              if (!empty($update_data)) {
                     User::where('id', $userId)->update($update_data);
              }

              $data = User::select(array('business_name', 'business_profile_pic', 'business_website', 'business_phone', 'business_email'))->where('id', $userId)->get()->first();
              return response()->json(['status' => 1, 'msg' => 'Business Profile Added Successfully', 'data' => $data], 200);
       }

       function get_business_info(Request $request) {

              $userId = Auth::id();
              $data = User::select(array('business_name', 'business_profile_pic', 'business_website', 'business_phone', 'business_email'))->where('id', $userId)->get()->first();
              return response()->json(['status' => 1, 'msg' => 'Get Business Profile Successfully', 'data' => $data], 200);
       }

       function list_social_platform(Request $request) {

              $user_id = Auth::id();
              $is_business_profile = Auth::user()->is_business_profile;

              $data = tbl_social_link::select(
                              array('tbl_social_link.social_id', 'tbl_social_link.social_platforn_url', 'social_platform_name', 'social_platform_icon', 'social_link', 'social_link_2', 'hint', 'link_id', 'tbl_social_link.*', DB::raw("$is_business_profile as is_business_profile")
                      ))
                      ->leftJoin('tbl_user_social_link', function($join) use($user_id) {
                             $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                             $join->select('social_link');
                             $join->where('user_id', $user_id);
                      })
                      ->where('tbl_social_link.is_deleted', 0)
                      ->get();

              return response()->json(['status' => 1, 'msg' => 'Get Social Platform Successfully', 'data' => $data], 200);
       }

       function get_user_social_link(Request $request) {

              $user_id = Auth::id();
              $is_business_profile = Auth::user()->is_business_profile;

              $data = tbl_user_social_link::select(array('*', DB::raw("$is_business_profile as is_business_profile")))
                              ->join('tbl_social_link', function($join) {
                                     $join->on('tbl_user_social_link.social_id', '=', 'tbl_social_link.social_id');
                                     $join->select('social_platform_name', 'social_platform_icon');
                              })
                              ->where('user_id', $user_id)
                              ->where('tbl_social_link.is_deleted', 0)
                              ->orderBy('is_first', 'DESC')->get();

              return response()->json(['status' => 1, 'msg' => 'Get User Social Link Successfully', 'data' => $data], 200);
       }

       function update_is_first(Request $request) {

              $rule = [
                  'link_id' => 'required',
              ];
              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $user_id = Auth::id();

              $link_id = $request->input('link_id');

              $myArray = explode(',', $link_id);

              tbl_user_social_link::where(['user_id' => $user_id])->update(['is_first' => 0]);

              tbl_user_social_link::where(['link_id' => $link_id, 'user_id' => $user_id])->update(['is_first' => 1]);

              return response()->json(['status' => 1, 'msg' => 'State update Successfully'], 200);
       }

       function add_user_social_link(Request $request) {

              $rule = [
                  'social_id' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $user_id = Auth::id();

              $social_id = $request->input('social_id');

              $social_link = $request->input('social_link');
              $social_link_2 = $request->input('social_link_2');

              $check = tbl_user_social_link::where(['social_id' => $social_id, 'user_id' => $user_id])->get()->first();

              if (empty($social_link_2)) {
                     $social_link_2 = null;
              }

              if (empty($check)) {

//                     tbl_user_social_link::where(['user_id' => $user_id])->update(['is_first' => 0]);

                     $social = new tbl_user_social_link();
                     $social->social_id = $social_id;
                     $social->social_link = $social_link;
                     $social->social_link_2 = $social_link_2;
                     $social->user_id = $user_id;
//                     $social->is_first = 1;
                     $social->save();
              } else {

                     tbl_user_social_link::where('link_id', $check->link_id)->update(['social_link' => $social_link, 'social_link_2' => $social_link_2]);
              }


              if ($social_id == 10) {
                     $this->generate_vcf_by_id($user_id);
              }

              return response()->json(['status' => 1, 'msg' => 'User Social Link Added Successfully'], 200);
       }

       function add_to_view(Request $request) {

              $rule = [
                  'view_to' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $user_id = Auth::id();

              $view_to = $request->input('view_to');

              $check_view = tbl_user_view::where(['view_by' => $user_id, 'view_to' => $view_to])->get()->first();

              if (empty($check_view)) {

                     $view = new tbl_user_view();
                     $view->view_by = $user_id;
                     $view->view_to = $view_to;
                     $view->save();
              }
              return response()->json(['status' => 1, 'msg' => 'Add to View Successfully'], 200);
       }

       function list_viewed_users(Request $request) {

              $user_id = Auth::id();

              $data = tbl_user_view::select(array('tbl_user_view.*', 'users.profile_pic', 'users.username'))
                              ->join('users', function($join) {
                                     $join->on('tbl_user_view.view_by', '=', 'users.id');
                              })
                              ->where('view_to', $user_id)->get();

              return response()->json(['status' => 1, 'msg' => 'Get User View List Successfully', 'data' => $data], 200);
       }

       function get_user_profile($id) {

              $data = User::where('id', $id)->get()->first();

              if (empty($data)) {

                     return response()->json(['status' => 0, 'msg' => 'Dont Be OverSmart'], 200);
              }

              return view("UserProfile")->with(compact('data'));
       }

       function update_link_status(Request $request) {

              $rule = [
                  'is_link_active' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $is_link_active = $request->input('is_link_active');

              $id = Auth::id();

              User::where('id', $id)->update(['is_link_active' => $is_link_active]);

              if ($is_link_active == 0) {
                     return response()->json(['status' => 1, 'msg' => 'Pinned Deactivated Successfully', 'is_link_active' => $is_link_active], 200);
              } else {
                     return response()->json(['status' => 1, 'msg' => 'Pinned Activated Successfully', 'is_link_active' => $is_link_active], 200);
              }
       }

       function update_airpawnd(Request $request) {

              $user_id = Auth::id();

              User::where('id', $user_id)->increment('total_airpawnd');

              return response()->json(['status' => 1, 'msg' => 'Total Count Updated Successfully'], 200);
       }

       function get_link_active_status(Request $request) {

              $user_id = Auth::id();
              $data = User::where('id', $user_id)->pluck('is_link_active')->first();
              return response()->json(['is_link_active' => $data, 'status' => 1, 'msg' => 'Get Status Successfully'], 200);
       }

       function buy_business_subscription(Request $request) {

              $userId = Auth::id();
              User::where('id', $userId)->update(['is_business_profile' => 1]);
              $is_business_profile = Auth::user()->is_business_profile;
              return response()->json(['is_business_profile' => $is_business_profile, 'status' => 1, 'msg' => 'Buy Business Subscription Successfully'], 200);
       }

       function update_subscription(Request $request) {

              $rule = [
                  'is_business_profile' => 'required',
              ];
              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {

                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $is_business_profile = $request->input('is_business_profile');
              if ($is_business_profile == "0" || $is_business_profile == 0) {
                     $is_business_profile == "0";
              }

              $userId = Auth::id();
              User::where('id', $userId)->update(['is_business_profile' => $is_business_profile]);
              return response()->json(['is_business_profile' => $is_business_profile, 'status' => 1, 'msg' => 'Update Business Subscription Successfully'], 200);
       }

       // get user
       function get_user(Request $req, $name) {

              $data = DB::table('users')
                              ->where('username', "$name")
                              ->get()->first();

              if (empty($data)) {

                     echo "<h1 style='display: flex;align-items: center;justify-content: center;text-align: center;margin-top: center;width: 50%;height: 50%;overflow: auto;margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;'>No User Found With This Username</h1>";

                     exit;
              }

              $id = $data->id;

              User::where('id', $id)->increment('total_airpawnd');

              if ($data->is_link_active == 0) {
                     return redirect()->intended('https://pinned.eu/');
//            return abort(404);
                     exit;
              }

              $data2 = DB::table('tbl_social_link')
                              ->Join('tbl_user_social_link', function ($join) use ($data) {
                                     $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                     $join->where('tbl_user_social_link.user_id', $data->id);
                                     $join->where('tbl_user_social_link.is_first', 1);
                              })
                              ->where('tbl_social_link.is_deleted', 0)
                              ->get()->first();


              if (empty($data2)) {

//            $data2 = DB::table('tbl_social_link')
//                    ->Join('tbl_user_social_link', function ($join) use ($data) {
//                        $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
//                        $join->where('tbl_user_social_link.user_id', $data->id);
//                    })
//                    ->get()
//                    ->first();
//
//            if (empty($data2)) {
//                echo "<h1 style='display: flex;align-items: center;justify-content: center;text-align: center;margin-top: center;width: 50%;height: 50%;overflow: auto;margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;'>No Data Found For $data->username</h1>";
//                exit;
//            }

                     if ($data->is_business_profile == 1) {
                            $data3 = DB::table('tbl_social_link')
                                    ->Join('tbl_user_social_link', function ($join) use ($data) {
                                           $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                           $join->where('tbl_user_social_link.user_id', $data->id);
                                    })
                                    ->where('tbl_social_link.is_deleted', 0)
                                    ->get();

                            echo '<pre>';
                            print_r($data3);
                            exit;

                            return view('UserProfile', ['data' => $data, 'social' => $data3]);
                            exit;
                     } else {
                            $data3 = DB::table('tbl_social_link')
                                    ->Join('tbl_user_social_link', function ($join) use ($data) {
                                           $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                           $join->where('tbl_user_social_link.user_id', $data->id);
                                    })
                                    ->where('is_premium', 0)
                                    ->where('tbl_social_link.is_deleted', 0)
                                    ->get();

                            echo '<pre>';
                            print_r($data3);
                            exit;
                            return view('getuserprofile', ['data' => $data, 'social' => $data3]);
                            exit;
                     }
              }

              $user_id = $data->id;
              $random_no = $this->get_random_number(6);
              $total_count = User::where('id', $user_id)->get()->first();

              /* if ($data2->social_platform_name == "Contact info") {

                $post2 = [
                'user_id' => $user_id,
                'sendto_id' => $user_id,
                'social_link' => $data2->social_link,
                'random_no' => $random_no,
                ];

                $fields_string2 = http_build_query($post2);
                $ch2 = curl_init();
                curl_setopt($ch2, CURLOPT_URL, "http://159.89.145.112:3000/send_contact_emit_api");
                curl_setopt($ch2, CURLOPT_POST, true);
                curl_setopt($ch2, CURLOPT_POSTFIELDS, $fields_string2);
                curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
                $result2 = curl_exec($ch2);

                } */

              $post = [
                  'user_id' => $user_id,
                  'sendto_id' => $user_id,
                  'count' => $total_count->total_airpawnd,
              ];

              $fields_string = http_build_query($post);
              $ch = curl_init();
              curl_setopt($ch, CURLOPT_URL, "http://159.89.145.112:3000/send_emit_api");
              curl_setopt($ch, CURLOPT_POST, true);
              curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
              curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
              $result = curl_exec($ch);

              $platform_link = $data2->social_link;
              $id = $data2->social_id;

              return view('getuserprofile', ['data' => $data, 'social' => $data2]);
       }

       //Get User By Username
       function get_user_by_username(Request $request) {

              $name = $request->input('name');
              $link = "";
              $data = DB::table('users')
                              ->where('username', "$name")
                              ->get()->first();


              print_r($data->id);
              exit;

//        print_r($data);
//        exit;

              if (empty($data)) {
                     return response()->json(['status' => 0, 'msg' => 'No User Found'], 200);
              }

              $id = $data->id;
              User::where('id', $id)->increment('total_airpawnd');

              if ($data->is_link_active == 0) {
                     return response()->json(['status' => 1, 'msg' => 'Get User View List Successfully', 'social_link' => "http://app.pinned.eu/pinned/get_user", 'social_id' => 0, 'link' => "http://app.pinned.eu/pinned/get_user",], 200);
              }

              $data2 = DB::table('tbl_social_link')
                              ->Join('tbl_user_social_link', function ($join) use ($data) {
                                     $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                     $join->where('tbl_user_social_link.user_id', $data->id);
                                     $join->where('tbl_user_social_link.is_first', 1);
                              })
                              ->where('tbl_social_link.is_deleted', 0)
                              ->get()->first();


              if (empty($data2)) {

                     return response()->json(['status' => 1, 'msg' => 'Get User View List Successfully', 'social_link' => "http://app.pinned.eu/pinned/get_user/$data->username", 'social_id' => 0, 'link' => "http://app.pinned.eu/pinned/get_user/$data->username",], 200);
              }

              $social = $data2;
              $user_id = $data->id;
              $total_count = User::where('id', $user_id)->get()->first();
              event(new UpdateCount($user_id, $total_count->total_airpawnd));
              $platform_link = $data2->social_link;
              $id = $data2->social_id;

              $random_no = $this->get_random_number(6);

              if ($social->social_platform_name == "Instagram") {
                     $link = "https://www.instagram.com/$platform_link";
              }

              if ($social->social_platform_name == "Facebook") {
                     $link = "$platform_link";
              }

              if ($social->social_platform_name == "Address") {
                     $link = "$platform_link";
              }

              if ($social->social_platform_name == "Cash App") {
                     $link = "https://cash.app/$platform_link";
              }

              if ($social->social_platform_name == "Email") {
                     $link = $platform_link;
              }

              if ($social->social_platform_name == "Link") {
                     $link = $platform_link;
              }

              if ($social->social_platform_name == "Linkedin") {
                     $link = "$platform_link";
              }

              if ($social->social_platform_name == "PayPal") {
                     $link = "https://www.paypal.me/$platform_link";
              }

              if ($social->social_platform_name == "Contact info") {
                     $link = $platform_link;
                     $random_no = $random_no;

                     event(new SendNumber($user_id, $link, $random_no));
              }

              if ($social->social_platform_name == "Snapchat") {
                     $link = "https://www.snapchat.com/add/$platform_link";
              }

              if ($social->social_platform_name == "Soundcloud") {
                     $link = "https://soundcloud.com/$platform_link";
              }

              if ($social->social_platform_name == "Spotify") {
                     $link = "$platform_link";
              }
              if ($social->social_platform_name == "Apple Music") {
                     $link = "$platform_link";
              }

              if ($social->social_platform_name == "TikTok") {
                     $link = $platform_link;
              }

              if ($social->social_platform_name == "Twitch") {
                     $link = "https://www.twitch.tv/$platform_link";
              }

              if ($social->social_platform_name == "Twitter") {
                     $link = "https://twitter.com/$platform_link";
              }

              if ($social->social_platform_name == "Venmo") {

                     $platform_link2 = $data2->social_link_2;
                     $link = "https://venmo.com/$platform_link";
                     $link2 = "$platform_link2";

                     return response()->json(['status' => 1, 'msg' => 'Get User View List Successfully', 'social_link' => $platform_link, 'social_link_2' => $platform_link2, 'social_id' => $id, 'link' => $link, 'random_no' => $random_no], 200);
              }

              if ($social->social_platform_name == "WhatsApp") {
                     $link = "https://wa.me/$platform_link";
              }

              if ($social->social_platform_name == "Website") {
                     $link = "https://$social->social_link";
              }
              if ($social->social_platform_name == "Google Slides") {
                     $link = $data2->social_link;
              }
              if ($social->social_platform_name == "Google Sheets") {
                     $link = $data2->social_link;
              }
              if ($social->social_platform_name == "Google Docs") {
                     $link = $data2->social_link;
              }

              if ($social->social_platform_name == "YouTube") {
                     $link = "https://www.youtube.com/channel/$platform_link";
              }

              if ($social->social_platform_name == "Zoom") {
                     $link = $data2->social_link;
              }


              if ($social->social_platform_name == "Skype") {
                     $link = $data2->social_link;
              }

              if ($social->social_id == 37) {
                     $link = $data2->social_link;
              }
              if ($social->social_id == 38) {
                     $link = $data2->social_link;
              }
              if ($social->social_id == 39) {
                     $link = $data2->social_link;
              }
              if ($social->social_id == 40) {
                     $link = $data2->social_link;
              }
//              exit;

              return response()->json(['status' => 1, 'msg' => 'Get User View List Successfully', 'social_link' => $platform_link, 'social_id' => $id, 'link' => $link, 'random_no' => $random_no], 200);
       }

       //Delete Link
       function delete_social_link(Request $request) {

              $rule = [
                  'link_id' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {
                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $link_id = $request->input('link_id');

              tbl_user_social_link::where('link_id', $link_id)->delete();

              return response()->json(['status' => 1, 'msg' => 'Link Removed Successfully'], 200);
       }

       //Basic Function
       public function check_email($email) {

              $users = DB::table('users')
                              ->select('email')
                              ->where('email', $email)
                              ->get()->first();

              return $users;
       }

       public function select($table, $select, $where) {

              $users = DB::table($table)
                      ->select($select)
                      ->where($where)
                      ->get();

              return $users;
       }

       function update($table, $where, $update) {

              $data = DB::table($table)
                      ->where($where)
                      ->update($update);

              return $data;
       }

       function insert($table, $values) {

              $users = \DB::table($table)
                      ->insertGetId($values);

              return $users;
       }

       function add_device($arr) {

              $where = array(
                  'user_id' => $arr['user_id'],
                  'device_id' => $arr['device_id'],
                  'device_type' => $arr['device_type'],
              );

              $check_device = $this->select('tbl_token', '*', $where)->toArray();

              if (!empty($check_device)) {

                     $update = array(
                         'device_token' => $arr['device_token'],
                     );

                     $this->update('tbl_token', $where, $update);
              } else {

                     $this->insert('tbl_token', $arr);
              }
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

       function generate_vcf_by_id($user_id) {


              // $data = DB::table('users')->where('username', "$name")->get()->first();
              $data = DB::table('users')->where('id', "$user_id")->get()->first();
              $id = $data->id;
              $data2 = tbl_user_social_link::where('user_id', $id)->where('social_id', 10)->get()->first();
              $social_link = $data2->social_link;


              if ($data->is_business_profile == 1) {
                     // is_business_profile
                     $firstname = preg_replace('#[^\pL\pN/-]+#', '', $data->business_name);
                     $resStr_b = strtolower($firstname);

                     $vcard = new VCard();
                     $business_email = $data->business_email;
                     $business_phone = $social_link;
                     $business_website = $data->business_website;
                     $vcard->addName($resStr_b);
                     $vcard->addEmail($business_email);
                     $vcard->addPhoneNumber($business_phone);
                     $vcard->addURL($business_website);
                     $vcard->addAddress(null, null, 'street', 'worktown', null, 'workpostcode', 'Belgium');
                     $vcard->setSavePath(public_path());
                     $vcard->save();

//                     echo '<pre>';
//                     print_r($vcard);
//                     exit;
              } else {
                     // is_not_business_profile
                     $vcard = new VCard();
                     $firstname = preg_replace('#[^\pL\pN/-]+#', '', $data->username);
                     $vcard->addName($firstname);
                     $vcard->addEmail($data->email);
                     $vcard->addPhoneNumber($social_link, 'PREF;WORK');
                     $vcard->addPhoneNumber($social_link, 'WORK');
                     $vcard->addAddress(null, null, 'street', 'worktown', null, 'workpostcode', 'Belgium');
                     $vcard->setSavePath(public_path());
                     $vcard->save();
              }

              $firstname2 = preg_replace('#[^\pL\pN/]+#', '', $data->username);
              $resStr = strtolower($data->username);
              $vcard_link = "https://app.pinned.eu/pinned/public/$firstname2.vcf";
              User::where('id', $id)->update(['vcard_link' => $vcard_link]);
       }

       function generate_vcf($name) {


              $data = DB::table('users')->where('username', "$name")->get()->first();
              $id = $data->id;
              $data2 = tbl_user_social_link::where('user_id', $id)->where('social_id', 10)->get()->first();
//              print_r($data2);
//              exit;

              if ($data2) {
//                     echo 'ok';
//                     exit;
                     $social_link = $data2->social_link;
                     echo "<script>window.location.href = '$data->vcard_link';</script>";
              } else {
                     echo "<h1 style='display: flex;align-items: center;justify-content: center;text-align: center;margin-top: center;width: 50%;height: 50%;overflow: auto;margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;'>No User Found With This Username</h1>";

                     exit;
              }
       }

       function lib2($param) {
              header("Content-type: text/x-vcard");
              header("Content-Disposition: attachment; filename=\"john_doe.vcf\";");
              $vcard = new vCard;

              $vcard->setName("John", "Doe");

              // Every set functions below are optional
              $vcard->setTitle("Software dev.");
              $vcard->setPhone("+1234567890");
              $vcard->setURL("http://johndoe.com");
              $vcard->setTwitter("diplodocus");
              $vcard->setMail("john@johndoe.com");
              $vcard->setAddress(array(
                  "street_address" => "Main Street",
                  "city" => "Ghost Town",
                  "state" => "",
                  "postal_code" => "012345",
                  "country_name" => "Somewhere"
              ));
              $vcard->setNote("Lorem Ipsum, \nWith new line.");

              echo $vcard;
       }

       function open_venmo() {
              return view('venmo');
       }

       function check_user_name($username) {

              $username1 = strtolower(trim(str_replace(" ", "", $username)));
              $username = preg_replace('/[^A-Za-z0-9\-]/', '', $username1);

              $data = User::where('username', '=', "$username")->get()->first();

              if (!empty($data)) {
                     $new_username = $username . "_" . $this->get_random_number(2);

                     $check_2 = User::where('username', '=', "$new_username")->get()->first();
                     if (!empty($check_2)) {
                            $new_username2 = $username . "_" . $this->get_random_number(3);
                            $final_username = $new_username2;
                     } else {
                            $final_username = $new_username;
                     }
              } else {
                     $final_username = $username;
              }

              return $final_username;
       }

       function privacy_policy(Request $request) {
              return view('privacy');
       }

       function terms_of_use(Request $request) {
              return view('terms');
       }

       //add reciept in database
       function add_reciept(Request $request) {

              $rule = [
                  'receipt_data' => 'required',
              ];

              $validate = Validator::make(request()->all(), $rule);

              if ($validate->fails()) {
                     return response()->json(['status' => 0, 'msg' => 'validation fail', 'data' => ['errors' => $validate->errors()]], 401);
              }

              $user_id = Auth::id();
              $receipt_data = $request->input('receipt_data');

              $check_data = tbl_user_reciept::where('user_id', $user_id)->get()->first();

              if (empty($check_data)) {
                     //insert
                     $data = new tbl_user_reciept();
                     $data->user_id = $user_id;
                     $data->receipt_data = $receipt_data;
                     $data->save();

                     $this->check_if_renewed_subscription($receipt_data, $user_id);

                     User::where('id', $user_id)->update(['is_business_profile' => 1]);
              } else {
                     //update
                     $where['user_id'] = $user_id;
                     $update['receipt_data'] = $receipt_data;
                     $this->update('tbl_user_reciept', $where, $update);

                     $this->check_if_renewed_subscription($receipt_data, $user_id);
                     User::where('id', $user_id)->update(['is_business_profile' => 1]);
              }

              return response()->json(['status' => 1, 'msg' => 'User Reciept Added Successfully'], 200);
       }

       function cron_check_subscription(Request $request) {
              $now = date('Y-m-d H:i:s');
              $data = tbl_user_reciept::where('end_date', '<=', $now)->get();

              foreach ($data as $key => $value) {
                     $user_id = $value['user_id'];
                     //checkif they are renewed theirs subscription or not
                     $is_renewed = $this->check_if_renewed_subscription($value['receipt_data'], $value['user_id']);

                     if ($is_renewed == 1) {
                            //update in tbl_user
                            User::where('id', $value['user_id'])->update(['is_business_profile' => $is_renewed]);
//                echo "Renewal Successfully $user_id" . "<br>";
                     } else {
                            //update in tbl_user
                            User::where('id', $value['user_id'])->update(['is_business_profile' => $is_renewed]);
//                            tbl_user_social_link::where('user_id', $value['user_id'])->update(['is_first' => 0]);
//                echo "He Is No Long More Business $user_id" . "<br>";
                     }
              }
       }

       function check_if_renewed_subscription($receipt_data, $user_id) {
              $receipt_data_['receipt-data'] = $receipt_data;
              $receipt_data_['password'] = "9d28cec1cf59454e9d5f42a44615fe68";

              $json = json_encode($receipt_data_);
//        $url = "https://sandbox.itunes.apple.com/verifyReceipt";
              $url = "https://buy.itunes.apple.com/verifyReceipt";
              $m = $this->excute_curl($json, $url);

              $m = json_decode($m, true);

              if ($m['status'] == 0) {
                     $count = count($m['receipt']['in_app']) - 1;
                     $transaction_id = $m['latest_receipt_info'][0]['transaction_id'];
                     $start_date = rtrim($m['latest_receipt_info'][0]['purchase_date'], " Etc/GMT");
                     $end_date = rtrim($m['latest_receipt_info'][0]['expires_date'], " Etc/GMT");
                     $now = gmdate("Y-m-d H:i:s");

//            print(" End Date " . $end_date . " and Now " . $now) . "<br>";

                     if ($end_date > $now) {
                            //update
                            $update['transaction_id'] = $transaction_id;
                            $update['purchase_date'] = $start_date;
                            $update['end_date'] = $end_date;
                            $where['user_id'] = $user_id;
                            $this->update('tbl_user_reciept', $where, $update);
                            return 1;
                     } else {
                            return 0;
                     }
              } else {
                     return 0;
              }
       }

       function verifyReciept(Request $request) {

              $rule = [
                  'user_id' => 'required',
                  'json' => 'required',
              ];

              $validate = Validator::make($request->all(), $rule);

              if ($validate->fails()) {
                     return response()->json(['status' => '0', 'message' => 'validation fail', 'data' => ['error' => $validate->errors()]], 401);
              }

              $json = $request->input('json');
              $url = "https://sandbox.itunes.apple.com/verifyReceipt";
              //$url = "https://buy.itunes.apple.com/verifyReceipt";
              $m = $this->excute_curl($json, $url);

              $m = json_decode($m, true);

              $count = count($m['receipt']['in_app']) - 1;

              $user_id = $request->input('user_id');
              $transaction_id = $m['receipt']['in_app'][$count]['transaction_id'];
              $start_date = rtrim($m['receipt']['in_app'][$count]['purchase_date'], " Etc/GMT");
              $end_date = rtrim($m['receipt']['in_app'][$count]['expires_date'], " Etc/GMT");

              $where['user_id'] = $user_id;
              $check_user = $this->select('tbl_user_transaction', '*', $where)->first();

              if ($check_user) {

                     //update
                     $update['transaction_id'] = $transaction_id;
                     $update['start_date'] = $start_date;
                     $update['end_date'] = $end_date;

                     $this->update('tbl_user_transaction', $where, $update);
              } else {

                     //insert
                     $data = array(
                         'user_id' => $user_id,
                         'transaction_id' => $transaction_id,
                         'start_date' => $start_date,
                         'end_date' => $end_date,
                     );

                     $this->insert('tbl_user_transaction', $data);
              }
              return response()->json(['status' => 1, 'message' => 'Subscription Added successfully'], 200);
       }

       //curl call
       function excute_curl($json, $url) {
              $ch = curl_init();
              curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
              curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
              curl_setopt($ch, CURLOPT_URL, $url);
              curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
              $result = curl_exec($ch);
              curl_close($ch);
              return $result;
       }

       // get user
       function get_userv1(Request $req, $name) {
              $data = DB::table('users')
                              ->where('username', "$name")
                              ->get()->first();

              if (empty($data)) {

                     echo "<h1 style='display: flex;align-items: center;justify-content: center;text-align: center;margin-top: center;width: 50%;height: 50%;overflow: auto;margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;'>No User Found With This Username</h1>";
                     exit;
              }

              $id = $data->id;

              User::where('id', $id)->increment('total_airpawnd');

              if ($data->is_link_active == 0) {

                     return abort(404);
                     exit;
              }


              $data2 = tbl_user_social_link::select(array('*'))
                              ->leftjoin('tbl_social_link', function($join) {
                                     $join->on('tbl_user_social_link.social_id', '=', 'tbl_social_link.social_id');
                              })
                              ->where('tbl_user_social_link.user_id', $data->id)
                              ->where('tbl_user_social_link.is_first', 1)
                              ->orderBy('is_first', 'DESC')->get()->first();
//              echo '<pre>';
//              print_r($data2->toArray());
//              exit;

              $contact_info = DB::table('tbl_social_link')
                              ->Join('tbl_user_social_link', function ($join) use ($data) {
                                     $join->on('tbl_social_link.social_id', '=', 'tbl_user_social_link.social_id');
                                     $join->where('tbl_user_social_link.user_id', $data->id);
                                     $join->where('tbl_user_social_link.social_id', 10);
                              })
                              ->join('users', 'tbl_user_social_link.user_id', 'users.id')
                              ->get()->first();




              if (empty($data2)) {


                     $data3 = tbl_user_social_link::select(array('*',))
                                     ->join('tbl_social_link', function($join) {
                                            $join->on('tbl_user_social_link.social_id', '=', 'tbl_social_link.social_id');
                                     })
                                     ->where('tbl_user_social_link.user_id', $data->id)
                                     ->where('tbl_social_link.is_deleted', 0)
                                     ->orderBy('is_first', 'DESC')->get();

//                     echo '<pre>';
//                     print_r($data3->toArray());
//                     exit;


                     foreach ($data3 as $key => $user) {
                            $platform_link = $user->social_link;
                            $social_platforn_url = $user->social_platforn_url;

                            if ($user->social_id == 1) {
                                   $open_link = "https://www.instagram.com/$platform_link";
                            } else if ($user->social_id == 2) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 3) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 4) {
                                   $open_link = "https://cash.app/$platform_link";
                            } else if ($user->social_id == 5) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 6) {
                                   $open_link = "https://pinterest.com/$platform_link";
                            } else if ($user->social_id == 7) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 8) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 9) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 10) {
                                   $open_link = "https://app.pinned.eu/pinned/generate_vcf/$data->username";
                            } else if ($user->social_id == 11) {
                                   $open_link = "https://www.snapchat.com/add/$platform_link";
                            } else if ($user->social_id == 12) {
                                   $open_link = "$platform_link";
                            } else if ($user->social_id == 13) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 14) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 15) {
                                   $open_link = "https://www.twitch.tv/$platform_link";
                            } else if ($user->social_id == 16) {
                                   $open_link = "https://twitter.com/$platform_link";
                            } else if ($user->social_id == 17) {

                                   $open_link = $platform_link;
                            } else if ($user->social_id == 18) {
                                   $open_link = "https://wa.me/$platform_link";
                            } else if ($user->social_id == 19) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 20) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 21) { //Tinder
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 22) { //Apple Music
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 23) { //Paysera
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 24) { //Fiver
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 25) { //Alibaba
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 26) { //Pinterest
                                   $open_link = 'https://pinterest.com/$platform_link';
                            } else if ($user->social_id == 27) { //Tinder
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 28) { //VK
                                   $open_link = 'https://vk.com/$platform_link';
                            } else if ($user->social_id == 29) { //Viber
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 30) { //Telegram
                                   $open_link = "$social_platforn_url$platform_link";
                            } else if ($user->social_id == 31) { //Skype
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 32) { //Odnokassniki
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 33) { //TransferWise
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 34) { //Amazon Business
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 35) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 36) { //OnlyFans
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 37) {
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 38) { //Calendly
                                   $open_link = "https://calendly.com/$platform_link";
                            } else if ($user->social_id == 39) { //Clubhouse
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 40) { //eToro
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 44) { //Podcast
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 51) { //Google Docs
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 52) { //Google Sheets
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 53) { //Google Slides
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 47) { //Embedded Video
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 41) { //Zoom
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 45) { //Etsy
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 43) { //Ethereum
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 42) { //Bitcoin
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 46) { //Shopify
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 48) { //Excel
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 49) { //PDF file
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 50) { //CSV file
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 51) { //Google Docs
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 52) { //Google Sheets
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 53) { //Google Slides
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 54) { //Jeunesse
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 55) { //Vimeo
                                   $open_link = $platform_link;
                            } else if ($user->social_id == 56) { //Binance
                                   $open_link = $platform_link;
                            } else { //Binance
                                   $open_link = $platform_link;
                            }

                            $data3[$key]->open_link = $open_link;
                     }
//                     echo '<pre>';
//                     print_r($data3);
//                     exit;
                     return view('pinned', ['data' => $data, 'social' => $data3, 'contact_info' => $contact_info]);
                     exit;



                     if (empty($data2)) {

                            echo "<h1 style='display: flex;align-items: center;justify-content: center;text-align: center;margin-top: center;width: 50%;height: 50%;overflow: auto;margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;'>No Data Found For $data->username</h1>";
                            exit;
                     }
              }



              $user_id = $data->id;
              $random_no = $this->get_random_number(6);
              $total_count = User::where('id', $user_id)->get()->first();

              if ($data2->social_platform_name == "Contact Card") {

                     event(new SendNumber($user_id, $data2->social_link, $random_no));
              }

              if ($data2->social_platform_name == "Venmo") {

                     event(new SendVenmo($user_id, $data2->social_link));
              }

              event(new UpdateCount($user_id, $total_count->total_tapandtag));

              $platform_link = $data2->social_link;

              $id = $data2->social_id;

              return view('profile', ['data' => $data, 'social' => $data2, 'contact_info' => $contact_info]);
       }

}
