var Model   = require('../index')();

class Inscrit extends Model{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    super();
    this.table   = 'inscrit';
    this.referer = 'serial';
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
   * [age description]
   * @return {[type]} [description]
   */
  get age(){
    return this.code_postal;
  }

}

module.exports = new Inscrit();
