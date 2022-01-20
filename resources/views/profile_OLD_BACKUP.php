<?php

//$platform = lcfirst($social->social_platform_name);
//$platform_link = $social->social_link;
//
//
//if ($social->social_platform_name == "Instagram") {
//    // header("Location: https://www.instagram.com/$platform_link");
//    header("Location: instagram://user?username=$platform_link");
//}
//if ($social->social_platform_name == "Facebook") {
////    header("Location: https://www.facebook.com/$platform_link");
////    header("Location: fb://profile/$platform_link");
//    header("Location: fb://page/$platform_link");
//}
//if ($social->social_platform_name == "Address") {
////    header("Location: https://maps.google.com/?q=$platform_link");
//    header("Location: https://maps.app.goo.gl/?q=$platform_link");
//}
//if ($social->social_platform_name == "Cash") {
//    header("Location: https://cash.app/$social->social_link");
//}
//if ($social->social_platform_name == "Email") {
//    header("Location: mailto:$social->social_link");
//}
//if ($social->social_platform_name == "Linked") {
////    header("Location: https://www.linkedin.com/in/$platform_link");
//    header("Location: linkedin://profile/$platform_link");
//}
//if ($social->social_platform_name == "Music") {
//    header("Location: $platform://user?username=$social->social_link");
//}
//if ($social->social_platform_name == "Paypal") {
//    header("Location: https://www.paypal.me/" . "/$social->social_link");
////    header("Location: paypal://" . "$social->social_link");
//}
//if ($social->social_platform_name == "Phone") {
//    header("Location: tel:$social->social_link");
//}
//if ($social->social_platform_name == "Snapchat") {
//    header("Location: https://www.snapchat.com/add/$platform_link");
//}
//if ($social->social_platform_name == "Soundcloud") {
////    header("Location: https://soundcloud.com/$platform_link");
//    header("Location: soundcloud://$platform_link");
//}
//if ($social->social_platform_name == "Spotify") {
//    header("Location: https://open.spotify.com/user/$platform_link");
//}
//if ($social->social_platform_name == "TikTok") {
////    header("Location: tiktok://@$platform_link");
//    header("Location: https://www.tiktok.com/@$platform_link");
//}
//if ($social->social_platform_name == "Twitch") {
//    header("Location: https://www.twitch.tv/$platform_link");
//}
//if ($social->social_platform_name == "Twitter") {
//    header("Location: https://twitter.com/$platform_link");
//}
//if ($social->social_platform_name == "Venmo") {
////    header("Location: https://venmo.com/$platform_link");
//    header("Location: venmo://users/$platform_link");
//}
//if ($social->social_platform_name == "Whatsapp") {
//    header("Location: https://wa.me/$platform_link?text=Hi");
//}
//if ($social->social_platform_name == "Website") {
//    header("Location: $platform_link");
//}
//if ($social->social_platform_name == "Youtube") {
////    header("Location: https://www.youtube.com/channel/$platform_link");
//    header("Location: vnd.youtube://$platform_link");
//}
//print_r(lcfirst($social->social_platform_name));


foreach ($social as $key => $social) {
    $platform = lcfirst($social->social_platform_name);
    $platform_link = $social->social_link;


    if ($social->social_platform_name == "Instagram") {
        header("Location: instagram://user?username=$platform_link");
        header("Location: https://www.instagram.com/$platform_link");
    }
    if ($social->social_platform_name == "Facebook") {
        header("Location: https://www.facebook.com/$platform_link");
    }
    if ($social->social_platform_name == "Address") {
        header("Location: https://maps.app.goo.gl/?q=$platform_link");
    }
    if ($social->social_platform_name == "Cash") {
        header("Location: https://cash.app/$social->social_link");
    }
    if ($social->social_platform_name == "Email") {
        header("Location: mailto:$social->social_link");
    }
    if ($social->social_platform_name == "Linked") {
        header("Location: linkedin://profile/$platform_link");
    }
    if ($social->social_platform_name == "Music") {
        header("Location: $platform://user?username=$social->social_link");
    }
    if ($social->social_platform_name == "Paypal") {
        header("Location: https://www.paypal.me/" . "/$social->social_link");
    }
    if ($social->social_platform_name == "Phone") {
        header("Location: tel:$social->social_link");
    }
    if ($social->social_platform_name == "Snapchat") {
        header("Location: https://www.snapchat.com/add/$platform_link");
    }
    if ($social->social_platform_name == "Soundcloud") {
        header("Location: soundcloud://$platform_link");
    }
    if ($social->social_platform_name == "Spotify") {
        header("Location: https://open.spotify.com/user/$platform_link");
    }
    if ($social->social_platform_name == "TikTok") {
        header("Location: https://www.tiktok.com/@$platform_link");
    }
    if ($social->social_platform_name == "Twitch") {
        header("Location: https://www.twitch.tv/$platform_link");
    }
    if ($social->social_platform_name == "Twitter") {
        header("Location: https://twitter.com/$platform_link");
    }
    if ($social->social_platform_name == "Venmo") {
        header("Location: venmo://users/$platform_link");
    }
    if ($social->social_platform_name == "Whatsapp") {
        header("Location: https://wa.me/$platform_link?text=Hi");
    }
    if ($social->social_platform_name == "Website") {
        header("Location: $platform_link");
    }
    if ($social->social_platform_name == "Youtube") {
        header("Location: vnd.youtube://$platform_link");
    }
}