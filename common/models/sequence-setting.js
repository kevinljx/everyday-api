'use strict';

module.exports = function (Sequencesetting) {

    /*
    Sequencesetting.beforeRemote("**", async function (ctx) {
        var token = ctx.req.accessToken;
        var userId = token && token.userId;
        if (userId) {
            console.log(await Sequencesetting.generateNumber(userId, "Quotation"));
        }
    });
*/
    Sequencesetting.generateNumber = async function (userId, modelName) {
        //find allusers in company
        var BaseUser = Sequencesetting.app.models.BaseUser;
        var userobj = await BaseUser.findOne({ where: { id: userId } });
        var companyUsers = await BaseUser.find({ where: { company: userobj.company } });
        var allsettings = await Sequencesetting.find({ where: { model: modelName } });
        var setting = allsettings.find(seq => {
            return companyUsers.findIndex(user => { return user.id.equals(seq.userId) }) >= 0
        });
        if (setting !== undefined) {
            var sequenceString = "";
            if (setting.prefix) {
                sequenceString += setting.prefix;
            }
            var nextNumber = String(setting.nextNumber);
            while (nextNumber.length < setting.numDigits) {
                nextNumber = "0" + nextNumber;
            }
            sequenceString += nextNumber;
            if (setting.suffix) {
                sequenceString += setting.suffix;
            }
            //increment nextNumber
            await setting.updateAttribute("nextNumber", setting.nextNumber + 1);

            return sequenceString;
        }
        else {
            return 0;
        }
    }

};
