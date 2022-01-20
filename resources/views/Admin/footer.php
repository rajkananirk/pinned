</div> <!-- content -->

<footer class="footer">
    2020 © Airpawnd.
</footer>

</div>


<!-- ============================================================== -->
<!-- End Right content here -->
<!-- ============================================================== -->

</div>
<!-- END wrapper -->



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
<script src="<?php echo url('/'); ?>/public/web/plugins/switchery/switchery.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
<!-- jQuery  -->
<script src="<?php echo url('/'); ?>/public/web/plugins/waypoints/jquery.waypoints.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/counterup/jquery.counterup.min.js"></script>

<script src="<?php echo url('/'); ?>/public/web/plugins/moment/moment.js"></script>

<!-- App js -->
<script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.core.js"></script>
<script src="<?php echo url('/'); ?>/public/web/assets/js/jquery.app.js"></script>

<!-- datatable -->
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/dataTables.bootstrap.js"></script>

<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/dataTables.buttons.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/buttons.bootstrap.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/jszip.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/vfs_fonts.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/buttons.html5.min.js"></script>
<script src="<?php echo url('/'); ?>/public/web/plugins/datatables/buttons.print.min.js"></script>

<!-- init -->
<script src="<?php echo url('/'); ?>/public/web/assets/pages/jquery.datatables.init.js"></script>

<!-- App js -->
<script>
    //var j = 1;
    var baseurl = "<?php echo url('/'); ?>/public/";
    $(document).ready(function () {
        $('#datatable').dataTable({});
        $('#clients').DataTable({

            dom: 'Bfrtip',
            buttons: [{
                    extend: 'csv',
                    text: 'Export',
                    processing: true,
                    serverSide: true,
                    ajax: "../server_side/scripts/server_processing.php",
                    className: 'btn btn-default',
                    exportOptions: {
                        columns: 'th:not(:last-child)'
                    }
                }]
        });
        $('#datatable-keytable').DataTable({
            keys: true
        });
        $('#datatable-responsive').DataTable();
        $('#datatable-colvid').DataTable({
            "dom": 'C<"clear">lfrtip',
            "colVis": {
                "buttonText": "Change columns"
            }
        });
        $('.datepicker').datepicker({
            format: 'dd-mm-yyyy',
        });

        $("#trainers").change(function () {
            var val = $('option:selected', this).val();
            $.ajax({
                url: baseurl + "Admin/getclients",
                type: "POST",
                data: {
                    type: val
                },
                dataType: "html",
                success: function (data) {
                    $("#client").html(data);
                }
            });
        });

        $(".addmore").click(function () {
            //alert('hi');
            var foodtype = $(this).attr('id');
            //console.log(i);
            var l = $('.mndiv_' + foodtype).length;
            // console.log(l);
            j = l;
            //console.log(j);
            options = $('#foods_' + foodtype).html();
            // console.log(options);
            var html = '<span class="pull-right"><button type="button" class="btn btn-success btn-rounded w-md waves-effect waves-light m-b-5 removediet" id="' + j + '_' + foodtype + '">Remove</button></span><br><div id="maindiv' + j + '_' + foodtype + '" class="mndiv_' + foodtype + '"><div class="form-group row"><label class="col-md-2 control-label">Food Name</label><div class="col-md-10"><select class="form-control"  name="foodname_' + foodtype + '[]" id="foods_' + foodtype + '" >' + options + '</select></div></div><div class="form-group row"><label class="col-md-2 control-label">Measurement</label><div class="col-md-10"><input type="text" class="form-control" name="measurement_' + foodtype + '[]"></div></div></div>';
            l--;

            $('#maindiv' + l + '_' + foodtype).after(html);
            //j++;
        });
        $(document).on('click', '.removediet', function () {
            var removediv = $(this).attr('id');
            //console.log(removediv);
            $('#maindiv' + removediv).remove();
            $(this).parent().next().remove();
            $(this).parent().remove();
        });
        $(".addmoreex").click(function () {
            //alert('hi');
            var foodtype = $(this).attr('id');
            //console.log(i);
            var l = $('.mndiv_' + foodtype).length;
            // console.log(l);
            j = l;
            //console.log(j);
            options = $('#category_' + foodtype).html();
            // console.log(options);
            var html = '<span class="pull-right"><button type="button" class="btn btn-success btn-rounded w-md waves-effect waves-light m-b-5 removediet" id="' + j + '_' + foodtype + '">Remove</button></span><br><div id="maindiv' + j + '_' + foodtype + '" class="mndiv_' + foodtype + '"><div class="form-group row"><label class="col-md-2 control-label">Excercise Category</label><div class="col-md-10"><select class="form-control category"  name="foodname' + foodtype + '[]" data-id="' + j + '" data-type="' + foodtype + '" id="category_' + foodtype + '" >' + options + '</select></div></div><div class="form-group row"><label class="col-md-2 control-label">Excercise</label><div class="col-md-10"> <select class="form-control"  name="excercise' + foodtype + '[]" data-id="' + j + '" id="excercise' + j + '_' + foodtype + '" > <option value="">--Select Excercise--</option></select></div></div><div class="form-group row"><label class="col-md-2 control-label">Sets</label><div class="col-md-10"><input type="text" class="form-control" name="sets' + foodtype + '[]" id="sets_' + foodtype + '" placeholder="Please Add Sets by Comma Separated"></div></div></div> ';
            l--;

            $('#maindiv' + l + '_' + foodtype).after(html);
            //j++;
        });
        $(document).on('change', '.category', function () {
            //$(".category").change(function() {
            var divid = $(this).data('id');
            var type = $(this).data('type');
            console.log(divid);
            console.log(type);
            //alert(divid);
            var val = $('option:selected', this).val();
            $.ajax({
                url: baseurl + "Admin/getexcercises",
                type: "POST",
                data: {
                    type: val
                },
                dataType: "html",
                success: function (data) {
                    $("#excercise" + divid + "_" + type).html(data);
                }
            });
        });

    });
    TableManageButtons.init();
</script>

</body>

</html>