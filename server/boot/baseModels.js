"use strict";

module.exports = function(server) {
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
  AccessRight.create([
    {name: "Access Group Role", description: "Access to roles inside a group.", categoryName: "Access", model: "AccessGroupRole", method: "create" },
    {name: "Access Group Role", categoryName: "Access", model: "AccessGroupRole", method: "read", editable: false },
    {name: "Access Group Role", categoryName: "Access", model: "AccessGroupRole", method: "update" },
    {name: "Access Group Role", categoryName: "Access", model: "AccessGroupRole", method: "delete" },
    {name: "Access Group", description: "Creating groups limit the information to only users in that group.", categoryName: "Access", model: "AccessGroup", method: "create" },
    {name: "Access Group", categoryName: "Access", model: "AccessGroup", method: "read", editable: false },
    {name: "Access Group", categoryName: "Access", model: "AccessGroup", method: "update" },
    {name: "Access Group", categoryName: "Access", model: "AccessGroup", method: "delete" },
    {name: "Access Role", description: "Roles allow access rights to be grouped together", categoryName: "Access", model: "AccessRole", method: "create" },
    {name: "Access Role", categoryName: "Access", model: "AccessRole", method: "read", editable: false },
    {name: "Access Role", categoryName: "Access", model: "AccessRole", method: "update" },
    {name: "Access Role", categoryName: "Access", model: "AccessRole", method: "delete" },
    {name: "Access Setting", description: "Assign groups and roles to users.", categoryName: "Access", model: "AccessSetting", method: "create" },
    {name: "Access Setting", categoryName: "Access", model: "AccessSetting", method: "read", editable: false },
    {name: "Access Setting", categoryName: "Access", model: "AccessSetting", method: "update" },
    {name: "Access Setting", categoryName: "Access", model: "AccessSetting", method: "delete" },
    {name: "Company Info", description: "Company info", categoryName: "Company", model: "BaseCompany", method: "create", editable: false },
    {name: "Company Info", categoryName: "Company", model: "BaseCompany", method: "read", editable: false },
    {name: "Company Info", categoryName: "Company", model: "BaseCompany", method: "update" },
    {name: "Company Info", categoryName: "Company", model: "BaseCompany", method: "delete", editable: false },
    {name: "Contact Address", description: "Address info for contacts", categoryName: "Contacts", model: "BaseAddress", method: "create" },
    {name: "Contact Address", categoryName: "Contacts", model: "BaseAddress", method: "read", editable: false },
    {name: "Contact Address", categoryName: "Contacts", model: "BaseAddress", method: "update" },
    {name: "Contact Address", categoryName: "Contacts", model: "BaseAddress", method: "delete"},
    {name: "Contact Info", description: "Basic info for contacts", categoryName: "Contacts", model: "BaseContact", method: "create" },
    {name: "Contact Info", categoryName: "Contacts", model: "BaseContact", method: "read", editable: false },
    {name: "Contact Info", categoryName: "Contacts", model: "BaseContact", method: "update" },
    {name: "Contact Info", categoryName: "Contacts", model: "BaseContact", method: "delete"},
    {name: "Customer info", description: "Customers", categoryName: "Contacts", model: "Customer", method: "create" },
    {name: "Customer Info", categoryName: "Contacts", model: "Customer", method: "read" },
    {name: "Customer Info", categoryName: "Contacts", model: "Customer", method: "update" },
    {name: "Customer Info", categoryName: "Contacts", model: "Customer", method: "delete"},
    {name: "Customer Category", description: "Customers", categoryName: "Contacts", model: "CustomerCategory", method: "create" },
    {name: "Customer Category", categoryName: "Contacts", model: "CustomerCategory", method: "read", editable: false },
    {name: "Customer Category", categoryName: "Contacts", model: "CustomerCategory", method: "update" },
    {name: "Customer Category", categoryName: "Contacts", model: "CustomerCategory", method: "delete"},
    {name: "Account info", description: "Accounts", categoryName: "Contacts", model: "Account", method: "create" },
    {name: "Account Info", categoryName: "Contacts", model: "Account", method: "read" },
    {name: "Account Info", categoryName: "Contacts", model: "Account", method: "update" },
    {name: "Account Info", categoryName: "Contacts", model: "Account", method: "delete"},
    {name: "User", description: "User info and rights", categoryName: "User", model: "BaseUser", method: "create" },
    {name: "User", categoryName: "User", model: "BaseUser", method: "read", editable: false },
    {name: "User", categoryName: "User", model: "BaseUser", method: "update" },
    {name: "User", categoryName: "User", model: "BaseUser", method: "delete"},
    {name: "Event", description: "Events & Reminders", categoryName: "General", model: "Event", method: "create" },
    {name: "Event", categoryName: "General", model: "Event", method: "read", editable: false },
    {name: "Event", categoryName: "General", model: "Event", method: "update" },
    {name: "Event", categoryName: "General", model: "Event", method: "delete"},
    {name: "Note", description: "Notes", categoryName: "General", model: "Note", method: "create" },
    {name: "Note", categoryName: "General", model: "Note", method: "read", editable: false },
    {name: "Note", categoryName: "General", model: "Note", method: "update" },
    {name: "Note", categoryName: "General", model: "Note", method: "delete"},
    {name: "Sequence Setting", description: "Number sequences settings", categoryName: "Setting", model: "SequenceSetting", method: "create" },
    {name: "Sequence Setting", categoryName: "Setting", model: "SequenceSetting", method: "read", editable: false },
    {name: "Sequence Setting", categoryName: "Setting", model: "SequenceSetting", method: "update", editable: false },
    {name: "Sequence Setting", categoryName: "Setting", model: "SequenceSetting", method: "delete"},
    {name: "Currency", description: "Currency list", categoryName: "Accounting", model: "Currency", method: "create" },
    {name: "Currency", categoryName: "Accounting", model: "Currency", method: "read", editable: false },
    {name: "Currency", categoryName: "Accounting", model: "Currency", method: "update" },
    {name: "Currency", categoryName: "Accounting", model: "Currency", method: "delete"},
    {name: "Currency Rate", description: "Currency rate tables", categoryName: "Accounting", model: "CurrencyRate", method: "create" },
    {name: "Currency Rate", categoryName: "Accounting", model: "CurrencyRate", method: "read", editable: false },
    {name: "Currency Rate", categoryName: "Accounting", model: "CurrencyRate", method: "update" },
    {name: "Currency Rate", categoryName: "Accounting", model: "CurrencyRate", method: "delete"},
    {name: "Discount Setting", description: "Discount settings", categoryName: "Accounting", model: "DiscountSetting", method: "create" },
    {name: "Discount Setting", categoryName: "Accounting", model: "DiscountSetting", method: "read", editable: false },
    {name: "Discount Setting", categoryName: "Accounting", model: "DiscountSetting", method: "update" },
    {name: "Discount Setting", categoryName: "Accounting", model: "DiscountSetting", method: "delete"},
    {name: "Quotation Line", description: "Quotation Line", categoryName: "Accounting", model: "QuotationLine", method: "create" },
    {name: "Quotation Line", categoryName: "Accounting", model: "QuotationLine", method: "read", editable: false },
    {name: "Quotation Line", categoryName: "Accounting", model: "QuotationLine", method: "update" },
    {name: "Quotation Line", categoryName: "Accounting", model: "QuotationLine", method: "delete"},
    {name: "Quotation", description: "Quotation", categoryName: "Accounting", model: "Quotation", method: "create" },
    {name: "Quotation", categoryName: "Accounting", model: "Quotation", method: "read" },
    {name: "Quotation", categoryName: "Accounting", model: "Quotation", method: "update" },
    {name: "Quotation", categoryName: "Accounting", model: "Quotation", method: "delete"},
    {name: "Tax", description: "Taxes", categoryName: "Accounting", model: "Tax", method: "create" },
    {name: "Tax", categoryName: "Accounting", model: "Tax", method: "read", editable: false },
    {name: "Tax", categoryName: "Accounting", model: "Tax", method: "update" },
    {name: "Tax", categoryName: "Accounting", model: "Tax", method: "delete"},
    {name: "Lead Industry", description: "List of industries for lead", categoryName: "Lead", model: "LeadIndustry", method: "create" },
    {name: "Lead Industry", categoryName: "Lead", model: "LeadIndustry", method: "read", editable: false },
    {name: "Lead Industry", categoryName: "Lead", model: "LeadIndustry", method: "update" },
    {name: "Lead Industry", categoryName: "Lead", model: "LeadIndustry", method: "delete"},
    {name: "Lead Source", description: "List of sources for lead", categoryName: "Lead", model: "LeadSource", method: "create" },
    {name: "Lead Source", categoryName: "Lead", model: "LeadSource", method: "read", editable: false },
    {name: "Lead Source", categoryName: "Lead", model: "LeadSource", method: "update" },
    {name: "Lead Source", categoryName: "Lead", model: "LeadSource", method: "delete"},
    {name: "Lead Status", description: "List of status for lead", categoryName: "Lead", model: "LeadStatus", method: "create" },
    {name: "Lead Status", categoryName: "Lead", model: "LeadStatus", method: "read", editable: false },
    {name: "Lead Status", categoryName: "Lead", model: "LeadStatus", method: "update" },
    {name: "Lead Status", categoryName: "Lead", model: "LeadStatus", method: "delete"},
    {name: "Lead", description: "Leads", categoryName: "Lead", model: "Lead", method: "create" },
    {name: "Lead", categoryName: "Lead", model: "Lead", method: "read", editable: false },
    {name: "Lead", categoryName: "Lead", model: "Lead", method: "update" },
    {name: "Lead", categoryName: "Lead", model: "Lead", method: "delete"},
    {name: "Access Setting", categoryName: "Access", model: "AccessSetting", method: "viewall" },
    {name: "Access Role", categoryName: "Access", model: "AccessRole", method: "viewall" }

  ], function(err, accrights) {
    if (err) throw err; 
    //create default roles
    AccessRole.create([
      {name: "Member", userId: "default", removable: false, editable: false},
      {name: "Company Admin", userId: "defaultAdmin"},
      {name: "Basic User", userId: "default"},
      {name: "Sales Manager", userId: "defaultAdmin"},
      {name: "Salesperson", userId: "default"},
      {name: "Accounts Manager", userId: "defaultAdmin"},
      {name: "Basic Account", userId: "default"},
    ], function(err, roles){
      if (err) throw err;
      
      //company admin
      roles[0].accessRights.add(accrights[0]);
      roles[0].accessRights.add(accrights[1]);
      roles[0].accessRights.add(accrights[2]);
      roles[0].accessRights.add(accrights[3]);
      roles[0].accessRights.add(accrights[4]);
      roles[0].accessRights.add(accrights[5]);
      roles[0].accessRights.add(accrights[6]);
      roles[0].accessRights.add(accrights[7]);
      roles[0].accessRights.add(accrights[8]);
      roles[0].accessRights.add(accrights[9]);
      roles[0].accessRights.add(accrights[10]);
      roles[0].accessRights.add(accrights[11]);
      roles[0].accessRights.add(accrights[12]);
      roles[0].accessRights.add(accrights[13]);
      roles[0].accessRights.add(accrights[14]);
      roles[0].accessRights.add(accrights[15]);
      roles[0].accessRights.add(accrights[16]);
      roles[0].accessRights.add(accrights[17]);
      roles[0].accessRights.add(accrights[18]);
      roles[0].accessRights.add(accrights[19]);
      roles[0].accessRights.add(accrights[20]); //contact address
      roles[0].accessRights.add(accrights[21]);
      roles[0].accessRights.add(accrights[22]);
      roles[0].accessRights.add(accrights[23]);
      roles[0].accessRights.add(accrights[24]);
      roles[0].accessRights.add(accrights[25]);
      roles[0].accessRights.add(accrights[26]);
      roles[0].accessRights.add(accrights[27]);
      roles[0].accessRights.add(accrights[28]);
      roles[0].accessRights.add(accrights[29]);
      roles[0].accessRights.add(accrights[30]);
      roles[0].accessRights.add(accrights[31]);
      roles[0].accessRights.add(accrights[32]);
      roles[0].accessRights.add(accrights[33]);
      roles[0].accessRights.add(accrights[34]);
      roles[0].accessRights.add(accrights[35]);
      roles[0].accessRights.add(accrights[36]);
      roles[0].accessRights.add(accrights[37]);
      roles[0].accessRights.add(accrights[38]);
      roles[0].accessRights.add(accrights[39]);
      roles[0].accessRights.add(accrights[40]); //user
      roles[0].accessRights.add(accrights[41]);
      roles[0].accessRights.add(accrights[42]);
      roles[0].accessRights.add(accrights[43]);
      roles[0].accessRights.add(accrights[44]);
      roles[0].accessRights.add(accrights[45]);
      roles[0].accessRights.add(accrights[46]);
      roles[0].accessRights.add(accrights[47]);
      roles[0].accessRights.add(accrights[48]);
      roles[0].accessRights.add(accrights[49]);
      roles[0].accessRights.add(accrights[50]);
      roles[0].accessRights.add(accrights[51]);
      roles[0].accessRights.add(accrights[52]);
      roles[0].accessRights.add(accrights[53]);
      roles[0].accessRights.add(accrights[54]);
      roles[0].accessRights.add(accrights[55]); //access setting viewall
      roles[0].accessRights.add(accrights[56]);

      //basic user
      roles[1].accessRights.add(accrights[1]);
      roles[1].accessRights.add(accrights[5]);
      roles[1].accessRights.add(accrights[9]);
      roles[1].accessRights.add(accrights[13]);
      roles[1].accessRights.add(accrights[17]);
      roles[1].accessRights.add(accrights[20]); //contact address
      roles[1].accessRights.add(accrights[21]);
      roles[1].accessRights.add(accrights[22]);
      roles[1].accessRights.add(accrights[23]);
      roles[1].accessRights.add(accrights[24]);
      roles[1].accessRights.add(accrights[25]);
      roles[1].accessRights.add(accrights[26]);
      roles[1].accessRights.add(accrights[27]);
      roles[1].accessRights.add(accrights[28]);
      roles[1].accessRights.add(accrights[29]);
      roles[1].accessRights.add(accrights[30]);
      roles[1].accessRights.add(accrights[31]);
      roles[1].accessRights.add(accrights[33]);
      roles[1].accessRights.add(accrights[36]);
      roles[1].accessRights.add(accrights[37]);
      roles[1].accessRights.add(accrights[38]);
      roles[1].accessRights.add(accrights[39]);
      roles[1].accessRights.add(accrights[41]);
      roles[1].accessRights.add(accrights[44]);
      roles[1].accessRights.add(accrights[45]);
      roles[1].accessRights.add(accrights[46]);
      roles[1].accessRights.add(accrights[47]);
      roles[1].accessRights.add(accrights[48]);
      roles[1].accessRights.add(accrights[49]);
      roles[1].accessRights.add(accrights[50]);
      roles[1].accessRights.add(accrights[51]);
      roles[1].accessRights.add(accrights[53]);
      roles[1].accessRights.add(accrights[54]);

      //accounts manager
      roles[4].accessRights.add(accrights[56]);
      roles[4].accessRights.add(accrights[57]);
      roles[4].accessRights.add(accrights[58]);
      roles[4].accessRights.add(accrights[59]);
      roles[4].accessRights.add(accrights[60]);
      roles[4].accessRights.add(accrights[61]);
      roles[4].accessRights.add(accrights[62]);
      roles[4].accessRights.add(accrights[63]);
      roles[4].accessRights.add(accrights[64]);
      roles[4].accessRights.add(accrights[65]);
      roles[4].accessRights.add(accrights[66]);
      roles[4].accessRights.add(accrights[67]);
      roles[4].accessRights.add(accrights[68]); //quotation line
      roles[4].accessRights.add(accrights[69]);
      roles[4].accessRights.add(accrights[70]);
      roles[4].accessRights.add(accrights[71]);
      roles[4].accessRights.add(accrights[72]);
      roles[4].accessRights.add(accrights[73]);
      roles[4].accessRights.add(accrights[74]);
      roles[4].accessRights.add(accrights[75]);
      roles[4].accessRights.add(accrights[76]);
      roles[4].accessRights.add(accrights[77]);
      roles[4].accessRights.add(accrights[78]);
      roles[4].accessRights.add(accrights[79]);

      //accounts user
      roles[5].accessRights.add(accrights[57]);
      roles[5].accessRights.add(accrights[61]);
      roles[5].accessRights.add(accrights[65]);
      roles[5].accessRights.add(accrights[68]); //quotation line
      roles[5].accessRights.add(accrights[69]);
      roles[5].accessRights.add(accrights[70]);
      roles[5].accessRights.add(accrights[71]);
      roles[5].accessRights.add(accrights[72]);
      roles[5].accessRights.add(accrights[73]);
      roles[5].accessRights.add(accrights[74]);
      roles[5].accessRights.add(accrights[75]);
      roles[5].accessRights.add(accrights[77]);

      //sales manager
      roles[2].accessRights.add(accrights[80]);
      roles[2].accessRights.add(accrights[81]);
      roles[2].accessRights.add(accrights[82]);
      roles[2].accessRights.add(accrights[83]);
      roles[2].accessRights.add(accrights[84]);
      roles[2].accessRights.add(accrights[85]);
      roles[2].accessRights.add(accrights[86]);
      roles[2].accessRights.add(accrights[87]);
      roles[2].accessRights.add(accrights[88]);
      roles[2].accessRights.add(accrights[89]);
      roles[2].accessRights.add(accrights[90]);
      roles[2].accessRights.add(accrights[91]);
      roles[2].accessRights.add(accrights[92]);
      roles[2].accessRights.add(accrights[93]);
      roles[2].accessRights.add(accrights[94]);
      roles[2].accessRights.add(accrights[95]);

      //sales user
      roles[3].accessRights.add(accrights[81]);
      roles[3].accessRights.add(accrights[85]);
      roles[3].accessRights.add(accrights[89]);
      roles[3].accessRights.add(accrights[92]);
      roles[3].accessRights.add(accrights[93]);
      roles[3].accessRights.add(accrights[94]);
      roles[3].accessRights.add(accrights[95]);

      
      PricePlan.create(
        {name: "Free Trial", duration: 3, amount: 0}
      , function(err, plan){
        plan.accessRights.add(accrights[0]);
        plan.accessRights.add(accrights[1]);
        plan.accessRights.add(accrights[2]);
        plan.accessRights.add(accrights[3]);
        plan.accessRights.add(accrights[4]);
        plan.accessRights.add(accrights[5]);
        plan.accessRights.add(accrights[6]);
        plan.accessRights.add(accrights[7]);
        plan.accessRights.add(accrights[8]);
        plan.accessRights.add(accrights[9]);
        plan.accessRights.add(accrights[10]);
        plan.accessRights.add(accrights[11]);
        plan.accessRights.add(accrights[12]);
        plan.accessRights.add(accrights[13]);
        plan.accessRights.add(accrights[14]);
        plan.accessRights.add(accrights[15]);
        plan.accessRights.add(accrights[16]);
        plan.accessRights.add(accrights[17]);
        plan.accessRights.add(accrights[18]);
        plan.accessRights.add(accrights[19]);
        plan.accessRights.add(accrights[20]); //contact address
        plan.accessRights.add(accrights[21]);
        plan.accessRights.add(accrights[22]);
        plan.accessRights.add(accrights[23]);
        plan.accessRights.add(accrights[24]);
        plan.accessRights.add(accrights[25]);
        plan.accessRights.add(accrights[26]);
        plan.accessRights.add(accrights[27]);
        plan.accessRights.add(accrights[28]);
        plan.accessRights.add(accrights[29]);
        plan.accessRights.add(accrights[30]);
        plan.accessRights.add(accrights[31]);
        plan.accessRights.add(accrights[32]);
        plan.accessRights.add(accrights[33]);
        plan.accessRights.add(accrights[34]);
        plan.accessRights.add(accrights[35]);
        plan.accessRights.add(accrights[36]);
        plan.accessRights.add(accrights[37]);
        plan.accessRights.add(accrights[38]);
        plan.accessRights.add(accrights[39]);
        plan.accessRights.add(accrights[40]); //user
        plan.accessRights.add(accrights[41]);
        plan.accessRights.add(accrights[42]);
        plan.accessRights.add(accrights[43]);
        plan.accessRights.add(accrights[44]);
        plan.accessRights.add(accrights[45]);
        plan.accessRights.add(accrights[46]);
        plan.accessRights.add(accrights[47]);
        plan.accessRights.add(accrights[48]);
        plan.accessRights.add(accrights[49]);
        plan.accessRights.add(accrights[50]);
        plan.accessRights.add(accrights[51]);
        plan.accessRights.add(accrights[52]);
        plan.accessRights.add(accrights[53]);
        plan.accessRights.add(accrights[54]);
        plan.accessRights.add(accrights[55]);
        plan.accessRights.add(accrights[56]);
        plan.accessRights.add(accrights[57]);
        plan.accessRights.add(accrights[58]);
        plan.accessRights.add(accrights[59]);
        plan.accessRights.add(accrights[60]);
        plan.accessRights.add(accrights[61]);
        plan.accessRights.add(accrights[62]);
        plan.accessRights.add(accrights[63]);
        plan.accessRights.add(accrights[64]);
        plan.accessRights.add(accrights[65]);
        plan.accessRights.add(accrights[66]);
        plan.accessRights.add(accrights[67]);
        plan.accessRights.add(accrights[68]); //quotation line
        plan.accessRights.add(accrights[69]);
        plan.accessRights.add(accrights[70]);
        plan.accessRights.add(accrights[71]);
        plan.accessRights.add(accrights[72]);
        plan.accessRights.add(accrights[73]);
        plan.accessRights.add(accrights[74]);
        plan.accessRights.add(accrights[75]);
        plan.accessRights.add(accrights[76]);
        plan.accessRights.add(accrights[77]);
        plan.accessRights.add(accrights[78]);
        plan.accessRights.add(accrights[79]);
        plan.accessRights.add(accrights[80]);
        plan.accessRights.add(accrights[81]);
        plan.accessRights.add(accrights[82]);
        plan.accessRights.add(accrights[83]);
        plan.accessRights.add(accrights[84]);
        plan.accessRights.add(accrights[85]);
        plan.accessRights.add(accrights[86]);
        plan.accessRights.add(accrights[87]);
        plan.accessRights.add(accrights[88]);
        plan.accessRights.add(accrights[89]);
        plan.accessRights.add(accrights[90]);
        plan.accessRights.add(accrights[91]);
        plan.accessRights.add(accrights[92]);
        plan.accessRights.add(accrights[93]);
        plan.accessRights.add(accrights[94]);
        plan.accessRights.add(accrights[95]);

        plan.defaultRoles.add(roles[0]);
        plan.defaultRoles.add(roles[1]);
        plan.defaultRoles.add(roles[2]);
        plan.defaultRoles.add(roles[3]);
        plan.defaultRoles.add(roles[4]);
        plan.defaultRoles.add(roles[5]);
      });
    });

    
  });
  */
  //var Lead = server.models.Lead;
  //Lead.deleteAll();
  /**
   * CRM Fields
   */
  // Lead Status
  /*
  var LeadStatus = server.models.LeadStatus;
  LeadStatus.deleteAll();
  LeadStatus.create([
    { name: "Contacted", color: "#41d617" },
    { name: "Not Contacted", color: "#6f6f6e" },
    { name: "Attempted to Contact", color: "#fdb14a" },
    { name: "Contact in Future", color: "#e6e410" },
    { name: "Junk Lead", color: "#714509" },
    { name: "Lost Lead", color: "#d61b17" }
  ]);

  // Lead Source
  var LeadSource = server.models.LeadSource;
  LeadSource.deleteAll();
  LeadSource.create([
    { name: "Advertisement", color: "#a1fa57" },
    { name: "Cold Call", color: "#57d8fa" },
    { name: "Employee Referral", color: "#fa5779" },
    { name: "External Referral", color: "#fada57" },
    { name: "Others", color: "#fa7157" }
  ]);

  // Lead Interest Level
  var LeadInterest = server.models.LeadInterestLevel;
  LeadInterest.deleteAll();
  LeadInterest.create([
    { name: "Rare", level: 20 },
    { name: "Medium Rare", level: 40 },
    { name: "Medium", level: 60 },
    { name: "Medium Well", level: 80 },
    { name: "Well Done", level: 100 }
  ]);

  // Deal Type
  var DealType = server.models.DealType;
  DealType.deleteAll();
  DealType.create([
    { name: "Upsells", color: "#57fac1" },
    { name: "New Business", color: "#5777fa" },
    { name: "Existing Business", color: "#fae957" },
    { name: "Others", color: "#caa26c" }
  ]);

  // Deal Stage
  var DealStage = server.models.DealStage;
  DealStage.deleteAll();
  DealStage.create([
    {
      name: "Prospecting",
      chance: 10,
      step: 0,
      invoice: false,
      quotation: false,
      description:
        "This stage refers to any initial calls, conversations or emails with a potential lead."
    },
    {
      name: "Qualification",
      chance: 25,
      step: 1,
      invoice: false,
      quotation: false,
      description: "This stage refers to a confirmed meeting with the lead."
    },
    {
      name: "Proposal",
      chance: 50,
      step: 2,
      invoice: false,
      quotation: true,
      description:
        "This stage refers to any discussion on budget, proposal or issue of quotations."
    },
    {
      name: "Negotiation",
      chance: 70,
      step: 3,
      invoice: false,
      quotation: false,
      description:
        "This stage refers to any form of further negotiation portraying some form of buying signal after initial proposal stage."
    },
    {
      name: "Buying Signal",
      chance: 90,
      step: 4,
      invoice: false,
      quotation: false,
      description:
        "This stage refers to strong buying signals from the client Eg. Verbal agreement."
    },
    {
      name: "Closed Won",
      chance: 100,
      step: 5,
      invoice: true,
      quotation: false,
      description: "This stage refers to a successful signed sales order."
    },
    {
      name: "Closed Lost",
      chance: 0,
      step: 6,
      invoice: false,
      quotation: false,
      description: "Client has declined the sales order."
    }
  ]);
*/
  // Industry
  /*
  var Industry = server.models.LeadIndustry;
  Industry.deleteAll();
  Industry.create([
    { name: "Accounting " },
    { name: "Airlines/Aviation" },
    { name: "Alternative Dispute Resolution" },
    { name: "Alternative Medicine" },
    { name: "Animation" },
    { name: "Apparel/Fashion" },
    { name: "Architecture/Planning" },
    { name: "Arts/Crafts" },
    { name: "Automotive" },
    { name: "Aviation/Aerospace" },
    { name: "Banking/Mortgage" },
    { name: "Biotechnology/Greentech" },
    { name: "Broadcast Media" },
    { name: "Building Materials" },
    { name: "Business Supplies/Equipment" },
    { name: "Capital Markets/Hedge Fund/Private Equity" },
    { name: "Chemicals" },
    { name: "Civic/Social Organization" },
    { name: "Civil Engineering" },
    { name: "Commercial Real Estate" },
    { name: "Computer Games" },
    { name: "Computer Hardware" },
    { name: "Computer Networking" },
    { name: "Computer Software/Engineering" },
    { name: "Computer/Network Security" },
    { name: "Construction" },
    { name: "Consumer Electronics" },
    { name: "Consumer Goods" },
    { name: "Consumer Services" },
    { name: "Cosmetics" },
    { name: "Dairy" },
    { name: "Defense/Space" },
    { name: "Design" },
    { name: "E-Learning" },
    { name: "Education Management" },
    { name: "Electrical/Electronic Manufacturing" },
    { name: "Entertainment/Movie Production" },
    { name: "Environmental Services" },
    { name: "Events Services" },
    { name: "Executive Office" },
    { name: "Facilities Services" },
    { name: "Farming" },
    { name: "Financial Services" },
    { name: "Fine Art" },
    { name: "Fishery" },
    { name: "Food Production" },
    { name: "Food/Beverages" },
    { name: "Fundraising" },
    { name: "Furniture" },
    { name: "Gambling/Casinos" },
    { name: "Glass/Ceramics/Concrete" },
    { name: "Government Administration" },
    { name: "Government Relations" },
    { name: "Graphic Design/Web Design" },
    { name: "Health/Fitness" },
    { name: "Higher Education/Acadamia" },
    { name: "Hospital/Health Care" },
    { name: "Hospitality" },
    { name: "Human Resources/HR" },
    { name: "Import/Export" },
    { name: "Individual/Family Services" },
    { name: "Industrial Automation" },
    { name: "Information Services" },
    { name: "Information Technology/IT" },
    { name: "Insurance" },
    { name: "International Affairs" },
    { name: "International Trade/Development" },
    { name: "Internet" },
    { name: "Investment Banking/Venture" },
    { name: "Investment Management/Hedge Fund/Private Equity" },
    { name: "Judiciary" },
    { name: "Law Enforcement" },
    { name: "Law Practice/Law Firms" },
    { name: "Legal Services" },
    { name: "Legislative Office" },
    { name: "Leisure/Travel" },
    { name: "Library" },
    { name: "Logistics/Procurement" },
    { name: "Luxury Goods/Jewelry" },
    { name: "Machinery" },
    { name: "Management Consulting" },
    { name: "Maritime" },
    { name: "Market Research" },
    { name: "Marketing/Advertising/Sales" },
    { name: "Mechanical or Industrial Engineering" },
    { name: "Media Production" },
    { name: "Medical Equipment" },
    { name: "Medical Practice" },
    { name: "Mental Health Care" },
    { name: "Military Industry" },
    { name: "Mining/Metals" },
    { name: "Motion Pictures/Film" },
    { name: "Museums/Institutions" },
    { name: "Music" },
    { name: "Nanotechnology" },
    { name: "Newspapers/Journalism" },
    { name: "Non-Profit/Volunteering" },
    { name: "Oil/Energy/Solar/Greentech" },
    { name: "Online Publishing" },
    { name: "Other Industry" },
    { name: "Outsourcing/Offshoring" },
    { name: "Package/Freight Delivery" },
    { name: "Packaging/Containers" },
    { name: "Paper/Forest Products" },
    { name: "Performing Arts" },
    { name: "Pharmaceuticals" },
    { name: "Philanthropy" },
    { name: "Photography" },
    { name: "Plastics" },
    { name: "Political Organization" },
    { name: "Primary/Secondary Education" },
    { name: "Printing" },
    { name: "Professional Training" },
    { name: "Program Development" },
    { name: "Public Relations/PR" },
    { name: "Public Safety" },
    { name: "Publishing Industry" },
    { name: "Railroad Manufacture" },
    { name: "Ranching" },
    { name: "Real Estate/Mortgage" },
    { name: "Recreational Facilities/Services" },
    { name: "Religious Institutions" },
    { name: "Renewables/Environment" },
    { name: "Research Industry" },
    { name: "Restaurants" },
    { name: "Retail Industry" },
    { name: "Security/Investigations" },
    { name: "Semiconductors" },
    { name: "Shipbuilding" },
    { name: "Sporting Goods" },
    { name: "Sports" },
    { name: "Staffing/Recruiting" },
    { name: "Supermarkets" },
    { name: "Telecommunications" },
    { name: "Textiles" },
    { name: "Think Tanks" },
    { name: "Tobacco" },
    { name: "Translation/Localization" },
    { name: "Transportation" },
    { name: "Utilities" },
    { name: "Venture Capital/VC" },
    { name: "Veterinary" },
    { name: "Warehousing" },
    { name: "Wholesale" },
    { name: "Wine/Spirits" },
    { name: "Wireless" },
    { name: "Writing/Editing" }
  ]);
*/
  // Countries
  /*
  var Country = server.models.BaseCountry;
  Country.deleteAll();
  Country.create([
    { name: "Singapore", code: "SG", phoneCode: "+65", language: "EN" },
    { name: "Afghanistan", code: "AF", phoneCode: "+1", language: "EN" },
    { name: "Åland Islands", code: "AX", phoneCode: "+60", language: "EN" },
    { name: "Albania", code: "AL", phoneCode: "+355", language: "EN" },
    { name: "Algeria", code: "DZ", phoneCode: "+213", language: "EN" },
    {
      name: "American Samoa",
      code: "AS",
      phoneCode: "+1-684",
      language: "EN"
    },
    { name: "Andorra", code: "AD", phoneCode: "+376", language: "EN" },
    { name: "Angola", code: "AO", phoneCode: "+244", language: "EN" },
    { name: "Anguilla", code: "AI", phoneCode: "+1-264", language: "EN" },
    { name: "Antarctica", code: "AS", phoneCode: "+672", language: "EN" },
    {
      name: "Antigua and Barbuda",
      code: "AG",
      phoneCode: "+1-268",
      language: "EN"
    },
    { name: "Argentina", code: "AR", phoneCode: "+54", language: "EN" },
    { name: "Armenia", code: "AM", phoneCode: "+374", language: "EN" },
    { name: "Aruba", code: "AW", phoneCode: "+297", language: "EN" },
    { name: "Austrailia", code: "AU", phoneCode: "+61", language: "EN" },
    { name: "Austria", code: "AT", phoneCode: "+43", language: "EN" },
    { name: "Azerbaijan", code: "AZ", phoneCode: "+994", language: "EN" },
    { name: "Bahamas", code: "BS", phoneCode: "+1-242", language: "EN" },
    { name: "Bahrain", code: "BH", phoneCode: "+973", language: "EN" },
    { name: "Bangladesh", code: "BD", phoneCode: "+880", language: "EN" },
    { name: "Barbados", code: "BB", phoneCode: "+1-246", language: "EN" },
    { name: "Belarus", code: "BY", phoneCode: "+375", language: "EN" },
    { name: "Belgium", code: "BE", phoneCode: "+32", language: "EN" },
    { name: "Belize", code: "BZ", phoneCode: "+501", language: "EN" },
    { name: "Benin", code: "BJ", phoneCode: "+229", language: "EN" },
    { name: "Bermuda", code: "BM", phoneCode: "+1-441", language: "EN" },
    { name: "Bhutan", code: "BT", phoneCode: "+1975", language: "EN" },
    { name: "Bolivia", code: "BO", phoneCode: "+591", language: "EN" },
    { name: "Bonaire", code: "BQ", phoneCode: "+", language: "EN" },
    { name: "Bosnia", code: "BA", phoneCode: "+387", language: "EN" },
    { name: "Botsswana", code: "BW", phoneCode: "+267", language: "EN" },
    { name: "Bouvet Island", code: "BV", phoneCode: "+", language: "EN" },
    { name: "Brazil", code: "BR", phoneCode: "+55", language: "EN" },
    {
      name: "British indian ocean territory",
      code: "IO",
      phoneCode: "+246",
      language: "EN"
    },
    {
      name: "Brunei darussalm",
      code: "BN",
      phoneCode: "+673",
      language: "EN"
    },
    { name: "Bulgaria", code: "BG", phoneCode: "+359", language: "EN" },
    { name: "Burkina Faso", code: "BF", phoneCode: "+226", language: "EN" },
    { name: "Burundi", code: "BI", phoneCode: "+257", language: "EN" },
    { name: "Cambodia", code: "KH", phoneCode: "+855", language: "EN" },
    { name: "Cameroon", code: "CM", phoneCode: "+237", language: "EN" },
    { name: "Canada", code: "CA", phoneCode: "+1", language: "EN" },
    { name: "Cape Verde", code: "CV", phoneCode: "+238", language: "EN" },
    {
      name: "Cayman Islands",
      code: "KY",
      phoneCode: "+1-345",
      language: "EN"
    },
    {
      name: "Central African Republic",
      code: "CF",
      phoneCode: "+236",
      language: "EN"
    },
    { name: "Chad", code: "TD", phoneCode: "+235", language: "EN" },
    { name: "Chile", code: "CL", phoneCode: "+56", language: "EN" },
    { name: "China", code: "CN", phoneCode: "+86", language: "EN" },
    {
      name: "Christmas Island",
      code: "CX",
      phoneCode: "+61",
      language: "EN"
    },
    {
      name: "Coco(keeling)island",
      code: "CC",
      phoneCode: "+61",
      language: "EN"
    },
    { name: "Colombia", code: "CO", phoneCode: "+57", language: "EN" },
    { name: "Comoros", code: "KM", phoneCode: "+269", language: "EN" },
    { name: "Congo", code: "CG", phoneCode: "+242", language: "EN" },
    { name: "Congo", code: "CD", phoneCode: "+243", language: "EN" },
    { name: "Cook Islands", code: "CK", phoneCode: "+682", language: "EN" },
    { name: "Costa Rica", code: "CR", phoneCode: "+506", language: "EN" },
    { name: "Côte dIvoire", code: "CI", phoneCode: "+225", language: "EN" },
    { name: "Croatia", code: "HR", phoneCode: "+385", language: "EN" },
    { name: "Cuba", code: "CU", phoneCode: "+53", language: "EN" },
    { name: "Curaçao", code: "CW", phoneCode: "+599", language: "EN" },
    { name: "Cyprus", code: "CY", phoneCode: "+357", language: "EN" },
    { name: "Czech Republic", code: "CZ", phoneCode: "+420", language: "EN" },
    { name: "Denmark", code: "DK", phoneCode: "+45", language: "EN" },
    { name: "Djibouti", code: "DJ", phoneCode: "+253", language: "EN" },
    { name: "Dominica", code: "DM", phoneCode: "+1-767", language: "EN" },
    {
      name: "Dominican republic",
      code: "DK",
      phoneCode: "+45",
      language: "EN"
    },
    {
      name: "Denmark",
      code: "DO",
      phoneCode: "+1-809, 1-829, 1-849",
      language: "EN"
    },
    { name: "Ecuador", code: "EC", phoneCode: "+593", language: "EN" },
    { name: "Egypt", code: "EG", phoneCode: "+20", language: "EN" },
    { name: "El Salvador", code: "SV", phoneCode: "+503", language: "EN" },
    {
      name: "Equatorial Guinea",
      code: "GQ",
      phoneCode: "+240",
      language: "EN"
    },
    { name: "Eritrea", code: "ER", phoneCode: "+291", language: "EN" },
    { name: "Estonia", code: "EE", phoneCode: "+372", language: "EN" },
    { name: "Ethiopia", code: "ET", phoneCode: "+251", language: "EN" },
    {
      name: "Falkland Islands (Malvinas)",
      code: "FK",
      phoneCode: "+500",
      language: "EN"
    },
    { name: "Faroe Islands", code: "FO", phoneCode: "+298", language: "EN" },
    { name: "Fiji", code: "FJ", phoneCode: "+679", language: "EN" },
    { name: "Finland", code: "FI", phoneCode: "+358", language: "EN" },
    { name: "France", code: "FR", phoneCode: "+33", language: "EN" },
    { name: "French guiana", code: "GF", phoneCode: "+", language: "EN" },
    {
      name: "French polynesia",
      code: "PF",
      phoneCode: "+689",
      language: "EN"
    },
    {
      name: "French Southern Territories",
      code: "TF",
      phoneCode: "+251",
      language: "EN"
    },
    { name: "Gabon", code: "GA", phoneCode: "+241", language: "EN" },
    { name: "Gambia", code: "GM", phoneCode: "+220", language: "EN" },
    { name: "Georgia", code: "GE", phoneCode: "+995", language: "EN" },
    { name: "Germany", code: "DE", phoneCode: "+49", language: "EN" },
    { name: "Ghana", code: "GH", phoneCode: "+233", language: "EN" },
    { name: "Gibraltar", code: "GI", phoneCode: "+350", language: "EN" },
    { name: "Greece", code: "GR", phoneCode: "+30", language: "EN" },
    { name: "Greenland", code: "GL", phoneCode: "+299", language: "EN" },
    { name: "Greneda", code: "GD", phoneCode: "+1-473", language: "EN" },
    { name: "Guandalope", code: "GA", phoneCode: "+", language: "EN" },
    { name: "Guam", code: "GU", phoneCode: "+1-671", language: "EN" },
    { name: "Guatemala", code: "GT", phoneCode: "+502", language: "EN" },
    { name: "Guernsay", code: "GG", phoneCode: "+44-1481", language: "EN" },
    { name: "Guinea", code: "GN", phoneCode: "+224", language: "EN" },
    { name: "Guinea-Bissasu", code: "GW", phoneCode: "+245", language: "EN" },
    { name: "Guyana", code: "GY", phoneCode: "+592", language: "EN" },
    { name: "Haiti", code: "HT", phoneCode: "+509", language: "EN" },
    {
      name: "Heard Island and McDonald Islands",
      code: "GA",
      phoneCode: "+",
      language: "EN"
    },
    {
      name: "Holy See (Vatican City State)",
      code: "HT",
      phoneCode: "+",
      language: "EN"
    },
    { name: "Honduras", code: "HN", phoneCode: "+504", language: "EN" },
    { name: "Hong Kong", code: "HK", phoneCode: "+852", language: "EN" },
    { name: "Hungary", code: "HU", phoneCode: "+36", language: "EN" },
    { name: "Iceland", code: "IS", phoneCode: "+354", language: "EN" },
    { name: "India", code: "IN", phoneCode: "+91", language: "EN" },
    { name: "Indonesia", code: "ID", phoneCode: "+62", language: "EN" },
    { name: "Iran", code: "IR", phoneCode: "+98", language: "EN" },
    { name: "Iraq", code: "IQ", phoneCode: "+964", language: "EN" },
    { name: "Ireland", code: "IE", phoneCode: "+353", language: "EN" },
    {
      name: "Isle of men",
      code: "IM",
      phoneCode: "+44-1624",
      language: "EN"
    },
    { name: "Israel", code: "IL", phoneCode: "+972", language: "EN" },
    { name: "Italy", code: "IT", phoneCode: "+39", language: "EN" },
    { name: "Jamaica", code: "JM", phoneCode: "+1-876", language: "EN" },
    { name: "Japan", code: "JP", phoneCode: "+81", language: "EN" },
    { name: "Jersey", code: "JE", phoneCode: "+44-1534", language: "EN" },
    { name: "Jordan", code: "JO", phoneCode: "+962", language: "EN" },
    { name: "Kazakhstan", code: "KZ", phoneCode: "+7", language: "EN" },
    { name: "Kenya", code: "KE", phoneCode: "+254", language: "EN" },
    { name: "Kiribati", code: "KI", phoneCode: "+686", language: "EN" },
    {
      name: "Korea, Democratic Peoples Republic of",
      code: "KE",
      phoneCode: "+",
      language: "EN"
    },
    {
      name: "Korea, Republic of",
      code: "KE",
      phoneCode: "+",
      language: "EN"
    },
    { name: "Kuwait", code: "KW", phoneCode: "+965", language: "EN" },
    { name: "Kyrgyzstan", code: "KG", phoneCode: "+996", language: "EN" },
    { name: "Laos", code: "LA", phoneCode: "+856", language: "EN" },
    { name: "Latvia", code: "LV", phoneCode: "+371", language: "EN" },
    { name: "Lebanon", code: "LB", phoneCode: "+961", language: "EN" },
    { name: "Lesotho", code: "LS", phoneCode: "+266", language: "EN" },
    { name: "Liberia", code: "LR", phoneCode: "+231", language: "EN" },
    { name: "Libya", code: "LY", phoneCode: "+218", language: "EN" },
    { name: "Liechtenstein", code: "LI", phoneCode: "+423", language: "EN" },
    { name: "Lithuania", code: "LT", phoneCode: "+370", language: "EN" },
    { name: "Luxembourg", code: "LU", phoneCode: "+352", language: "EN" },
    { name: "Macao", code: "MO", phoneCode: "+853", language: "EN" },
    { name: "Macedonia", code: "MK", phoneCode: "+389", language: "EN" },
    { name: "Madagascar", code: "MG", phoneCode: "+261", language: "EN" },
    { name: "Malawi", code: "MW", phoneCode: "+265", language: "EN" },
    { name: "Malaysia", code: "MY", phoneCode: "+60", language: "EN" },
    { name: "Maldives", code: "MV", phoneCode: "+960", language: "EN" },
    { name: "Mali", code: "ML", phoneCode: "+223", language: "EN" },
    { name: "Malta", code: "MT", phoneCode: "+356", language: "EN" },
    {
      name: "Marshall Islands",
      code: "MH",
      phoneCode: "+692",
      language: "EN"
    },
    { name: "Martinique", code: "MQ", phoneCode: "+", language: "EN" },
    { name: "Mauritius", code: "MU", phoneCode: "+230", language: "EN" },
    { name: "Mayotte", code: "YT", phoneCode: "+262", language: "EN" },
    { name: "Mexico", code: "MX", phoneCode: "+52", language: "EN" },
    { name: "Micronesia", code: "FM", phoneCode: "+691", language: "EN" },
    { name: "Moldova", code: "MD", phoneCode: "+373", language: "EN" },
    { name: "Monaco", code: "MC", phoneCode: "+377", language: "EN" },
    { name: "Mongolia", code: "MN", phoneCode: "+976", language: "EN" },
    { name: "Montenegro", code: "ME", phoneCode: "+382", language: "EN" },
    { name: "Monserrat", code: "MS", phoneCode: "+1-664", language: "EN" },
    { name: "Morocco", code: "MA", phoneCode: "+212", language: "EN" },
    { name: "Mozambique", code: "MD", phoneCode: "+258", language: "EN" },
    { name: "Myanmar", code: "MM", phoneCode: "+95", language: "EN" },
    { name: "Namibia", code: "NA", phoneCode: "+264", language: "EN" },
    { name: "Nauru", code: "NR", phoneCode: "+674", language: "EN" },
    { name: "Nepal", code: "NP", phoneCode: "+977", language: "EN" },
    { name: "Netherlands", code: "NL", phoneCode: "+31", language: "EN" },
    { name: "New Caledonia", code: "NC", phoneCode: "+687", language: "EN" },
    { name: "New Zealand", code: "NZ", phoneCode: "+64", language: "EN" },
    { name: "Nicaragua", code: "NI", phoneCode: "+505", language: "EN" },
    { name: "Niger", code: "NE", phoneCode: "+227", language: "EN" },
    { name: "Nigeria", code: "NG", phoneCode: "+234", language: "EN" },
    { name: "Niue", code: "NU", phoneCode: "+683", language: "EN" },
    { name: "Norfolk Island", code: "NF", phoneCode: "+", language: "EN" },
    {
      name: "Northern Marina Islands",
      code: "MP",
      phoneCode: "+1-670",
      language: "EN"
    },
    { name: "Norway", code: "NO", phoneCode: "+47", language: "EN" },
    { name: "Oman", code: "OM", phoneCode: "+968", language: "EN" },
    { name: "Pakistan", code: "PK", phoneCode: "+92", language: "EN" },
    { name: "Palau", code: "PW", phoneCode: "+680", language: "EN" },
    { name: "Palestine", code: "PS", phoneCode: "+970", language: "EN" },
    { name: "Panama", code: "PA", phoneCode: "+507", language: "EN" },
    {
      name: "Papua New Guinea",
      code: "PG",
      phoneCode: "+675",
      language: "EN"
    },
    { name: "Paraguay", code: "PY", phoneCode: "+595", language: "EN" },
    { name: "Peru", code: "PE", phoneCode: "+51", language: "EN" },
    { name: "Philippines", code: "PH", phoneCode: "+63", language: "EN" },
    { name: "Pitcairn", code: "PN", phoneCode: "+64", language: "EN" },
    { name: "Poland", code: "PL", phoneCode: "+48", language: "EN" },
    { name: "Portugal", code: "PT", phoneCode: "+351", language: "EN" },
    {
      name: "Puerto Rico",
      code: "PR",
      phoneCode: "+1-787, 1-939",
      language: "EN"
    },
    { name: "Qatar", code: "QA", phoneCode: "+974", language: "EN" },
    { name: "Reunion", code: "RE", phoneCode: "+262", language: "EN" },
    { name: "Romania", code: "RO", phoneCode: "+40", language: "EN" },
    { name: "Russia", code: "RU", phoneCode: "+7", language: "EN" },
    { name: "Rwanda", code: "RW", phoneCode: "+250", language: "EN" },
    {
      name: "Saint Barthelemy",
      code: "BL",
      phoneCode: "+590",
      language: "EN"
    },
    { name: "Saint Helena", code: "SH", phoneCode: "+290", language: "EN" },
    {
      name: "Saint Kitts and Nevis",
      code: "KN",
      phoneCode: "+1-869",
      language: "EN"
    },
    { name: "Saint Lucia", code: "LC", phoneCode: "+1-758", language: "EN" },
    { name: "Saint Martin", code: "BL", phoneCode: "+590", language: "EN" },
    {
      name: "Saint Pierre and Miquelon",
      code: "PM",
      phoneCode: "+508",
      language: "EN"
    },
    {
      name: "Saint Vincent and Grenadines",
      code: "VC",
      phoneCode: "+1-784",
      language: "EN"
    },
    { name: "Samoa", code: "WS", phoneCode: "+685", language: "EN" },
    { name: "San Marino", code: "SM", phoneCode: "+378", language: "EN" },
    {
      name: "Sao Tome and Principe",
      code: "ST",
      phoneCode: "+239",
      language: "EN"
    },
    { name: "Saudi Arabia", code: "SA", phoneCode: "+966", language: "EN" },
    { name: "Senegal", code: "SN", phoneCode: "+221", language: "EN" },
    { name: "Serbia", code: "RS", phoneCode: "+381", language: "EN" },
    { name: "Seychelles", code: "SC", phoneCode: "+248", language: "EN" },
    { name: "Sierra Leone", code: "SL", phoneCode: "+232", language: "EN" },
    { name: "Singapore", code: "SG", phoneCode: "+65", language: "EN" },
    { name: "Sint Maarten", code: "SX", phoneCode: "+1-721", language: "EN" },
    { name: "Slovakia", code: "SK", phoneCode: "+421", language: "EN" },
    { name: "Slovenia", code: "SI", phoneCode: "+386", language: "EN" },
    {
      name: "Solomon Islands",
      code: "SB",
      phoneCode: "+677",
      language: "EN"
    },
    { name: "Somalia", code: "SO", phoneCode: "+252", language: "EN" },
    { name: "South Africa", code: "ZA", phoneCode: "+27", language: "EN" },
    {
      name: "South Georgia and the South Sandwich Islands",
      code: "GS",
      phoneCode: "+",
      language: "EN"
    },
    { name: "South Sudan", code: "SS", phoneCode: "+211", language: "EN" },
    { name: "Spain", code: "ES", phoneCode: "+34", language: "EN" },
    { name: "Sri Lanka", code: "LK", phoneCode: "+94", language: "EN" },
    { name: "Sudan", code: "SD", phoneCode: "+249", language: "EN" },
    { name: "Suriname", code: "SR", phoneCode: "+597", language: "EN" },
    {
      name: "Svalbard and Jan Mayen",
      code: "SJ",
      phoneCode: "+47",
      language: "EN"
    },
    { name: "Swaziland", code: "SZ", phoneCode: "+268", language: "EN" },
    { name: "Sweden", code: "SE", phoneCode: "+46", language: "EN" },
    { name: "Switzerland", code: "CH", phoneCode: "+41", language: "EN" },
    { name: "Syria", code: "SY", phoneCode: "+963", language: "EN" },
    { name: "Taiwan", code: "TW", phoneCode: "+886", language: "EN" },
    { name: "Tajikstan", code: "TJ", phoneCode: "+992", language: "EN" },
    { name: "Tanzania", code: "TZ", phoneCode: "+255", language: "EN" },
    { name: "Thailand", code: "TH", phoneCode: "+66", language: "EN" },
    { name: "Timor-leste", code: "TL", phoneCode: "+", language: "EN" },
    { name: "Togo", code: "TG", phoneCode: "+228", language: "EN" },
    { name: "Tokelau", code: "TK", phoneCode: "+690", language: "EN" },
    { name: "Tonga", code: "TO", phoneCode: "+676", language: "EN" },
    {
      name: "Trinidad and Tobago",
      code: "TT",
      phoneCode: "+1-868",
      language: "EN"
    },
    { name: "Tunisia", code: "TN", phoneCode: "+216", language: "EN" },
    { name: "Turkey", code: "TR", phoneCode: "+90", language: "EN" },
    { name: "Turkmenistan", code: "TM", phoneCode: "+993", language: "EN" },
    {
      name: "Turks and Caicos islands",
      code: "TC",
      phoneCode: "+1-649",
      language: "EN"
    },
    { name: "Tuvalu", code: "TV", phoneCode: "+688", language: "EN" },
    { name: "Uganda", code: "UG", phoneCode: "+256", language: "EN" },
    { name: "Ukraine", code: "UA", phoneCode: "+380", language: "EN" },
    {
      name: "United Arab Emirates",
      code: "AE",
      phoneCode: "+971",
      language: "EN"
    },
    { name: "United Kingdom", code: "GB", phoneCode: "+44", language: "EN" },
    { name: "United States", code: "US", phoneCode: "+1", language: "EN" },
    {
      name: "United States Minor Outlying Islands",
      code: "UM",
      phoneCode: "+249",
      language: "EN"
    },
    { name: "Uruguay", code: "UY", phoneCode: "+598", language: "EN" },
    { name: "Uzbekistan", code: "UZ", phoneCode: "+998", language: "EN" },
    { name: "Vanuatu", code: "VU", phoneCode: "+678", language: "EN" },
    { name: "Venezuela", code: "VE", phoneCode: "+58", language: "EN" },
    { name: "Vietnam", code: "VN", phoneCode: "+84", language: "EN" },
    {
      name: "Virgin Islands, British",
      code: "VG",
      phoneCode: "+",
      language: "EN"
    },
    {
      name: "Virgin Islands, U.S.",
      code: "VI",
      phoneCode: "+",
      language: "EN"
    },
    {
      name: "Wallis and Futuna",
      code: "WF",
      phoneCode: "+681",
      language: "EN"
    },
    { name: "Western Sahara", code: "EH", phoneCode: "+212", language: "EN" },
    { name: "Yemen", code: "YE", phoneCode: "+967", language: "EN" },
    { name: "Zambia", code: "ZM", phoneCode: "+260", language: "EN" },
    { name: "Zimbabwe", code: "ZW", phoneCode: "+263", language: "EN" }
  ]);
  */
};
