<?php

use Illuminate\Support\Facades\Route;

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

Route::get('/', function () {
       return view('welcome');
});

Route::get('get_user/{name}', 'UserController@get_userv1');
Route::get('privacy_policy', 'UserController@privacy_policy');
Route::get('terms_of_use', 'UserController@terms_of_use');
//Route::get('get_user/{name}', 'UserController@index'); origional
Route::get('open_venmo', 'UserController@open_venmo');
Route::get('get_user_2/{name}', 'UserController@get_user');

Route::get('generate_vcf/{name}', 'UserController@generate_vcf');

Route::get('get_user_by_username/{name}', 'UserController@get_user_by_username');
Route::get('generate_vcf_by_id/{id}', 'UserController@generate_vcf_by_id');


Route::post('admin_login', 'Admin\AdminController@admin_login');

Route::get('Admin', 'Admin\AdminController@Admin');
Route::group(['namespace' => 'Admin', 'middleware' => 'admin'], function () {
       Route::get('Dashboard', 'AdminController@Dashboard');
       Route::get('check_user', 'AdminController@check_user');

       Route::get('Block_user/{id}', 'AdminController@block_user');
       Route::get('UnBlock_user/{id}', 'AdminController@unblock_user');
       Route::get('Delete/{id}', 'AdminController@delete_user');
       Route::get('logout', 'AdminController@logout');
       Route::get('List_user', 'AdminController@list_user');
});

Route::group(['namespace' => 'Admin', 'middleware' => 'admin'], function () {

});
