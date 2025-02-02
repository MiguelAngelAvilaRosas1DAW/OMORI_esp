/* DO NOT CHANGE THIS LINE */ if(!window.rebindRules){window.rebindRules=new Set();} /* DO NOT CHANGE THIS LINE */ 
//// PUT RULES BELOW THIS LINE
/// NOTE THAT FOR EACH BACK SLASH YOU NEED TWO
/// USE RULE IDENTIFIERS
/// format: [macro, newText, predicate?, priority?]
/// note that priority is MANDATORY when predicate is provided.
// Example rules: 
// rebindRules.add(["kel", "\\n<DW KEL>"]);
// rebindRules.add(["kel", "\\n<FA KEL>", () => $gameVariables.value(22)===2, 1]);
rebindRules.add(["art","\\n<ARTISTA>"]);
rebindRules.add(["spxh","\\n<EX-MARIDO ESPACIAL>"]);
rebindRules.add(["mai", "\\n<COCORREO>"]);
rebindRules.add(["smm","\\n<BROTE DE TIERRA MIKE>"]);
rebindRules.add(["jaw","\\n<SR. JAWSUM>"]);
rebindRules.add(["mav","\\n<EL MAVERICK>"]);
rebindRules.add(["spg","\\n<PIRATA ESPACIAL>"]);
rebindRules.add(["spd","\\n<PIRATA ESPACIAL PANA>"]);
rebindRules.add(["spb","\\n<PIRATA ESPACIAL COMPADRE>"]);
rebindRules.add(["wis","\\n<ROCO SABIA>"]);
rebindRules.add(["eye","\\n<CEJOTAS>"]);
rebindRules.add(["ban","\\n<FLEQUILLO>"]);
rebindRules.add(["gra","\\n<ABUELA>"]);
rebindRules.add(["kit","\\n<NIÑO COMETA>"]);
rebindRules.add(["tvg","\\n<CHICA TV>"]);
rebindRules.add(["sha","\\n<BROTE SOSPECHOSO>"]);
rebindRules.add(["may","\\n<BROTE ALCALDE>"]);
rebindRules.add(["sle","\\n<BROTE DORMIDO>"]);
rebindRules.add(["spo","\\n<BROTE ESPOROSO>"]);
rebindRules.add(["che","\\n<BROTE CHEF>"]);
rebindRules.add(["spr","\\n<BROTE DE TIERRA>"]);
rebindRules.add(["ban","\\n<BROTE BANDIDO>"]);
rebindRules.add(["smo","\\n<PEKEÑO>"]);
rebindRules.add(["sou","\\n<BROTE SOUS CHEF>"]);
rebindRules.add(["tea","\\n<MAESTRO BROTE>"]);
rebindRules.add(["st1","\\n<ALUMNO BROTE 1>"]);
rebindRules.add(["st2","\\n<ALUMNO BROTE 2>"]);
rebindRules.add(["st3","\\n<ALUMNO BROTE 3>"]);
rebindRules.add(["dun","\\n<BROTE BURRO>"]);
rebindRules.add(["lau","\\n<BROTE LAVANDERO>"]);
rebindRules.add(["squ","\\n<BROTE CAUDRADO>"]);
rebindRules.add(["dm1","\\n<BROTE COMEDOR 1>"]);
rebindRules.add(["dm2","\\n<BROTE COMEDOR 2>"]);
rebindRules.add(["dm3","\\n<BROTE COMEDOR 3>"]);
rebindRules.add(["mm1","\\n<BROTE.R 1>"]);
rebindRules.add(["mm2","\\n<BROTE.R 2>"]);
rebindRules.add(["sp1","\\n<EQUIPO ESPACIAL 1>"]);
rebindRules.add(["sp2","\\n<EQUIPO ESPACIAL 2>"]);
rebindRules.add(["sp3","\\n<EQUIPO ESPACIAL 3>"]);
rebindRules.add(["ear","\\n<TIERRA>"]);
rebindRules.add(["sbf","\\n<NOVIO ESPACIAL>"]);
rebindRules.add(["sxbf","\\n<EX NOVIO ESPACIAL>"]);
rebindRules.add(["cap","\\n<CAPT. CHICO ESPACIAL>"]);
rebindRules.add(["sxhb","\\n<EX-MARIDO ESPACIAL>"]);
rebindRules.add(["shb","\\n<MARIDO ESPACIAL>"]);
/// DO NOT CHANGE ANYTHING BELOW THIS LINE
if (!window.rebindInstalled) {
    (function() {
        let rules = {};
        let lastRefreshSize = 0;
    
        let og = {
            MsgMacro: Yanfly.MsgMacro,
            MsgMacroRef: Yanfly.MsgMacroRef
        }
    
        let lut = {};
    
        window.rebindRefresh = function() {
            if (lastRefreshSize === window.rebindRules.size) return;
            
            rules = {};
            lut = {};
            for (let i in og.MsgMacroRef) {
                lut[og.MsgMacroRef[i]] = i;
                rules[i] = {
                    base: og.MsgMacro[og.MsgMacroRef[i]],
                    predicate: []
                }
            }
    
            window.rebindRules.forEach(function(value) {
                if (value.length === 2) { // BASE RULE
                    rules[value[0].toUpperCase()].base = value[1];
                } else {
                    rules[value[0].toUpperCase()].predicate.push({
                        priority: value[3]||0,
                        value: value[1],
                        predicate: value[2]
                    });
                }
            });
    
            console.log(rules, lut);
        }
    
        Yanfly.MsgMacro = new Proxy(Yanfly.MsgMacro, {
            get(target, symbol) {
                if(rules[lut[symbol]]) {
                    let predicateRules = rules[lut[symbol]].predicate;
                    let predicateResults = [];
                    for (let rule of predicateRules) {
                        predicateResults.push([
                            rule.predicate(),
                            rule.priority,
                            rule.value
                        ]);
                    }
    
                    predicateResults = predicateResults.filter(value => value[0]);
                    predicateResults.sort((a,b) => a[1] - b[1]);
                    
                    if (predicateResults.length > 0) {
                        return predicateResults[predicateResults.length - 1][2];
                    } else {
                        return rules[lut[symbol]].base;
                    }
                } else {
                    return Reflect.get(...arguments);
                }
            }
        })
    
        window.rebindInstalled = true;
    })();
    }
    window.rebindRefresh();