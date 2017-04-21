var Model   = require('../index')();

class User extends Model{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    super();
    this.table   = 'user';
    this.referer = 'id';
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
