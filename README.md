

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
    this.table   = 'User';
    this.referer = 'id';
  }

  /**
   * [_treatBeforeInsert description]
   * @param  {[type]} oData [description]
   * @return {[type]}       [description]
   */
  _treatBeforeInsert( oData){
      oData.nom = oData.nom.strtolower();
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
oUser.then(( oUser)=>{
    // read
    console.log( oUser.nom, oUser.prenom, oUser.completeName);

    // update
    oUser.nom = 'lorem';
    oUser.save().then(()=>{ console.log('saved OK ')});

}).catch((e)=>{
  console.log(e);
});

// ALL USERS
oUsers.then( ( aUser)=>{

    aUsers.map( (oUser)=>{
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


### Update

```js
var User      = require('./user.js');

var oPromise  = User.one("`id` = '2'")
                    .then( ( oUser)=>{
                      oUser.nom = "Doe";
                      oUser.save().then((oUser)=>{
                        console.log( `${oUser.completeName} updated`);
                      });
                    });
```