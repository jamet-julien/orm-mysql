var EventEmitter = require('events');
var mysqlDB      = require('mysql');
var CONNECT;


var map     = new WeakMap();
var _private = function (object) {
    if (!map.has(object))
        map.set(object, {});
    return map.get(object);
}
/**
 * [exports description]
 * @type {[type]}
 */
class Model extends EventEmitter{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){

    super();
    _private(this)._fields  = [];
    this._referer = '';
    this._table   = '';

  }

  /**
   * [setData description]
   * @param {[type]} oData [description]
   */
  setData( oData){
      var sName;
      for ( sName in oData) {
        _private(this)._fields.push( sName);
        this[sName] = oData[sName];
      }
  }

  /**
   * [_query description]
   * @param  {[type]} _query [description]
   * @return {[type]}        [description]
   */
  _query() {

    var aArg    = [].slice.call(arguments),fBack,oQuery;


		return new Promise( (resolve, reject) => {

      fBack = function(error, results, fields){
          if (error) reject(error);
          else resolve( results, fields);
      };

      aArg.push( fBack);

			oQuery = CONNECT.query.apply( CONNECT, aArg);
      //console.log( oQuery.sql);
		});
	}

  /**
   * [_computeCondition description]
   * @return {[type]} [description]
   */
  _computeCondition( arg){
    var aArg   = [].slice.call(arg),
        mValue = aArg.shift(),
        sKey   = '',
        aCond  = ['1'],
        sValue;

    switch ( typeof mValue) {
      case 'object':
            for(sKey in mValue){
                 sValue = CONNECT.escape( mValue[sKey]);
                 aCond.push( `\`${sKey}\` = '${sValue}'`);
            }
        break;
      case 'string':
      case 'number':
            aCond.push( mValue);
      default:
        break;
    }

    return aCond.join(' AND ');
  }

  /**
   * [_multiRead description]
   * @param  {[type]} resolve [description]
   * @param  {[type]} reject  [description]
   * @return {[type]}         [description]
   */
  _multiRead( sQuery, resolve, reject){

      this._query( sQuery).then( ( aRows)=>{
        var data = [];
        if( aRows.length){
          data = aRows.map( ( oData)=>{
            var oTemp = new this.constructor();
            oTemp.setData( oData);
            return oTemp;
          });
        }
        resolve( data);
      }).catch((e)=>{
        reject( e);
      });
  }

  /**
   * [_oneRead description]
   * @param  {[type]} resolve [description]
   * @param  {[type]} reject  [description]
   * @return {[type]}         [description]
   */
  _oneRead ( sQuery, resolve, reject){

      this._query( sQuery).then( ( aRows)=>{
        var oTemp = this;
        if( aRows.length){
          oTemp = new this.constructor();
          oTemp.setData( aRows[0]);
        }
        resolve( oTemp);
      }).catch((e)=>{
        reject( e);
      });
  }

  /**
   * [_getFormatValues description]
   * @param  {[type]} aData  [description]
   * @param  {[type]} aParam [description]
   * @return {[type]}        [description]
   */
  _computeFormatValues( oData, aParam){

    var aFormat    = aParam || ['WHERE ',' AND '],
        aResult    = [],
        sKey       = '',
        sValue     = '';

    for( sKey in oData){
        sValue = CONNECT.escape( oData[sKey]);
        sValue = ( typeof sValue == 'number')? sValue : `'${sValue}'`;
        aResult.push( `\`${sKey}\` = ${sValue}`);
    }

    return (aResult.length)? aFormat[0] + aResult.join( aFormat[1] ) : '';

  }

  /**
   * [treatBeforeUpdate description]
   * @param  {[type]} oData [description]
   * @return {[type]}       [description]
   */
  _treatBeforeUpdate( oData){}

  /**
   * [treatBeforeInsert description]
   * @param  {[type]} oData [description]
   * @return {[type]}       [description]
   */
  _treatBeforeInsert( oData){}

  /**
   * [_treatBeforeDelete description]
   * @param  {[type]} oData [description]
   * @return {[type]}       [description]
   */
  _treatBeforeDelete( oData){}

  /**
   * [_read description]
   * @param  {[type]} arg         [description]
   * @param  {[type]} fCall       [description]
   * @param  {String} [sLimit=''] [description]
   * @return {[type]}             [description]
   */
  _read( arg, fCall, sLimit = ''){
    var sQuery = `SELECT * FROM ${this._table} WHERE ${this._computeCondition( arg)} ${sLimit}`;
    return new Promise( fCall.bind( this, sQuery));
  }

  /**
   * [_read description]
   * @return {[type]} [description]
   */
  all(){
    return this._read( arguments, this._multiRead);
  }


  /**
   * [_read description]
   * @return {[type]} [description]
   */
  one(){
    return this._read( arguments, this._oneRead, 'LIMIT 1');
  }


  /**
   * [save description]
   * @return {[type]} [description]
   */
  save(){

    var oData = {},
        iLen  = _private(this)._fields.length,
        sKey  = '';

    for(;iLen--;){
        sKey        = _private(this)._fields[iLen];
        oData[sKey] = this[sKey];
    }

    this._treatBeforeUpdate( oData);
    this.setData( oData);

    delete oData.id;
    delete oData[this._referer];

    return new Promise( (resolve, reject)=>{

      this._query(
                   `UPDATE ?? SET ? WHERE ?? = ?`,
                   [ this._table , oData, this._referer, this[this._referer] ]
                 ).then(( oInfo)=>{
                              resolve( this);
                        }).catch((e)=>{
                          reject(e);
                        });

      });
  }

  destroy(){

    var oData = {},
        iLen  = _private(this)._fields.length,
        sKey  = '';

    for(;iLen--;){
        sKey        = _private(this)._fields[iLen];
        oData[sKey] = this[sKey];
    }

    this._treatBeforeDelete( oData);

    return new Promise( (resolve, reject)=>{

      this._query(
                   `DELETE FROM ?? WHERE ?? = ?`,
                   [ this._table , this._referer, this[this._referer] ]
                 ).then(()=>{
                          resolve( new this.constructor());
                        }).catch((e)=>{
                          reject(e);
                        });

      });

  }

  /**
  * [create description]
  * @return {[type]} [description]
  */
  create( oData){

    this._treatBeforeInsert( oData);

    return new Promise( (resolve, reject)=>{

      this._query( `INSERT INTO ?? SET ?`, [ this._table , oData]).then(( oInfo)=>{

            oData.id = oInfo.insertId;
            this.setData( oData);
            resolve( this);

      }).catch((e)=>{
        reject(e);
      });

    });
  }

  /**
   * [customFind description]
   * @param  {[type]} sQuery [description]
   * @return {[type]}        [description]
   */
  customFind(){
    var arg = [].slice.call(arguments);

    return new Promise( (resolve, reject)=>{

      this._query.apply( this, arg)
                 .then(( aRows)=>{

                          var data = [];

                          if( aRows.length){
                            data = aRows.map( ( oData)=>{
                              var oTemp = new this.constructor();
                              oTemp.setData( oData);
                              return oTemp;
                            });
                          }
                          resolve( data);
                      }).catch((e)=>{
                        reject(e);
                      });
      });
  }

}


/**
 * [description]
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */

module.exports = function( oParam){

  var oParam    = oParam || require( '../setting/config.js');
  CONNECT       = mysqlDB.createConnection(oParam);

  CONNECT.connect( (err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });

  return Model;
};
