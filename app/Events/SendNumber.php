<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class SendNumber implements ShouldBroadcastNow {

    use Dispatchable,
        InteractsWithSockets,
        SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $user_id;
    public $phone_number;
    public $random_no;

    public function __construct($user_id, $phone_number, $random_no) {
        $this->user_id = $user_id;
        $this->phone_number = $phone_number;
        $this->random_no = $random_no;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn() {
        return ['airpawnd'];
    }

    public function broadcastAs() {
        return 'getphonenumber';
    }

}
