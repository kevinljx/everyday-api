"use strict";

module.exports = function (server) {
  /**
   * ==================================
   * DEVELOPMENT ONLY
   * ==================================
   */
  /*
  Access Rights. Create default access rights
  */
  /*
    var AccessRight = server.models.AccessRight;
    AccessRight.deleteAll();
    var AccessRole = server.models.AccessRole;
    AccessRole.deleteAll();
    var PricePlan = server.models.PricePlan;
    PricePlan.deleteAll();
    var AccessRightCategory = server.models.AccessRightCategory;
    AccessRightCategory.deleteAll()
    var AccessRightMethod = server.models.AccessRightMethod;
    AccessRightMethod.deleteAll();
    AccessRightMethod.create([
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "viewall", parentMethod: "read" },
      { name: "saverights", parentMethod: "update" },
      { name: "create" },
      { name: "read", editable: false },
      { name: "update" },
      { name: "delete" },
      { name: "viewall" },
      { name: "create", parentMethod: "viewall" },
      { name: "read", parentMethod: "viewall" },
      { name: "update", parentMethod: "viewall" },
      { name: "delete", parentMethod: "viewall" },
      { name: "saveuserrights", parentMethod: "viewall" },
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" },
      { name: "read", editable: false },
      { name: "update" },
      { name: "delete", editable: false },
      { name: "create" }, //event
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" }, //customer info
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" }, //customer cat
      { name: "read", editable: false },
      { name: "update" },
      { name: "delete" },
      { name: "create", parentModel: "Customer", parentMethod: "create" },
      { name: "read", parentModel: "Customer", parentMethod: "read" },
      { name: "update", parentModel: "Customer", parentMethod: "update" },
      { name: "delete", parentModel: "Customer", parentMethod: "delete" },
      { name: "create", parentModel: "Customer", parentMethod: "create" },
      { name: "read", parentModel: "Customer", parentMethod: "read" },
      { name: "update", parentModel: "Customer", parentMethod: "update" },
      { name: "delete", parentModel: "Customer", parentMethod: "delete" },
      { name: "create" }, //account
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" },
      { name: "read", parentModel: "Lead", parentMethod: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create", parentModel: "LeadIndustry", parentMethod: "create" },
      { name: "read", parentModel: "Lead", parentMethod: "read" },
      { name: "update", parentModel: "LeadIndustry", parentMethod: "update" },
      { name: "delete", parentModel: "LeadIndustry", parentMethod: "delete" },
      { name: "create", parentModel: "LeadIndustry", parentMethod: "create" }, //lead status
      { name: "read", parentModel: "Lead", parentMethod: "read" },
      { name: "update", parentModel: "LeadIndustry", parentMethod: "update" },
      { name: "delete", parentModel: "LeadIndustry", parentMethod: "delete" },
      { name: "create" }, //deal
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create" }, //deal select list
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create", parentModel: "Deal", parentMethod: "create" },
      { name: "read", parentModel: "Deal", parentMethod: "read" },
      { name: "update", parentModel: "Deal", parentMethod: "update" },
      { name: "delete", parentModel: "Deal", parentMethod: "delete" },
      { name: "create", parentModel: "Deal", parentMethod: "create" },
      { name: "read", parentModel: "Deal", parentMethod: "read" },
      { name: "update", parentModel: "Deal", parentMethod: "update" },
      { name: "delete", parentModel: "Deal", parentMethod: "delete" },
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
      { name: "create", parentModel: "Quotation", parentMethod: "create" },
      { name: "read", parentModel: "Quotation", parentMethod: "read" },
      { name: "update", parentModel: "Quotation", parentMethod: "update" },
      { name: "delete", parentModel: "Quotation", parentMethod: "delete" }
  
    ], function (err, methods) {
  
      AccessRight.create([
        {
          name: "Access Role", description: "Allow users with this role to create, edit and remove roles.", model: "AccessRole", accessRightMethods: [
            methods[0], methods[1], methods[2], methods[3], methods[4], methods[5]
          ]
        },
        {
          name: "Manage users", description: "Rights to create and edit users", model: "BaseUser", accessRightMethods: [
            methods[6], methods[7], methods[8], methods[9]
          ]
        },
        {
          name: "Access Setting", description: "Rights to create and edit users", model: "BaseUser", accessRightMethods: [
            methods[10], methods[11], methods[12], methods[13], methods[14], methods[15]
          ]
        },
        {
          name: "Sequence Setting", description: "Number sequences settings", model: "SequenceSetting", accessRightMethods: [
            methods[16], methods[17], methods[18], methods[19]
          ]
        },
        {
          name: "Company Info", description: "Edit company info. Displayed on invoices and documents", model: "BaseCompany", accessRightMethods: [
            methods[20], methods[21], methods[22], methods[23]
          ]
        },
        {
          name: "Event", description: "Events & Reminders", model: "Event", accessRightMethods: [
            methods[24], methods[25], methods[26], methods[27]
          ]
        },
        {
          name: "Note", description: "Rights to create and edit Notes", model: "Note", accessRightMethods: [
            methods[28], methods[29], methods[30], methods[31]
          ]
        },
        {
          name: "Customer info", description: "Creating and viewing Customers", model: "Customer", accessRightMethods: [
            methods[32], methods[33], methods[34], methods[35]
          ]
        },
        {
          name: "Customer Category", description: "Creating and editing customer categories", model: "CustomerCategory", accessRightMethods: [
            methods[36], methods[37], methods[38], methods[39]
          ]
        },
        {
          name: "Contact Info", description: "Basic info for contacts", model: "BaseContact", parentModel: "Customer", accessRightMethods: [
            methods[40], methods[41], methods[42], methods[43]
          ]
        },
        {
          name: "Contact Address", description: "", model: "BaseAddress", parentModel: "Customer", accessRightMethods: [
            methods[44], methods[45], methods[46], methods[47]
          ]
        },
        {
          name: "Account", description: "Account Management", model: "Account", accessRightMethods: [
            methods[48], methods[49], methods[50], methods[51]
          ]
        },
        {
          name: "Lead", description: "Lead Management", model: "Lead", accessRightMethods: [
            methods[52], methods[53], methods[54], methods[55]
          ]
        },
        {
          name: "Lead Select lists", description: "Selectable options for Leads", model: "LeadIndustry", accessRightMethods: [
            methods[56], methods[57], methods[58], methods[59]
          ]
        },
        {
          name: "Lead Source", description: "", model: "LeadSource", parentModel: "LeadIndustry", accessRightMethods: [
            methods[60], methods[61], methods[62], methods[63]
          ]
        },
        {
          name: "Lead Status", description: "", model: "LeadStatus", parentModel: "LeadIndustry", accessRightMethods: [
            methods[64], methods[65], methods[66], methods[67]
          ]
        },
        {
          name: "Deal", description: "Deals Management", model: "Deal", accessRightMethods: [
            methods[68], methods[69], methods[70], methods[71]
          ]
        },
        {
          name: "Deal Select lists", description: "Selectable options for Deals", model: "DealType", accessRightMethods: [
            methods[72], methods[73], methods[74], methods[75]
          ]
        },
        {
          name: "Deal Stage", description: "", model: "DealStage", parentModel: "Deal", accessRightMethods: [
            methods[76], methods[77], methods[78], methods[79]
          ]
        },
        {
          name: "Deal History", description: "", model: "DealHistory", parentModel: "Deal", accessRightMethods: [
            methods[80], methods[81], methods[82], methods[83]
          ]
        },
        {
          name: "Quotation", description: "Quotation rights", model: "Quotation", accessRightMethods: [
            methods[84], methods[85], methods[86], methods[87]
          ]
        },
        {
          name: "Quotation Line", description: "", model: "QuotationLine", parentModel: "Quotation", accessRightMethods: [
            methods[88], methods[89], methods[90], methods[91]
          ]
        }
  
      ], function (err, rights) {
        AccessRightCategory.create([
          {
            module: "Default", name: "User Management", description: "Manage users and their rights to your Everyday account.", accessrights: [
              rights[0], rights[1], rights[2], rights[3]
            ]
          },
          { module: "Default", name: "Company Info", description: "Viewing and accessing your company's info.", accessrights: [rights[4]] },
          { module: "Default", name: "Events Management", description: "Managing events.", accessrights: [rights[5]] },
          { module: "Default", name: "Notes", description: "Creating and editing notes", accessrights: [rights[6]] },
          {
            module: "Default", name: "Contact Management", description: "Viewing and editing customer contact information", accessrights: [
              rights[7], rights[8], rights[9], rights[10]]
          },
          { module: "CRM", name: "Account info", description: "Managing of Account info", accessrights: [rights[11]] },
          {
            module: "CRM", name: "Leads", description: "Viewing and management of leads", accessrights: [
              rights[12], rights[13], rights[14], rights[15]]
          },
          {
            module: "CRM", name: "Deals", description: "Managing of Deals", accessrights: [
              rights[16], rights[17], rights[18], rights[19]]
          },
          { module: "Accounting", name: "Quotation & Invoices", description: "Invoice & Quotation related rights", accessrights: [rights[20], rights[21]] },
          { module: "Accounting", name: "Payment & Credit note", description: "Payment & Credit note related rights" },
          { module: "Accounting", name: "Misc settings", description: "Tax, currency and other misc settings" }
        ], function (err, categories) {
          AccessRole.create([
            {
              name: "Company Admin", tier: 0, companyId: "default", accessRightCategories: [
                categories[0], categories[1], categories[2], categories[3], categories[4], categories[5], categories[6], categories[7],
                categories[8], categories[9], categories[10]
              ]
            }
          ], function (err, admin) {
            AccessRole.create([
              {
                name: "CRM Admin", tier: 1, companyId: "default", accessRightCategories: [
                  categories[2], categories[3], categories[4], categories[5], categories[6], categories[7]
                ], parentId: admin[0].id
              },
              {
                name: "Accounting Admin", tier: 1, companyId: "default", accessRightCategories: [
                  categories[2], categories[3], categories[4], categories[5], categories[8], categories[9], categories[10]
                ], parentId: admin[0].id
              }
            ], function (err, roles) {
              PricePlan.create(
                { name: "Free Trial", duration: 3, amount: 0 }
                , function (err, plan) {
                  plan.defaultRoles.add(admin[0]);
                  plan.defaultRoles.add(roles[0]);
                  plan.defaultRoles.add(roles[1]);
                });
            });
          })
        });
  
      });
  
    });
    */
};
