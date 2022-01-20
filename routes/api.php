<?phpuse Illuminate\Http\Request;use Illuminate\Support\Facades\Route;/*  |--------------------------------------------------------------------------  | API Routes  |--------------------------------------------------------------------------  |  | Here is where you can register API routes for your application. These  | routes are loaded by the RouteServiceProvider within a group which  | is assigned the "api" middleware group. Enjoy building your API!  | */Route::middleware('auth:api')->get('/user', function (Request $request) {       return $request->user();});Route::post('login_by_thirdparty', 'UserController@login_by_thirdparty');Route::group(['middleware' => 'auth:api'], function () {       Route::post('update_profile', 'UserController@update_profile');       Route::post('logout', 'UserController@logout');       Route::post('list_social_platform', 'UserController@list_social_platform');       Route::post('get_user_social_link', 'UserController@get_user_social_link');       Route::post('add_user_social_link', 'UserController@add_user_social_link');       Route::post('add_to_view', 'UserController@add_to_view');       Route::post('list_viewed_users', 'UserController@list_viewed_users');       Route::post('update_airpawnd', 'UserController@update_airpawnd');       Route::post('update_is_first', 'UserController@update_is_first');       Route::post('update_link_status', 'UserController@update_link_status');       Route::post('delete_social_link', 'UserController@delete_social_link');       Route::post('get_link_active_status', 'UserController@get_link_active_status');       Route::post('add_business_info', 'UserController@add_business_info');       Route::post('edit_business_info', 'UserController@edit_business_info');       Route::post('get_business_info', 'UserController@get_business_info');       Route::post('buy_business_subscription', 'UserController@buy_business_subscription');       Route::post('add_reciept', 'UserController@add_reciept');       Route::post('get_user_detail', 'UserController@get_user_detail');       Route::post('update_subscription', 'UserController@update_subscription');});Route::post('get_user_by_username', 'UserController@get_user_by_username');Route::get('generate_vcf', 'UserController@generate_vcf');Route::get('cron_check_subscription', 'UserController@cron_check_subscriptionv');