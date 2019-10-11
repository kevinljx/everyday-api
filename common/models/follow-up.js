"use strict";

module.exports = function(Followup) {
  /**
   * Custom Post
   */
  Followup.beforeRemote("customAdd", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Followup.customAdd = async function(data, userId) {
    try {
      /*  {
          "title": "string",
              "date": "2019-10-08T07:18:22.309Z",
                  "resultId": "5d9c35f803030f93914ee3ad",
                      "typeId": "5d9c35f803030f93914ee3af",
                          "followupableType": "Lead",
                              "followupableId": ""
      } */

      var newEntry = await Followup.create({ ...data, userId });
      var toShow = await Followup.findById(newEntry.id);
      return toShow;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  Followup.remoteMethod("customAdd", {
    accepts: [{ arg: "data", type: "any" }, { arg: "userId", type: "any" }],
    http: { path: "/create", verb: "post" },
    returns: { arg: "data", type: "object" }
  });
};
