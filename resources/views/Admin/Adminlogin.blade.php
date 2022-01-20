
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- App favicon -->
        <link rel="shortcut icon" href="<?php echo url('/'); ?>web/assets/images/favicon.ico">
        <!-- App title -->
        <title>Airpawnd - Admin Panel</title>

        <!-- App css -->
        <link href="<?php echo url('/'); ?>/public/web/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/core.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/components.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/icons.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/pages.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/menu.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo url('/'); ?>/public/web/assets/css/responsive.css" rel="stylesheet" type="text/css" />

        <!-- HTML5 Shiv and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->

        <script src="<?php echo url('/'); ?>/public/web/assets/js/modernizr.min.js"></script>

    </head>


    <body class="bg-transparent">

        <!-- HOME -->
        <section>
            <div class="container-alt">
                <div class="row">
                    <div class="col-sm-12">

                        <div class="wrapper-page">

                            <div class="m-t-40 account-pages">
                                <div class="text-center account-logo-box">
                                    <h2 class="text-uppercase">
                                        <a href="#" class="text-success">
                                            <h4 style="color: #ffffff" class="text-uppercase font-bold m-b-0">Admin Login</h4>
                                        </a>
                                    </h2>
                                </div>
                                @if ($message = Session::get('error'))
                                <div class="alert alert-danger alert-block">
                                    <button type="button" class="close" data-dismiss="alert">×</button>
                                    <strong>{{ $message }}</strong>
                                </div>
                                @endif
                                <div class="account-content" style="padding: 30px 30px 60px 30px;">
                                    <form class="form-horizontal" action="<?php echo url('/') ?>/admin_login" method="post">
                                        @csrf

                                        <div class="form-group ">
                                            <div class="col-xs-12">
                                                <input class="form-control" type="text" name="email" required="" placeholder="email">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-xs-12">
                                                <input class="form-control" type="password" name="password" required="" placeholder="Password">
                                            </div>
                                        </div>

                                        <div class="form-group account-btn text-center m-t-10">
                                            <div class="col-xs-12">
                                                <button class="btn w-md btn-bordered btn-danger waves-effect waves-light" type="submit">Log In</button>
                                            </div>
                                        </div>

                                    </form>

                                    <div class="clearfix"></div>

                                </div>
                            </div>
                            <!-- end card-box-->
                        </div>
                        <!-- end wrapper -->

                    </div>
                </div>
            </div>
        </section>
        <!-- END HOME -->

        <script>
var resizefunc = [];
        </script>

        <!-- jQuery  -->
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.min.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/bootstrap.min.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/detect.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/fastclick.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.blockUI.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/waves.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.slimscroll.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.scrollTo.min.js"></script>

        <!-- App js -->
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.core.js"></script>
        <script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.app.js"></script>

    </body>
</html>