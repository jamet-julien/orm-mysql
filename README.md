
[![NPM](https://img.shields.io/npm/dt/orm-mysql.svg)](https://nodei.co/npm/orm-mysql)

Tiny ORM with Mysql to tiny project.

[![NPM](https://nodei.co/npm/orm-mysql.png?compact=true)](https://nodei.co/npm/orm-mysql)


## Installation

```bash
$ npm install orm-mysql
```


## Usage

file : User.js
```js
var Model   = require('orm-mysql')( require('./config-sql.js'));

class User extends Model{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    super();
    this._table   = 'User';
    this._referer = 'id';
  }

  /**
   * [_treatBeforeInsert description]
   * @param  {[type]} oData [description]
   * @return {[type]}       [description]
   */
  _treatBeforeInsert( oData){
    oData.nom    = oData.nom.toLowerCase();
    oData.prenom = oData.prenom.toLowerCase();
  }

  /**
   * [completeName description]
   * @return {[type]} [description]
   */
  get completeName(){
    return `${this.nom} ${this.prenom}`;
  }

}

module.exports = new User();

```
## Quick start

```js
var User      = require('./user.js');
var oPromise  = User.one("`id` = '2'");
var oPromises = User.all();

//ONE USER
oPromise.then(( oUser)=>{
    // read
    console.log( oUser.nom, oUser.prenom, oUser.completeName);

    // update
    oUser.nom = 'lorem';
    oUser.save().then(()=>{ console.log('saved OK ')});

}).catch((e)=>{
  console.log(e);
});

// ALL USERS
oPromises.then( ( aUser)=>{

    aUser.map( (oUser)=>{
      console.log( oUser.nom, oUser.prenom, oUser.completeName);
    })

})
```

## Overview

### Create

```js
var User      = require('./user.js');

var oPromise  = User.create({
  prenom : "john",
  nom    : "dupond"
}).then( ( oUser)=>{
  console.log( `${oUser.completeName} created`);
});


```
### Read

To read One element

```js
var User      = require('./user.js');

User.one(" `prenom` = 'john' ").then( ( oUser)=>{
  console.log( `Hi ! ${oUser.completeName}`);
});

```

To read Multi element
```js
var User      = require('./user.js');

User.all().then( ( aUsers)=>{

    aUsers.map((oUser)=>{
      console.log( `Hi ! ${oUser.completeName}`);
    })

});
```


### Update

```js
var User      = require('./user.js');

User.one(" `prenom` = 'john' ")
    .then( ( oUser)=>{
      oUser.nom = "Doe";
      oUser.save().then((oUser)=>{
        console.log( `${oUser.completeName} updated`);
      });
    });
```

### DELETE

```js
var User       = require('./user.js');

var oPromiseDel  = User.create({
                                prenom : "alphonse",
                                nom    : "dupond"
                              })
                      .then(( oUser)=>{
                              return oUser.destroy();
                            });

oPromiseDel.then(()=>{
  console.log('sup');
});

```

### CUSTOM

```js
var User       = require('./user.js');

User.customFind('SELECT * FROM user WHERE prenom = ?', 'john')
    .then(( aUsers)=>{

        aUsers.map((oUser)=>{
          console.log( `custom -> Hi ! ${oUser.completeName}`);
        })

    });

```
