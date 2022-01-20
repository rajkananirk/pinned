@include('Admin.header')


<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>

@include('Admin.sidebar')

<!-- ============================================================== -->
<!-- Start right Content here -->
<!-- ============================================================== -->
<div class="content-page">
    <!-- Start content -->
    <div class="content">


        <div class="container">


            <div class="row">
                <div class="col-xs-12">
                    <div class="page-title-box">
                        <h4 class="page-title"> Dashboard </h4>
                        <div class="clearfix">
                        </div>
                    </div>
                </div>

            </div>

            <!-- end row -->

            <div class="row text-center">
                <h3> Statistics </h3><br>

                <div class="col-lg-2 col-md-4 col-sm-6">
                    <div class="card-box widget-box-one">
                        <div class="wigdet-one-content">
                            <p class="m-0 text-uppercase font-600 font-secondary text-overflow">Total Customer</p>
                            <h2 class="text-danger"><span data-plugin="counterup"><?php echo $data; ?></span></h2>
                        </div>
                    </div>
                </div>


            </div>

        </div>

    </div>

</div>
@include('Admin.footer')
