var User      = require('./user.js');

// create
var oPromise  = User.create({
                              prenom : "john",
                              nom    : "dupond"
                            }).then( ( oUser)=>{
                              console.log( `${oUser.completeName} created`);
                            });

//READ ONE
User.one(" `prenom` = 'john' ").then( ( oUser)=>{
  console.log( `Hi ! ${oUser.completeName}`);
});

//READ ALL
User.all().then( ( aUsers)=>{

    aUsers.map((oUser)=>{
      console.log( `Hi ! ${oUser.completeName}`);
    })

});

// UPDATE
User.one(" `prenom` = 'john' ")
    .then( ( oUser)=>{

      oUser.nom = "Doe";

      oUser.save().then((oUser)=>{
        console.log( `${oUser.completeName} updated`);
      });

    });

// DELETE
var deletePromise  = User.create({
                                prenom : "alphonse",
                                nom    : "dupond"
                              })
                      .then(( oUser)=>{
                              return oUser.destroy();
                            });

deletePromise.then(()=>{
  console.log('sup');
});


// CUSTOM FIND
User.customFind('SELECT * FROM user WHERE prenom = ?', 'john')
    .then(( aUsers)=>{

        aUsers.map((oUser)=>{
          console.log( `custom -> Hi ! ${oUser.completeName}`);
        })

    });
