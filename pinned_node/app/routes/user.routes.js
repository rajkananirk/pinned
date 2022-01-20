const {check, validationResult} = require('express-validator');

module.exports = function (app, upload) {
    const apicontroller = require("../controllers/ApiController.js");

    // login
    app.post("/get_user_by_username", [
        check('name').not().isEmpty().trim(),
    ], apicontroller.get_user_by_username);
    
    //send Emit
    app.post("/send_emit_api", [
        check('user_id').not().isEmpty().trim(),
        check('sendto_id').not().isEmpty().trim(),
        check('count').not().isEmpty().trim(),
    ], apicontroller.sendEmitApi);
    
    //send Emit
    app.post("/send_contact_emit_api", [
        check('user_id').not().isEmpty().trim(),
        check('sendto_id').not().isEmpty().trim(),
        check('social_link').not().isEmpty().trim(),
        check('random_no').not().isEmpty().trim(),
    ], apicontroller.sendEmitContactApi);

};