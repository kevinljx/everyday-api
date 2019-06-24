'use strict';
module.exports = function (Model, bootOptions = {}) {

    Model.observe('before delete', function (ctx, next) {


        var numItems = 0;
        var itemCount = 0;
        function deleteCb() {
            itemCount++;
            if (itemCount >= numItems) {
                next();
            }
        }


        Model.find({ where: ctx.where }, function (err, deleteModels) {
            if (err) next(err);
            var deleteInfo = deleteModels.map(item => {
                return {
                    model: Model.name,
                    deleteDate: new Date(),
                    info: item
                }
            });
            numItems = deleteInfo.length;
            var DeletedItem = Model.app.models.DeletedItem;
            for (const info of deleteInfo) {
                DeletedItem.create(info, function (err, obj) {
                    deleteCb();
                });
            }

        });

        // next();

    });

}
