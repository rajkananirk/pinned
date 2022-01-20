<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class tbl_user_social_link extends Model {

    protected $table = 'tbl_user_social_link';
    public $timestamps = false;

    public function social_platform() {
        return $this->hasOne(tbl_social_link::class, 'social_id', 'social_id');
    }

}
