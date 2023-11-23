db.getCollection("collection1").aggregate([
    //COMUNE DI COSENZA
    // A partire dal 03/01/2023  
    {
       $match: {"timestamp": {$gte: "2023-01-03"}}
    },
    // Sensore del comune di Cosenza
    {
       $match: {"name": {$in: ['Weather Station Cosenza01'] } }
    },

    //Misurazioni interessate
     {
       $match: {"data.description": {$in: ['Wind direction', 'Wind speed'
                                             ] } }
    },
     {
      $addFields: {
          //Prendi la direzione del vento in gradi
          windDirectionIndex: {$switch: {
                           branches: [
                              { case: 
                                  { $and : [{ $in: [ 'Wind direction', "$data.description"] }
                                          , { $in: [ 'degrees', "$data.uom"] }
                                      ]
                                  }, 
                                  then: {$indexOfArray: [ "$data.description", 'Wind direction']} 
                              }
                           ],
                           default: -1
                          }  
                         } ,
          //Prendi la velocità del vento
          windSpeedIndex: {$switch: {
                           branches: [
                              { case: 
                                  { $in: [ 'Wind speed', "$data.description"]                                      
                                  }, 
                                  then: {$indexOfArray: [ "$data.description", 'Wind speed']} 
                              }
                           ],
                           default: -1
                          }  
                         } ,
      }
     },
     {
      $project:
      {
        //"data": 1,
        "_id": 0,
        "Direzione del vento (gradi)": {$toDouble : {$arrayElemAt: ["$data.value", '$windDirectionIndex']} }, 
        "Velocità del vento (m/s)": {$toDouble : {$arrayElemAt: ["$data.value", '$windSpeedIndex']} }, 
        "date": {
          "$dateFromString": {
            "dateString": "$timestamp"
          }
        }
      }
    },
          

])

