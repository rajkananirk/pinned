<?php
foreach ($social as $key => $social) {
    $platform = lcfirst($social->social_platform_name);
    $platform_link = $social->social_link;


    if ($social->social_platform_name == "Instagram") {
        $link[] = "https://www.instagram.com/$platform_link";
    }
    if ($social->social_platform_name == "Facebook") {
        $link[] = "https://www.facebook.com/$platform_link";
    }
    if ($social->social_platform_name == "Address") {
        $link[] = "https://maps.app.goo.gl/?q=$platform_link";
    }
    if ($social->social_platform_name == "Cash") {
        $link[] = "https://cash.app/$social->social_link";
    }
    if ($social->social_platform_name == "Email") {
        $link[] = "mailto:$social->social_link";
    }
    if ($social->social_platform_name == "Linked") {
        $link[] = "https://profile/$platform_link";
    }
    if ($social->social_platform_name == "Paypal") {
        $link[] = "https://www.paypal.me/" . "/$social->social_link";
    }
    if ($social->social_platform_name == "Phone") {
        $link[] = "tel:$platform_link";
    }
    if ($social->social_platform_name == "Snapchat") {
        $link[] = "https://www.snapchat.com/add/$platform_link";
    }
    if ($social->social_platform_name == "Soundcloud") {
        $link[] = "https://$platform_link";
    }
    if ($social->social_platform_name == "Spotify") {
        $link[] = "https://open.spotify.com/user/$platform_link";
    }
    if ($social->social_platform_name == "TikTok") {
        $link[] = "https://www.tiktok.com/@$platform_link";
    }
    if ($social->social_platform_name == "Twitch") {
        $link[] = "https://www.twitch.tv/$platform_link";
    }
    if ($social->social_platform_name == "Twitter") {
        $link[] = "https://twitter.com/$platform_link";
    }
    if ($social->social_platform_name == "Venmo") {
        $link[] = "https://users/$platform_link";
    }
    if ($social->social_platform_name == "Whatsapp") {
        $link[] = "https://wa.me/$platform_link?text=Hi";
    }
    if ($social->social_platform_name == "Website") {
        $link[] = "$platform_link";
    }
    if ($social->social_platform_name == "Youtube") {
        $link[] = "https://www.youtube.com/channel/$platform_link";
    }
}
?>


<html>
    <body onload="checkCookies()">

        <script>
            function checkCookies() {
<?php foreach ($link as $key => $value) { ?>

                    var open = window.open(<?php echo '"' . $value . '"'; ?>);

                    if (open == null || typeof (open) == 'undefined')
                        alert("Turn off your pop-up blocker!\n\nWe try to open the following url:\n" + <?php echo '"' . $value . '"'; ?>);

<?php }
?>
            }
        </script>

    </body>
</html>
