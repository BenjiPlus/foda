game.heroesAI.pud = {
  move: {
    default: 'defensive'
  },
  play: function (card, cardData) {
    var hook = $('.enemydecks .hand .skills.pud-hook');
    var rot = $('.enemydecks .sidehand .skills.pud-rot');
    var ult = $('.enemydecks .hand .skills.pud-ult');
    var p;
    if (!$('.map .enemy.pud').length) {
     hook.data('ai discard', hook.data('ai discard') + 1);
    }
    if (card.canCast(hook)) {
      cardData['can-cast'] = true;
      var range = hook.data('aoe range');
      card.around(1, function (spot) {
        var cardInRange = card.firstCardInLine(spot, range);
        if (cardInRange && cardInRange.side() == card.opponent()) {
          var p = cardData['can-attack'] ? 25 : 5;
          if (cardInRange.hasClass('channeling')) p += 20;
          cardData['cast-strats'].push({
            priority: p + parseInt((cardInRange.data('hp')-cardInRange.data('current hp'))/4),
            skill: 'hook',
            target: spot
          });
        }
      });
    }
    if (card.canCast(rot)) {
      cardData['can-cast'] = true;
      var targets = 0;
      p = 0;
      card.opponentsInRange(rot.data('aoe range'), function (cardInRange) {
        targets++;
        p += parseInt((cardInRange.data('hp')-cardInRange.data('current hp'))/4);
      });
      if (!rot.hasClass('on')) { // turn on
        if (targets > 1) {
          cardData['cast-strats'].push({
            priority: p + 10,
            skill: 'rot',
            target: card
          });
        } else if (card.data('current hp') < 5) {
          // deny
          cardData['cast-strats'].push({
            priority: 30,
            skill: 'rot',
            target: card
          });
        }
      } else { // turn off
        if (targets <= 1) {
          cardData['cast-strats'].push({
            priority: 50 - (p/2),
            skill: 'rot',
            target: card
          });
        }
      }
    }
    if (card.canCast(ult)) {
      p = cardData['can-attack'] ? 0 : 50;
      card.opponentsInRange(rot.data('aoe range'), function (cardInRange) {
        if (!cardInRange.hasClasses('invisible ghost dead towers')) {
          cardData['can-cast'] = true;
          cardData['cast-strats'].push({
            priority: p + parseInt((cardInRange.data('hp')-cardInRange.data('current hp'))/4),
            skill: 'ult',
            target: cardInRange
          });
        }
      });
    }
    card.data('ai', cardData);
  },
  defend: function (pud) {
    //console.log('defend-from-pud');
    //avoid hook
  }
};