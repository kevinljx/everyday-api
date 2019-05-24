'use strict';

module.exports = function(Lead) {
   
   Lead.showFullAddress = function showFullAddress(lead){
     var address = "";
     if(lead.address_1){
         address += lead.address_1+"\n";         
     }
     if(lead.address_2){
        address += lead.address_2+"\n";         
     }
     if(lead.state){
        address += lead.state+",";         
     }
     if(lead.city){
        address += lead.city+" ";         
     }
     if(lead.zip){
        address += lead.zip;         
     }
     return address;
   };
};
