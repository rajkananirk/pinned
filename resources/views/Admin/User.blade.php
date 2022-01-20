@include('Admin.header')

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
                        <h4 class="page-title">User List</h4>
                        <div class="pull-right">
                            <!--<a  class="btn btn-success pull-right" data-target="#_add" data-toggle="modal"><i class=" mdi mdi-playlist-plus"></i>&nbsp;Add Category</a>-->
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
            <!-- end row -->


            <div class="row">
                <div class="col-sm-12">
                    <div class="card-box table-responsive">

                        @if ($message = Session::get('success'))
                        <div class="alert alert-success alert-block">
                            <button type="button" class="close" data-dismiss="alert">×</button>
                            <strong>{{ $message }}</strong>
                        </div>
                        @endif

                        <table id="clients" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>location</th>
                                    <th>phone_no</th>
                                    <th>about</th>
                                    <th>profile_pic</th>
                                    <th>Action</th>

                                </tr>
                            </thead>

                            <tbody>

                                <?php $i = 1; ?>
                                @foreach ($data as $value => $user)
                                <tr>
                                    <td><?= $i++; ?></td>
                                    <td><?= $user['username']; ?></td>
                                    <td><?= $user['email']; ?></td>
                                    <td><?= $user['gender']; ?></td>
                                    <td><?= $user['location']; ?></td>
                                    <td><?= $user['phone_no']; ?></td>
                                    <td><?php echo mb_strimwidth($user['about'], 0, 30, "..."); ?></td>

                                    <td>
                                        <?php if ($user['profile_pic'] !== NULL) { ?>
                                            <img src="<?= $user['profile_pic']; ?>" class="img-thumbnail" alt="No Image" width="65" height="65">
                                        <?php } else { ?>
                                            <img src="http://localhost/airpawnd/public/uploads/1593595508.jpg" class="img-thumbnail" alt="No Image" width="65" height="65">
                                        <?php } ?>
                                    </td>

                                    <td>
                                        <?php if ($user['is_blocked'] == 0) { ?>

                                            <span><a href="<?php
                                                $user_id = $user['id'];
                                                echo url("/Block_user") . "/$user_id";
                                                ?>"class="btn btn-info">Block</a>
                                            </span>

                                        <?php } else { ?>

                                            <span><a href="<?php
                                                $user_id = $user['id'];
                                                echo url("/UnBlock_user") . "/$user_id";
                                                ?>" style="color:#000000" class="btn btn-warning">UnBlock</a>
                                            </span>

                                        <?php } ?>



                                        <span><a href="<?php
                                            $user_id = $user['id'];
                                            echo url("/Delete") . "/$user_id";
                                            ?>" style="color:#000000" class="btn btn-danger" id="user_id" name="user_id" onclick="return confirm('This Will Delete User Permenently. Are you sure to delete?')">Delete</a>
                                        </span>

                                    </td>
                                </tr>
                                @endforeach

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div> <!-- container -->
    </div>
</div> <!-- content -->

@include('Admin.footer')
