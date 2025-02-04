//=============================================================================
// TDS Custom Battle Action Text
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_CustomBattleActionText = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.CustomBattleActionText = _TDS_.CustomBattleActionText || {};
//=============================================================================
 /*:
 * @plugindesc
 * This plugins allows you to set customized messages for actions.
 *
 * @author TDS
 */
//=============================================================================


//=============================================================================
// ** Window_BattleLog
//-----------------------------------------------------------------------------
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_displayAction         = Window_BattleLog.prototype.displayAction;
_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults  = Window_BattleLog.prototype.displayActionResults;
//=============================================================================
// * Make Custom Action Text
//=============================================================================
Window_BattleLog.prototype.makeCustomActionText = function(subject, target, item) {
  var user          = subject;
  var result        = target.result();
  var hit           = result.isHit();
  var success       = result.success;
  var critical      = result.critical;
  var missed        = result.missed;
  var evaded        = result.evaded;
  var hpDam         = result.hpDamage;
  var mpDam         = result.mpDamage;
  var tpDam         = result.tpDamage;
  var addedStates   = result.addedStates;
  var removedStates = result.removedStates;
  var strongHit     = result.elementStrong;
  var weakHit       = result.elementWeak;
  var text = '';
  var type = item.meta.BattleLogType.toUpperCase();
  var switches = $gameSwitches;
  var unitLowestIndex = target.friendsUnit().getLowestIndexMember();
  var pronome1 = target.name() === "AUBREY" ? "A" : "O";
  var pronome2 = target.name() === "AUBREY" ? "a" : "o";


  function parseNoEffectEmotion(tname, em) {
    if(em.toLowerCase().contains("afraid")) {
      if(tname === "OMORI") {return "¡OMORI no siente MIEDO!\r\n"}
      return target.name() + " ¡no siente MIEDO!\r\n";
    }
    let finalString = `${tname} no puede estar ${em}`;
    if(finalString.length >= 40) {
      let voinIndex = 0;
      for(let i = 40; i >= 0; i--) {
        if(finalString[i] === " ") {
          voinIndex = i;
          break;
        }
      }
      finalString = [finalString.slice(0, voinIndex).trim(), "\r\n", finalString.slice(voinIndex).trimLeft()].join('')
    }
    return finalString;
  }

  function parseNoStateChange(tname,stat,hl) {
    let noStateChangeText = `¡${tname} ya no ${stat} puede\r\nbajar! ${hl}`; // TARGET NAME - STAT - HIGHER/LOWER
    return noStateChangeText
  }

  // Type case
//OMORI//
if (hpDam != 0) {
  var hpDamageText = '¡' + target.name() + ' recibió ' + hpDam + ' de daño!';
  if (strongHit) {
    hpDamageText = '¡Fue un ataque conmovedor!\r\n' + hpDamageText;
  } else if (weakHit) {
    hpDamageText = 'Fue un ataque aburrido...\r\n' + hpDamageText;
  }
} else if (result.isHit() === true) {
  var hpDamageText = user.name() + " atacó, pero no hizo nada.";
} else {
  var hpDamageText = user.name() + " atacó, pero falló.";
}

if (critical) {
    hpDamageText = '¡LE DIO JUSTO EN EL CORAZÓN!\r\n' + hpDamageText;
}

if (mpDam > 0) {
  var mpDamageText = target.name() + ' perdió ' + mpDam + ' de JUGO...';
  hpDamageText = hpDamageText + "\r\n" + mpDamageText;
} else {
  var mpDamageText = '';
}

  switch (type) {
  case 'BLANK': // ATAQUE
    text = '...';
    break;

  case 'ATTACK': // ATAQUE
    text = '¡' + user.name() + ' ataca a ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'MULTIHIT':
    text = '¡' + user.name() + " hace daño a todo el mundo!\r\n";
    break;

  case 'OBSERVE': // OBSERVE
    text = user.name() + ' observa atentamente...\r\n';
    text += target.name() + '!';
    break;

  case 'OBSERVE TARGET': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = '¡' + target.name() + ' va a atacar a\r\n';
    text += user.name() + '!';
    break;

  case 'OBSERVE ALL': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = user.name() + ' observa atentamente a \r\n';
    text += target.name() + '!';
    text = '¡' + target.name() + ' va a atacar a todos!';
    break;

  case 'SAD POEM':  // SAD POEM
    text = user.name() + ' lee un poema triste...\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(12)) {text += target.name() + ' se siente MISERABLE....';}
      else if(target.isStateAffected(11)) {text += target.name() + ' se siente DEPRESIVO...';}
      else if(target.isStateAffected(10)) {text += target.name() + ' se siente TRISTE...';}
    }
    else {text += parseNoEffectEmotion(target.name(), "¡¡TRISTEZA!!")}
    break;

    case 'STAB': // STAB
    text = user.name() + ' apuñala a ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'TRICK':  // TRICK
    text = '¡' + user.name() + ' engañá a ' + target.name() + '!\r\n';
    if(target.isEmotionAffected("FELIZ")) {
      if(!target._noStateMessage) {text += '¡' + target.name() + ' bajó su VELOCIDAD!\r\n';}
      else {text += parseNoStateChange(target.name(), "VELOCIDAD", "bajó!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'SHUN': // SHUN
    text = user.name() + ' evitó a ' + target.name() + '.\r\n';
    if(target.isEmotionAffected("sad")) {
      if(!target._noStateMessage) {text += '¡' + target.name() + '\y su DEFENSA disminuyó!\r\n';}
      else {text += parseNoStateChange(target.name(), "DEFENSA", "bajo!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'MOCK': // MOCK
    text = user.name() + ' se burla de ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'HACKAWAY':  // Hack Away
    text = '¡' + user.name() + ' agita su cuchillo a lo loco!';
    break;

  case 'PICK POCKET': //Pick Pocket
    text = '¡' + user.name() + ' trata de tomar un artículo!\r\n';
    text += 'from ' + target.name();
    break;

  case 'BREAD SLICE': //Bread Slice
    text = '¡' + user.name() + ' rebanó a ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HIDE': // Hide
    text = user.name() + ' se esconde... ';
    break;

  case 'QUICK ATTACK': // Quick ATAQUE
    text = '¡' + user.name() + ' se lanza a por ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT HAPPY': //Exploit FELIZ
    text = user.name() + ' explota a ' + target.name() + '\felicidad\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT SAD': // Exploit Sad
    text = user.name() + ' explota a ' + target.name() + '\'s\r\n';
    text += 'sadness!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT ANGRY': // Exploit ENFADADO
    text = user.name() + ' explota a ' + target.name() + '\'s\r\n';
    text += 'enojado!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT EMOTION': // Exploit Emotion
    text = user.name() + " explota a " + target.name() + "de EMOCIONES";
    if(text.length >= 34) {
      text = user.name() + ' explota ' + target.name() + '\'s\r\n';
      text += 'EMOCIONES!\r\n';
    }
    else {text += "\r\n"}
    text += hpDamageText;
    break;

  case 'FINAL STRIKE': // Final Strike
    text = '¡' + user.name() + ' desata su ataque definitivo!';
    break;

  case 'TRUTH': // PAINFUL TRUTH
    text = user.name() + ' le susurra la verdad a\r\n';
    text += target.name() + '.\r\n';
    text += hpDamageText + "\r\n";
    if(!target._noEffectMessage) {
      text += target.name() + " se siente TRISTE.\r\n";
    }
    else {text += parseNoEffectEmotion(target.name(), "¡¡TRISTEZA!!\r\n")}
    if(user.isStateAffected(12)) {text += user.name() + " se siente MISERABLE...";}
    else if(user.isStateAffected(11)) {text += user.name() + " se siente DEPRESIVO..";}
    else if(user.isStateAffected(10)) {text += user.name() + " se siente TRISTE.";}
    break;

  case 'ATTACK AGAIN':  // ATAQUE AGAIN 2
    text = '¡' + user.name() + ' ataca otra vez!\r\n';
    text += hpDamageText;
    break;

  case 'TRIP':  // TRIP
    text = '¡' + user.name() + ' tropieza con ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + ' y su VELOCIDAD bajó!\r\n';}
    else {text += parseNoStateChange(target.name(), "VELOCIDAD ", "bajó!!\r\n")}
    text += hpDamageText;
    break;

    case 'TRIP 2':  // TRIP 2
      text = '¡' + user.name() + ' tropieza con ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' y su VELOCIDAD bajó!\r\n';}
      else {text += parseNoStateChange(target.name(), "VELOCIDAD ", "bajó!!\r\n")}
      if(!target._noEffectMessage) {text += target.name() + ' se siente TRISTE.\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "¡TRISTEZA!\r\n")}
      text += hpDamageText;
      break;

  case 'STARE': // STARE
    text = user.name() + ' mira fijamente a ' + target.name() + '.\r\n';
    text += target.name() + ' se siente incómodo.';
    break;

  case 'RELEASE ENERGY':  // RELEASE ENERGY
    text = '¡' + user.name() + ' y sus amigos se reúnen para\r\n';
    text += 'realizar su ataque definitivo!';
    break;

  case 'VERTIGO': // OMORI VERTIGO
    if(target.index() <= unitLowestIndex) {
      text = '¡' + user.name() + ' despierta a los enemigos!\r\n';
      text += 'Los enemigos\' ¡Y su ATAQUE bajaron!\r\n';
    }
    text += hpDamageText;
    break;

  case 'CRIPPLE': // OMORI CRIPPLE
    if(target.index() <= unitLowestIndex) {
      text = '¡' + user.name() + ' Inutiliza a los enemigos!\r\n';
      text += "Los enemigos y su VELOCIDAD bajaron!\r\n";
    }
    text += hpDamageText;
    break;

  case 'SUFFOCATE': // OMORI SUFFOCATE
    if(target.index() <= unitLowestIndex) {
      text = '¡' + user.name() + ' Asfixia a los enemigos!\r\n';
      text += 'Los enemigos sienten que les falta el aire.\r\n';
      text += "Los enemigos y su DEFENSA cayerón!\r\n";
    }
    text += hpDamageText;
    break;

  //AUBREY//
  case 'PEP TALK':  // PEP TALK
    text = '¡' + user.name() + ' anima a ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += '¡¡¡' + target.name() + ' se siente MANÍACO!!!';}
      else if(target.isStateAffected(7)) {text += '¡¡' + target.name() + ' se siente EXTÁTICO!!';}
      else if(target.isStateAffected(6)) {text += '¡' + target.name() + ' se siente FELIZ!';}
    }
    else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!")}
    break;

  case 'TEAM SPIRIT':  // TEAM SPIRIT
    text = user.name() + ' anima a ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += '¡¡¡' + target.name() + ' se siente MANÍACO!!!\r\n';}
      else if(target.isStateAffected(7)) {text += '¡¡' + target.name() + ' se siente EXTÁTICO!!\r\n';}
      else if(target.isStateAffected(6)) {text += '¡' + target.name() + ' se siente FELIZ!\r\n';}
    }
    else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!\r\n")}

    if(!user._noEffectMessage) {
      if(user.isStateAffected(8)) {text += '¡¡¡' + user.name() + ' se siente MANÍACO!!!';}
      else if(user.isStateAffected(7)) {text += '¡¡' + user.name() + ' se siente EXTÁTICO!!';}
      else if(user.isStateAffected(6)) {text += '¡' + user.name() + ' se siente FELIZ!';}
    }
    else {text += parseNoEffectEmotion(user.name(), "¡MÁS FELIZ!\r\n")}
    break;

  case 'HEADBUTT':  // HEADBUTT
    text = '¡' + user.name() + ' le mete un cabezazo a ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HOMERUN': // Homerun
    text = '¡' + user.name() + ' manda a ' + target.name() + '\r\n';
    text += 'fuera del parque!\r\n';
    text += hpDamageText;
    break;

  case 'THROW': // Wind-up Throw
    text = '¡' + user.name() + ' tira su arma!';
    break;

  case 'POWER HIT': //Power Hit
    text = '¡' + user.name() + ' golpea a ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + '\ y su defensa bajaron.\r\n';}
    else {text += parseNoStateChange(target.name(), "DEFENSA", "bajó!!\r\n")}
    text += hpDamageText;
    break;

  case 'LAST RESORT': // Last Resort
    text = '¡' + user.name() + ' ataca a ' + target.name() + '\r\n';
    text += ' con todas sus fuerzas!\r\n';
    text += hpDamageText;
    break;

  case 'COUNTER ATTACK': // Counter ATAQUE
    text = '¡' + user.name() + ' prepara su bate!';
    break;

  case 'COUNTER HEADBUTT': // Counter Headbutt
    text = user.name() + ' prepara su cabeza!';
    break;

  case 'COUNTER ENFADADO': //Counter ENFADADO
    text = '¡' + user.name() + ' se prepara!';
    break;

  case 'LOOK OMORI 1':  // Look at Omori 2
    text = 'OMORI no notó a ' + user.name() + ', ¡así que\r\n';
    text += user.name() + ' ataca de nuevo!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 2': // Look at Omori 2
    text = 'OMORI sigue sin notar a ' + user.name() + ', ¡así que\r\n';
    text += user.name() + ' ataca más fuerte!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 3': // Look at Omori 3
    text = '¡OMORI nota finalmente a ' + user.name() + '! ¡\r\n';
    text += user.name() + ' balancea su bate de felicidad!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK KEL 1':  // Look at Kel 1
    text = '¡KEL molesta a AUBREY!\r\n';
    text += target.name() + " se siente ENFADADA!";
    break;

  case 'LOOK KEL 2': // Look at Kel 2
   text = '¡KEL y AUBREY se pelean!!\r\n';
   text += 'El ATAQUE de KEL y AUBREY se elevó!\r\n';
   var AUBREY = $gameActors.actor(2);
   var KEL = $gameActors.actor(3);
   if(AUBREY.isStateAffected(14) && KEL.isStateAffected(14)) {text += 'KEL y AUBREY se sienten ENFADADOS.';}
   else if(AUBREY.isStateAffected(14) && KEL.isStateAffected(15)) {
    text += '¡¡KEL se siente ENFURECIDO!!\r\n';
    text += '¡AUBREY se siente ENFADADA!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(14)) {
    text += '¡¡KEL se siente ENFADADO!!\r\n';
    text += '¡¡AUBREY se siente ENFURECIDA!!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(15)) {text += '¡¡KEL y AUBREY se sienten ENFURECIDOS!!';}
   else {text += '¡KEL y AUBREY se sienten ENFADADOS!';}
   break;

  case 'LOOK HERO':  // LOOK AT HERO 1
    text = 'HERO le dice a AUBREY que se concentre!\r\n';
    if(target.isStateAffected(6)) {text += '¡' + target.name() + " se siente FELIZ!\r\n"}
    else if(target.isStateAffected(7)) {text += '¡' + target.name() + " se siente EXTÁTICA!!\r\n"}
    text += '¡¡La defensa de' + user.name() + '\ aumento!!';
    break;

  case 'LOOK HERO 2': // LOOK AT HERO 2
    text = '¡HERO anima a AUBREY!\r\n';
    text += '¡La DEFENSA de AUBREY aumento!\r\n';
    if(target.isStateAffected(6)) {text += '¡' + target.name() + " se siente FELIZ!\r\n"}
    else if(target.isStateAffected(7)) {text += '¡¡' + target.name() + " se siente EXTÁTICA!!\r\n"}
    if(!!$gameTemp._statsState[0]) {
      var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
      if(absHp > 0) {text += `AUBREY recupera ${absHp} CORAZONES!\r\n`;}
    }
    if(!!$gameTemp._statsState[1]) {
      var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
      if(absMp > 0) {text += `¡AUBREY recupera ${absMp} de JUGO!`;}
    }
    $gameTemp._statsState = undefined;
    break;

  case 'TWIRL': // ATAQUE
    text = '¡' + user.name() + ' ataca a ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

   //KEL//
    case 'ANNOY':  // ANNOY
      text = '¡' + user.name() + ' molesta a ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(14)) {text += target.name() + ` se siente ENFADAD${pronome1} ..`;}
        else if(target.isStateAffected(15)) {text += target.name() + ` se siente ENFURECID${pronome1} ..`;}
        else if(target.isStateAffected(16)) {text += target.name() + ` se siente FURIOS${pronome1} ..`;}
      }
      else {text += parseNoEffectEmotion(target.name(), "más ENFADADO!")}
      break;

    case 'REBOUND':  // REBOUND
      text = '¡La bola de' + user.name() + 'rebota por todas partes!';
      break;

    case 'FLEX':  // FLEX
      text = '¡' + user.name() + ' flexiona y se siente genial!\r\n';
      text += '¡La precisión de' + user.name() + "aumenta!\r\n"
      break;

    case 'JUICE ME': // JUICE ME
      text = '¡' + user.name() + ' le tira el COCO a ' + target.name() + '!\r\n'
      var absMp = Math.abs(mpDam);
      if(absMp > 0) {
        text += `${target.name()} recupera ${absMp} de JUGO...\r\n`
      }
      text += hpDamageText;
      break;

    case 'RALLY': // RALLY
      text = '¡' + user.name() + ' hace que todo el mundo se anime!\r\n';
      if(user.isStateAffected(7)) {text += user.name() + " se siente EXTÁTICO!!\r\n"}
      else if(user.isStateAffected(6)) {text += user.name() + " se siente FELIZ!\r\n"}
      text += "¡Todo mundo ganó ENERGÍA!\r\n"
      for(let actor of $gameParty.members()) {
        if(actor.name() === "KEL") {continue;}
        var result = actor.result();
        if(result.mpDamage >= 0) {continue;}
        var absMp = Math.abs(result.mpDamage);
        text += `${actor.name()} recuperó ${absMp} de JUGO...\r\n`
      }
      break;

    case 'SNOWBALL': // SNOWBALL
      text = '¡' + user.name() + ' lanza una BOLA DE NIEVE a\r\n';
      text += target.name() + '!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " se siente TRISTE.\r\n"}
      else {text += parseNoEffectEmotion(target.name(), "¡más TRISTE!\r\n")}
      text += hpDamageText;
      break;

    case 'TICKLE': // TICKLE
      text = user.name() + ' cosquillea a ' + target.name() + '!\r\n'
      text += `${target.name()} bajó la guardia!`
      break;

    case 'RICOCHET': // RICOCHET
     text = '¡' + user.name() + ' hace trucos con su pelota!\r\n';
     text += hpDamageText;
     break;

    case 'CURVEBALL': // CURVEBALL
     text = user.name() + ' lanza una bola curva...\r\n';
     text += '¡Le a dado de lleno a ' + target.name() + '!\r\n';
     switch($gameTemp._randomState) {
       case 6:
         if(!target._noEffectMessage) {text += '¡' + target.name() + " se siente FELIZ!\r\n"}
         else {text += parseNoEffectEmotion(target.name(), "más FELIZ!\r\n")}
         break;
      case 14:
        if(!target._noEffectMessage) {text += target.name() + " se siente ENFADADO!\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "más ENFADADO!\r\n")}
        break;
      case 10:
        if(!target._noEffectMessage) {text += target.name() + " se siente TRISTE.\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "más TRISTE!\r\n")}
        break;

     }
     text += hpDamageText;
     break;

    case 'MEGAPHONE': // MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = '¡' + user.name() + ' irrita a todos!\r\n';}
      if(target.isStateAffected(16)) {text += '¡¡¡' + target.name() + ' se siente FURIOSO!!!\r\n'}
      else if(target.isStateAffected(15)) {text += '¡¡' + target.name() + ' se siente ENFURECIDO!!\r\n'}
      else if(target.isStateAffected(14)) {text += '¡' + target.name() + ' se siente ENFADADO!\r\n'}
      break;

    case 'DODGE ATTACK': // DODGE ATAQUE
      text = '¡' + user.name() + ' se prepara para esquivar!';
      break;

    case 'DODGE ANNOY': // DODGE ANNOY
      text = '¡' + user.name() + ' comienza a burlarse de los enemigos!';
      break;

    case 'DODGE TAUNT': // DODGE TAUNT
      text = '¡' + user.name() + ' comienza a provocar de los enemigos!\r\n';
      text += "¡El índice de impacto los enemigos cayó durante un turno!"
      break;

    case 'PASS OMORI':  // KEL PASS OMORI
      text = 'OMORI no estaba mirando y le dio de lleno...\r\n';
      text += 'OMORI recibió 1 de daño!';
      break;

    case 'PASS OMORI 2': //KEL PASS OMORI 2
      text = '¡OMORI atrapa el balón de KEL!\r\n';
      text += '¡OMORI lanza el balón a\r\n';
      text += target.name() + '!\r\n';
      var OMORI = $gameActors.actor(1);
      if(OMORI.isStateAffected(6)) {text += "¡OMORI se siente FELIZ!\r\n"}
      else if(OMORI.isStateAffected(7)) {text += "¡¡OMORI se siente EXTÁTICO!!\r\n"}
      text += hpDamageText;
      break;

    case 'PASS AUBREY':  // KEL PASS AUBREY
      text = '¡AUBREY manda a tomar por saco el balón!\r\n';
      text += hpDamageText;
      break;

    case 'PASS HERO':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {text = '¡' + user.name() + ' le da a todos los enemigos!\r\n';}
      text += hpDamageText;
      break;

    case 'PASS HERO 2':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {
        text = '¡' + user.name() + ' acaba con sus enemigos con estilo!\r\n';
        text += "¡Bajo el ATAQUE a todos los enemigos!\r\n";
      }
      text += hpDamageText;
      break;

    //HERO//
    case 'MASSAGE':  // MASSAGE
      text = user.name() + ' da un masaje a ' + target.name() + '...\r\n';
      if(!!target.isAnyEmotionAffected(true)) {
        text += target.name() + ' se calmo.';
      }
      else {text += "No tuvo ningún efecto..."}
      break;

    case 'COOK':  // COOK
      text = '¡' + user.name() + ' hace una galleta para ' + target.name() + '!';
      break;

    case 'FAST FOOD': //FAST FOOD
      text = '¡' + user.name() + ' prepara comida rápida para ' + target.name() + '!';
      break;

    case 'JUICE': // JUICE
      text = '¡' + user.name() + ' hace un jugo para ' + target.name() + '!';
      break;

    case 'SMILE':  // SMILE
      text = '¡' + user.name() + ' sonríe a ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += '¡' + target.name() + ' bajo su ATAQUE!';}
      else {text += parseNoStateChange(target.name(), "ATAQUE", "bajó!!\r\n")}
      break;

    case 'DAZZLE':
      text = '¡' + user.name() + ' sonríe a ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += '¡' + target.name() + ' bajo su ATAQUE!\r\n';}
      else {text += parseNoStateChange(target.name(), "ATAQUE", "¡Aún así bajó!\r\n")}
      if(!target._noEffectMessage) {
        text += '¡' + target.name() + ' se siente FELIZ!';
      }
      else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!")}
      break;
    case 'TENDERIZE': // TENDERIZE
      text = user.name() + ' masajea intensamente.\r\n';
      text += target.name() + '!\r\n';
      if(!target._noStateMessage) {text += '¡' + target.name() + 'perdió DEFENSA!\r\n';}
      else {text += parseNoStateChange(target.name(), "DEFENSA", "bajó!!\r\n")}
      text += hpDamageText;
      break;

    case 'SNACK TIME':  // SNACK TIME
      text = '¡' + user.name() + ' hace galletas para todos!';
      break;

    case 'TEA TIME': // TEA TIME
      text = user.name() + ' saca un té para el descanso.\r\n';
      text += '¡' + target.name() + ` se siente refrescad${pronome2}!\r\n`;
      if(result.hpDamage < 0) {
        var absHp = Math.abs(result.hpDamage);
        text += `¡ ${target.name()} recuperó ${absHp} CORAZONES!\r\n`
      }
      if(result.mpDamage < 0) {
        var absMp = Math.abs(result.mpDamage);
        text += `¡${target.name()} recuperó ${absMp} de JUGO!\r\n`
      }
      break;

    case 'SPICY FOOD': // SPICY FOOD
      text = '¡' + user.name() + ' cocina algo de comida picante!\r\n';
      text += hpDamageText;
      break;

    case 'SINGLE TAUNT': // SINGLE TAUNT
      text = user.name() + ' llamó la atención de ' + '\r\n';
      text += 'el ' + target.name();
      break;

    case 'TAUNT':  // TAUNT
      text = user.name() + ' llamó la atención del enemigo.';
      break;

    case 'SUPER TAUNT': // SUPER TAUNT
      text = user.name() + ' llamó la atención del enemigo.\r\n';
      text += user.name() + ' se prepara para bloquear los ATAQUES enemigos.';
      break;

    case 'ENCHANT':  // ENCHANT
      text = user.name() + ' llama la atención de los enemigos\r\n';
      text += 'con una sonrisa.\r\n';
      if(!target._noEffectMessage) {text += '¡' + target.name() + " se siente FELIZ!";}
      else {text += parseNoEffectEmotion(target.name(), "¡más FELIZ!")}
      break;

    case 'MENDING': //MENDING
      text = user.name() + ' atiende a ' + target.name() + '.\r\n';
      text += '¡' + user.name() + ' es ahora el chef personal de ' + target.name() + '!';
      break;

    case 'SHARE FOOD': //SHARE FOOD
      if(target.name() !== user.name()) {
        text = user.name() + ' comparte la comida con ' + target.name() + '!'
      }
      break;

    case 'CALL OMORI':  // CALL OMORI
      text = '¡' + user.name() + ' saluda a OMORI!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(1).hp);
        if(absHp > 0) {text += `¡OMORI recupera ${absHp} CORAZONES!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(1).mp);
        if(absMp > 0) {text += `¡OMORI recupera ${absMp} de JUGO!`;}
      }
      $gameTemp._statsState = undefined;
      break;

    case 'CALL KEL':  // CALL KEL
      text = '¡' + user.name() + ' conforta a KEL!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(3).hp);
        if(absHp > 0) {text += `¡KEL recupera ${absHp} CORAZONES!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(3).mp);
        if(absMp > 0) {text += `¡KEL recupera ${absMp} de JUGO!`;}
      }
      break;

    case 'CALL AUBREY':  // CALL AUBREY
      text = '¡' + user.name() + ' anima a AUBREY!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if(absHp > 0) {text += `¡AUBREY recupera ${absHp} CORAZONES!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if(absMp > 0) {text += `¡AUBREY recupera ${absMp} de JUGO!`;}
      }
      break;


    //PLAYER//
    case 'CALM DOWN':  // PLAYER CALM DOWN
      if(item.id !== 1445) {text = user.name() + ' se calma.\r\n';} // Process if Calm Down it's not broken;
      if(Math.abs(hpDam) > 0) {text += '¡' + user.name() + ' recupera ' + Math.abs(hpDam) + ' CORAZONES!';}
      break;

    case 'FOCUS':  // PLAYER FOCUS
      text = user.name() + ' se concentra.';
      break;

    case 'PERSIST':  // PLAYER PERSIST
      text = user.name() + ' persiste.';
      break;

    case 'OVERCOME':  // PLAYER OVERCOME
      text = user.name() + ' acepta la verdad.';
      break;

  //UNIVERSAL//
    case 'FIRST AID':  // FIRST AID
      text = '¡' + user.name() + ' ayuda a  ' + target.name() + '!\r\n';
      text += '¡' + target.name() + ' recupera ' + Math.abs(target._result.hpDamage) + ' CORAZONES!';
      break;

    case 'PROTECT':  // PROTECT
      text = '¡' + user.name() + ' se encuentra frente a ' + target.name() + '!';
      break;

    case 'GAURD': // GAURD
      text = user.name() + ' se prepara para bloquear.';
      break;

  //FOREST BUNNY//
    case 'BUNNY ATTACK': // FOREST BUNNY ATAQUE
      text = user.name() + ' mordisquea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING': // BUNNY DO NOTHING
      text = user.name() + ' está saltando...';
	  text += 'por ahí!';
      break;

    case 'BE CUTE':  // BE CUTE
      text = '¡' + user.name() + ' guiña un ojo \r\n'
	  text += 'a ' + target.name() + '!\r\n';
      text += target.name() + ' perdió ATAQUE...';
      break;

    case 'SAD EYES': //SAD EYES
     text = user.name() + ' mira \r\n'
      text += 'tristemente a ' + target.name() + '...\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se siente TRISTE...';}
      else {text += parseNoEffectEmotion(target.name(), "más TRISTE!")}
      break;

  //FOREST BUNNY?//
    case 'BUNNY ATTACK2': // BUNNY? ATAQUE
      text = '¿' + user.name() + ' mordisquea a ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING2':  // BUNNY? DO NOTHING
      text = '¿' + user.name() + ' está saltando por ahí?';
      break;

    case 'BUNNY CUTE2':  // BE CUTE?
      text = '¿' + user.name() + ' parpadea \r\n'
      text += 'a ' + target.name() + '?\r\n';
      text += '¿' + target.name() + ' perdió ATAQUE?';
      break;

    case 'SAD EYES2': // SAD EYES?
     text = user.name() + ' mira \r\n'
      text += 'tristemente a ' + target.name() + '...\r\n';
      if(!target._noEffectMessage) {text += '¿' + target.name() + ' se puso TRISTE?';}
      else {text += parseNoEffectEmotion(target.name(), "más TRISTE?")}
      break;

    //SPROUT MOLE//
    case 'SPROUT ATTACK':  // SPROUT MOLE ATAQUE
      text = '¡' + user.name() + ' se topa con ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING':  // SPROUT NOTHING
      text = user.name() + ' está rodando por ahí.';
      break;

    case 'RUN AROUND':  // RUN AROUND
      text = '¡' + user.name() + ' corre por ahí!';
      break;

    case 'HAPPY RUN AROUND': //HAPPY RUN AROUND
      text = user.name() + ' corre de un lado a otro con energía!';
       break;

    //MOON BUNNY//
    case 'MOON ATTACK':  // MOON BUNNY ATAQUE
      text = user.name() + ' se lanza a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MOON NOTHING':  // MOON BUNNY NOTHING
      text = user.name() + ' se está espaciando.';
      break;

    case 'BUNNY BEAM':  // BUNNY BEAM
      text = user.name() + ' dispara un láser!\r\n';
      text += hpDamageText;
      break;

    //DUST BUNNY//
    case 'DUST NOTHING':  // DUST NOTHING
      text = user.name() + ' está intentando\r\n';
      text += ' mantenerse controlado.';
      break;

    case 'DUST SCATTER':  // DUST SCATTER
      text = user.name() + ' explota!';
      break;

    //U.F.O//
    case 'UFO ATTACK':  // UFO ATAQUE
      text = user.name() + ' se estrella contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'UFO NOTHING':  // UFO NOTHING
      text = user.name() + ' está perdiendo interés.';
      break;

    case 'STRANGE BEAM':  // STRANGE BEAM
      text = user.name() + ' se enciende una luz extraña!\r\n';
      text += target.name() + " siente una rara EMOCIÓN!"
      break;

    case 'ORANGE BEAM':  // ORANGE BEAM
      text = user.name() + ' dispara un láser naranja.\r\n';
      text += hpDamageText;
      break;

    //VENUS FLYTRAP//
    case 'FLYTRAP ATTACK':  // FLYTRAP ATAQUE
      text = user.name() + ' golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FLYTRAP NOTHING':  // FLYTRAP NOTHING
      text = user.name() + ' está atrayendote.';
      break;

    case 'FLYTRAP CRUNCH':  // FLYTRAP
      text = user.name() + ' muerde a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //WORMHOLE//
    case 'WORM ATTACK':  // WORM ATAQUE
      text = user.name() + ' abofetea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'WORM NOTHING':  // WORM NOTHING
      text = user.name() + ' se contonea...';
      break;

    case 'OPEN WORMHOLE':  // OPEN WORMHOLE
      text = user.name() + ' abre un agujero de gusano!';
      break;

    //MIXTAPE//
    case 'MIXTAPE ATTACK':  // MIXTAPE ATAQUE
      text = user.name() + ' abofetea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MIXTAPE NOTHING':  // MIXTAPE NOTHING
      text = user.name() + ' se está desenredando.';
      break;

    case 'TANGLE':  // TANGLE
      text = target.name() + ' se atascó en ' + user.name() + '!\r\n';
      text += target.name() + ' perdió mucha VELOCIDAD...';
      break;

    //DIAL-UP//
    case 'DIAL ATTACK':  // DIAL ATTACK
      text = user.name() + ' es lento.\r\n';
      text += `${target.name()} se lastima en la frustración!\r\n`;
      text += hpDamageText;
      break;

    case 'DIAL NOTHING':  // DIAL NOTHING
      text = user.name() + ' está cargando...';
      break;

    case 'DIAL SLOW':  // DIAL SLOW
      text = user.name() + ' se raleeeeeeeeentiza.\r\n';
      text += 'La VELOCIDAD de todos cayó...';
      break;

    //DOOMBOX//
    case 'DOOM ATTACK':  // DOOM ATAQUE
      text = user.name() + ' choca con ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOOM NOTHING':  // DOOM NOTHING
      text = user.name() + ' está ajustando la radio.';
      break;

    case 'BLAST MUSIC':  // BLAST MUSIC
      text = user.name() + ' deja caer algunos ritmos enfermos!';
      break;

 //SHARKPLANE//
    case 'SHARK ATTACK':  // SHARK PLANE
      text = user.name() + ' embiste a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK NOTHING':  // SHARK NOTHING
      text = user.name() + ' hurga sus dientes.';
      break;

    case 'OVERCLOCK ENGINE':  // OVERCLOCK ENGINE
      text = user.name() + ' acelera su motor.\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' ganó VELOCIDAD!';
      }
      else {text += parseNoStateChange(user.name(), "VELOCIDAD ", "más!")}
      break;

    case 'SHARK CRUNCH':  // SHARK
        text = user.name() + ' masticó a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

    //SNOW BUNNY//
    case 'SNOW BUNNY ATTACK':  // SNOW ATAQUE
      text = user.name() + ' empujó nieve a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW NOTHING':  // SNOW NOTHING
      text = user.name() + ' se está relajando.';
      break;

    case 'SMALL SNOWSTORM':  // SMALL SNOWSTORM
      text = user.name() + ' empuja la nieve a todo el mundo,\r\n';
      text += '¡provocando la tormenta de nieve más pequeña del mundo!';
      break;

    //SNOW ANGEL//
    case 'SNOW ANGEL ATTACK': //SNOW ANGEL ATAQUE
      text = user.name() + ' toca a ' + target.name() + '\r\n';
      text += 'con sus manos frías.\r\n';
      text += hpDamageText;
      break;

    case 'UPLIFTING HYMN': //UPLIFTING HYMN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta una hermosa canción...\r\n';
        text += 'Todo el mundo se siente FELIZ!';
      }
      target._noEffectMessage = undefined;
      break;

    case 'PIERCE HEART': //PIERCE HEART
      text = user.name() + ' perfora el CORAZÓN de ' + target.name() + '\r\n';
      text += hpDamageText;
      break;

    //SNOW PILE//
    case 'SNOW PILE ATTACK': //SNOW PILE ATAQUE
      text = user.name() + ' lanza la nieve a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW PILE NOTHING': //SNOW PILE NOTHING
      text = user.name() + ' se siente helado.';
      break;

    case 'SNOW PILE ENGULF': //SNOW PILE ENGULF
      text = user.name() + ' engulle a ' + target.name() + ' en la nieve!\r\n';
      text += user.name() + ' perdió VELOCIDAD.\r\n';
      text += user.name() + ' y su defensa cayó.';
      break;

    case 'SNOW PILE MORE SNOW': //SNOW PILE MORE SNOW
      text = user.name() + ' se amontona la nieve sobre sí misma!\r\n';
      text += user.name() + ' el ATAQUE subió!\r\n';
      text += user.name() + ' el DEFENSA subió!';
      break;

    //CUPCAKE BUNNY//
    case 'CCB ATTACK': //CUP CAKE BUNNY ATAQUE
      text = user.name() + ' choca con ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CCB NOTHING': //CUP CAKE BUNNY NOTHING
      text = user.name() + ' salta en su lugar.';
      break;

    case 'CCB SPRINKLES': //CUP CAKE BUNNY SPRINKLES
      text = user.name() + ' cubre a ' + target.name() + '\r\n';
      text += 'de chispas.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se siente FELIZ!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!\r\n")}
      text += target.name() + "se aumentaron todas las estadísticas"
      break;

    //MILKSHAKE BUNNY//
    case 'MSB ATTACK': //MILKSHAKE BUNNY ATAQUE
      text = user.name() + ' derrama el batido sobre ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'MSB NOTHING': //MILKSHAKE BUNNY NOTHING
      text = user.name() + ' gira en círculos.';
      break;

    case 'MSB SHAKE': //MILKSHAKE BUNNY SHAKE
      text = user.name() + ' empieza a temblar FURIOSOSAMENTE!\r\n';
      text += '¡Los batidos vuelan por todas partes!';
      break;

    //PANCAKE BUNNY//
    case 'PAN ATTACK': //PANCAKE BUNNY ATAQUE
      text = user.name() + ' mordisquea a  ' + target.name() + '.\r\n';
      text += hpDamageText;
	   break;

    case 'PAN NOTHING': //PANCAKE BUNNY NOTHING
      text = user.name() + ' hace una voltereta!\r\n';
      text += '¡Qué talento!';
      break;

    //STRAWBERRY SHORT SNAKE//
    case 'SSS ATTACK': //STRAWBERRY SHORT SNAKE ATTACK
      text = user.name() + ' hunde sus colmillos en ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SSS NOTHING': //STRAWBERRY SHORT SNAKE NOTHING
      text = user.name() + ' silba.';
      break;

    case 'SSS SLITHER': //STRAWBERRY SHORT SNAKE SLITHER
      text = user.name() + ' se desliza alegremente.\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se siente FELIZ!';}
      else {text += parseNoEffectEmotion(user.name(), "¡MÁS FELIZ!")}
      break;

    //PORCUPIE//
    case 'PORCUPIE ATTACK': //PORCUPIE ATTACK
      text = user.name() + ' se asoma ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PORCUPIE NOTHING': //PORCUPIE NOTHING
      text = user.name() + ' olfatea.';
      break;

    case 'PORCUPIE PIERCE': //PORCUPIE PIERCE
      text = user.name() + ' empaliza ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //BUN BUNNY//
    case 'BUN ATTACK': //BUN ATTACK
      text = user.name() + ' golpea conejos con ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUN NOTHING': //BUN NOTHING
      text = user.name() + ' está holgazaneando.';
      break;

    case 'BUN HIDE': //BUN HIDE
      text = user.name() + ' se esconde en su bollo.';
      break;

    //TOASTY//
    case 'TOASTY ATTACK': //TOASTY ATTACK
      text = user.name() + ' carga contra ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'TOASTY NOTHING': //TOASTY NOTHING
      text = user.name() + ' se hurga la nariz.';
      break;

    case 'TOASTY RILE': //TOASTY RILE
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' da un discurso polémico!\r\n';
        text += '¡Todo el mundo se siente ENOFADADO!';
      }
      target._noEffectMessage = undefined;
      break;

    //SOURDOUGH//
    case 'SOUR ATTACK': //SOURDOUGH ATTACK
      text = user.name() + ' pisa a ' + target.name() + 'el dedo del pie!\r\n';
      text += hpDamageText;
      break;

    case 'SOUR NOTHING': //SOURDOUGH NOTHING
      text = user.name() + ' da una patada a la tierra.';
      break;

    case 'SOUR BAD WORD': //SOURDOUGH BAD WORD
      text = '¡Oh no ' + user.name() + ' dijo una mala palabra!\r\n';
      text += hpDamageText;
      break;

    //SESAME//
    case 'SESAME ATTACK': //SESAME ATTACK
      text = user.name() + ' lanza semillas a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SESAME NOTHING': //SESAME Nothing
      text = user.name() + ' se rasca la cabeza.';
      break;

    case 'SESAME ROLL': //SESAME BREAD ROLL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' pasa por encima de todos!\r\n';
      }
      text += hpDamageText;
      break;

    //CREEPY PASTA//
    case 'CREEPY ATTACK': //CREEPY ATTACK
      text = user.name() + ' intimida a ' + target.name() + '.\r\n';
      text += 'incomodandole.\r\n';
      text += hpDamageText;
      break;

    case 'CREEPY NOTHING': //CREEPY NOTHING
      text = user.name() + ' no hace nada... ¡Aterrador!';
      break;

    case 'CREEPY SCARE': //CREEPY SCARE
      text = user.name() + ' muestra a todos sus peores\r\n';
      text += 'pesadillas!';
      break;

    //COPY PASTA//
    case 'COPY ATTACK': //COPY ATTACK
      text = user.name() + ' le da un golpe a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DUPLICATE': //DUPLICATE
      text = user.name() + ' se copia a sí mismo! ';
      break;

    //HUSH PUPPY//
    case 'HUSH ATTACK': //HUSH ATTACK
      text = user.name() + ' embiste a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HUSH NOTHING': //HUSH NOTHING
      text = user.name() + ' trata de ladrar...\r\n';
      text += 'Pero no pasó nada...';
      break;

    case 'MUFFLED SCREAMS': //MUFFLED SCREAMS
      text = user.name() + ' empieza a gritar!\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI") {
        text += target.name() + ' se siente ATERRORIZADO';
      }
      else {text += parseNoEffectEmotion(target.name(), "ATERRORIZADO")}
      break;

    //GINGER DEAD MAN//
    case 'GINGER DEAD ATTACK': //GINGER DEAD MAN ATTACK
      text = user.name() + ' apuñala a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GINGER DEAD NOTHING': //GINGER DEAD MAN DO NOTHING
      text = user.name() + ' y su cabeza se cayeron...\r\n';
      text += user.name() + ' se la puso de vuelta.';
      break;

    case 'GINGER DEAD THROW HEAD': //GINGER DEAD MAN THROW HEAD
      text = user.name() + ' tira su cabeza a \r\n';
      text +=  target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //LIVING BREAD//
    case 'LIVING BREAD ATTACK': //LIVING BREAD ATTACK
      text = user.name() + ' hace resbalar a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD NOTHING': //LIVING BREAD ATTACK
      text = user.name() + ' lentamente se acerca a \r\n';
      text += target.name() + '!';
      break;

    case 'LIVING BREAD BITE': //LIVING BREAD BITE
      text = user.name() + ' muerde a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD BAD SMELL': //LIVING BREAD BAD SMELL
      text = user.name() + ' huele mal!\r\n';
      text += target.name() + ' perdió DEFENSA!';
      break;

    //Bug Bunny//
    case 'BUG BUN ATTACK': //Bug Bun Attack
     text = user.name() + ' hace resbalar a ' + target.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'BUG BUN NOTHING': //Bug Bun Nothing
      text = user.name() + ' intenta mantener el equilibrio sobre su cabeza. ';
      break;

    case 'SUDDEN JUMP': //SUDDEN JUMP
      text = user.name() + ' embiste a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;
	  
	  //HAPPIER=MAS FELIZ

    case 'SCUTTLE': //Bug Bun Scuttle
      text = user.name() + ' corre feliz.\r\n';
      text += 'Fue muy tierno!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se siente FELIZ!';}
      else {text += parseNoEffectEmotion(user.name(), "MÁS FELIZ!")}
      break;

    //RARE BEAR//
    case 'BEAR ATTACK': //BEAR ATTACK
      text = user.name() + ' corta hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BEAR HUG': //BEAR HUG
      text = user.name() + ' abraza a ' + target.name() + '!\r\n';
      text += target.name() + ' pierde VELOCIDAD!\r\n';
      text += hpDamageText;
      break;
	  

    case 'ROAR': //ROAR
      text = user.name() + ' deja salir un gran gruñido!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se siente ENFADADO!';}
      else {text += parseNoEffectEmotion(user.name(), "MÁS ENFURECIDO!")}
      break;

    //POTTED PALM//
    case 'PALM ATTACK': //PALM ATTACK
      text = user.name() + ' golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PALM NOTHING': //PALM NOTHING
      text = user.name() + ' está en su vasija. ';
      break;

    case 'PALM TRIP': //PALM TRIP
      text = target.name() + ' se tropieza con ' + user.name() + '!\r\n';
      text += hpDamageText + '.\r\n';
      text += target.name() + ' perdió VELOCIDAD.';
      break;

    case 'PALM EXPLOSION': //PALM EXPLOSION
      text = user.name() + ' explota!';
      break;

    //SPIDER CAT//
    case  'SPIDER ATTACK': //SPIDER ATTACK
      text = user.name() + ' muerde a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPIDER NOTHING': //SPIDER NOTHING
      text = user.name() + ' tose una bola de telaraña.';
      break;

    case 'SPIN WEB': //SPIN WEB
       text = user.name() + ' dispara telarañas a ' + target.name() + '!\r\n';
       text += target.name() + ' perdió VELOCIDAD.';
       break;

    //SPROUT MOLE?//
    case 'SPROUT ATTACK 2':  // SPROUT MOLE? ATTACK
      text = user.name() + ' abofetea a ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING 2':  // SPROUT MOLE? NOTHING
      text = user.name() + ' esta rodando por el lugar?';
      break;

    case 'SPROUT RUN AROUND 2':  // SPROUT MOLE? RUN AROUND
      text = user.name() + ' corretea por los alrededores?';
      break;

    //HAROLD//
    case 'HAROLD ATTACK': //HAROLD ATTACK
      text = user.name() + ' empuña su espada contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HAROLD NOTHING': // HAROLD NOTHING
      text = user.name() + ' ajusta su casco.';
      break;

    case 'HAROLD PROTECT': // HAROLD PROTECT
      text = user.name() + ' se protege a si mismo.';
      break;

    case 'HAROLD WINK': //HAROLD WINK
      text = user.name() + ' guiña a ' + target.name() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se suente FELIZ!';}
      else {text += parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
      break;

    //MARSHA//
    case 'MARSHA ATTACK': //MARSHA ATTACK
      text = user.name() + ' empuña su hacha contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA NOTHING': //MARSHA NOTHING
      text = user.name() + ' se cae. ';
      break;

    case 'MARSHA SPIN': //MARSHA NOTHING
      text = user.name() + ' empieza a dar vueltas a la velocidad de la marcha!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA CHOP': //MARSHA CHOP
      text = user.name() + ' golpea su arma contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //THERESE//
    case 'THERESE ATTACK': //THERESE ATTACK
      text = user.name() + ' tira una flecha hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE NOTHING': //THERESE NOTHING
      text = user.name() + ' deja caer una flecha.';
      break;

    case 'THERESE SNIPE': //THERESE SNIPE
      text = user.name() + ' apunta al punto debil de ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE INSULT': //THERESE INSULT
      text = user.name() + ' llama a ' + target.name() + ' cabeza de chorlito!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se siente ENFADADO!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "MÁS ENFADADO!\r\n")}
      text += hpDamageText;
      break;

    case 'DOUBLE SHOT': //THERESE DOUBLE SHOT
      text = user.name() + ' tira dos flechas al mismo tiempo!';
      break;

    //LUSCIOUS//
    case 'LUSCIOUS ATTACK': //LUSCIOUS ATTACK
      text = user.name() + ' intenta decir un encantamiento...\r\n';
      text += user.name() + ' hizo algo magico aparecer!\r\n';
      text += hpDamageText;
      break;

    case 'LUSCIOUS NOTHING': //LUSCIOUS NOTHING
      text = user.name() + ' intenta decir un encantamiento...\r\n';
      text += 'Pero nada sucede...';
      break;

    case 'FIRE MAGIC': //FIRE MAGIC
      text = user.name() + ' intenta decir un encantamiento...\r\n';
      text += user.name() + ' prende a su equipo en fuego!\r\n';
      text += hpDamageText;
      break;

    case 'MISFIRE MAGIC': //MISFIRE MAGIC
      text = user.name() + ' intenta decir un encantamiento...\r\n';
      text += user.name() + ' prende la habitación en fuego!!!\r\n';
      text += hpDamageText;
      break;

    //HORSE HEAD//
    case 'HORSE HEAD ATTACK': //HORSE HEAD ATTACK
      text = user.name() + ' muerde a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'HORSE HEAD NOTHING': //HORSE HEAD NOTHING
      text = user.name() + ' eructa.';
      break;

    case 'HORSE HEAD LICK': //HORSE HEAD LICK
     text = user.name() + ' lame el pelo de ' + target.name() + '.\r\n';
     text += hpDamageText + '\r\n';
     if(!target._noEffectMessage) {text += target.name() + ' se siente ENFADADO!';}
     else {text += parseNoEffectEmotion(target.name(), "MÁS ENFADADO!")}
     break;

    case 'HORSE HEAD WHINNY': //HORSE HEAD WHINNY
      text = user.name() + ' relincha felizmente!';
      break;

    //HORSE BUTT//
    case 'HORSE BUTT ATTACK': //HORSE BUTT ATTACK
      text = user.name() + ' pisotea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT NOTHING': //HORSE BUTT NOTHING
      text = user.name() + ' se tira un pedo.';
      break;

    case 'HORSE BUTT KICK': //HORSE BUTT KICK
      text = user.name() + ' patea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT PRANCE': //HORSE BUTT PRANCE
      text = user.name() + ' brinca alrededor.';
      break;

    //FISH BUNNY//
    case 'FISH BUNNY ATTACK': //FISH BUNNY ATTACK
      text = user.name() + ' nada hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FISH BUNNY NOTHING': //FISH BUNNY NOTHING
      text = user.name() + ' nada en circulos. ';
      break;

    case 'SCHOOLING': //SCHOOLING
      text = user.name() + ' llama a sus amigos! ';
      break;

    //MAFIA ALLIGATOR//
    case 'MAFIA ATTACK': //MAFIA ATTACK
      text = user.name() + ' da un golpe de karate a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA NOTHING': //MAFIA NOTHING
      text = user.name() + ' hace sonar sus nudillos.';
      break;

    case 'MAFIA ROUGH UP': //MAFIA ROUGH UP
      text = user.name() + ' se pone rudo contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA BACK UP': //MAFIA ALLIGATOR BACKUP
      text = user.name() + ' llama a respaldos!';
      break;

    //MUSSEL//
    case 'MUSSEL ATTACK': //MUSSEL ATTACK
      text = user.name() + ' golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MUSSEL FLEX': //MUSSEL FLEX
     text = user.name() + ' flexiona y se siente genial!\r\n';
     text += user.name() + " ganó PRECISIÓN!\r\n"
     break;

    case 'MUSSEL HIDE': //MUSSEL HIDE
     text = user.name() + ' se esconde en su caparazón.';
     break;

    //REVERSE MERMAID//
    case 'REVERSE ATTACK': //REVERSE ATTACK
     text = target.name() + ' se choca con ' + user.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'REVERSE NOTHING': //REVERSE NOTHING
     text = user.name() + ' hace una voltereta!\r\n';
     text += 'WOW!';
     break;

    case 'REVERSE RUN AROUND': //REVERSE RUN AROUND
      text = 'Todos huyen de ' + user.name() + ',\r\n';
      text += 'pero se encontrais con el de todas formas...\r\n';
      text += hpDamageText;
      break;

    //SHARK FIN//
    case 'SHARK FIN ATTACK': //SHARK FIN ATTACK
      text = user.name() + ' se tira contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK FIN NOTHING': //SHARK FIN NOTHING
      text = user.name() + ' nada en circulos.';
      break;

    case 'SHARK FIN BITE': //SHARK FIN BITE
      text = user.name() + ' mordisquea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK WORK UP': //SHARK FIN WORK UP
      text = user.name() + ' se agranda a si mismo!\r\n';
      text += user.name() + ' ganó VELOCIDAD!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' se siente ENFADADO!';
      }
      else {text += parseNoEffectEmotion(user.name(), "MÁS ENFADADO!")}
      break;

    //ANGLER FISH//
    case 'ANGLER ATTACK': //ANGLER FISH ATTACK
      text = user.name() + ' muerde a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGLER NOTHING': //ANGLER FISH NOTHING
      text = user.name() + ' tiene hambre y gruñe su estomago.';
      break;

    case 'ANGLER LIGHT OFF': //ANGLER FISH LIGHT OFF
      text = user.name() + ' apaga su luz.\r\n';
      text += user.name() + ' se desaparece en la oscuridad.';
      break;

    case 'ANGLER BRIGHT LIGHT': //ANGLER FISH BRIGHT LIGHT
      text = 'Todos ven sus vidas pasar\r\n';
      text += 'ante sus ojos!';
      break;

    case 'ANGLER CRUNCH': //ANGLER FISH CRUNCH
      text = user.name() + ' atraviesa a ' + target.name() + ' con sus dientes!\r\n';
      text += hpDamageText;
      break;

    //SLIME BUNNY//
    case 'SLIME BUN ATTACK': //SLIME BUNNY ATTACK
      text = user.name() + ' se acaricia contra ' + target.name() +'.\r\n';
      text += hpDamageText;
      break;

    case 'SLIME BUN NOTHING': //SLIME BUN NOTHING
      text = user.name() + ' sonríe a todos.\r\n';
      break;

    case 'SLIME BUN STICKY': //SLIME BUN STICKY
      text = user.name() + ' se siente solo y llora.\r\n';
      if(!target._noStateMessage) {text += target.name() + 'pierde VELOCIDAD!\r\n';}
      else {text += parseNoStateChange(target.name(), "VELOCIDAD", "aun más!\r\n")}
      text += target.name() + " se siente TRISTE.";
      break;

    //WATERMELON MIMIC//
    case 'WATERMELON RUBBER BAND': //WATERMELON MIMIC RUBBER BAND
      text = user.name() + ' lanza una BANDA DE GOMA!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON JACKS': //WATERMELON MIMIC JACKS
      text = user.name() + ' tira JACKS por todo el lugar!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON DYNAMITE': //WATERMELON MIMIC DYNAMITE
      text = user.name() + ' lanza DINAMITA!\r\n';
      text += 'OH NO!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON WATERMELON SLICE': //WATERMELON MIMIC WATERMELON SLICE
      text = user.name() + ' tira JUGO DE SANDÍA!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON GRAPES': //WATERMELON MIMIC GRAPES
      text = user.name() + ' tira JUGO DE UVA!\r\n';
      text += hpDamageText;
      break;

    case 'WATEMELON FRENCH FRIES': //WATERMELON MIMIC FRENCH FRIES
      text = user.name() + ' tira PAPAS FRITAS!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON CONFETTI': //WATERMELON MIMIC CONFETTI
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' tira CONFETI!\r\n';
        text += "Todos se sienten FELICES!"
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON RAIN CLOUD': //WATERMELON MIMIC RAIN CLOUD
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' invoca una NUBE DE LLUVIA!\r\n';
        text += "Todos se sienten TRISTES."
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON AIR HORN': //WATERMELON MIMIC AIR HORN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' usa una BOCINA DE AIRE!\r\n';
        text += "Todo el mundo está ENFADADO!"
      }
      target._noEffectMessage = undefined;
      break;

    //SQUIZZARD//
    case 'SQUIZZARD ATTACK': //SQUIZZARD ATTACK
      text = user.name() + ' usa magia en ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SQUIZZARD NOTHING': //SQUIZZARD NOTHING
      text = user.name() + ' dice tonterías.';
      break;

    case 'SQUID WARD': //SQUID WARD
      text = user.name() + ' crea un calamardo pupilo.\r\n';
      text += target.name() + ' ganó DEFENSA.';
      break;

    case  'SQUID MAGIC': //SQUID MAGIC
      text = user.name() +  ' hace encantos magicos de calamar!\r\n';
      text += 'Todos se comienzan a sentir raro...';
      break;

    //WORM-BOT//
    case 'BOT ATTACK': //MECHA WORM ATTACK
      text = user.name() + ' se lanza sobre ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT NOTHING': //MECHA WORM NOTHING
      text = user.name() + ' mordisquea fuerte!';
      break;

    case 'BOT LASER': //MECHA WORM CRUNCH
      text = user.name() + ' arremete contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT FEED': //MECHA WORM FEED
      text = user.name() + ' come a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;


    //SNOT BUBBLE//
    case 'SNOT INFLATE': //SNOT INFLATE
      text = user.name() + ' se le infla el moco!\r\n';
      text += target.name() + ' ganó ATAQUE!';
      break;

    case 'SNOT POP': //SNOT POP
      text = user.name() + ' explota!\r\n';
      text += 'El moco vuela hacia todos lados!!\r\n';
      text += hpDamageText;
      break;

    //LAB RAT//
    case  'LAB ATTACK': //LAB RAT ATTACK
      text = user.name() + ' dispara un laser!\r\n';
      text += hpDamageText;
      break;

    case  'LAB NOTHING': //LAB RAT NOTHING
      text = user.name() + ' deja salir un poco de vapor.';
      break;

    case  'LAB HAPPY GAS': //LAB RAT HAPPY GAS
      text = user.name() + ' deja salir gas FELIZ!\r\n';
      text += 'Todos se sienten FELICES!';
      target._noEffectMessage = undefined;
      break;

    case  'LAB SCURRY': //LAB RAT SCURRY
      text = user.name() + ' corre alrededor!\r\n';
      break;

    //MECHA MOLE//
    case 'MECHA MOLE ATTACK': //MECHA MOLE ATTACK
      text = user.name() + ' arremete contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MECHA MOLE NOTHING': //MECHA MOLE NOTHING
      text = user.name() + 'le brilla un poco el ojo.';
      break;

    case 'MECHA MOLE EXPLODE': //MECHA MOLE EXPLODE
      text = user.name() + ' se le cae una unica lagrima.\r\n';
      text += user.name() + ' explota gloriosamente!';
      break;

    case 'MECHA MOLE STRANGE LASER': //MECHA MOLE STRANGE LASER
      text = user.name() + ' le emite una extraña luz \r\n';
      text += 'desde su ojo. ' + target.name() + ' se sintió raro.';
      break;

    case 'MECHA MOLE JET PACK': //MECHA MOLE JET PACK
      text = 'Un jet pack apareció sobre ' + user.name() + '!\r\n';
      text += user.name() + ' voló en medio de todos!';
      break;

    //CHIMERA CHICKEN//
    case 'CHICKEN RUN AWAY': //CHIMERA CHICKEN RUN AWAY
      text = user.name() + ' huye.';
      break;

    case 'CHICKEN NOTHING': //CHICKEN DO NOTHING
      text = user.name() + ' cloqueó. ';
      break;

    //SALLI//
    case 'SALLI ATTACK': //SALLI ATTACK
      text = user.name() + ' corre hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SALLI NOTHING': //SALLI NOTHING
      text = user.name() + ' hizo una voltereta!';
      break;

    case 'SALLI SPEED UP': //SALLI SPEED UP
      text = user.name() + ' se acelera alrededor de la habitación!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' ganó VELOCIDAD!';
      }
      else {text += parseNoStateChange(user.name(), "VELOCIDAD", "aun más!")}
      break;

    case 'SALLI DODGE ANNOY': //SALLI STARE
      text = user.name() + ' comienza a enfocarse intensamente! ';
      break;

    //CINDI//
    case 'CINDI ATTACK': //CINDI ATTACK
      text = user.name() + ' golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI NOTHING': //CINDI NOTHING
      text = user.name() + ' gira en un circulo.';
      break;

    case 'CINDI SLAM': //CINDI SLAM
      text = user.name() + ' abofetea su brazo contra ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI COUNTER ATTACK': //CINDI COUNTER ATTACK
      text = user.name() + ' se preparan!';
      break;

    //DOROTHI//
    case 'DOROTHI ATTACK': //DOROTHI ATTACK
      text = user.name() + ' pisotea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI NOTHING': //DOROTHI NOTHING
      text = user.name() + ' llora hacia la oscuridad.';
      break;

    case 'DOROTHI KICK': //DOROTHI KICK
      text = user.name() + ' patea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI HAPPY': //DOROTHI HAPPY
      text = user.name() + ' trota alrededor!';
      break;

    //NANCI//
    case 'NANCI ATTACK': //NANCI ATTACK
      text = user.name() + ' apuñala sus garras en ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'NANCI NOTHING': //NANCI NOTHING
      text = user.name() + ' se desliza hacia adelante y hacia atras.';
      break;

    case 'NANCI ANGRY': //NANCI ANGRY
      text = user.name() + ' empieza a hervir!';
      break;

    //MERCI//
    case 'MERCI ATTACK': //MERCI ATTACK
      text = user.name() + ' toca el pecho de ' + target.name() + '.\r\n';
      text += target.name() + ' siente sus organos siendo desgarrados!\r\n';
      text += hpDamageText;
      break;

    case 'MERCI NOTHING': //MERCI NOTHING
      text = user.name() + ' sonrie misteriosamente.';
      break;

    case 'MERCI MELODY': //MERCI LAUGH
      text = user.name() + ' canta una canción.\r\n';
      text += target.name() + ' escucha una melodia familiar.\r\n';
      if(target.isStateAffected(6)) {text += target.name() + " se siente FELIZ!\r\n"}
      else if(target.isStateAffected(7)) {text += target.name() + " se siente EXTÁTICO!!\r\n"}
      else if(target.isStateAffected(8)) {text += target.name() + " se siente MANÍACO!!!\r\n"}
      break;

    case 'MERCI SCREAM': //MERCI SCREAM
      text = user.name() + ' hace un chillido horrible!\r\n';
      text += hpDamageText;
      break;


    //LILI//
    case 'LILI ATTACK': //LILI ATTACK
      text = user.name() + ' mira dentro del alma de ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LILI NOTHING': //LILI NOTHING
      text = user.name() + ' guiña.';
      break;

    case 'LILI MULTIPLY': //LILI MULTIPLY
      text = user.name() + 'se le caen los ojos!\r\n';
      text += 'The eye grew into another ' + user.name() + '!';
      break;

    case 'LILI CRY': //LILI CRY
      text = 'Los ojos de ' + user.name() + ' se llenan de lagrimas.\r\n';
      text += target.name() + " se siente TRISTE."
      break;

    case 'LILI SAD EYES': //LILI SAD EYES
      text = target.name() + ' vió tristeza en los ojos de ' + user.name() + '.\r\n';
      text += target.name() + ' ya no se anima a atacar a ' + user.name(); + '.\r\n'
      break;

    //HOUSEFLY//
    case 'HOUSEFLY ATTACK': //HOUSEFLY ATTACK
      text = user.name() + ' aterrizo sobre la cara de ' + target.name() + '.\r\n';
      text += target.name() + ' se abofetea a si mismo en la cara!\r\n';
      text += hpDamageText;
      break;

    case 'HOUSEFLY NOTHING': //HOUSEFLY NOTHING
      text = user.name() + ' zumba alrededor rapidamente!';
      break;

    case 'HOUSEFLY ANNOY': //HOUSEFLY ANNOY
      text = user.name() + ' zumba en la oreja de ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se siente ENFADADO!';}
      else {text += parseNoEffectEmotion(target.name(), "MÁS ENFADADO!")}
      break;

    //RECYCLIST//
    case 'FLING TRASH': //FLING TRASH
      text = user.name() + ' lanza BASURA hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GATHER TRASH': //GATHER TRASH
      text = user.name() + ' encuentra BASURA en el suelo\r\n';
      text += 'y la mete en su bolsa!\r\n';
      text += hpDamageText;
      break;

    case 'RECYCLIST CALL FOR FRIENDS': //RECYCLIST CALL FOR FRIENDS
      text = user.name() + ' hizo la llamada de los RECICLANTES!!';
      break;

    //STRAY DOG//
    case 'STRAY DOG ATTACK': //STRAY DOG ATTACK
      text = user.name() + ' usa un mordisco de ataque!\r\n';
      text += hpDamageText;
      break;

    case 'STRAY DOG HOWL': //STRAY DOG HOWL
      text = user.name() + ' hace un aullido perforante!';
      break;

    //CROW//
    case 'CROW ATTACK': //CROW ATTACK
      text = user.name() + ' picotea a ' + target.name() + ' en sus ojos.\r\n';
      text += hpDamageText;
      break;

    case 'CROW GRIN': //CROW GRIN
      text = user.name() + ' tiene una grande sonrisa en su rostro.';
      break;

    case 'CROW STEAL': //CROW STEAL
      text = user.name() + ' roba algo!';
      break;

    // BEE //
    case 'BEE ATTACK': //BEE Attack
      text = user.name() + ' pica a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'BEE NOTHING': //BEE NOTHING
      text = user.name() + ' vuela alrededor rápido!';
      break;

    // GHOST BUNNY //
    case 'GHOST BUNNY ATTACK': //GHOST BUNNY ATTACK
      text = user.name() + ' pasa junto a ' + target.name() + '!\r\n';
      text += target.name() + ' se siente cansado.\r\n';
      text += mpDamageText;
      break;

    case 'GHOST BUNNY NOTHING': //GHOST BUNNY DO NOTHING
      text = user.name() + ' flota en el espacio.';
      break;

    //TOAST GHOST//
    case 'TOAST GHOST ATTACK': //TOAST GHOST ATTACK
      text = user.name() + ' pasa junto a ' + target.name() + '!\r\n';
      text += target.name() + ' se siente cansado.\r\n';
      text += hpDamageText;
      break;

    case 'TOAST GHOST NOTHING': //TOAST GHOST NOTHING
      text = user.name() + ' suena aterrador.';
      break;

    //SPROUT BUNNY//
    case 'SPROUT BUNNY ATTACK': //SPROUT BUNNY ATTACK
      text = user.name() + ' abofetea a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT BUNNY NOTHING': //SPROUT BUNNY NOTHING
      text = user.name() + ' mordisquea un poco de pasto.';
      break;

    case 'SPROUT BUNNY FEED': //SPROUT BUNNY FEED
      text = user.name() + ' alimenta a ' + target.name() + '.\r\n';
      text += `${user.name()} recupera ${Math.abs(hpDam)} CORAZONES!`
      break;

    //CELERY//
    case 'CELERY ATTACK': //CELERY ATTACK
      text = user.name() + ' embiste a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CELERY NOTHING': //CELERY NOTHING
      text = user.name() + ' se cae.';
      break;

    //CILANTRO//
    case 'CILANTRO ATTACK': //CILANTRO ATTACK
      text = user.name() + ' aporrea a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CILANTRO NOTHING': //CILANTRO DO NOTHING
      text = user.name() + ' contempla la vida.';
      break;

    case 'GARNISH': //CILANTRO GARNISH
      text = user.name() + ' se sacrifica a si mismo\r\n';
      text += 'para mejorar a ' + target.name() + '.';
      break;

    //GINGER//
    case 'GINGER ATTACK': //GINGER ATTACK
      text = user.name() + ' quiebra y ataca a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'GINGER NOTHING': //GINGER NOTHING
      text = user.name() + ' encuentra la paz interior.';
      break;

    case 'GINGER SOOTHE': //GINGER SOOTHE
      text = user.name() + ' calma a ' + target.name() + '.\r\n';
      break;

    //YE OLD MOLE//
    case 'YE OLD ROLL OVER': //MEGA SPROUT MOLE ROLL OVER
      text = user.name() + ' rueda sobre todos!';
      text += hpDamageText;
      break;

    //KITE KID//
    case 'KITE KID ATTACK':  // KITE KID ATTACK
      text = user.name() + ' tira JACKS a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE KID BRAG':  // KITE KID BRAG
      text = user.name() + ' presume la COMETA DEL CHICO!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' se siente FELIZ!';
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
      break;

    case 'REPAIR':  // REPAIR
      text = user.name() + ' pone parches a la cometa!\r\n';
      text += 'La COMETA DEL NIÑO esta como nueva!';
      break;

    //KID'S KITE//
    case 'KIDS KITE ATTACK': // KIDS KITE ATTACK
      text = user.name() + ' se sumerge hacia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE NOTHING': // KITE NOTHING
      text = user.name() + ' infla su pecho orgulloso!';
      break;

    case 'FLY 1':  // FLY 1
      text = user.name() + ' vuela muy alto!';
      break;

    case 'FLY 2':  // FLY 2
      text = user.name() + ' se desliza hacia abajo!!';
      break;

    //PLUTO//
    case 'PLUTO NOTHING':  // PLUTO NOTHING
      text = user.name() + ' hace una pose!\r\n';
      break;

    case 'PLUTO HEADBUTT':  // PLUTO HEADBUTT
      text = user.name() + ' va hacia adelante y golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PLUTO BRAG':  // PLUTO BRAG
      text = user.name() + ' presume sobre sus musculos!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' se siente FELIZ!';
      }
      else {text += parseNoEffectEmotion(user.name(), "MÁS FELIZ!")}
      break;

    case 'PLUTO EXPAND':  // PLUTO EXPAND
      text = user.name() + ' se anima a si mismo!!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' ganó más ATAQUE y DEFENSA!!\r\n';
        text += user.name() + ' perdió VELOCIDAD.';
      }
      else {
        text += parseNoStateChange(user.name(), "ATAQUE", "aun más!\r\n")
        text += parseNoStateChange(user.name(), "DEFENSA", "aun más!\r\n")
        text += parseNoStateChange(user.name(), "VELOCIDAD", "disminuyó!")
      }
      break;

    case 'EXPAND NOTHING':  // PLUTO NOTHING
      text = user.name() + ' te ha intimidado \r\n';
      text += 'con sus músculos.';
      break;

    //RIGHT ARM//
    case 'R ARM ATTACK':  // R ARM ATTACK
      text = user.name() + ' corta a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GRAB':  // GRAB
      text = user.name() + ' agarra a ' + target.name() + '!\r\n';
      text += target.name() + ' perdió VELOCIDAD.\r\n';
      text += hpDamageText;
      break;

    //LEFT ARM//
    case 'L ARM ATTACK':  // L ARM ATTACK
      text = user.name() + ' golpea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'POKE':  // POKE
      text = user.name() + ' toca a ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' se siente ENFADADO!\r\n';
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS ENFADADO!\r\n")}
      text += hpDamageText;
      break;

    //DOWNLOAD WINDOW//
    case 'DL DO NOTHING':  // DL DO NOTHING
      text = user.name() + ' está en un 99%.';
      break;

    case 'DL DO NOTHING 2':  // DL DO NOTHING 2
      text = user.name() + ' está aún en 99%...';
      break;

    case 'DOWNLOAD ATTACK':  // DOWNLOAD ATTACK
      text = user.name() + ' se choca y quema!';
      break;

    //SPACE EX-BOYFRIEND//
    case 'SXBF ATTACK':  // SXBF ATTACK
      text = user.name() + ' patea a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SXBF NOTHING':  // SXBF NOTHING
      text = user.name() + ' mira con nostalgia\r\n';
      text += 'hacia la distancia.';
      break;

    case 'ANGRY SONG':  // ANGRY SONG
      text = user.name() + ' llora intensamente!';
      break;

    case 'ANGSTY SONG':  // ANGSTY SONG
      text = user.name() + ' canta tristemente...\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' se siente TRISTE.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' se siente DEPRESIVO..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' se siente MISERABLE...';}
      break;

    case 'BIG LASER':  // BIG LASER
      text = user.name() + ' dispara su rasho lazer!\r\n';
      text += hpDamageText;
      break;

    case 'BULLET HELL':  // BULLET HELL
      text = user.name() + ' disparó su rasho lazer\r\n';
      text += ' salvajemente en desesperación!';
      break;

    case 'SXBF DESPERATE':  // SXBF NOTHING
      text = user.name() + '\r\n';
      text += 'rechina sus dientes!';
      break;

    //THE EARTH//
    case 'EARTH ATTACK':  // EARTH ATTACK
      text = user.name() + ' ataca a ' + target.name() + '!\r\n';
      text += hpDamageText
      break;

    case 'EARTH NOTHING':  // EARTH NOTHING
      text = user.name() + ' esta rotando lentamente.';
      break;

    case 'EARTH CRUEL':  // EARTH CRUEL
      text = user.name() + ' es cruel contra ' + target.name() + '!\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' se siente TRISTE.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' se siente DEPRESIVO..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' se siente MISERABLE...';}
      break;

    case 'CRUEL EPILOGUE':  // EARTH CRUEL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " es cruel con todos...\r\n";
        text += "Todos se sienten TRISTES."
      }
      break;

    case 'PROTECT THE EARTH':  // PROTECT THE EARTH
      text = user.name() + ' usa su ataque más grande!';
      break;

    //SPACE BOYFRIEND//
    case 'SBF ATTACK': //SPACE BOYFRIEND ATTACK
      text = user.name() + ' patea rápidamente a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SBF LASER': //SPACE BOYFRIEND LASER
      text = user.name() + ' dispara su rasho lazer!\r\n';
      text += hpDamageText;
      break;

    case 'SBF CALM DOWN': //SPACE BOYFRIEND CALM DOWN
      text = user.name() + ' vacía su mente\r\n';
      text += 'y remueve toda EMOCIÓN.';
      break;

    case 'SBF ANGRY SONG': //SPACE BOYFRIEND ANGRY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' se lamenta con toda su rabia!\r\n';
        text += "¡Todo el mundo está ENFADADO!\r\n";
      }
      text += hpDamageText;
      break;

    case 'SBF ANGSTY SONG': //SPACE BOYFRIEND ANGSTY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta con toda la oscuridad\r\n';
        text += 'en su alma!\r\n';
        text += "Todo el mundo se siente TRISTE.\r\n";
      }
      text += mpDamageText;
      break;

    case 'SBF JOYFUL SONG': //SPACE BOYFRIEND JOYFUL SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta con toda la alegría\r\n';
        text += "en su corazón!\r\n"
        text += "¡Todo el mundo se siente FELIZ!\r\n";
      }
      text += hpDamageText;
      break;

    //NEFARIOUS CHIP//
    case 'EVIL CHIP ATTACK': //NEFARIOUS CHIP ATTACK
      text = user.name() + ' se carga en ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EVIL CHIP NOTHING': //NEFARIOUS CHIP NOTHING
      text = user.name() + ' acaricia su malvado\r\n';
      text += 'bigote!';
      break;


    case 'EVIL LAUGH': //NEFARIOUS LAUGH
      text = user.name() + ' se ríe como el malvado\r\n';
      text += 'villano que es!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " ¡se siente FELIZ!"}
      else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!")}
      break;

    case 'EVIL COOKIES': //NEFARIOUS COOKIES
      text = user.name() + ' lanza galletas de avena a todo el mundo.\r\n';
      text += '¡Qué maldad!';
      break;

    //BISCUIT AND DOUGHIE//
    case 'BD ATTACK': //BISCUIT AND DOUGHIE ATTACK
      text = user.name() + ' ataca juntos!\r\n';
      text += hpDamageText;
      break;

    case 'BD NOTHING': //BISCUIT AND DOUGHIE NOTHING
      text = user.name() + ' olvida algo\r\n';
      text += 'en el horno!';
      break;

    case 'BD BAKE BREAD': //BISCUIT AND DOUGHIE BAKE BREAD
      text = user.name() + ' aca un poco de\r\n';
      text += 'PAN del horno!';
      break;

    case 'BD COOK': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' hace una galleta!\r\n';
      text += `${target.name()} recupera ${Math.abs(hpDam)}\r\nCORAZONES!`
      break;

    case 'BD CHEER UP': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' hacen lo posible para \r\n';
      text += 'no estar TRISTE.';
      break;

    //KING CRAWLER//
    case 'KC ATTACK': //KING CRAWLER ATTACK
      text = user.name() + ' choca con ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC NOTHING': //KING CRAWLER NOTHING
      text = user.name() + ' suelta un chillido\r\n';
      text += 'desgarrador!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + " se siente ENFADADO!";
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS ENFADADO")}
      break;

    case 'KC CONSUME': //KING CRAWLER CONSUME
      text = user.name() + ' se come un\r\n';
      text += "¡BROTE DE TIERRA.P!\r\n"
      text += `${target.name()} recupera ${Math.abs(hpDam)} CORAZONES!\r\n`;
      break;

    case 'KC RECOVER': //KING CRAWLER CONSUME
      text = `${target.name()} recupera ${Math.abs(hpDam)} CORAZONES!\r\n`;
      if(!target._noEffectMessage) {text += target.name() + " se siente FELIZ!"}
      else {text += parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
      break;

    case 'KC CRUNCH': //KING CRAWLER CRUNCH
      text = user.name() + ' mastica a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC RAM': //KING CRAWLER RAM
      text = user.name() + ' corre por la fiesta!\r\n';
      text += hpDamageText;
      break;

    //KING CARNIVORE//

    case "SWEET GAS":
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " suelta gas!\r\n";
        text += "¡Huele muy bien!\r\n";
        text += "¡Todo el mundo se siente FELIZ!";
      }
      target._noEffectMessage = undefined;
      break;

    //SPROUTMOLE LADDER//
    case 'SML NOTHING': //SPROUT MOLE LADDER NOTHING
      text = user.name() + ' se mantiene firme en su sitio. ';
      break;

    case 'SML SUMMON MOLE': //SPROUT MOLE LADDER SUMMON SPROUT MOLE
      text = 'Un BROTE DE TIERRA se sube en ' + user.name() + '!';
      break;

    case 'SML REPAIR': //SPROUT MOLE LADDER REPAIR
      text = user.name() + ' fue reparado.';
      break;

    //UGLY PLANT CREATURE//
    case 'UPC ATTACK': //UGLY PLANT CREATURE ATTACK
      text = user.name() + '  se envuelve en\r\n';
      text += target.name() + ' con las enredaderas!\r\n';
      text += hpDamageText;
      break;

    case 'UPC NOTHING': //UGLY PLANT CRATURE NOTHING
      text = user.name() + ' ruge!';
      break;

    //ROOTS//
    case 'ROOTS NOTHING': //ROOTS NOTHING
      text = user.name() + ' se contonea.';
      break;

    case 'ROOTS HEAL': //ROOTS HEAL
      text = user.name() + '  proporciona nutrientes para\r\n';
      text += target.name() + '.';
      break;

    //BANDITO MOLE//
    case 'BANDITO ATTACK': //BANDITO ATTACK
      text = user.name() + ' corta a ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BANDITO STEAL': //BANDITO STEAL
      text = user.name() + ' roba rápidamente un objeto\r\n';
      text += 'de la fiesta!'
      break;

    case 'B.E.D.': //B.E.D.
      text = '¡' + user.name() + ' saca la C.A.M.A.!\r\n';
      text += hpDamageText;
      break;

    //SIR MAXIMUS//
    case 'MAX ATTACK': //SIR MAXIMUS ATTACK
      text = user.name() + ' sacude su espada!\r\n';
      text += hpDamageText;
      break;

    case 'MAX NOTHING': //SIR MAXIMUS NOTHING
      text = user.name() + ' tiró de su espalda...\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' se siente TRISTEZA.'
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS TRISTE!")}
      break;

    case 'MAX STRIKE': //SIR MAXIMUS SWIFT STRIKE
      text = user.name() + ' ataca dos veces!';
      break;

    case 'MAX ULTIMATE ATTACK': //SIR MAXIMUS ULTIMATE ATTACK
      text = '"AHORA PARA MI ATAQUE DEFINITIVO!"';
      text += hpDamageText;
      break;

    case 'MAX SPIN': //SIR MAXIMUS SPIN
        break;

    //SIR MAXIMUS II//
    case 'MAX 2 NOTHING': //SIR MAXIMUS II NOTHING
      text = user.name() + ' recuerda\r\n';
      text += 'las últimas palabras de su padre.\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' se siente TRISTE.'
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS TRISTE.")}
      break;

    //SIR MAXIMUS III//
    case 'MAX 3 NOTHING': //SIR MAXIMUS III NOTHING
      text = user.name() + ' recuerda\r\n';
      text += 'las últimas palabras de su abuelo.\r\n';
      text += target.name() + ' se siente TRISTE.'
      break;

    //SWEETHEART//
    case 'SH ATTACK': //SWEET HEART ATTACK
      text = user.name() + ' abofetea a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SH INSULT': //SWEET HEART INSULT
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " insulta a todo el mundo!\r\n"
        text += "¡Todo el mundo está enfadado!\r\n";
      }
      text += hpDamageText;
      target._noEffectMessage = undefined;
      break;

    case 'SH SNACK': //SWEET HEART SNACK
      text = user.name() + ' ordena a un sirviente que le traiga\r\n';
      text += 'un SNACK.\r\n';
      text += hpDamageText;
      break;

    case 'SH SWING MACE': //SWEET HEART SWING MACE
      text = user.name() + ' blande su maza con fervor!\r\n';
      text += hpDamageText;
      break;

    case 'SH BRAG': //SWEET HEART BRAG
      text = user.name() + ' presume de\r\n';
      text += 'uno de sus muchos, muchos talentos!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(8)) {text += target.name() + ' se siente MANIACO!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' se siente EXTÁTICO!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' se siente FELIZ!';}
      }
      else {text += parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}

      break;

      //MR. JAWSUM //
      case 'DESK SUMMON MINION': //MR. JAWSUM DESK SUMMON MINION
        text = user.name() + ' coge el teléfono y\r\n';
        text += 'llama a un CHICO LAGARTO!';
        break;

      case 'JAWSUM ATTACK ORDER': //MR. JAWSUM DESK ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' da órdenes de ataque.\r\n';
          text += "Todo el mundo está ENFADADO.";
        }
        break;

      case 'DESK NOTHING': //MR. JAWSUM DESK DO NOTHING
        text = user.name() + ' comienza a contar sus ALMEJAS.';
        break;

      //PLUTO EXPANDED//
      case 'EXPANDED ATTACK': //PLUTO EXPANDED ATTACK
        text = user.name() + ' lanza la Luna a\r\n';
        text += target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED SUBMISSION HOLD': //PLUTO EXPANDED SUBMISSION HOLD
        text = user.name() + ' pone a ' + target.name() + '\r\n';
        text += 'en espera de sumisión!\r\n';
        text += target.name() + ' su VELOCIDAD cayó.\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED HEADBUTT': //PLUTO EXPANDED HEADBUTT
        text = user.name() + ' golpea su cabeza\r\n';
        text += 'contra ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED FLEX COUNTER': //PLUTO EXPANDED FLEX COUNTER
        text = user.name() + ' flexiona sus músculos\r\n'
        text += 'y se prepara!';
        break;

      case 'EXPANDED EXPAND FURTHER': //PLUTO EXPANDED EXPAND FURTHER
        text = user.name() + ' se expande aún más!\r\n';
        if(!target._noStateMessage) {
          text += target.name() + ' y su ATAQUE subió!\r\n';
          text += target.name() + ' y su DEFENSA subió!\r\n';
          text += target.name() + ' y su VELOCIDAD subió!';
        }
        else {
          text += parseNoStateChange(user.name(), "ATAQUE", "subió!\r\n")
          text += parseNoStateChange(user.name(), "DEFENSA", "subió!\r\n")
          text += parseNoStateChange(user.name(), "VELOCIDAD", "BAJÓ!")
        }
        break;

      case 'EXPANDED EARTH SLAM': //PLUTO EXPANDED EARTH SLAM
        text = user.name() + ' coge a la tierra\r\n';
        text += 'y la golpea contra todo el mundo!';
        break;

      case 'EXPANDED ADMIRATION': //PLUTO EXPANDED ADMIRATION
        text = user.name() + ' está admirando el progreso de KEL.\r\n';
        if(target.isStateAffected(8)) {text += target.name() + ' se siente MANICO!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' se siente EXTÁTICO!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' se siente FELIZ!';}
        break;

      //ABBI TENTACLE//
      case 'TENTACLE ATTACK': //ABBI TENTACLE ATTACK
        text = user.name() + ' golpea a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'TENTACLE TICKLE': //ABBI TENTACLE TICKLE
        text = user.name() + " debilita a " + target.name() + "!\r\n";
        text += `${target.name()} baja la guardia!`
        break;

      case 'TENTACLE GRAB': //ABBI TENTACLE GRAB
        text = user.name() + ' se envuelve en ' + target.name() + '!\r\n';
        if(result.isHit()) {
          if(target.name() !== "OMORI" && !target._noEffectMessage) {text += target.name() + " se siente ATERRORIZADO.\r\n";}
          else {text += parseNoEffectEmotion(target.name(), "ATERRORIZADO")}
        }
        text += hpDamageText;
        break;

      case 'TENTACLE GOOP': //ABBI TENTACLE GOOP
        text = target.name() + ' está empapado de líquido oscuro!\r\n';
        text += target.name() + ' se siente más débil...\r\n';
        text += target.name() + ' y su ATAQUE bajó!\r\n';
        text += target.name() + ' y su DEFENSA bajó!\r\n';
        text += target.name() + ' y su VELOCIDAD bajó!';
        break;

      //ABBI//
      case 'ABBI ATTACK': //ABBI ATTACK
        text = user.name() + ' ataca a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ABBI REVIVE TENTACLE': //ABBI REVIVE TENTACLE
        text = user.name() + ' enfoca a su CORAZÓN.';
        break;

      case 'ABBI VANISH': //ABBI VANISH
        text = user.name() + ' se desvanece en las sombras...';
        break;

      case 'ABBI ATTACK ORDER': //ABBI ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' estira sus tentáculos.\r\n';
          text += "EL ATAQUE de todo el mundo sube!!\r\n"
          text += "¡Todo el mundo está ENFADADO!"
        }
        break;

      case 'ABBI COUNTER TENTACLE': //ABBI COUNTER TENTACLES
        text = user.name() + ' se mueve entre las sombras...';
        break;

      //ROBO HEART//
      case 'ROBO HEART ATTACK': //ROBO HEART ATTACK
        text = user.name() + ' dispara se manos de cohete!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART NOTHING': //ROBO HEART NOTHING
        text = user.name() + ' se está amortiguando...';
        break;

      case 'ROBO HEART LASER': //ROBO HEART LASER
        text = user.name() + ' abre la boca y\r\n';
        text += 'dispara un láser!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART EXPLOSION': //ROBO HEART EXPLOSION
        text = user.name() + ' derrama una sola lágrima siendo un robot.\r\n';
        text += user.name() + ' explota!';
        break;

      case 'ROBO HEART SNACK': //ROBO HEART SNACK
        text = user.name() + ' abre la boca.\r\n';
        text += '¡Aparece un nutritivo SNACK!\r\n';
        text += hpDamageText;
        break;

      //MUTANT HEART//
      case 'MUTANT HEART ATTACK': //MUTANT HEART ATTACK
        text = user.name() + ' canta una canción para ' + target.name() + '!\r\n';
        text += 'No fue la mejor...\r\n';
        text += hpDamageText;
        break;

      case 'MUTANT HEART NOTHING': //MUTANT HEART NOTHING
        text = user.name() + ' posa!';
        break;

      case 'MUTANT HEART HEAL': //MUTANT HEART HEAL
        text = user.name() + ' arregla su vestido!';
        text += hpDamageText;
        break;

      case 'MUTANT HEART WINK': //MUTANT HEART WINK
        text = user.name() + ' guiña a ' + target.name() + '!\r\n';
        text += 'Fue algo lindo...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' se siente FELIZ!';}
        else {text += parseNoEffectEmotion(target.name(), "¡MÁS FELIZ!")}
        break;

      case 'MUTANT HEART INSULT': //MUTANT HEART INSULT
        text = user.name() + ' accidentalmente dice algo\r\n';
        text += 'malo.\r\n';
        if(!target._noEffectMessage){text += target.name() + ' se siente ENFADADO!';}
        else {text += parseNoEffectEmotion(target.name(), "¡MÁS ENFADADO!")}
        break;

      case 'MUTANT HEART KILL': //MUTANT HEART KILL
        text = 'MUTANTHEART abofetea a ' + user.name() +'!\r\n';
        text += hpDamageText;
        break;

        //PERFECT HEART//
        case 'PERFECT STEAL HEART': //PERFECT HEART STEAL HEART
          text = user.name() + ' roba a ' + target.name() + '\'s\r\n';
          text += 'CORAZONES.\r\n';
          text += hpDamageText + "\r\n";
          if(user.result().hpDamage < 0) {text += `${user.name()} recupera ${Math.abs(user.result().hpDamage)} CORAZONES!\r\n`}
          break;

        case 'PERFECT STEAL BREATH': //PERFECT HEART STEAL BREATH
          text = user.name() + ' roba a ' + target.name() + '\'s\r\n';
          text += 'su aliento.\r\n';
          text += mpDamageText + "\r\n";
          if(user.result().mpDamage < 0) {text += `${user.name()} recupera ${Math.abs(user.result().mpDamage)} JUGO...\r\n`}
          break;

        case 'PERFECT EXPLOIT EMOTION': //PERFECT HEART EXPLOIT EMOTION
          text = user.name() + ' explota a ' + target.name() + '\'s\r\n';
          text += 'EMOTIONS!\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT SPARE': //PERFECT SPARE
          text = user.name() + ' decide dejar a \r\n';
          text += target.name() + ' vivir.\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT ANGELIC VOICE': //UPLIFTING HYMN
          if(target.index() <= unitLowestIndex) {
            text = user.name() + ' canta una canción conmovedora...\r\n';
            if(!user._noEffectMessage) {text += user.name() + " se siente TRISTE.\r\n"}
            else {text += parseNoEffectEmotion(user.name(), "¡MÁS TRISTE!\r\n")}
            text += '¡Todo el mundo se siente FELIZ!';
          }
          break;

        case "PERFECT ANGELIC WRATH":
          if(target.index() <= unitLowestIndex) {text = user.name() + " desata su ira.\r\n";}
          if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' se siente MANIACO!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' se siente EXTÁTICO!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' se siente FELIZ!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' se siente MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' se siente DEPRESIVO..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' se siente TRISTE.\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' se siente FURIOSO!!!\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' se siente ENFURECIDO!!\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' se siente ENFADADO!\r\n';}
          }
          else {
            if(target.isEmotionAffected("feliz")) {text += parseNoEffectEmotion(target.name(), "¡MAS FELIZ!\r\n")}
            else if(target.isEmotionAffected("triste")) {text += parseNoEffectEmotion(target.name(), "¡MAS TRISTE!\r\n")}
            else if(target.isEmotionAffected("enfadado")) {text += parseNoEffectEmotion(target.name(), "¡MAS ENFADADO!\r\n")}
          }
          text += hpDamageText;
          break;

        //SLIME GIRLS//
        case 'SLIME GIRLS COMBO ATTACK': //SLIME GIRLS COMBO ATTACK
          text = 'Las ' + user.name() + ' atacan en conjunto!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS DO NOTHING': //SLIME GIRLS DO NOTHING
          text = 'MEDUSA lanza una botella...\r\n';
          text += 'Pero no pasó nada...';
          break;

        case 'SLIME GIRLS STRANGE GAS': //SLIME GIRLS STRANGE GAS
            if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' se siente MANIACO!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' se siente EXTÁTICO!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' se siente FELIZ!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' se siente MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' se siente DEPRESIVO..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' se siente TRISTE.\r\n';}
              else if(target.isStateAffected(16)) {text += target.name() + ' se siente FURIOSO!!!\r\n';}
              else if(target.isStateAffected(15)) {text += target.name() + ' se siente ENFURECIDO!!\r\n';}
              else if(target.isStateAffected(14)) {text += target.name() + ' se siente ENFADADO!\r\n';}
          }
          else {
            if(target.isEmotionAffected("feliz")) {text += parseNoEffectEmotion(target.name(), "¡MAS FELIZ!\r\n")}
            else if(target.isEmotionAffected("triste")) {text += parseNoEffectEmotion(target.name(), "¡MAS TRISTE!\r\n")}
            else if(target.isEmotionAffected("enfadado")) {text += parseNoEffectEmotion(target.name(), "¡MAS ENFADADO!\r\n")}
          }
          break;

        case 'SLIME GIRLS DYNAMITE': //SLIME GIRLS DYNAMITE
          //text = 'MEDUSA threw a bottle...\r\n';
          //text += 'And it explodes!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS STING RAY': //SLIME GIRLS STING RAY
          text = '¡MOLLY dispara sus aguijones!\r\n';
          text += target.name() + ' es golpeado!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS SWAP': //SLIME GIRLS SWAP
          text = '¡MEDUSA hace lo suyo!\r\n';
          text += '¡Tus corazones y tu jugo están cambiados!';
          break;

        case 'SLIME GIRLS CHAIN SAW': //SLIME GIRLS CHAIN SAW
          text = '¡MARINA saca una motosierra!\r\n';
          text += hpDamageText;
          break;

      //HUMPHREY SWARM//
      case 'H SWARM ATTACK': //HUMPHREY SWARM ATTACK
        text = 'HUMPHREY rodea y ataca ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY LARGE//
      case 'H LARGE ATTACK': //HUMPHREY LARGE ATTACK
        text = 'HUMPHREY se estrella contra ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY FACE//
      case 'H FACE CHOMP': //HUMPHREY FACE CHOMP
        text = 'HUMPHREY hunde sus dientes en ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'H FACE DO NOTHING': //HUMPHREY FACE DO NOTHING
        text = 'HUMPHREY mira fijamente a ' + target.name() + '!\r\n';
        text += 'A HUMPHREY se le hace la boca agua.';
        break;

      case 'H FACE HEAL': //HUMPHREY FACE HEAL
        text = '¡HUMPHREY se traga un enemigo!\r\n';
        text += `HUMPHREY recupera ${Math.abs(hpDam)} CORAZONES!`
        break;

      //HUMPHREY UVULA//
      case 'UVULA DO NOTHING 1': //HUMPHREY UVULA DO NOTHING
        text = user.name() + ' sonríe a ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 2': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' le guiña el ojo a ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 3': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' escupe a ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 4': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' mira fijamente a ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 5': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' parpadea a ' + target.name() + '.\r\n';
      break;

      //FEAR OF FALLING//
      case 'DARK NOTHING': //SOMETHING IN THE DARK NOTHING
        text = user.name() + ' se rie de ' + target.name() + '\r\n';
        text += 'mientras cae...';
        break;

      case 'DARK ATTACK': //SOMETHING IN THE DARK ATTACK
        text = user.name() + ' empuja a ' + target.name() + ' y lo tira por las escaleras...'  + '\r\n';
        text += hpDamageText;
        break;

      //FEAR OF BUGS//
      case 'BUGS ATTACK': //FEAR OF BUGS ATTACK
        text = '¡' + user.name() + ' muerde a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BUGS NOTHING': //FEAR OF BUGS NOTHING
        text = user.name() + ' está tratando de razonar contigo...';
        break;

      case 'SUMMON BABY SPIDER': //SUMMON BABY SPIDER
        text = 'Un huevo de araña sale del cascarón\r\n';
        text += 'Apareció una araña bebé.';
        break;

      case 'BUGS SPIDER WEBS': //FEAR OF BUGS SPIDER WEBS
        text = user.name() + ' enreda a ' + target.name() + '\r\n';
        text += 'en redes pegajosas...\r\n';
        text += target.name() + ' bajó su VELOCIDAD!\r\n';
        break;

      //BABY SPIDER//
      case 'BABY SPIDER ATTACK': //BABY SPIDER ATTACK
        text = '¡' + user.name() + ' muerde a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BABY SPIDER NOTHING': //BABY SPIDER NOTHING
        text = user.name() + ' hace un ruido extraño.';
        break;

      //FEAR OF DROWNING//
      case 'DROWNING ATTACK': //FEAR OF DROWNING ATTACK
        text = 'El agua arrastra a ' + target.name() + ' hasta las\r\n';
        text += 'profundidades...\r\n';
        text += hpDamageText;
        break;

      case 'DROWNING NOTHING': //FEAR OF DROWNING NOTHING
        text = user.name() + ' disfruta oirte sufrir.' + "\r\n";
        break;

      case 'DROWNING DRAG DOWN': //FEAR OF DROWNING DRAG DOWN
        // text = user.name() + ' grabs\r\n';
        // text += target.name() + '\s leg and drags him down!\r\n';
        text = hpDamageText;
        break;

      //OMORI'S SOMETHING//
      case 'O SOMETHING ATTACK': //OMORI SOMETHING ATTACK
        text = user.name() + ' te arrastra a la oscuridad...' + '\r\n';
        text += hpDamageText;
        break;

      case 'O SOMETHING NOTHING': //OMORI SOMETHING NOTHING
        text = user.name() + ' te mira fijamente.' + '\r\n';
        break;

      case 'O SOMETHING BLACK SPACE': //OMORI SOMETHING BLACK SPACE
        //text = user.name() + ' drags ' + target.name() + ' into\r\n';
        //text += 'the shadows.';
        text = hpDamageText;
        break;

      case 'O SOMETHING SUMMON': //OMORI SOMETHING SUMMON SOMETHING
        text = user.name() + ' llama algo desde\r\n';
        text += 'la oscuridad.';
        break;

      case 'O SOMETHING RANDOM EMOTION': //OMORI SOMETHING RANDOM EMOTION
        text = user.name() + ' juega con ' + target.name() +'y sus EMOCIONES.';
        break;

      //BLURRY IMAGE//
      case 'BLURRY NOTHING': //BLURRY IMAGE NOTHING
        text = 'ALGO se balancea en el viento.';
        break;

      //HANGING BODY//
      case 'HANG WARNING':
          text = 'Sientes un escalofrío que te recorre la espalda.';
          break;

      case 'HANG NOTHING 1':
          text = 'Te sientes mareado.';
          break;

      case 'HANG NOTHING 2':
          text = 'Sientes que tus pulmones se tensan.';
          break;

      case 'HANG NOTHING 3':
          text = 'Sientes una sensación de hundimiento en el\r\n';
          text += 'estómago.';
          break;

      case 'HANG NOTHING 4':
          text = 'Sientes que el corazón se te sale\r\n';
          text += 'del pecho.';
          break;

      case 'HANG NOTHING 5':
          text = 'Sientes que estás temblando.';
          break;

      case 'HANG NOTHING 6':
          text = 'Sientes que te flaquean las rodillas.';
          break;

      case 'HANG NOTHING 7':
          text = 'Sientes que el sudor te resbala por\r\n';
          text += 'la frente.';
          break;

      case 'HANG NOTHING 8':
          text = 'Sientes que tu puño se cierra por sí solo.';
          break;

      case 'HANG NOTHING 9':
          text = 'Oyes los latidos de tu corazón.';
          break;

      case 'HANG NOTHING 10':
          text = 'Oyes cómo tu corazón empieza a estabilizarse.';
          break;

      case 'HANG NOTHING 11':
          text = 'Oyes cómo tu respiración empieza a estabilizarse.';
          break;

      case 'HANG NOTHING 12':
          text = 'Te centras en lo que\r\n';
          text += 'tienes delante.';
          break;

      //AUBREY//
      case 'AUBREY NOTHING': //AUBREY NOTHING
        text = user.name() + ' escupe en tu zapato.';
        break;

      case 'AUBREY TAUNT': //AUBREY TAUNT
        text = '¡' + user.name() + ' llama a ' + target.name() + ' débil!\r\n';
        text += '¡' + target.name() + " se siente ENFADADO!";
        break;

      //THE HOOLIGANS//
      case 'CHARLIE ATTACK': //HOOLIGANS CHARLIE ATTACK
        text = '¡CHARLIE pone todo su empeño en un ataque!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL ATTACK': //HOOLIGANS ANGEL ATTACK
        text = '¡ANGEL golpea rápidamente a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK CHARM': //HOOLIGANS MAVERICK CHARM
        text = '¡EL MAVERICK guiña un ojo a ' + target.name() + '!\r\n';
        text += target.name() + 'y bajó su ATAQUE.'
        break;

      case 'KIM HEADBUTT': //HOOLIGANS KIM HEADBUTT
        text = '¡KIM le da un cabezazo a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE CANDY': //HOOLIGANS VANCE CANDY
        text = '¡VANCE lanza caramelos!\r\n';
        text += hpDamageText;
        break;

      case 'HOOLIGANS GROUP ATTACK': //THE HOOLIGANS GROUP ATTACK
        text = '¡' + user.name() + ' atacan todos a la vez!\r\n';
        text += hpDamageText;
        break;

      //BASIL//
      case 'BASIL ATTACK': //BASIL ATTACK
        text = user.name() + ' raja a ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'BASIL NOTHING': //BASIL NOTHING
        text = user.name() + ' tiene los ojos rojos de llorar.';
        break;

      case 'BASIL PREMPTIVE STRIKE': //BASIL PREMPTIVE STRIKE
        text = user.name() + ' raja a ' + target.name() +' en el brazo.\r\n';
        text += hpDamageText;
        break;

      //BASIL'S SOMETHING//
      case 'B SOMETHING ATTACK': //BASIL'S SOMETHING ATTACK
        text = user.name() + ' estrangula a ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B SOMETHING TAUNT': //BASIL'S SOMETHING TAUNT BASIL
        text = user.name() + ' raja a ' + target.name() + '.\r\n';
        break;

      //PLAYER SOMETHING BASIL FIGHT//
      case 'B PLAYER SOMETHING STRESS': //B PLAYER SOMETHING STRESS
        text = user.name() + ' no puede mas.\r\n';
        text += target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B PLAYER SOMETHING HEAL': //B PLAYER SOMETHING HEAL
        text = user.name() + ' acentua las heridas de ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B OMORI SOMETHING CONSUME EMOTION': //B OMORI SOMETHING CONSUME EMOTION
        text = user.name() + ' consume a  ' + target.name() + ' y sus EMOCIONES.';
        break;

      //CHARLIE//
      case 'CHARLIE RELUCTANT ATTACK': //CHARLIE RELUCTANT ATTACK
        text = '¡' + user.name() + ' pega a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CHARLIE NOTHING': //CHARLIE NOTHING
        text = user.name() + ' está ahí de pie.';
        break;

      case 'CHARLIE LEAVE': //CHARLIE LEAVE
        text = user.name() + ' deja de luchar.';
        break;

      //ANGEL//
      case 'ANGEL ATTACK': //ANGEL ATTACK
        text = '¡' + user.name() + ' da una rápida patada a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL NOTHING': //ANGEL NOTHING
        text = '¡' + user.name() + ' hace una voltereta y posa!';
        break;

      case 'ANGEL QUICK ATTACK': //ANGEL QUICK ATTACK
        text = '¡' + user.name() + ' se teletransporta detrás de ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL TEASE': //ANGEL TEASE
        text = '¡' + user.name() + ' habla mal de ' + target.name() + '!';
        break;

      //THE MAVERICK//
      case 'MAVERICK ATTACK': //THE MAVERICK ATTACK
        text = '¡' + user.name() + ' golpea a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK NOTHING': //THE MAVERICK NOTHING
        text = user.name() + ' empieza a presumir ante\r\n';
        text += 'sus \"fans\".';
        break;

      case 'MAVERICK SMILE': //THE MAVERICK SMILE
        text = user.name() + ' sonríe seductoramente...\r\n';
        text += target.name() + ' y bajo su ATAQUE.';
        break;

      case 'MAVERICK TAUNT': //THE MAVERICK TAUNT
        text = '¡' + user.name() + ' comienza a burlarse de\r\n';
        text += target.name() + '!\r\n';
        text += target.name() + " se siente ENFADADO!"
        break;

      //KIM//
      case 'KIM ATTACK': //KIM ATTACK
        text = '¡' + user.name() + ' golpea a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'KIM NOTHING': //KIM DO NOTHING
        text = 'El teléfono de ' + user.name() + ' sonó...\r\n';
        text += 'Era un número equivocado.';
        break;

      case 'KIM SMASH': //KIM SMASH
        text = '¡' + user.name() + ' agarra la camiseta de ' + target.name() + ' y le da un \r\n';
        text += 'puñetazo en la cara!\r\n';
        text += hpDamageText;
        break;

      case 'KIM TAUNT': //KIM TAUNT
        text = user.name() + ' comienza a burlarse de ' + target.name() + '!\r\n';
        text += target.name() + " se siente TRISTE.";
        break;

      //VANCE//
      case 'VANCE ATTACK': //VANCE ATTACK
        text = '¡' + user.name() + ' golpea a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE NOTHING': //VANCE NOTHING
        text = user.name() + ' se rasca la barriga.';
        break;

      case 'VANCE CANDY': //VANCE CANDY
        text = '¡' + user.name() + ' lanza caramelos viejos a ' + target.name() + '!\r\n';
        text += 'Ewww... Es pegajoso...\r\n';
        text += hpDamageText;
        break;

      case 'VANCE TEASE': //VANCE TEASE
        text = '¡' + user.name() + ' dice cosas malas sobre ' + target.name() + '!\r\n';
        text += target.name() + " se siente TRISTE."
        break;

      //JACKSON//
      case 'JACKSON WALK SLOWLY': //JACKSON WALK SLOWLY
        text = user.name() + ' avanza lentamente...\r\n';
        text += '¡Sientes que no puedes escapar!';
        break;

      case 'JACKSON KILL': //JACKSON AUTO KILL
        text = '¡' + user.name() + ' ¡¡TE ATRAPÓ!!!\r\n';
        text += 'Ves tu vida pasar ante tus ojos...';
        break;

      //RECYCLEPATH//
      case 'R PATH ATTACK': //RECYCLEPATH ATTACK
        text = '¡' + user.name() + ' golpea a ' + target.name() + ' con bolsas!\r\n';
        text += hpDamageText;
        break;

      case 'R PATH SUMMON MINION': //RECYCLEPATH SUMMON MINION
        text = '¡' + user.name() + ' llama a un seguidor!\r\n';
        text += '¡Apareció un RECICULTISTA!';
        break;

      case 'R PATH FLING TRASH': //RECYCLEPATH FLING TRASH
        text = '¡' + user.name() + ' lanza toda su BASURA\r\n';
        text += 'a ' + target.name() + '!\r\n'
        text += hpDamageText;
        break;

      case 'R PATH GATHER TRASH': //RECYCLEPATH GATHER TRASH
        text = '¡' + user.name() + ' recoge un poco de BASURA!';
        break;

    //SOMETHING IN THE CLOSET//
      case 'CLOSET ATTACK': //SOMETHING IN THE CLOSET ATTACK
        text = '¡' + user.name() + ' arrastra a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CLOSET NOTHING': //SOMETHING IN THE CLOSET DO NOTHING
        text = user.name() + ' murmura inquietantemente.';
        break;

      case 'CLOSET MAKE AFRAID': //SOMETHING IN THE CLOSET MAKE AFRAID
        text = user.name() + ' conoce tu secreto.';
        break;

      case 'CLOSET MAKE WEAK': //SOMETHING IN THE CLOSET MAKE WEAK
        text = user.name() + ' absorbe a ' + target.name() + ' y su voluntad de vivir';
        break;

    //BIG STRONG TREE//
      case 'BST SWAY': //BIG STRONG TREE NOTHING 1
        text = 'Una suave brisa recorre las hojas.';
        break;

      case 'BST NOTHING': //BIG STRONG TREE NOTHING 2
        text = user.name() + ' se mantiene firme\r\n';
        text += 'porque es un árbol.';
        break;

    //DREAMWORLD FEAR EXTRA BATTLES//
    //HEIGHTS//
    case 'DREAM HEIGHTS ATTACK': //DREAM FEAR OF HEIGHTS ATTACK
      text = user.name() + ' golpea a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'DREAM HEIGHTS GRAB': //DREAM FEAR OF HEIGHTS GRAB
      if(target.index() <= unitLowestIndex) {
        text = '¡Las manos aparecen y agarran a todos!\r\n';
        text += 'El ataque de todos' + ' bajo...';
      }

      break;

    case 'DREAM HEIGHTS HANDS': //DREAM FEAR OF HEIGHTS HANDS
      text = 'Aparecen más manos y rodean a\r\n';
      text += user.name() + '.\r\n';
      if(!target._noStateMessage) {text += user.name() + ' la DEFENSA se elevó!';}
      else {text += parseNoStateChange(user.name(), "DEFENSA", "¡incremento!")}
      break;

    case 'DREAM HEIGHTS SHOVE': //DREAM FEAR OF HEIGHTS SHOVE
      text = user.name() + ' empuja a ' + target.name() + '.\r\n';
      text += hpDamageText + '\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI"){text += target.name() + ' se siente ATERRORIZADO.';}
      else {text += parseNoEffectEmotion(target.name(), "ATERRORIZADO")}
      break;

    case 'DREAM HEIGHTS RELEASE ANGER': //DREAM FEAR OF HEIGHTS RELEASE ANGER
      text = user.name() + ' se ENFADA con todo el mundo.';
      break;

    //SPIDERS//
    case 'DREAM SPIDERS CONSUME': //DREAM FEAR OF SPIDERS CONSUME
      text = user.name() + ' envuelve y se come a ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    //DROWNING//
    case 'DREAM DROWNING SMALL': //DREAM FEAR OF DROWNING SMALL
      text = 'A todos les cuesta respirar...';
      break;

    case 'DREAM DROWNING BIG': //DREAM FEAR OF DROWNING BIG
      text = 'Todo el mundo tiene ganas de desmayarse...';
      break;

    // BLACK SPACE EXTRA //
    case 'BS LIAR': // BLACK SPACE LIAR
      text = 'Miente.';
      break;

    //BACKGROUND ACTORS//
    //BERLY//
      case 'BERLY ATTACK': //BERLY ATTACK
        text = '¡BERLY da un cabezazo a ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BERLY NOTHING 1': //BERLY NOTHING 1
        text = '¡BERLY se esconde valientemente en la esquina!';
        break;

      case 'BERLY NOTHING 2': //BERLY NOTHING 2
        text = 'BERLY se arregla las gafas.';
        break;

      //TOYS//
      case 'CAN':  // CAN
        text = user.name() + ' da una patada a la lata.';
        break;

      case 'DANDELION':  // DANDELION
        text = user.name() + ' sopla sobre el DIENTE DE LEÓN.\r\n';
        text += user.name() + ' se siente como ' + (switches.value(6) ? 'ella' : 'él') + 'a sí mismo de nuevo.';
        break;

      case 'DYNAMITE':  // DYNAMITE
        text = user.name() + ' lanza DINAMITA!';
        break;

      case 'LIFE JAM':  // LIFE JAM
        text = user.name() + ' utiliza MERMELADA VITAL en una TOSTADA!\r\n';
        text += 'La TOSTADA cobro vida!';
        break;

      case 'PRESENT':  // PRESENT
        text = target.name() + ' abre el REGALO\r\n';
        text += 'No era lo que ' + target.name() + ' quería...\r\n';
        if(!target._noEffectMessage){text += '!' + target.name() + ' se siente ENFADADO! ';}
        else {text += parseNoEffectEmotion(target.name(), "¡MÁS ENFADADO!")}
        break;

      case 'SILLY STRING':  // DYNAMITE
        if(target.index() <= unitLowestIndex) {
          text = '¡' + user.name() + ' utiliza CUERDA TONTA!\r\n';
          text += 'WOOOOO!! ¡Es una fiesta!\r\n';
          text += '¡Todo el mundo se siente FELIZ! ';
        }
        break;

      case 'SPARKLER':  // SPARKLER
        text = '¡' + user.name() + ' enciende la BENGALA!\r\n';
        text += 'WOOOOO!! ¡Es una fiesta!\r\n';
        if(!target._noEffectMessage){text += target.name() + ' se siente FELIZ!';}
        else {text += parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
        break;

      case 'COFFEE': // COFFEE
        text = '¡' + user.name() + ' se bebe el CAFÉ!\r\n';
        text += '¡' + user.name() + ' se siente increíble!';
        break;

      case 'RUBBERBAND': // RUBBERBAND
        text = '¡' + user.name() + ' se encarga de ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //OMORI BATTLE//

      case "OMORI ERASES":
        text = user.name() + " te echa abajo.\r\n";
        text += hpDamageText;
        break;

      case "MARI ATTACK":
        text = user.name() + " te recuerda lo que hiciste.\r\n";
        text += target.name() + " esta ATERRORIZADO.\r\n";
        text += hpDamageText;
        break;

      //STATES//
      case 'HAPPY':
        if(!target._noEffectMessage){text = '¡' + target.name() + ' se siente FELIZ!';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
        break;

      case 'ECSTATIC':
        if(!target._noEffectMessage){text = '¡¡' + target.name() + ' se siente EXTÁTICO!!';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
        break;

      case 'MANIC':
        if(!target._noEffectMessage){text = '¡¡¡' + target.name() + ' se siente MANIACO!!!';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS FELIZ!")}
        break;

      case 'SAD':
        if(!target._noEffectMessage){text = target.name() + ' se siente TRISTE...';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS TRISTE!")}
        break;

      case 'DEPRESSED':
        if(!target._noEffectMessage){text = target.name() + ' se siente DEPRESIVO...';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS TRISTE!")}
        break;

      case 'MISERABLE':
        if(!target._noEffectMessage){text = target.name() + ' se siente MISERABLE...';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS TRISTE!")}
        break;

      case 'ANGRY':
        if(!target._noEffectMessage){text = '¡' + target.name() + ' se siente ENFADADO!';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS ENFADADO!")}
        break;

      case 'ENRAGED':
        if(!target._noEffectMessage){text = '¡¡' + target.name() + ' se siente ENFURECIDO!!';}
        else {text = parseNoEffectEmotion(target.name(), "MÁS ENFADADO!!")}
        break;

      case 'FURIOUS':
        if(!target._noEffectMessage){text = '¡¡¡' + target.name() + ' se siente FURIOSO!!!'}
        else {text = parseNoEffectEmotion(target.name(), "MÁS ENFADADO!")}
        break;

      case 'AFRAID':
        if(!target._noEffectMessage){text = '¡' + target.name() + ' se siente ATERRORIZADO!';}
        else {text = parseNoEffectEmotion(target.name(), "ATERRORIZADO")}
        break;

      case 'CANNOT MOVE':
        text = '¡' + target.name() + ' no puede moverse! ';
        break;

      case 'INFATUATION':
        text = '¡' + target.name() + ' está inmovilizada por el amor! ';
        break;
		
			//SNALEY//
    case 'SNALEY MEGAPHONE': // SNALEY MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = '¡' + user.name() + ' usa un MEGÁFONO!\r\n';}
      if(target.isStateAffected(16)) {text += '¡' + target.name() + ` se siente ENFADAD${pronome1}!!!\r\n`}
      else if(target.isStateAffected(15)) {text += '¡' + target.name() + ` se siente ENFURECID${pronome1}!!\r\n`}
      else if(target.isStateAffected(14)) {text += '¡' + target.name() + ` se siente FURIOS${pronome1}!\r\n`}
      break;



  }
  // Return Text
  return text;
};
//=============================================================================
// * Display Custom Action Text
//=============================================================================
Window_BattleLog.prototype.displayCustomActionText = function(subject, target, item) {
  // Make Custom Action Text
  var text = this.makeCustomActionText(subject, target, item);
  // If Text Length is more than 0
  if (text.length > 0) {
    if(!!this._multiHitFlag && !!item.isRepeatingSkill) {return;}
    // Get Get
    text = text.split(/\r\n/);
    for (var i = 0; i < text.length; i++) { this.push('addText', text[i]); }
    // Add Wait
    this.push('wait', 15);

  }
  if(!!item.isRepeatingSkill) {this._multiHitFlag = true;}
};
//=============================================================================
// * Display Action
//=============================================================================
Window_BattleLog.prototype.displayAction = function(subject, item) {
  // Return if Item has Custom Battle Log Type
  if (item.meta.BattleLogType) { return; }
  // Run Original Function
  _TDS_.CustomBattleActionText.Window_BattleLog_displayAction.call(this, subject, item);
};
//=============================================================================
// * Display Action Results
//=============================================================================
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
  // Get Item Object
  var item = BattleManager._action._item.object();
  // If Item has custom battle log type
  if (item && item.meta.BattleLogType) {
    // Display Custom Action Text
    this.displayCustomActionText(subject, target, item);
    // Return
  }
  // Run Original Function
  else {
    _TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults.call(this, subject, target);
  }
};

const _old_window_battleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage
Window_BattleLog.prototype.displayHpDamage = function(target) {
  let result = target.result();
  if(result.isHit() && result.hpDamage > 0) {
    if(!!result.elementStrong) {
      this.push("addText","...¡Fue un ataque dínamico!");
      this.push("waitForNewLine");
    }
    else if(!!result.elementWeak) {
      this.push("addText", "...¡Fue un ataque aburrido!");
      this.push("waitForNewLine")
    }
  }
  return _old_window_battleLog_displayHpDamage.call(this, target)
};

//=============================================================================
// * CLEAR
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_endAction= Window_BattleLog.prototype.endAction;
Window_BattleLog.prototype.endAction = function() {
  _TDS_.CustomBattleActionText.Window_BattleLog_endAction.call(this);
  this._multiHitFlag = false;
};

//=============================================================================
// * DISPLAY ADDED STATES
//=============================================================================
