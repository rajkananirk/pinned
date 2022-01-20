<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class tbl_user_reciept extends Model {

    protected $table = 'tbl_user_reciept';
    public $timestamps = false;
    protected $primaryKey = 'reciept_id';
    protected $fillable = ['user_id', 'receipt_data'];

}
