"use strict";

module.exports = function(server) {
  /**
   * ==================================
   * DEVELOPMENT ONLY
   * ==================================
   */
  var Lead = server.models.Lead;
  Lead.deleteAll();

  /**
   * CRM Fields
   */
  // Lead Status
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

  // Industry
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

  // Countries
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
};
