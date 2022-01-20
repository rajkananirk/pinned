<!DOCTYPE html>

<html lang="en" dir="ltr">

       <head>
              <meta charset="utf-8">
              <title>Pinned</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link rel="stylesheet" href="{{asset('public/css/style.css')}}">
              <link rel="icon" href="{{asset('public/images/LOGO_ICON_PNG.png')}}" type="image/gif" sizes="16x16">
              <meta http-equiv="Cache-control" content="no-cache">
              <meta http-equiv="Expires" content="-1">
       </head>

       <style>
              img {
                     border-radius: 50%;
              }
              a.button {
                     padding: 5px;
                     float: right;
                     padding: 7px;
                     background: white;
                     border: none;
                     width: 100px;
                     border-radius: 10px;
                     margin-top: 13px;
                     margin-right: 5px;
                     color: #5F5F5F;
              }
              .black-section > div {
                     width: 100%;
                     color: white;
                     padding-top: 2px;
              }

       </style>
       <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>

       <body>

              <div class="header-container-zactra">

                     <header>
                         <!--<img src="{{asset('public/images/white.png')}}" class="header-sr-icon" alt="">-->
                            <div class="header-sr-icon" >
                                   <span class="header-title"> Pinned </span>
                            </div>
                     </header>

              </div>

              <section class="margin-zactra">

                     <div class="backgroud-overlay">
                            @if(!empty($data->business_profile_pic))
                            <div class="avatar2 avatared" alt="">
                                   <img src="{{$data->business_profile_pic}}">
                            </div>
                            @elseif(!empty($data->profile_pic))
                            <div class="avatar2 avatared" alt="">
                                   <img src="{{$data->profile_pic}}">
                            </div>
                            @else
                            <img src="{{asset('public/images/user_profile.png')}}" class="avatar" alt="" style="width:120px; height: 120px ">
                            @endif
                     </div>

                     @if(!empty($data->business_name))
                     <p><b class="title-name" style="color: white;">{{ $data->business_name}}</b></p>
                     @else
                     <p><b class="title-name" style="color: white;">{{ $data->username}}</b></p>
                     @endif

                     <br>

                     @if(!empty($data->business_website))
                     <div class="card-body" style="color: white;">
                            <strong><i class="fa fa-globe"></i> Website : </strong>

                            <?php
                            $strUrl = $data->business_website;
                            $arrParsedUrl = parse_url($strUrl);
                            if (!empty($arrParsedUrl['scheme'])) {
                                   // Contains http:// schema
                                   if ($arrParsedUrl['scheme'] === "http") {
                                          // Contains http:// schema
                                          $url = "$strUrl";
                                   } else if ($arrParsedUrl['scheme'] === "https") {
                                          // Contains https:// schema
                                          $url = "$strUrl";
                                   }
                            } else {
                                   // Don't contains http:// or https://
                                   $url = "http://$strUrl";
                            }
                            ?>

                            <a href="<?php echo $url; ?>" style="color: white;">
                                   <?php echo $url; ?>
                            </a>



                     </div>
                     <br>
                     @endif

                     @if(!empty($data->business_phone))
                     <div class="card-body" style="color: white;">
                            <strong style="color: white;"><i class="fa fa-phone"></i> Phone : </strong>
                            <!--<a href="tel:{{$data->business_phone}}">{{$data->business_phone}}</a>-->
                            {{$data->business_phone}}
                     </div>
                     <br>
                     @endif

                     @if(!empty($data->business_email))
                     <div class="card-body" style="color: white;">
                            <strong style="color: white;"><i class="fa fa-envelope"></i> Email : </strong>
                            <!--<a href="tel:{{$data->business_phone}}">{{$data->business_phone}}</a>-->
                            {{$data->business_email}}
                     </div>
                     <br>
                     @endif

                     @if(!empty($data->user_bio))
                     <div class="card-body" style="color: white;">
                            {{$data->user_bio}}
                     </div>
                     @endif

              </section>

              <section class="margin-zactra">

                     <div class="black-section">

                            <div>

                                   <div class="black-inner-div-margin">

                                   </div>

                                   <div class="black-middle-section">

                                          Pinned {{$data->total_airpawnd}}

                                   </div>

                            </div>

              </section>

              <section class="margin-zactra">

                     @foreach ($social as $user)

                     @if($user->social_id == 35)
                     <div class="zactra-special-box" style="background-image: linear-gradient(to right, #5789C1, #E22862);">
                            @else
                            <div class="zactra-special-box" style="background-image: linear-gradient(to right, #<?php echo substr($user->gradient_start, 4); ?>, #E22862);">
                                   @endif

                                   <img class="special-image" src="{{$user->social_platform_icon}}" alt="">

                                   <span class="special-text">
                                          <?php
                                          if ($data->is_business_profile == 1 && $user->social_id == 10) {
                                                 //Business Info
                                                 $str = substr('Business Info', 0, 9) . '...';
                                                 echo $str;
                                          } else {
                                                 if (strlen($user->social_platform_name) > 9)
                                                        $str = substr($user->social_platform_name, 0, 9) . '...';
                                                 else {
                                                        $str = $user->social_platform_name;
                                                 }
                                                 echo $str;
                                          }
                                          ?>
                                   </span>

                                   <a class="button" href="<?php
                                      $platform_link = $user->social_link;

                                      if ($user->social_platform_name == "Instagram") {
                                             echo " https://www.instagram.com/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Facebook") {
                                             echo " https://www.facebook.com/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Address") {
                                             echo "$platform_link";
                                      }

                                      if ($user->social_platform_name == "Cash App") {
                                             echo " https://cash.app/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Email") {
                                             echo " mailto:$platform_link";
                                      }

                                      if ($user->social_id == 35) {
                                             echo " $platform_link";
                                      }

                                      if ($user->social_platform_name == "Linkedin") {
                                             echo " $platform_link";
                                      }

                                      if ($user->social_platform_name == "PayPal") {
                                             echo " https://www.paypal.me/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Contact info") {
                                             echo "$data->vcard_link";
                                      }

                                      if ($user->social_platform_name == "Snapchat") {
                                             echo " https://www.snapchat.com/add/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Soundcloud") {
                                             echo " $platform_link";
                                      }

                                      if ($user->social_platform_name == "Spotify") {

                                             echo "$platform_link";
                                      }

                                      if ($user->social_platform_name == "TikTok") {
                                             echo " $platform_link";
                                      }

                                      if ($user->social_platform_name == "Twitch") {
                                             echo " https://www.twitch.tv/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Twitter") {
                                             echo " https://twitter.com/$platform_link";
                                      }

                                      if ($user->social_platform_name == "Venmo") {
                                             echo " https://venmo.com/$platform_link";
                                      }
                                      if ($user->social_platform_name == "WhatsApp") {
                                             echo " https://wa.me/$platform_link";
                                      }
                                      if ($user->social_platform_name == "Website") {
                                             echo " https://$user->social_link";
                                      }
                                      if ($user->social_platform_name == "YouTube") {
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 36) { //OnlyFans
                                             echo "$platform_link";
                                      }
                                      if ($user->social_id == 22) { //Apple Music
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 23) { //Paysera
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 24) { //Fiver
                                             echo " https://www.fiverr.com/$platform_link";
                                      }
                                      if ($user->social_id == 25) { //Alibaba
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 6) { //Pinterest
                                             echo " https://pinterest.com/$platform_link";
                                      }
                                      if ($user->social_id == 21) { //Tinder
                                             echo " https://tinder.com/$platform_link";
                                      }
                                      if ($user->social_id == 28) { //VK
                                             echo " https://vk.com/$platform_link";
                                      }
                                      if ($user->social_id == 29) { //Viber
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 30) { //Telegram
                                             echo " https://telegram.me/$platform_link";
                                      }
                                      if ($user->social_id == 31) { //Skype
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 32) { //ok.ru
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 33) { //Transfer Wise
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 34) { //Amazon Business
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 37) {
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 38) {
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 39) {
                                             echo " $platform_link";
                                      }
                                      if ($user->social_id == 40) {
                                             echo " $platform_link";
                                      }
                                      ?>" target="_blank">view </a>

                            </div>

                            @endforeach

              </section>

       </body>

</html>