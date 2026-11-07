System.register("chunks:///_virtual/account.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './economy.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _extends, cclegacy, INITIAL_SKILL_IDS, TRAINING_COSTS, ITEM_UPGRADE_COSTS;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      INITIAL_SKILL_IDS = module.INITIAL_SKILL_IDS;
      TRAINING_COSTS = module.TRAINING_COSTS;
      ITEM_UPGRADE_COSTS = module.ITEM_UPGRADE_COSTS;
    }],
    execute: function () {
      exports({
        activate: activate,
        clone: clone,
        equip: equip,
        newAccount: newAccount,
        runStats: runStats,
        settle: settle,
        train: train,
        trainingCost: trainingCost,
        upgrade: upgrade,
        upgradeCost: upgradeCost,
        validateAccount: validateAccount
      });
      cclegacy._RF.push({}, "65a5eLzldhCL54Z5TCGeJyB", "account", undefined);
      var ITEM_NAMES = exports('ITEM_NAMES', {
        EQ01: '青锋枪',
        EQ02: '山行袍',
        EQ03: '青玉坠',
        CO01: '行云轮',
        CO02: '赤鬃小兽'
      });
      var EQUIPMENT = exports('EQUIPMENT', ['EQ01', 'EQ02', 'EQ03']);
      var COMPANIONS = exports('COMPANIONS', ['CO01', 'CO02']);
      var SLOT = exports('SLOT', {
        EQ01: 'weapon',
        EQ02: 'clothes',
        EQ03: 'accessory'
      });
      function clone(value) {
        return JSON.parse(JSON.stringify(value));
      }
      function newAccount(seed) {
        if (seed === void 0) {
          seed = 0x71ab3291;
        }
        return {
          schema: 1,
          revision: 0,
          coins: 0,
          iron: 0,
          training: {
            ATK: 0,
            HP: 0
          },
          unlockedSkills: [].concat(INITIAL_SKILL_IDS),
          unlockedItems: [],
          shards: {},
          items: {},
          equipped: {
            weapon: null,
            clothes: null,
            accessory: null
          },
          equippedCompanionId: null,
          clearedStages: [],
          highestUnlockedStage: 1,
          pity: {
            equipment: {
              focus: null,
              misses: 0
            },
            companion: {
              focus: null,
              misses: 0
            }
          },
          receipts: {},
          rng: seed >>> 0 || 1
        };
      }
      function validateAccount(a) {
        var _a$training, _a$training2;
        var integer = function integer(n, max) {
          if (max === void 0) {
            max = Number.MAX_SAFE_INTEGER;
          }
          return Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) <= max;
        };
        if (!a || a.schema !== 1 || !integer(a.revision) || !integer(a.coins) || !integer(a.iron) || !integer(a.rng, 0xffffffff)) throw new Error('存档账号结构无效，已停止写入');
        if (!integer((_a$training = a.training) == null ? void 0 : _a$training.ATK, 20) || !integer((_a$training2 = a.training) == null ? void 0 : _a$training2.HP, 20) || !integer(a.highestUnlockedStage, 30) || a.highestUnlockedStage < 1) throw new Error('存档成长数据无效');
        if (!Array.isArray(a.unlockedSkills) || new Set(a.unlockedSkills).size !== a.unlockedSkills.length || a.unlockedSkills.some(function (id) {
          return !/^SK(0[1-9]|1[0-2])$/.test(id);
        })) throw new Error('存档招式池无效');
        if (!Array.isArray(a.unlockedItems) || new Set(a.unlockedItems).size !== a.unlockedItems.length || a.unlockedItems.some(function (id) {
          return !(id in ITEM_NAMES);
        })) throw new Error('存档物品权限无效');
        if (!a.shards || !a.items || !a.receipts || !a.pity || !a.equipped || !Array.isArray(a.clearedStages)) throw new Error('存档缺少必要字段');
        for (var _i = 0, _Object$entries = Object.entries(a.shards); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i],
            id = _Object$entries$_i[0],
            n = _Object$entries$_i[1];
          if (!(id in ITEM_NAMES) || !integer(n)) throw new Error('存档碎片数量无效');
        }
        for (var _i2 = 0, _Object$entries2 = Object.entries(a.items); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _Object$entries2[_i2],
            _id = _Object$entries2$_i[0],
            _n = _Object$entries2$_i[1];
          if (!(_id in ITEM_NAMES) || !integer(_n, 10) || !_n || !a.unlockedItems.includes(_id)) throw new Error('存档物品等级无效');
        }
        for (var _iterator = _createForOfIteratorHelperLoose(EQUIPMENT), _step; !(_step = _iterator()).done;) {
          var _id2 = _step.value;
          var current = a.equipped[SLOT[_id2]];
          if (current !== null && (current !== _id2 || !a.items[current])) throw new Error('存档装备位置无效');
        }
        if (a.equippedCompanionId !== null && (!COMPANIONS.includes(a.equippedCompanionId) || !a.items[a.equippedCompanionId])) throw new Error('存档同行伙伴无效');
        for (var _iterator2 = _createForOfIteratorHelperLoose(['equipment', 'companion']), _step2; !(_step2 = _iterator2()).done;) {
          var category = _step2.value;
          var p = a.pity[category],
            ids = category === 'equipment' ? EQUIPMENT : COMPANIONS;
          if (!p || !integer(p.misses, 2) || p.focus !== null && !ids.includes(p.focus)) throw new Error('存档收集进度无效');
        }
      }
      function trainingCost(stat, level) {
        if (!Number.isInteger(level) || level < 0 || level >= 20) return null;
        return TRAINING_COSTS[stat][level];
      }
      function upgradeCost(item, level) {
        if (!Number.isInteger(level) || level < 1 || level >= 10) return null;
        return _extends({}, ITEM_UPGRADE_COSTS[item.startsWith('EQ') ? 'equipment' : 'companion'][level - 1]);
      }
      function runStats(account) {
        var _account$items$accoun, _account$items$accoun2, _account$items$accoun3;
        validateAccount(account);
        var weapon = account.equipped.weapon ? (_account$items$accoun = account.items[account.equipped.weapon]) != null ? _account$items$accoun : 0 : 0;
        var clothes = account.equipped.clothes ? (_account$items$accoun2 = account.items[account.equipped.clothes]) != null ? _account$items$accoun2 : 0 : 0;
        var accessory = account.equipped.accessory ? (_account$items$accoun3 = account.items[account.equipped.accessory]) != null ? _account$items$accoun3 : 0 : 0;
        var companion = account.equippedCompanionId ? {
          id: account.equippedCompanionId,
          level: account.items[account.equippedCompanionId]
        } : null;
        var wheel = (companion == null ? void 0 : companion.id) === 'CO01' ? companion.level : 0;
        return {
          maxHp: 100 + 10 * account.training.HP + 10 * clothes + 4 * accessory,
          damageMultiplier: 1 + .05 * account.training.ATK + .05 * weapon + .02 * accessory,
          speed: 210 + (wheel ? 5 + wheel : 0),
          pickupRadius: 60 + (wheel ? 8 + 2 * wheel : 0),
          companion: companion,
          unlockedSkills: [].concat(account.unlockedSkills)
        };
      }
      function already(account, id) {
        return account.receipts[id];
      }
      function receipt(a, id, kind, before, message, details) {
        a.revision = before.revision + 1;
        var r = {
          id: id,
          kind: kind,
          revision: a.revision,
          message: message,
          coins: a.coins - before.coins,
          iron: a.iron - before.iron,
          details: details
        };
        a.receipts[id] = r;
        validateAccount(a);
        return r;
      }
      function duplicate(a, id) {
        var r = already(a, id);
        return r ? {
          account: a,
          receipt: r,
          duplicate: true
        } : null;
      }
      function train(before, stat, id) {
        var d = duplicate(before, id);
        if (d) return d;
        var cost = trainingCost(stat, before.training[stat]);
        if (cost === null) throw new Error('修行已满20级');
        if (before.coins < cost) throw new Error("\u94DC\u94B1\u4E0D\u8DB3\uFF0C\u9700\u8981" + cost);
        var a = clone(before);
        a.coins -= cost;
        a.training[stat]++;
        return {
          account: a,
          receipt: receipt(a, id, 'training', before, (stat === 'ATK' ? '攻击' : '气血') + "\u4FEE\u884C\u5347\u81F3" + a.training[stat] + "\u7EA7\uFF0C\u4E0B\u6B21\u51FA\u53D1\u65F6\u751F\u6548", {
            stat: stat,
            from: before.training[stat],
            to: a.training[stat],
            cost: cost
          }),
          duplicate: false
        };
      }
      function activate(before, item, id) {
        var _before$shards$item, _a$shards$item;
        var d = duplicate(before, id);
        if (d) return d;
        if (!before.unlockedItems.includes(item)) throw new Error('此物尚未解锁');
        if (before.items[item]) throw new Error('已经激活');
        if (((_before$shards$item = before.shards[item]) != null ? _before$shards$item : 0) < 10) throw new Error('需要10片本体碎片');
        var a = clone(before),
          remaining = ((_a$shards$item = a.shards[item]) != null ? _a$shards$item : 0) - 10;
        a.items[item] = 1;
        a.shards[item] = 0;
        a.iron += remaining;
        var equipped = false;
        if (item.startsWith('EQ')) {
          var slot = SLOT[item];
          if (!a.equipped[slot]) {
            a.equipped[slot] = item;
            equipped = true;
          }
        } else if (!a.equippedCompanionId) {
          a.equippedCompanionId = item;
          equipped = true;
        }
        for (var _iterator3 = _createForOfIteratorHelperLoose(['equipment', 'companion']), _step3; !(_step3 = _iterator3()).done;) {
          var key = _step3.value;
          if (a.pity[key].focus === item) {
            a.pity[key].focus = null;
            a.pity[key].misses = 0;
          }
        }
        return {
          account: a,
          receipt: receipt(a, id, 'activate', before, ITEM_NAMES[item] + "\u5DF2\u6FC0\u6D3B" + (equipped ? item.startsWith('EQ') ? '并装备' : '并同行' : '') + (remaining ? "\uFF0C\u4F59" + remaining + "\u7247\u8F6C\u4E3A\u7CBE\u94C1" : ''), {
            item: item,
            spentShards: 10,
            convertedShards: remaining,
            equipped: equipped,
            level: 1
          }),
          duplicate: false
        };
      }
      function upgrade(before, item, id) {
        var _before$items$item;
        var d = duplicate(before, id);
        if (d) return d;
        var level = (_before$items$item = before.items[item]) != null ? _before$items$item : 0,
          cost = upgradeCost(item, level);
        if (!level) throw new Error('请先激活');
        if (!cost) throw new Error('已经满10级');
        if (before.coins < cost.coins || before.iron < cost.iron) throw new Error("\u9700\u8981\u94DC\u94B1" + cost.coins + "\u3001\u7CBE\u94C1" + cost.iron);
        var a = clone(before);
        a.coins -= cost.coins;
        a.iron -= cost.iron;
        a.items[item] = level + 1;
        return {
          account: a,
          receipt: receipt(a, id, 'upgrade', before, ITEM_NAMES[item] + "\u5347\u81F3" + (level + 1) + "\u7EA7\uFF0C\u4E0B\u6B21\u51FA\u53D1\u751F\u6548", {
            item: item,
            from: level,
            to: level + 1,
            cost: cost
          }),
          duplicate: false
        };
      }
      function equip(before, item, slot, id) {
        var d = duplicate(before, id);
        if (d) return d;
        if (item && !before.items[item]) throw new Error('请先激活');
        var a = clone(before);
        var previous;
        if (slot === 'companion' || item != null && item.startsWith('CO')) {
          if (item && !COMPANIONS.includes(item)) throw new Error('不是伙伴');
          previous = a.equippedCompanionId;
          a.equippedCompanionId = item;
          slot = 'companion';
        } else {
          if (item) {
            if (!EQUIPMENT.includes(item)) throw new Error('不是装备');
            var expected = SLOT[item];
            if (slot && slot !== expected) throw new Error('装备位置不匹配');
            slot = expected;
          }
          if (!slot) throw new Error('请指定位置');
          previous = a.equipped[slot];
          a.equipped[slot] = item;
        }
        return {
          account: a,
          receipt: receipt(a, id, 'equip', before, item ? "" + ITEM_NAMES[item] + (slot === 'companion' ? '开始同行' : '已装备') + "\uFF0C\u4E0B\u6B21\u51FA\u53D1\u751F\u6548" : '已卸下，下次出发生效', {
            slot: slot,
            previous: previous,
            item: item
          }),
          duplicate: false
        };
      }
      function random(a) {
        var x = a.rng >>> 0 || 1;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        a.rng = x >>> 0;
        return a.rng / 4294967296;
      }
      function addShards(a, item, n) {
        var _a$shards$item2;
        var converted = a.items[item] ? n : 0;
        if (converted) a.iron += n;else a.shards[item] = ((_a$shards$item2 = a.shards[item]) != null ? _a$shards$item2 : 0) + n;
        return {
          item: item,
          quantity: n,
          converted: converted
        };
      }
      function draw(a, category, sourcePool) {
        var pool = sourcePool.filter(function (item) {
          return a.unlockedItems.includes(item);
        });
        if (!pool.length) return null;
        var ids = category === 'equipment' ? EQUIPMENT : COMPANIONS;
        var p = a.pity[category];
        var incomplete = function incomplete(item) {
          var _a$shards$item3;
          return a.unlockedItems.includes(item) && !a.items[item] && ((_a$shards$item3 = a.shards[item]) != null ? _a$shards$item3 : 0) < 10;
        };
        // Unlock order is retained in the array; ID is the tie-breaker within one unlock.
        if (p.focus && !incomplete(p.focus)) {
          p.focus = null;
          p.misses = 0;
        }
        if (!p.focus) {
          var next = a.unlockedItems.find(function (item) {
            return ids.includes(item) && incomplete(item);
          });
          p.focus = next != null ? next : null;
          p.misses = 0;
        }
        var focus = p.focus,
          eligible = focus !== null && pool.includes(focus),
          forced = eligible && p.misses >= 2;
        var item = forced ? focus : pool[Math.floor(random(a) * pool.length)];
        // Independent of the target draw and of pity. A single-target pool still draws quantity.
        var quantity = category === 'equipment' ? random(a) < .5 ? 4 : 5 : 4;
        if (eligible) p.misses = item === focus ? 0 : Math.min(2, p.misses + 1);
        var result = addShards(a, item, quantity);
        if (focus && !incomplete(focus)) {
          p.focus = null;
          p.misses = 0;
        }
        return _extends({}, result, {
          category: category,
          focus: focus,
          eligible: eligible,
          forced: forced,
          missesAfter: p.misses,
          pool: [].concat(pool)
        });
      }
      function settle(before, stage, runId, outcome, completedWaves) {
        var id = "settlement:" + runId,
          d = duplicate(before, id);
        if (d) return d;
        if (!Number.isInteger(completedWaves) || completedWaves < 0 || completedWaves > stage.waves.length) throw new Error('结算波次无效');
        var a = clone(before),
          first = outcome === 'victory' && !a.clearedStages.includes(stage.id),
          r = stage.reward;
        var gifts = [],
          drops = [];
        if (outcome === 'victory') {
          if (first) {
            a.clearedStages.push(stage.id);
            a.highestUnlockedStage = Math.max(a.highestUnlockedStage, Math.min(30, stage.number + 1));
            for (var _iterator4 = _createForOfIteratorHelperLoose(r.unlockSkills), _step4; !(_step4 = _iterator4()).done;) {
              var skill = _step4.value;
              if (!a.unlockedSkills.includes(skill)) a.unlockedSkills.push(skill);
            }
            // Simultaneous item unlocks use a stable ID tie-break, before focus selection and draw.
            for (var _iterator5 = _createForOfIteratorHelperLoose([].concat(r.unlockItems).sort()), _step5; !(_step5 = _iterator5()).done;) {
              var _item = _step5.value;
              if (!a.unlockedItems.includes(_item)) a.unlockedItems.push(_item);
            }
            for (var _i3 = 0, _Object$entries3 = Object.entries((_r$firstShards = r.firstShards) != null ? _r$firstShards : {}); _i3 < _Object$entries3.length; _i3++) {
              var _r$firstShards;
              var _Object$entries3$_i = _Object$entries3[_i3],
                item = _Object$entries3$_i[0],
                n = _Object$entries3$_i[1];
              if (!a.unlockedItems.includes(item)) throw new Error('首通碎片权限尚未解锁');
              gifts.push(addShards(a, item, n));
            }
          }
          a.coins += r.coins + (first ? r.firstCoins : 0);
          a.iron += r.iron + (first ? r.firstIron : 0);
          var equipment = draw(a, 'equipment', r.equipmentPool),
            companion = draw(a, 'companion', r.companionPool);
          if (equipment) drops.push(equipment);
          if (companion) drops.push(companion);
        } else if (outcome === 'defeat') a.coins += Math.min(20, 5 * completedWaves);
        var details = {
          runId: runId,
          stageId: stage.id,
          outcome: outcome,
          firstClear: first,
          completedWaves: completedWaves,
          gifts: gifts,
          drops: drops,
          unlockedSkills: first ? r.unlockSkills : [],
          unlockedItems: first ? r.unlockItems : []
        };
        var message = outcome === 'victory' ? "" + stage.name + (first ? '首通' : '通关') + " \xB7 \u94DC\u94B1+" + (a.coins - before.coins) + " \xB7 \u7CBE\u94C1+" + (a.iron - before.iron) : outcome === 'defeat' ? "\u8D25\u9000 \xB7 \u5B8C\u6574\u901A\u8FC7" + completedWaves + "\u6CE2 \xB7 \u94DC\u94B1+" + (a.coins - before.coins) : '已返回营地，本次未结算奖励';
        return {
          account: a,
          receipt: receipt(a, id, 'settlement', before, message, details),
          duplicate: false
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BO01Presentation.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _extends, cclegacy;
  return {
    setters: [function (module) {
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "806d8LHf3lHgL/p3XY6z0Hi", "BO01Presentation", undefined);
      /** Presentation history only. It cannot advance the model or defer an AI state. */
      var BO01Presentation = exports('BO01Presentation', /*#__PURE__*/function () {
        function BO01Presentation() {
          this.clocks = new Map();
        }
        var _proto = BO01Presentation.prototype;
        _proto.clear = function clear() {
          this.clocks.clear();
        };
        _proto.prune = function prune(ids) {
          for (var _i = 0, _Array$from = Array.from(this.clocks.keys()); _i < _Array$from.length; _i++) {
            var id = _Array$from[_i];
            if (!ids.includes(id)) this.clocks["delete"](id);
          }
        };
        _proto.sample = function sample(a, time, phase) {
          var c = this.clocks.get(a.id);
          if (!c || time < c.time) {
            var clip = a.pose === 'windup' ? 'anticipation' : a.pose === 'attack' ? 'execute' : a.pose === 'move' ? 'Walk' : 'Idle';
            c = {
              clip: clip,
              age: clip === 'Walk' ? Math.max(0, a.poseAge) : 0,
              time: time,
              x: a.x,
              y: a.y,
              reason: a.pose === 'frozen' ? 'snapshot-frozen-no-history-idle' : 'snapshot-pose-no-start-replay',
              held: phase !== 'playing' || a.pose === 'frozen'
            };
            this.clocks.set(a.id, c);
            return _extends({}, c);
          }
          var elapsed = Math.max(0, time - c.time),
            moved = Math.hypot(a.x - c.x, a.y - c.y) > .0001;
          c.time = time;
          c.x = a.x;
          c.y = a.y;
          if (phase !== 'playing' || a.pose === 'frozen' || elapsed === 0) {
            c.held = true;
            return _extends({}, c);
          }
          c.held = false;
          if (a.pose === 'windup' || a.pose === 'attack') {
            c.clip = a.pose === 'windup' ? 'anticipation' : 'execute';
            c.age = 0;
            c.reason = 'model-window-immediate';
            return _extends({}, c);
          }
          var moving = a.pose === 'move' && moved;
          if (moving) {
            if (c.clip === 'Idle') {
              c.clip = 'Start';
              c.age = 0;
              c.reason = 'idle-to-move-source-start';
            } else if (c.clip === 'Start') {
              c.age += elapsed;
              if (c.age + 1e-8 >= .8) {
                c.age = Math.max(0, c.age - .8);
                c.clip = 'Walk';
                c.reason = 'source-start-to-walk';
              }
            } else if (c.clip === 'Walk') {
              c.age += elapsed;
              c.reason = 'moving-battle-clock';
            } else {
              c.clip = 'Walk';
              c.age = Math.max(0, a.poseAge);
              c.reason = 'interruption-to-move-hard-cut-unproven';
            }
          } else {
            if (c.clip === 'Walk') {
              var frame = Math.floor((Math.max(0, c.age) + 1e-8) * 30) % 24;
              if (frame === 0) {
                c.clip = 'Stop';
                c.age = 0;
                c.reason = 'walk-frame0-to-stop-source-boundary';
              } else {
                c.clip = 'Idle';
                c.age = 0;
                c.reason = 'arbitrary-stop-hard-cut-unproven';
              }
            } else if (c.clip === 'Stop') {
              c.age += elapsed;
              if (c.age + 1e-8 >= .4) {
                c.clip = 'Idle';
                c.age = 0;
                c.reason = 'source-stop-to-idle';
              }
            } else if (c.clip === 'Idle') {
              c.age = 0;
              c.reason = 'stationary-idle';
            } else {
              c.clip = 'Idle';
              c.age = 0;
              c.reason = 'interruption-to-idle-hard-cut-unproven';
            }
          }
          return _extends({}, c);
        };
        return BO01Presentation;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/combat-navigation.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        navigationPoint: navigationPoint,
        segmentRectangle: segmentRectangle
      });
      cclegacy._RF.push({}, "fd409Xh59xEeqrNB/a1UruD", "combat-navigation", undefined);
      /** Visibility graph over inflated authored rectangle corners, deterministic Dijkstra. */
      function navigationPoint(from, target, radius, obstacles, width, height) {
        // Match move()'s open collision interior: touching a body-expanded edge is legal.
        // Keep the 1u clearance on route corners, not on the start/target exclusion area.
        var rectangles = obstacles.map(function (r) {
          return {
            x: r.x - radius,
            y: r.y - radius,
            width: r.width + 2 * radius,
            height: r.height + 2 * radius
          };
        });
        var blocked = function blocked(a, b) {
          return rectangles.some(function (r) {
            return crossesInterior(a, b, r);
          });
        };
        var point = function point(p) {
          return {
            x: p.x,
            y: p.y
          };
        };
        if (!blocked(from, target)) return point(target);
        var nodes = [from, target];
        for (var _iterator = _createForOfIteratorHelperLoose(rectangles), _step; !(_step = _iterator()).done;) {
          var r = _step.value;
          var _loop = function _loop() {
            var p = _arr[_i3];
            if (p.x >= radius && p.y >= radius && p.x <= width - radius && p.y <= height - radius && !rectangles.some(function (q) {
              return inside(p, q);
            })) nodes.push(p);
          };
          for (var _i3 = 0, _arr = [{
              x: r.x - 1,
              y: r.y - 1
            }, {
              x: r.x + r.width + 1,
              y: r.y - 1
            }, {
              x: r.x - 1,
              y: r.y + r.height + 1
            }, {
              x: r.x + r.width + 1,
              y: r.y + r.height + 1
            }]; _i3 < _arr.length; _i3++) {
            _loop();
          }
        }
        var costs = nodes.map(function () {
            return Infinity;
          }),
          previous = nodes.map(function () {
            return -1;
          }),
          used = new Set();
        costs[0] = 0;
        while (used.size < nodes.length) {
          var best = -1;
          for (var i = 0; i < nodes.length; i++) if (!used.has(i) && (best < 0 || costs[i] < costs[best])) best = i;
          if (best < 0 || !Number.isFinite(costs[best])) break;
          if (best === 1) {
            var _i = 1;
            while (previous[_i] > 0) _i = previous[_i];
            return point(previous[_i] === 0 ? nodes[_i] : from);
          }
          used.add(best);
          for (var _i2 = 1; _i2 < nodes.length; _i2++) {
            if (used.has(_i2) || blocked(nodes[best], nodes[_i2])) continue;
            var cost = costs[best] + Math.hypot(nodes[_i2].x - nodes[best].x, nodes[_i2].y - nodes[best].y);
            if (cost < costs[_i2]) {
              costs[_i2] = cost;
              previous[_i2] = best;
            }
          }
        }
        return point(from); // An unreachable route stops without returning an Actor/self alias.
      }

      /** Only an interval inside both open slabs blocks navigation; edge tangency is legal. */
      function crossesInterior(a, b, r) {
        var enter = 0,
          exit = 1;
        for (var _i4 = 0, _arr2 = [[a.x, b.x - a.x, r.x, r.x + r.width], [a.y, b.y - a.y, r.y, r.y + r.height]]; _i4 < _arr2.length; _i4++) {
          var _arr2$_i = _arr2[_i4],
            start = _arr2$_i[0],
            delta = _arr2$_i[1],
            low = _arr2$_i[2],
            high = _arr2$_i[3];
          if (Math.abs(delta) < 1e-10) {
            if (start <= low || start >= high) return false;
          } else {
            var p = (low - start) / delta,
              q = (high - start) / delta;
            enter = Math.max(enter, Math.min(p, q));
            exit = Math.min(exit, Math.max(p, q));
            if (enter >= exit) return false;
          }
        }
        return exit > enter;
      }
      function inside(p, r) {
        return p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height;
      }
      function segmentRectangle(a, b, r) {
        var enter = 0,
          exit = 1;
        for (var _i5 = 0, _arr3 = [[a.x, b.x - a.x, r.x, r.x + r.width], [a.y, b.y - a.y, r.y, r.y + r.height]]; _i5 < _arr3.length; _i5++) {
          var _arr3$_i = _arr3[_i5],
            start = _arr3$_i[0],
            delta = _arr3$_i[1],
            low = _arr3$_i[2],
            high = _arr3$_i[3];
          if (Math.abs(delta) < 1e-10) {
            if (start < low || start > high) return false;
          } else {
            var p = (low - start) / delta,
              q = (high - start) / delta;
            enter = Math.max(enter, Math.min(p, q));
            exit = Math.min(exit, Math.max(p, q));
            if (enter > exit) return false;
          }
        }
        return exit >= 0 && enter <= 1;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/combat.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './contract.ts', './combat-navigation.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, _createClass, cclegacy, SKILL_CAP, navigationPoint, segmentRectangle;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SKILL_CAP = module.SKILL_CAP;
    }, function (module) {
      navigationPoint = module.navigationPoint;
      segmentRectangle = module.segmentRectangle;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ce3ebgd7mxNI5i0qVz2LDTT", "combat", undefined);
      var DT = 1 / 60;
      var SIM_VERSION = 'inkblade30-combat.20261107.1';
      var ESCORT_RADIUS_REVISION = 'escort-radius.body-hurt-configured.1';
      var TAU = Math.PI * 2;
      var HERO_RADIUS = 16;
      var SWEEP_START = 0.4;
      var SWEEP_END = 0.567;
      var SWEEP_LENGTH = 1.1;
      var SWEEP_ARC = 140 * Math.PI / 180;
      var clone = function clone(v) {
        return JSON.parse(JSON.stringify(v));
      };
      var distance = function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
      };
      var angleTo = function angleTo(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
      };
      var wrap = function wrap(a) {
        return Math.atan2(Math.sin(a), Math.cos(a));
      };
      var stableId = function stableId(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
      };
      var clamp = function clamp(x, a, b) {
        return Math.max(a, Math.min(b, x));
      };
      var field = function field(s, k, fallback) {
        return typeof s[k] === 'number' && Number.isFinite(s[k]) ? s[k] : fallback;
      };
      var xpThreshold = function xpThreshold(level) {
        return 10 + 4 * (level - 1) + 2 * Math.floor((level - 1) / 5);
      };
      /** Fixed 60Hz deterministic simulation. No browser, engine, clock, storage or Math.random. */
      var BattleSim = exports('BattleSim', /*#__PURE__*/function () {
        function BattleSim(stage, enemySpecs, skillSpecs, stats, seed, runId, restored) {
          var _this = this,
            _objective$path$0$x,
            _objective$path$,
            _objective$path$0$y,
            _objective$path$2;
          this.s = void 0;
          this.meta = void 0;
          this.enemyById = new Map();
          this.skillById = new Map();
          this.views = new WeakMap();
          this.stage = stage;
          enemySpecs.forEach(function (e) {
            return _this.enemyById.set(e.id, e);
          });
          skillSpecs.forEach(function (e) {
            return _this.skillById.set(e.id, e);
          });
          if (!stage.waves.length) throw new Error('A stage requires explicit waves');
          for (var _iterator = _createForOfIteratorHelperLoose(stage.waves), _step; !(_step = _iterator()).done;) {
            var w = _step.value;
            for (var _iterator2 = _createForOfIteratorHelperLoose(w.groups), _step2; !(_step2 = _iterator2()).done;) {
              var g = _step2.value;
              if (!this.enemyById.has(g.enemy)) throw new Error("Unknown enemy " + g.enemy);
            }
          }
          var reachable = new Set(stage.waves.flatMap(function (w) {
            return w.groups.map(function (g) {
              return g.enemy;
            });
          }));
          var queue = Array.from(reachable);
          for (var i = 0; i < queue.length; i++) {
            var spec = this.enemyById.get(queue[i]);
            if (!spec) throw new Error("Unknown dependency " + queue[i]);
            var child = spec.splitInto || (spec.behavior === 'summon' ? 'EN01' : null);
            if (child && !reachable.has(child)) {
              reachable.add(child);
              queue.push(child);
            }
          }
          var relevantEnemies = Array.from(reachable).sort().map(function (id) {
            return _this.enemyById.get(id);
          });
          var escort = stage.mechanics.find(function (x) {
            return x.kind === 'escort';
          });
          if (escort && (!Number.isFinite(escort.radius) || escort.radius <= 0)) throw new Error('Invalid escort radius');
          // Keep non-escort checkpoint identities unchanged. Only escort semantics changed.
          var contentIdentity = [SIM_VERSION, stage, relevantEnemies, [].concat(skillSpecs).sort(function (a, b) {
            return stableId(a.id, b.id);
          })];
          if (escort) contentIdentity.push(ESCORT_RADIUS_REVISION);
          var contentHash = this.fingerprint(JSON.stringify(contentIdentity));
          if (restored !== undefined) {
            var _parsed$objective, _parsed$hero, _parsed$hero2, _parsed$stats, _parsed$stats2, _parsed$stats3, _parsed$stats4, _parsed$stats5;
            var parsed = JSON.parse(restored);
            var m = parsed.sim;
            if (escort && (!Number.isFinite((_parsed$objective = parsed.objective) == null ? void 0 : _parsed$objective.radius) || parsed.objective.radius !== escort.radius)) throw new Error('Invalid or incompatible escort radius checkpoint');
            if (parsed.schema !== 1 || parsed.runId !== runId || parsed.stageId !== stage.id || !m || m.contentHash !== contentHash || !Number.isInteger(parsed.tick) || parsed.tick < 0 || parsed.time !== parsed.tick / 60 || !Number.isFinite((_parsed$hero = parsed.hero) == null ? void 0 : _parsed$hero.hp) || !(((_parsed$hero2 = parsed.hero) == null ? void 0 : _parsed$hero2.maxHp) > 0) || !Number.isInteger(m.rng) || !Number.isFinite(m.nextAttack) || !Number.isFinite(m.nextId) || !Number.isFinite(m.eventSeq) || !['playing', 'choice', 'paused', 'defeat', 'victory'].includes(parsed.phase) || !['playing', 'choice'].includes(m.resumePhase) || !Array.isArray(parsed.enemies) || !Array.isArray(parsed.projectiles) || !Array.isArray(parsed.pickups) || !Array.isArray(parsed.effects) || !Array.isArray(parsed.skills) || !Array.isArray((_parsed$stats = parsed.stats) == null ? void 0 : _parsed$stats.unlockedSkills) || !(((_parsed$stats2 = parsed.stats) == null ? void 0 : _parsed$stats2.maxHp) > 0) || !(((_parsed$stats3 = parsed.stats) == null ? void 0 : _parsed$stats3.damageMultiplier) > 0) || !Number.isFinite((_parsed$stats4 = parsed.stats) == null ? void 0 : _parsed$stats4.speed) || !Number.isFinite((_parsed$stats5 = parsed.stats) == null ? void 0 : _parsed$stats5.pickupRadius)) throw new Error('Invalid or incompatible battle checkpoint');
            this.s = parsed;
            this.meta = m;
            // A restored checkpoint is always explicitly resumed; input is never replayed.
            this.meta.move = {
              x: 0,
              y: 0
            };
            this.meta.accumulator = 0;
            if (this.s.phase === 'playing' || this.s.phase === 'choice') {
              this.meta.resumePhase = this.s.phase;
              this.s.phase = 'paused';
              this.s.pauseReason = 'restored';
            }
            return;
          }
          if (!(stats.maxHp > 0) || !(stats.speed >= 0) || !(stats.damageMultiplier > 0)) throw new Error('Invalid run stats');
          this.meta = {
            rng: seed >>> 0 || 0x6d2b79f5,
            nextId: 0,
            eventSeq: 0,
            move: {
              x: 0,
              y: 0
            },
            accumulator: 0,
            resumePhase: 'playing',
            nextAttack: 0,
            hurtUntil: 0,
            sweep: null,
            faceTarget: null,
            faceAt: 0,
            waveStart: 0,
            groups: [],
            restUntil: null,
            allWavesDone: false,
            waveOvertime: false,
            companionCooldown: 0,
            gates: {},
            pendingHits: [],
            mechanicClocks: {},
            escortIndex: 1,
            contentHash: contentHash
          };
          var objective = stage.mechanics.find(function (x) {
            return x.kind === 'beacon' || x.kind === 'escort';
          });
          this.s = {
            schema: 1,
            runId: runId,
            stageId: stage.id,
            seed: seed,
            tick: 0,
            time: 0,
            phase: 'playing',
            pauseReason: null,
            hero: _extends({
              id: 'hero',
              kind: 'hero'
            }, clone(stage.world.spawn), {
              hp: stats.maxHp,
              maxHp: stats.maxHp,
              radius: HERO_RADIUS,
              face: 0,
              pose: 'idle',
              poseAge: 0,
              hitAt: -1
            }),
            enemies: [],
            projectiles: [],
            pickups: [],
            effects: [],
            skills: [],
            level: 1,
            xp: 0,
            xpNext: 10,
            pendingLevels: 0,
            offer: null,
            wave: 0,
            completedWaves: 0,
            kills: 0,
            reviveUsed: false,
            invincibleUntil: 0,
            objective: _extends({
              progress: 0,
              target: (objective == null ? void 0 : objective.kind) === 'beacon' ? objective.holdSeconds : stage.objective === 'survive' ? stage.surviveSeconds || 0 : 1
            }, (objective == null ? void 0 : objective.kind) === 'escort' ? {
              hp: objective.hp,
              maxHp: objective.hp,
              radius: objective.radius,
              x: (_objective$path$0$x = (_objective$path$ = objective.path[0]) == null ? void 0 : _objective$path$.x) != null ? _objective$path$0$x : stage.world.spawn.x,
              y: (_objective$path$0$y = (_objective$path$2 = objective.path[0]) == null ? void 0 : _objective$path$2.y) != null ? _objective$path$0$y : stage.world.spawn.y
            } : {}),
            events: [],
            stats: clone(stats),
            sim: this.meta
          };
          this.emit('wave', {
            wave: 0,
            label: stage.waves[0].label
          });
        }

        /** Runtime read-only proxy; renderers cannot mutate simulation or its nested arrays. */
        var _proto = BattleSim.prototype;
        _proto.readOnly = function readOnly(value) {
          var _this2 = this;
          var existing = this.views.get(value);
          if (existing) return existing;
          var proxy = new Proxy(value, {
            get: function get(target, key) {
              var v = Reflect.get(target, key);
              return v && typeof v === 'object' ? _this2.readOnly(v) : v;
            },
            set: function set() {
              throw new Error('BattleState is read-only');
            },
            deleteProperty: function deleteProperty() {
              throw new Error('BattleState is read-only');
            },
            defineProperty: function defineProperty() {
              throw new Error('BattleState is read-only');
            }
          });
          this.views.set(value, proxy);
          return proxy;
        };
        _proto.fingerprint = function fingerprint(text) {
          var h = 2166136261;
          for (var i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
          return (h >>> 0).toString(16);
        };
        _proto.random = function random() {
          var t = this.meta.rng = this.meta.rng + 0x6d2b79f5 >>> 0;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
        _proto.id = function id(prefix) {
          return prefix + "-" + ++this.meta.nextId;
        };
        _proto.emit = function emit(type, fields) {
          if (fields === void 0) {
            fields = {};
          }
          this.s.events.push(_extends({
            seq: ++this.meta.eventSeq,
            type: type
          }, fields));
          if (this.s.events.length > 160) this.s.events.shift();
        };
        _proto.serialize = function serialize() {
          return JSON.stringify(this.s);
        };
        _proto.setMove = function setMove(x, y) {
          if (this.s.phase !== 'playing') return;
          if (!Number.isFinite(x) || !Number.isFinite(y)) return;
          var n = Math.max(1, Math.hypot(x, y));
          this.meta.move = {
            x: x / n,
            y: y / n
          };
        };
        _proto.pause = function pause(reason) {
          if (reason === void 0) {
            reason = 'manual';
          }
          if (this.s.phase !== 'playing' && this.s.phase !== 'choice') return false;
          this.meta.resumePhase = this.s.phase;
          this.s.phase = 'paused';
          this.s.pauseReason = reason;
          this.meta.move = {
            x: 0,
            y: 0
          };
          this.meta.accumulator = 0;
          return true;
        };
        _proto.resume = function resume() {
          if (this.s.phase !== 'paused') return false;
          this.s.phase = this.meta.resumePhase;
          this.s.pauseReason = null;
          this.meta.move = {
            x: 0,
            y: 0
          };
          return true;
        };
        _proto.revive = function revive() {
          if (this.s.phase !== 'defeat' || this.s.reviveUsed || this.s.objective.hp !== undefined && this.s.objective.hp <= 0) return false;
          this.s.reviveUsed = true;
          this.s.hero.hp = this.s.hero.maxHp * 0.6;
          this.s.invincibleUntil = this.s.time + 2;
          this.meta.resumePhase = 'playing';
          this.s.phase = 'paused';
          this.s.pauseReason = 'revived';
          this.meta.move = {
            x: 0,
            y: 0
          };
          this.meta.hurtUntil = 0;
          this.meta.sweep = null;
          this.pose(this.s.hero, 'idle');
          this.emit('revive');
          return true;
        };
        _proto.choose = function choose(offerId, skillId) {
          var _learned$rank;
          var o = this.s.offer;
          if (this.s.phase !== 'choice' || !o || o.id !== offerId || !o.skills.includes(skillId)) return false;
          var learned = this.s.skills.find(function (x) {
            return x.id === skillId;
          });
          if (learned) {
            if (learned.rank >= 10) return false;
            learned.rank++;
          } else {
            if (this.s.skills.length >= SKILL_CAP || !this.s.stats.unlockedSkills.includes(skillId)) return false;
            this.s.skills.push({
              id: skillId,
              rank: 1,
              cooldown: 0
            });
          }
          this.s.pendingLevels--;
          this.s.offer = null;
          this.s.phase = 'playing';
          this.emit('choice', {
            offerId: offerId,
            skillId: skillId,
            rank: (_learned$rank = learned == null ? void 0 : learned.rank) != null ? _learned$rank : 1
          });
          this.nextOffer();
          return true;
        };
        _proto.step = function step(dt) {
          if (this.s.phase !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
          // The host sends 1/60 and explicitly pauses on hide. Consume every legal dt.
          this.meta.accumulator += dt;
          while (this.meta.accumulator + 1e-10 >= DT && this.s.phase === 'playing') {
            this.meta.accumulator = Math.max(0, this.meta.accumulator - DT);
            this.tick();
          }
          if (this.s.phase !== 'playing') this.meta.accumulator = 0;
        };
        _proto.pose = function pose(a, next) {
          if (a.pose !== next) {
            a.pose = next;
            a.poseAge = 0;
          }
        };
        _proto.tick = function tick() {
          this.s.tick++;
          this.s.time = this.s.tick / 60;
          var t = this.s.time;
          this.s.hero.poseAge += DT;
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.s.enemies), _step3; !(_step3 = _iterator3()).done;) {
            var e = _step3.value;
            e.poseAge += DT;
          }
          this.meta.pendingHits = [];
          this.director();
          this.moveHero();
          this.enemies();
          this.mechanics();
          this.shots();
          // Player lethal takes priority over uncommitted outgoing/death/loot/XP intents.
          if (this.s.hero.hp <= 0 || this.s.objective.hp !== undefined && this.s.objective.hp <= 0) {
            this.end('defeat');
            return;
          }
          this.basicAttack();
          this.skills();
          this.companion();
          this.effects();
          this.resolveHits();
          this.collect();
          this.progress();
          if (this.s.phase === 'playing') this.nextOffer();
          if (this.s.tick % 600 === 0) for (var _i = 0, _Object$keys = Object.keys(this.meta.gates); _i < _Object$keys.length; _i++) {
            var k = _Object$keys[_i];
            if (this.meta.gates[k] < t - 10) delete this.meta.gates[k];
          }
        };
        _proto.move = function move(a, radius, dx, dy) {
          var w = this.stage.world;
          var valid = function valid(x, y) {
            return !w.obstacles.some(function (r) {
              return x + radius > r.x && x - radius < r.x + r.width && y + radius > r.y && y - radius < r.y + r.height;
            });
          };
          var x = clamp(a.x + dx, radius, w.width - radius),
            y = clamp(a.y + dy, radius, w.height - radius);
          if (valid(x, a.y)) a.x = x;
          if (valid(a.x, y)) a.y = y;
        };
        _proto.moveHero = function moveHero() {
          var _this3 = this;
          var h = this.s.hero,
            v = this.meta.move;
          this.move(h, h.radius, v.x * this.s.stats.speed * DT, v.y * this.s.stats.speed * DT);
          if (this.s.time < this.meta.hurtUntil) {
            var moving = Math.hypot(v.x, v.y) > 0.01;
            this.pose(h, moving ? 'run' : 'hurt');
            if (moving) h.face = Math.atan2(v.y, v.x);else h.poseAge = Math.max(0, this.s.time - h.hitAt);
            return;
          }
          if (this.meta.sweep && !this.meta.sweep.cancelled && this.s.time - this.meta.sweep.start < SWEEP_LENGTH) {
            this.pose(h, 'sweep');
            h.poseAge = this.s.time - this.meta.sweep.start;
            return;
          }
          this.pose(h, Math.hypot(v.x, v.y) > 0.01 ? 'run' : 'idle');
          if (Math.hypot(v.x, v.y) > 0.01) h.face = Math.atan2(v.y, v.x);else {
            var nearest = this.nearest(h, Infinity);
            var prior = this.s.enemies.find(function (e) {
              return e.id === _this3.meta.faceTarget;
            });
            if (nearest && (!prior || distance(h, nearest) + 24 < distance(h, prior) && this.s.time - this.meta.faceAt >= 0.15)) {
              this.meta.faceTarget = nearest.id;
              this.meta.faceAt = this.s.time;
            }
            var target = this.s.enemies.find(function (e) {
              return e.id === _this3.meta.faceTarget;
            });
            if (target) h.face = angleTo(h, target);
          }
        };
        _proto.nearest = function nearest(from, range, excluded) {
          var _this4 = this;
          if (excluded === void 0) {
            excluded = [];
          }
          return this.s.enemies.filter(function (e) {
            return e.hp > 0 && e.born <= _this4.s.time && !excluded.includes(e.id) && distance(from, e) <= range;
          }).sort(function (a, b) {
            return distance(from, a) - distance(from, b) || stableId(a.id, b.id);
          })[0];
        };
        _proto.director = function director() {
          var _this5 = this;
          if (this.meta.allWavesDone) return;
          if (this.meta.restUntil !== null) {
            if (this.s.time < this.meta.restUntil) return;
            this.s.wave++;
            this.meta.waveStart = this.s.time;
            this.meta.groups = [];
            this.meta.restUntil = null;
            this.meta.waveOvertime = false;
            this.emit('wave', {
              wave: this.s.wave,
              label: this.stage.waves[this.s.wave].label
            });
          }
          var wave = this.stage.waves[this.s.wave];
          wave.groups.forEach(function (g, i) {
            if (_this5.meta.groups.includes(i) || _this5.s.time - _this5.meta.waveStart < (g.delay || 0)) return;
            _this5.meta.groups.push(i);
            for (var n = 0; n < g.count; n++) {
              var _g$spacing, _g$hpScale, _g$damageScale;
              var a = TAU * n / Math.max(1, g.count),
                h = _this5.s.hero,
                spacing = (_g$spacing = g.spacing) != null ? _g$spacing : 70;
              var p = {
                x: h.x + Math.cos(a) * 340,
                y: h.y + Math.sin(a) * 340
              };
              if (g.pattern === 'north' || g.pattern === 'south' || g.pattern === 'line') p = {
                x: h.x + (n - (g.count - 1) / 2) * spacing,
                y: h.y + (g.pattern === 'south' ? 350 : -350)
              };
              if (g.pattern === 'east' || g.pattern === 'west' || g.pattern === 'flank') p = {
                x: h.x + (g.pattern === 'west' || g.pattern === 'flank' && n % 2 === 0 ? -350 : 350),
                y: h.y + (n - (g.count - 1) / 2) * spacing
              };
              if (g.pattern === 'corners') p = {
                x: h.x + (n % 2 ? 330 : -330),
                y: h.y + (n % 4 < 2 ? -330 : 330)
              };
              _this5.spawn(g.enemy, p, (_g$hpScale = g.hpScale) != null ? _g$hpScale : 1, (_g$damageScale = g.damageScale) != null ? _g$damageScale : 1);
            }
          });
          if (wave.maxSeconds && !this.meta.waveOvertime && this.s.time - this.meta.waveStart >= wave.maxSeconds) {
            this.meta.waveOvertime = true;
            this.emit('wave-overtime', {
              wave: this.s.wave
            });
          }
        };
        _proto.spawn = function spawn(specId, p, hpScale, damageScale, generation) {
          if (hpScale === void 0) {
            hpScale = 1;
          }
          if (damageScale === void 0) {
            damageScale = 1;
          }
          if (generation === void 0) {
            generation = 0;
          }
          var spec = this.enemyById.get(specId);
          if (!spec || this.s.enemies.length >= 220) return;
          var e = {
            id: this.id('enemy'),
            kind: spec.id,
            specId: specId,
            x: clamp(p.x, spec.radius, this.stage.world.width - spec.radius),
            y: clamp(p.y, spec.radius, this.stage.world.height - spec.radius),
            hp: spec.hp * hpScale,
            maxHp: spec.hp * hpScale,
            radius: spec.radius,
            face: 0,
            pose: 'spawn',
            poseAge: 0,
            hitAt: -1,
            born: this.s.time + 1,
            cooldown: this.s.time + 1.5 + this.random() * 0.6,
            ai: 'idle',
            until: 0,
            frozenUntil: 0,
            controlReady: 0,
            aim: 0,
            damage: spec.damage * damageScale,
            generation: generation,
            guarding: false
          };
          // Keep spawns out of authored solid obstacles.
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.stage.world.obstacles), _step4; !(_step4 = _iterator4()).done;) {
            var r = _step4.value;
            if (e.x + e.radius > r.x && e.x - e.radius < r.x + r.width && e.y + e.radius > r.y && e.y - e.radius < r.y + r.height) e.x = clamp(r.x - e.radius - 1, e.radius, this.stage.world.width - e.radius);
          }
          this.s.enemies.push(e);
        };
        _proto.attackTarget = function attackTarget(e) {
          var o = this.s.objective;
          return o.hp !== undefined && o.x !== undefined && o.y !== undefined && distance(e, {
            x: o.x,
            y: o.y
          }) < distance(e, this.s.hero) ? {
            x: o.x,
            y: o.y,
            radius: o.radius
          } : this.s.hero;
        };
        _proto.enemies = function enemies() {
          for (var _i2 = 0, _arr = this.s.enemies; _i2 < _arr.length; _i2++) {
            var _spec$range, _spec$range2;
            var e = _arr[_i2];
            if (e.born > this.s.time || e.hp <= 0) continue;
            if (e.frozenUntil > this.s.time) {
              if (e.ai === 'idle') e.cooldown += DT;else e.until += DT;
              for (var _iterator5 = _createForOfIteratorHelperLoose(this.s.effects), _step5; !(_step5 = _iterator5()).done;) {
                var fx = _step5.value;
                if (fx.owner === e.id) fx.age -= DT;
              }
              this.pose(e, 'frozen');
              continue;
            }
            var spec = this.enemyById.get(e.specId),
              target = this.attackTarget(e),
              d = distance(e, target);
            e.guarding = spec.behavior === 'guard' && (this.s.time - e.born) % 5 < 2;
            if (e.ai === 'warning') {
              this.pose(e, 'windup');
              if (this.s.time < e.until) continue;
              e.ai = 'execute';
              e.until = this.s.time + (spec.behavior === 'charge' || spec.bossPattern === 'hunt' ? 0.65 : 0.25);
              this.pose(e, 'attack');
              this.enemyExecute(e, spec);
              this.emit('enemyattack', {
                enemyId: e.id,
                pattern: spec.bossPattern || spec.behavior
              });
            }
            if (e.ai === 'execute') {
              if (spec.behavior === 'charge' || spec.bossPattern === 'hunt') this.move(e, e.radius, Math.cos(e.aim) * field(spec, 'chargeSpeed', spec.speed * 3) * DT, Math.sin(e.aim) * field(spec, 'chargeSpeed', spec.speed * 3) * DT);
              if (spec.behavior === 'charge' || spec.bossPattern === 'hunt' || spec.behavior === 'chase' || spec.behavior === 'guard' || spec.behavior === 'split') this.contact(e, target);
              if (this.s.time >= e.until) {
                var _spec$attackInterval;
                e.ai = 'idle';
                e.cooldown = this.s.time + ((_spec$attackInterval = spec.attackInterval) != null ? _spec$attackInterval : 1.5);
              }
              continue;
            }
            e.face = angleTo(e, target);
            var ranged = spec.behavior === 'ranged' || spec.behavior === 'summon' || spec.behavior === 'boss';
            var reach = ranged ? (_spec$range = spec.range) != null ? _spec$range : 600 : spec.behavior === 'charge' ? (_spec$range2 = spec.range) != null ? _spec$range2 : 250 : e.radius + target.radius + 18;
            if (d <= reach && this.s.time >= e.cooldown) {
              var _spec$telegraph;
              e.ai = 'warning';
              e.aim = angleTo(e, target);
              e.face = e.aim;
              e.until = this.s.time + ((_spec$telegraph = spec.telegraph) != null ? _spec$telegraph : ranged ? 0.9 : 0.45);
              this.pose(e, 'windup');
              var pattern = spec.bossPattern || spec.behavior;
              var shape = pattern === 'rings' ? 'radial' : pattern === 'cross' ? 'rays' : pattern === 'fan' || pattern === 'hunt' ? 'fan' : pattern === 'ranged' || pattern === 'charge' ? 'line' : 'circle';
              this.s.effects.push({
                id: this.id('warning'),
                kind: "warning-" + pattern,
                shape: shape,
                x: e.x,
                y: e.y,
                angle: e.aim,
                radius: reach,
                length: spec.behavior === 'charge' ? field(spec, 'chargeSpeed', spec.speed * 3) * 0.65 : reach,
                width: spec.behavior === 'charge' ? 2 * e.radius + 2 * target.radius : 16,
                count: pattern === 'rings' ? 12 : pattern === 'cross' ? 4 : pattern === 'fan' ? 7 : pattern === 'hunt' ? 3 : 1,
                arcRad: pattern === 'fan' ? 1.32 : pattern === 'hunt' ? 0.7 : 0,
                chargeLength: pattern === 'hunt' ? field(spec, 'chargeSpeed', spec.speed * 3) * 0.65 : 0,
                age: 0,
                duration: e.until - this.s.time,
                owner: e.id
              });
            } else if (d > (ranged ? Math.min(240, reach * 0.6) : e.radius + target.radius + 3)) {
              var _e$navUntil;
              if (!e.nav || ((_e$navUntil = e.navUntil) != null ? _e$navUntil : 0) <= this.s.time || !e.navTarget || distance(e.navTarget, target) > 80 || distance(e, e.nav) < spec.speed * DT + 2) {
                e.nav = navigationPoint(e, target, e.radius, this.stage.world.obstacles, this.stage.world.width, this.stage.world.height);
                e.navTarget = _extends({}, target);
                e.navUntil = this.s.time + 0.5;
              }
              if (distance(e, e.nav) > 0) {
                var heading = angleTo(e, e.nav);
                this.move(e, e.radius, Math.cos(heading) * spec.speed * DT, Math.sin(heading) * spec.speed * DT);
                this.pose(e, 'move');
              } else this.pose(e, e.guarding ? 'guard' : 'idle');
            } else this.pose(e, e.guarding ? 'guard' : 'idle');
          }
        };
        _proto.enemyExecute = function enemyExecute(e, spec) {
          var _spec$projectileSpeed, _spec$range3;
          if (spec.behavior === 'summon') {
            var add = typeof spec.splitInto === 'string' ? spec.splitInto : 'EN01';
            for (var i = 0; i < 2; i++) this.spawn(add, {
              x: e.x + (i ? 60 : -60),
              y: e.y
            }, 1, 1, 1);
          } else if (spec.behavior === 'ranged') this.fire('enemy', e, e.aim, e.damage, (_spec$projectileSpeed = spec.projectileSpeed) != null ? _spec$projectileSpeed : 210, (_spec$range3 = spec.range) != null ? _spec$range3 : 650, 7, 1, e.id);else if (spec.behavior === 'boss') {
            var _spec$bossPattern;
            var pattern = (_spec$bossPattern = spec.bossPattern) != null ? _spec$bossPattern : 'fan';
            var count = pattern === 'rings' ? 12 : pattern === 'cross' ? 4 : pattern === 'hunt' ? 3 : 7;
            for (var _i3 = 0; _i3 < count; _i3++) {
              var _spec$projectileSpeed2, _spec$range4;
              var a = pattern === 'rings' ? _i3 * TAU / count : pattern === 'cross' ? e.aim + _i3 * Math.PI / 2 : e.aim + (_i3 - (count - 1) / 2) * (pattern === 'hunt' ? 0.35 : 0.22);
              this.fire('enemy', e, a, e.damage, (_spec$projectileSpeed2 = spec.projectileSpeed) != null ? _spec$projectileSpeed2 : 200, (_spec$range4 = spec.range) != null ? _spec$range4 : 650, 8, 1, e.id);
            }
          }
        };
        _proto.contact = function contact(e, target) {
          if (distance(e, target) > e.radius + target.radius + 10) return;
          if (target === this.s.hero) this.hurtHero(e.damage, e.id);else this.hurtEscort(e.damage, e.id);
        };
        _proto.hurtHero = function hurtHero(damage, source) {
          if (this.s.time < this.s.invincibleUntil || this.s.hero.hp <= 0) return;
          var actual = Math.min(this.s.hero.hp, Math.max(1, damage));
          this.s.hero.hp -= actual;
          this.s.hero.hitAt = this.s.time;
          this.s.invincibleUntil = this.s.time + 0.65;
          this.meta.hurtUntil = this.s.time + 0.27;
          if (this.meta.sweep) this.meta.sweep.cancelled = true;
          this.pose(this.s.hero, Math.hypot(this.meta.move.x, this.meta.move.y) > 0.01 ? 'run' : 'hurt');
          this.emit('hit', {
            targetId: 'hero',
            source: source,
            damage: actual
          });
        };
        _proto.hurtEscort = function hurtEscort(damage, source) {
          var key = 'escort-incoming';
          if ((this.meta.gates[key] || 0) > this.s.time || this.s.objective.hp === undefined) return;
          this.meta.gates[key] = this.s.time + 0.75;
          this.s.objective.hp = Math.max(0, this.s.objective.hp - damage);
          this.emit('hit', {
            targetId: 'escort',
            source: source,
            damage: damage
          });
        };
        _proto.basicAttack = function basicAttack() {
          var h = this.s.hero,
            t = this.s.time;
          if (this.meta.sweep && t - this.meta.sweep.start >= SWEEP_LENGTH) this.meta.sweep = null;
          if (!this.meta.sweep && t >= this.meta.nextAttack && t >= this.meta.hurtUntil) {
            var target = this.s.enemies.filter(function (e) {
              return e.hp > 0 && e.born <= t && distance(h, e) <= 155 + e.radius;
            }).sort(function (a, b) {
              return distance(h, a) - distance(h, b) || stableId(a.id, b.id);
            })[0];
            if (target) {
              var angle = angleTo(h, target);
              this.meta.sweep = {
                start: t,
                angle: angle,
                hits: [],
                cancelled: false,
                missed: false
              };
              this.meta.nextAttack = t + 1.6;
              h.face = angle;
              this.pose(h, 'sweep');
              h.poseAge = 0;
              this.emit('sweep', {
                angle: angle
              });
            }
          }
          var sw = this.meta.sweep;
          if (!sw) return;
          if (!sw.cancelled) h.face = sw.angle;
          var age = t - sw.start,
            prev = age - DT;
          if (!sw.cancelled && age >= SWEEP_START && prev < SWEEP_END) {
            var lo = -SWEEP_ARC / 2 + SWEEP_ARC * clamp((prev - SWEEP_START) / (SWEEP_END - SWEEP_START), 0, 1);
            var hi = -SWEEP_ARC / 2 + SWEEP_ARC * clamp((age - SWEEP_START) / (SWEEP_END - SWEEP_START), 0, 1);
            for (var _i4 = 0, _arr2 = this.s.enemies; _i4 < _arr2.length; _i4++) {
              var e = _arr2[_i4];
              var d = distance(h, e),
                a = wrap(angleTo(h, e) - sw.angle),
                pad = Math.asin(Math.min(1, e.radius / Math.max(1, d)));
              if (e.born <= t && !sw.hits.includes(e.id) && d <= 155 + e.radius && a + pad >= lo && a - pad <= hi) {
                sw.hits.push(e.id);
                this.hit(e, 14 * this.s.stats.damageMultiplier, 'basic', h);
              }
            }
          }
          if (age >= SWEEP_END && !sw.missed) {
            sw.missed = true;
            if (!sw.hits.length) this.emit('miss', {
              source: 'basic'
            });
          }
        };
        _proto.fire = function fire(team, origin, angle, damage, speed, range, radius, pierce, skill, cast, control) {
          var _this$s$enemies$find$, _this$s$enemies$find;
          if (cast === void 0) {
            cast = this.id('cast');
          }
          if (control === void 0) {
            control = 0;
          }
          if (this.s.projectiles.length >= 512) return;
          var shot = {
            id: this.id('shot'),
            kind: team === 'enemy' ? (_this$s$enemies$find$ = (_this$s$enemies$find = this.s.enemies.find(function (e) {
              return e.id === skill;
            })) == null ? void 0 : _this$s$enemies$find.kind) != null ? _this$s$enemies$find$ : skill : skill,
            team: team,
            x: origin.x,
            y: origin.y,
            angle: angle,
            radius: radius,
            damage: damage,
            speed: speed,
            life: Math.max(0.1, range / Math.max(1, speed)),
            remaining: range,
            pierce: pierce,
            hits: [],
            skill: skill,
            cast: cast,
            control: control,
            turns: 0
          };
          this.s.projectiles.push(shot);
        };
        _proto.hit = function hit(e, damage, source, origin, control, knockback) {
          if (control === void 0) {
            control = 0;
          }
          if (knockback === void 0) {
            knockback = 0;
          }
          this.meta.pendingHits.push({
            enemy: e.id,
            damage: damage,
            source: source,
            origin: {
              x: origin.x,
              y: origin.y
            },
            control: control,
            knockback: knockback
          });
        };
        _proto.gate = function gate(key, seconds) {
          if ((this.meta.gates[key] || 0) > this.s.time) return false;
          this.meta.gates[key] = this.s.time + seconds;
          return true;
        };
        _proto.skills = function skills() {
          var _this6 = this;
          this.s.effects = this.s.effects.filter(function (z) {
            return z.orbit !== true;
          });
          var _loop = function _loop() {
              var learned = _step6.value;
              var spec = _this6.skillById.get(learned.id);
              if (!spec) return 0; // continue
              var interval = spec.interval / (1 + 0.03 * (learned.rank - 1));
              var damage = spec.damage * (1 + 0.12 * (learned.rank - 1)) * _this6.s.stats.damageMultiplier;
              var h = _this6.s.hero;
              if (spec.id === 'SK04' || spec.id === 'SK12') {
                var _spec$count;
                var count = (_spec$count = spec.count) != null ? _spec$count : 1;
                for (var i = 0; i < count; i++) {
                  var _spec$radius;
                  var a = _this6.s.time * field(spec, 'angularSpeed', 3) * (spec.id === 'SK12' && i % 2 ? -1 : 1) + i * TAU / count;
                  var point = {
                    x: h.x + Math.cos(a) * spec.range,
                    y: h.y + Math.sin(a) * spec.range
                  };
                  _this6.s.effects.push(_extends({
                    id: "orbit-" + spec.id + "-" + i,
                    kind: spec.id
                  }, point, {
                    radius: (_spec$radius = spec.radius) != null ? _spec$radius : 18,
                    angle: a,
                    age: 0,
                    duration: DT * 1.1,
                    orbit: true
                  }));
                  for (var _i5 = 0, _arr3 = _this6.s.enemies; _i5 < _arr3.length; _i5++) {
                    var _spec$radius2;
                    var e = _arr3[_i5];
                    if (e.born <= _this6.s.time && distance(point, e) <= ((_spec$radius2 = spec.radius) != null ? _spec$radius2 : 18) + e.radius && _this6.gate(spec.id + ":" + e.id, interval)) _this6.hit(e, damage, spec.id, point);
                  }
                }
                return 0; // continue
              }

              learned.cooldown = Math.max(0, learned.cooldown - DT);
              if (learned.cooldown > 1e-9) return 0; // continue
              var target = spec.id === 'SK02' ? _this6.s.enemies.filter(function (e) {
                  return e.born <= _this6.s.time && distance(h, e) <= spec.range;
                }).sort(function (a, b) {
                  var _this6$enemyById$get$, _this6$enemyById$get, _this6$enemyById$get$2, _this6$enemyById$get2;
                  return ((_this6$enemyById$get$ = (_this6$enemyById$get = _this6.enemyById.get(b.specId)) == null ? void 0 : _this6$enemyById$get.armor) != null ? _this6$enemyById$get$ : 0) - ((_this6$enemyById$get$2 = (_this6$enemyById$get2 = _this6.enemyById.get(a.specId)) == null ? void 0 : _this6$enemyById$get2.armor) != null ? _this6$enemyById$get$2 : 0) || distance(h, a) - distance(h, b) || stableId(a.id, b.id);
                })[0] : _this6.nearest(h, spec.range),
                cast = _this6.id('cast');
              if (!target && spec.id !== 'SK07' && spec.id !== 'SK11') return 0; // continue
              learned.cooldown = interval;
              var aim = target ? angleTo(h, target) : h.face;
              if (spec.id === 'SK01' || spec.id === 'SK02' || spec.id === 'SK08' || spec.id === 'SK09' || spec.id === 'SK11') {
                var _spec$count2;
                var _count = (_spec$count2 = spec.count) != null ? _spec$count2 : 1;
                for (var _i6 = 0; _i6 < _count; _i6++) {
                  var _spec$speed, _spec$radius3, _spec$control;
                  var _a = spec.id === 'SK11' ? _i6 * TAU / _count : aim + (_i6 - (_count - 1) / 2) * field(spec, 'spread', 0) * Math.PI / 180;
                  _this6.fire('hero', h, _a, damage, (_spec$speed = spec.speed) != null ? _spec$speed : 300, spec.range, (_spec$radius3 = spec.radius) != null ? _spec$radius3 : 8, field(spec, 'pierce', 1), spec.id, cast, (_spec$control = spec.control) != null ? _spec$control : 0);
                }
              } else if (spec.id === 'SK10') {
                var next = target;
                var hitIds = [];
                var origin = h;
                for (var _i7 = 0; _i7 < ((_spec$count3 = spec.count) != null ? _spec$count3 : 3) && next; _i7++) {
                  var _spec$count3, _spec$radius4;
                  _this6.hit(next, damage * Math.pow(field(spec, 'jumpFalloff', 0.85), _i7), spec.id, origin);
                  hitIds.push(next.id);
                  _this6.s.effects.push(_extends({
                    id: _this6.id('chain'),
                    kind: 'SK10'
                  }, origin, {
                    age: 0,
                    duration: 0.18,
                    radius: distance(origin, next),
                    angle: angleTo(origin, next)
                  }));
                  origin = next;
                  next = _this6.nearest(origin, (_spec$radius4 = spec.radius) != null ? _spec$radius4 : 165, hitIds);
                }
              } else if (spec.id === 'SK07') {
                for (var _i8 = 0, _arr4 = _this6.s.enemies; _i8 < _arr4.length; _i8++) {
                  var _e = _arr4[_i8];
                  if (_e.born <= _this6.s.time && distance(h, _e) <= spec.range + _e.radius) _this6.hit(_e, damage, spec.id, h, 0, field(spec, 'knockback', 6));
                }
                _this6.s.effects.push({
                  id: _this6.id('pulse'),
                  kind: spec.id,
                  x: h.x,
                  y: h.y,
                  age: 0,
                  duration: 0.25,
                  radius: spec.range
                });
              } else {
                var candidates = _this6.s.enemies.filter(function (e) {
                  return e.born <= _this6.s.time && distance(h, e) <= spec.range;
                }).sort(function (a, b) {
                  return distance(h, a) - distance(h, b) || stableId(a.id, b.id);
                });
                for (var _i9 = 0; _i9 < Math.min((_spec$count4 = spec.count) != null ? _spec$count4 : 1, candidates.length); _i9++) {
                  var _spec$count4, _spec$duration, _spec$radius5, _spec$speed2;
                  var at = spec.id === 'SK03' ? {
                    x: h.x,
                    y: h.y
                  } : candidates[_i9];
                  var zone = {
                    id: _this6.id('zone'),
                    kind: spec.id,
                    x: at.x,
                    y: at.y,
                    age: 0,
                    duration: ((_spec$duration = spec.duration) != null ? _spec$duration : 2) + field(spec, 'warning', 0),
                    radius: (_spec$radius5 = spec.radius) != null ? _spec$radius5 : 60,
                    angle: aim,
                    damage: damage,
                    skill: spec.id,
                    cast: cast,
                    warning: field(spec, 'warning', 0),
                    nextPulse: field(spec, 'warning', 0),
                    pulse: field(spec, 'pulse', 0.35),
                    speed: spec.id === 'SK03' ? (_spec$speed2 = spec.speed) != null ? _spec$speed2 : 65 : 0
                  };
                  _this6.s.effects.push(zone);
                }
              }
            },
            _ret;
          for (var _iterator6 = _createForOfIteratorHelperLoose(this.s.skills), _step6; !(_step6 = _iterator6()).done;) {
            _ret = _loop();
            if (_ret === 0) continue;
          }
        };
        _proto.companion = function companion() {
          var c = this.s.stats.companion;
          if (!c || c.id !== 'CO02') return;
          this.meta.companionCooldown = Math.max(0, this.meta.companionCooldown - DT);
          if (this.meta.companionCooldown > 0) return;
          var target = this.nearest(this.s.hero, 600);
          if (!target) return;
          this.fire('companion', this.s.hero, angleTo(this.s.hero, target), 4 + c.level - 1, 340, 600, 7, 1, 'CO02');
          this.meta.companionCooldown = 2.6;
        };
        _proto.segmentDistance = function segmentDistance(a, b, p) {
          var dx = b.x - a.x,
            dy = b.y - a.y,
            n = dx * dx + dy * dy;
          var t = n ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / n, 0, 1) : 0;
          return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
        };
        _proto.shots = function shots() {
          var _this7 = this;
          var alive = [];
          var _loop2 = function _loop2() {
            var p = _arr5[_i10];
            var old = {
                x: p.x,
                y: p.y
              },
              travel = Math.min(p.remaining, p.speed * DT);
            p.x += Math.cos(p.angle) * travel;
            p.y += Math.sin(p.angle) * travel;
            p.remaining -= travel;
            p.life -= DT;
            if (_this7.stage.world.obstacles.some(function (r) {
              return segmentRectangle(old, p, {
                x: r.x - p.radius,
                y: r.y - p.radius,
                width: r.width + 2 * p.radius,
                height: r.height + 2 * p.radius
              });
            })) return 1; // continue
            if (p.team === 'enemy') {
              if (_this7.segmentDistance(old, p, _this7.s.hero) <= p.radius + HERO_RADIUS) {
                _this7.hurtHero(p.damage, p.skill);
                p.pierce = 0;
              }
              var o = _this7.s.objective;
              if (p.pierce && o.hp !== undefined && o.x !== undefined && o.y !== undefined && _this7.segmentDistance(old, p, {
                x: o.x,
                y: o.y
              }) <= p.radius + o.radius) {
                _this7.hurtEscort(p.damage, p.skill);
                p.pierce = 0;
              }
            } else {
              var targets = _this7.s.enemies.filter(function (e) {
                return e.born <= _this7.s.time && !p.hits.includes(e.id) && _this7.segmentDistance(old, p, e) <= p.radius + e.radius;
              }).sort(function (a, b) {
                return distance(old, a) - distance(old, b) || stableId(a.id, b.id);
              });
              for (var _iterator7 = _createForOfIteratorHelperLoose(targets), _step7; !(_step7 = _iterator7()).done;) {
                var e = _step7.value;
                p.hits.push(e.id);
                p.pierce--;
                if (_this7.gate(p.cast + ":" + e.id, p.skill === 'SK09' || p.skill === 'SK11' ? 0.15 : 0.001)) _this7.hit(e, p.damage, p.skill, old, p.control);
                if (p.skill === 'SK02' && p.hits.length % 3 === 0 && p.turns < 2) {
                  var next = _this7.nearest(p, p.remaining, p.hits);
                  if (next) {
                    p.angle = angleTo(p, next);
                    p.turns++;
                  }
                }
                if (p.pierce <= 0) break;
              }
            }
            if (p.pierce > 0 && p.life > 0 && p.remaining > 0) alive.push(p);
          };
          for (var _i10 = 0, _arr5 = this.s.projectiles; _i10 < _arr5.length; _i10++) {
            if (_loop2()) continue;
          }
          this.s.projectiles = alive;
        };
        _proto.effects = function effects() {
          var keep = [];
          for (var _i11 = 0, _arr6 = this.s.effects; _i11 < _arr6.length; _i11++) {
            var z = _arr6[_i11];
            z.age += DT;
            if (z.speed) {
              z.x += Math.cos(z.angle || 0) * z.speed * DT;
              z.y += Math.sin(z.angle || 0) * z.speed * DT;
            }
            if (z.skill && z.damage !== undefined && z.nextPulse !== undefined && z.age >= z.nextPulse && z.age <= z.duration) {
              var _z$pulse;
              z.nextPulse += (_z$pulse = z.pulse) != null ? _z$pulse : 0.35;
              for (var _i12 = 0, _arr7 = this.s.enemies; _i12 < _arr7.length; _i12++) {
                var _z$pulse2;
                var e = _arr7[_i12];
                if (e.born <= this.s.time && distance(z, e) <= z.radius + e.radius && this.gate((z.skill === 'SK03' ? z.skill : z.cast) + ":" + e.id, (_z$pulse2 = z.pulse) != null ? _z$pulse2 : 0.35)) this.hit(e, z.damage, z.skill, z);
              }
            }
            if (z.age < z.duration) keep.push(z);
          }
          this.s.effects = keep;
        };
        _proto.resolveHits = function resolveHits() {
          var _this8 = this;
          var _loop3 = function _loop3() {
            var _spec$armor;
            var hit = _step8.value;
            var e = _this8.s.enemies.find(function (x) {
              return x.id === hit.enemy;
            });
            if (!e || e.hp <= 0) return 1; // continue
            var spec = _this8.enemyById.get(e.specId);
            var frontal = e.guarding && Math.abs(wrap(angleTo(e, hit.origin) - e.face)) <= Math.PI / 3;
            var armor = Math.min(0.65, ((_spec$armor = spec.armor) != null ? _spec$armor : 0) + (frontal ? 0.5 : 0));
            var actual = Math.min(e.hp, Math.max(1, hit.damage * (1 - armor)));
            e.hp -= actual;
            e.hitAt = _this8.s.time;
            _this8.emit('hit', {
              source: hit.source,
              targetId: e.id,
              damage: actual
            });
            if (hit.control && _this8.s.time >= e.controlReady) {
              var boss = spec.behavior === 'boss',
                elite = e.specId.startsWith('EL'),
                factor = boss ? 0.2 : elite ? 0.5 : e.specId === 'EN03' ? 0.7 : 1;
              e.frozenUntil = _this8.s.time + hit.control * factor;
              e.controlReady = e.frozenUntil + (boss ? 3 : elite ? 1.5 : 0.6);
            }
            if (hit.knockback && spec.behavior !== 'boss') {
              var a = angleTo(hit.origin, e),
                n = hit.knockback * (e.specId.startsWith('EL') ? 0.3 : 1);
              _this8.move(e, e.radius, Math.cos(a) * n, Math.sin(a) * n);
            }
          };
          for (var _iterator8 = _createForOfIteratorHelperLoose(this.meta.pendingHits), _step8; !(_step8 = _iterator8()).done;) {
            if (_loop3()) continue;
          }
          var dead = this.s.enemies.filter(function (e) {
            return e.hp <= 0;
          });
          var deadIds = new Set(dead.map(function (e) {
            return e.id;
          }));
          this.s.effects = this.s.effects.filter(function (z) {
            return !deadIds.has(z.owner);
          });
          this.s.enemies = this.s.enemies.filter(function (e) {
            return e.hp > 0;
          });
          for (var _iterator9 = _createForOfIteratorHelperLoose(dead), _step9; !(_step9 = _iterator9()).done;) {
            var e = _step9.value;
            var spec = this.enemyById.get(e.specId);
            this.s.kills++;
            this.s.pickups.push({
              id: this.id('xp'),
              x: e.x,
              y: e.y,
              value: spec.xp
            });
            this.emit('enemydeath', {
              enemyId: e.id,
              enemyKind: e.specId
            });
            if (spec.behavior === 'split' && spec.splitInto && e.generation < 1) for (var i = 0; i < 2; i++) this.spawn(spec.splitInto, {
              x: e.x + (i ? 25 : -25),
              y: e.y
            }, 1, 1, e.generation + 1);
          }
          this.meta.pendingHits = [];
        };
        _proto.collect = function collect() {
          var keep = [];
          for (var _iterator10 = _createForOfIteratorHelperLoose(this.s.pickups), _step10; !(_step10 = _iterator10()).done;) {
            var p = _step10.value;
            var d = distance(p, this.s.hero);
            if (d <= this.s.stats.pickupRadius || p.attracted === true) {
              p.attracted = true;
              var step = Math.min(d, 420 * DT),
                a = angleTo(p, this.s.hero);
              p.x += Math.cos(a) * step;
              p.y += Math.sin(a) * step;
              if (distance(p, this.s.hero) <= 24) {
                this.s.xp += p.value;
                this.emit('pickup', {
                  value: p.value,
                  pickupId: p.id
                });
                continue;
              }
            }
            keep.push(p);
          }
          this.s.pickups = keep;
          while (this.s.xp >= this.s.xpNext) {
            this.s.xp -= this.s.xpNext;
            this.s.level++;
            this.s.xpNext = xpThreshold(this.s.level);
            this.s.pendingLevels++;
          }
        };
        _proto.take = function take(items) {
          return items.splice(Math.floor(this.random() * items.length), 1)[0];
        };
        _proto.nextOffer = function nextOffer() {
          var _this9 = this;
          if (this.s.phase !== 'playing' || this.s.offer || !this.s.pendingLevels) return;
          var owned = this.s.skills.filter(function (x) {
            return x.rank < 10 && _this9.skillById.has(x.id);
          }).map(function (x) {
            return x.id;
          }).sort();
          var learned = new Set(this.s.skills.map(function (x) {
            return x.id;
          }));
          var fresh = this.s.skills.length < SKILL_CAP ? Array.from(new Set(this.s.stats.unlockedSkills)).filter(function (x) {
            return !learned.has(x) && _this9.skillById.has(x);
          }).sort() : [];
          var result = [];
          if (owned.length && fresh.length) {
            result.push(this.take(owned), this.take(fresh));
          }
          var rest = [].concat(owned, fresh);
          while (rest.length && result.length < 3) result.push(this.take(rest));
          if (!result.length) {
            this.emit('skills-saturated', {
              skipped: this.s.pendingLevels
            });
            this.s.pendingLevels = 0;
            return;
          }
          for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(this.random() * (i + 1));
            var _ref = [result[j], result[i]];
            result[i] = _ref[0];
            result[j] = _ref[1];
          }
          this.s.offer = {
            id: this.id('offer'),
            skills: result,
            level: this.s.level - this.s.pendingLevels + 1
          };
          this.s.phase = 'choice';
          this.meta.move = {
            x: 0,
            y: 0
          };
          this.emit('levelup', {
            offerId: this.s.offer.id,
            skills: result
          });
        };
        _proto.mechanics = function mechanics() {
          var _this10 = this;
          var _loop4 = function _loop4() {
            var m = _step11.value;
            if (m.kind === 'hazard') {
              var _m$offset;
              var age = _this10.s.time - ((_m$offset = m.offset) != null ? _m$offset : 0);
              if (age < 0 || _this10.meta.allWavesDone && _this10.stage.objective === 'clear') return 1; // continue
              var cycle = Math.floor(age / m.period),
                phase = age % m.period;
              if (_this10.meta.mechanicClocks[m.id] !== cycle) {
                var _m$radius;
                _this10.meta.mechanicClocks[m.id] = cycle;
                _this10.s.effects.push({
                  id: _this10.id('hazard-warning'),
                  kind: "hazard-" + m.shape,
                  shape: m.shape === 'line' ? 'rect' : 'circle',
                  x: m.x,
                  y: m.y,
                  radius: (_m$radius = m.radius) != null ? _m$radius : 40,
                  width: m.width,
                  height: m.height,
                  age: phase - DT,
                  duration: m.warning + m.active,
                  warning: m.warning,
                  activeDuration: m.active
                });
              }
              if (phase >= m.warning && phase < m.warning + m.active) {
                var inside = function inside(v, r) {
                  var _m$radius2, _m$width, _m$height;
                  return m.shape === 'circle' ? distance(v, m) <= ((_m$radius2 = m.radius) != null ? _m$radius2 : 40) + r : Math.abs(v.x - m.x) <= ((_m$width = m.width) != null ? _m$width : 80) / 2 + r && Math.abs(v.y - m.y) <= ((_m$height = m.height) != null ? _m$height : 300) / 2 + r;
                };
                if (inside(_this10.s.hero, HERO_RADIUS)) _this10.hurtHero(m.damage, m.id);
                var o = _this10.s.objective;
                if (o.hp !== undefined && o.x !== undefined && o.y !== undefined && inside({
                  x: o.x,
                  y: o.y
                }, o.radius)) _this10.hurtEscort(m.damage, m.id);
              }
            } else if (m.kind === 'beacon') {
              if (distance(_this10.s.hero, m) <= m.radius) _this10.s.objective.progress = Math.min(m.holdSeconds, _this10.s.objective.progress + DT);
            } else {
              var _o = _this10.s.objective,
                p = {
                  x: _o.x,
                  y: _o.y
                },
                next = m.path[_this10.meta.escortIndex];
              if (next && distance(_this10.s.hero, p) <= 300) {
                var d = distance(p, next),
                  n = Math.min(d, m.speed * DT),
                  a = angleTo(p, next);
                _o.x += Math.cos(a) * n;
                _o.y += Math.sin(a) * n;
                if (d <= n + 1e-8) _this10.meta.escortIndex++;
              }
              _o.progress = m.path.length <= 1 ? 1 : clamp((_this10.meta.escortIndex - 1) / (m.path.length - 1), 0, 1);
            }
          };
          for (var _iterator11 = _createForOfIteratorHelperLoose(this.stage.mechanics), _step11; !(_step11 = _iterator11()).done;) {
            if (_loop4()) continue;
          }
        };
        _proto.progress = function progress() {
          var _this$s$objective$hp;
          var wave = this.stage.waves[this.s.wave];
          if (!this.meta.allWavesDone && this.meta.restUntil === null && this.meta.groups.length === wave.groups.length && !this.s.enemies.length) {
            this.s.completedWaves++;
            this.emit('wave-clear', {
              wave: this.s.wave
            });
            if (this.s.wave === this.stage.waves.length - 1) this.meta.allWavesDone = true;else this.meta.restUntil = this.s.time + wave.rest;
          }
          var clear = this.meta.allWavesDone && !this.s.enemies.length && !this.s.projectiles.some(function (p) {
            return p.team === 'enemy';
          });
          var win = false;
          if (this.stage.objective === 'clear') win = clear;
          if (this.stage.objective === 'survive') {
            var _this$stage$surviveSe;
            this.s.objective.progress = Math.min(this.s.time, this.s.objective.target);
            win = this.s.time >= ((_this$stage$surviveSe = this.stage.surviveSeconds) != null ? _this$stage$surviveSe : Infinity);
          }
          if (this.stage.objective === 'beacon') win = clear && this.s.objective.progress >= this.s.objective.target;
          if (this.stage.objective === 'escort') win = clear && this.s.objective.progress >= 1 && ((_this$s$objective$hp = this.s.objective.hp) != null ? _this$s$objective$hp : 0) > 0;
          if (win) {
            // Unreached drops remain uncollected. Never mint XP on a terminal frame.
            this.s.uncollectedXp = this.s.pickups.reduce(function (sum, p) {
              return sum + p.value;
            }, 0);
            this.s.pendingLevels = 0;
            this.s.offer = null;
            this.end('victory');
          }
        };
        _proto.end = function end(phase) {
          this.s.phase = phase;
          this.s.pauseReason = null;
          this.meta.move = {
            x: 0,
            y: 0
          };
          this.meta.accumulator = 0;
          if (phase === 'defeat') this.pose(this.s.hero, 'dead');
          this.emit(phase, {
            completedWaves: this.s.completedWaves,
            kills: this.s.kills
          });
        };
        _createClass(BattleSim, [{
          key: "state",
          get: function get() {
            return this.readOnly(this.s);
          }
        }]);
        return BattleSim;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/contract.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "38174t1nH9MiLojUTjCvlWq", "contract", undefined);
      /** Shared authored game contract. Root-owned; coordinates are world x-right/y-down. */
      var GAME_VERSION = exports('GAME_VERSION', 'inkblade30.20261106.dev.1');
      var SKILL_CAP = exports('SKILL_CAP', 6);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/economy.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3ee9bc5d29Ftob6kZgqykPR", "economy", undefined);
      /** Approved review.3 prices/rules; stage source milestones are rearranged for30. */
      var INITIAL_SKILL_IDS = exports('INITIAL_SKILL_IDS', ['SK01', 'SK04', 'SK08']);
      var ECONOMY_RULES = exports('ECONOMY_RULES', {
        activationShards: 10,
        itemLevelCap: 10,
        trainingLevelCap: 20,
        attackPerTrainingLevel: 0.05,
        hpPerTrainingLevel: 10,
        equipmentQuantity: [{
          amount: 4,
          numerator: 1,
          denominator: 2
        }, {
          amount: 5,
          numerator: 1,
          denominator: 2
        }],
        companionQuantity: 4,
        duplicateIronPerShard: 1,
        pityMissesBeforeForce: 2,
        failureCoinsPerCompletedWave: 5,
        failureCoinsCap: 20,
        source: 'approved-review.3-economy.v1.1;30-stage unlock/reward extension'
      });
      var TRAINING_COSTS = exports('TRAINING_COSTS', {
        ATK: [40, 60, 85, 115, 150, 190, 235, 285, 340, 400, 465, 535, 610, 690, 775, 865, 960, 1060, 1165, 1275],
        HP: [30, 45, 65, 90, 120, 155, 195, 240, 290, 345, 405, 470, 540, 615, 695, 780, 870, 965, 1065, 1170]
      });
      /** index0 is L1→2; L10 has no next row. Activation L0→1 is shards only. */
      var ITEM_UPGRADE_COSTS = exports('ITEM_UPGRADE_COSTS', {
        equipment: [{
          coins: 60,
          iron: 4
        }, {
          coins: 90,
          iron: 6
        }, {
          coins: 130,
          iron: 9
        }, {
          coins: 180,
          iron: 12
        }, {
          coins: 240,
          iron: 16
        }, {
          coins: 310,
          iron: 21
        }, {
          coins: 390,
          iron: 27
        }, {
          coins: 480,
          iron: 34
        }, {
          coins: 580,
          iron: 42
        }],
        companion: [{
          coins: 80,
          iron: 6
        }, {
          coins: 120,
          iron: 9
        }, {
          coins: 170,
          iron: 13
        }, {
          coins: 230,
          iron: 18
        }, {
          coins: 300,
          iron: 24
        }, {
          coins: 380,
          iron: 31
        }, {
          coins: 470,
          iron: 39
        }, {
          coins: 570,
          iron: 48
        }, {
          coins: 680,
          iron: 58
        }]
      });
      var ITEMS = exports('ITEMS', [{
        id: 'EQ01',
        name: '青锋枪',
        kind: 'equipment',
        slot: 'weapon',
        unlockStage: 1,
        description: '攻击+5%起，每级再+5个百分点。'
      }, {
        id: 'EQ02',
        name: '山行袍',
        kind: 'equipment',
        slot: 'clothes',
        unlockStage: 7,
        description: '最大HP+10起，每级再+10。'
      }, {
        id: 'EQ03',
        name: '青玉坠',
        kind: 'equipment',
        slot: 'accessory',
        unlockStage: 19,
        description: '攻击+2%/HP+4起，每级再+2个百分点/+4HP。'
      }, {
        id: 'CO01',
        name: '行云轮',
        kind: 'companion',
        slot: 'companion',
        unlockStage: 3,
        description: '移速+6/拾取+10u起，每级再+1/+2u。'
      }, {
        id: 'CO02',
        name: '赤鬃小兽',
        kind: 'companion',
        slot: 'companion',
        unlockStage: 13,
        description: '独立伤害4起，每级+1，每2.6秒单发；不继承角色训练装备。'
      }]);
      var EQUIPMENT_IDS = exports('EQUIPMENT_IDS', ['EQ01', 'EQ02', 'EQ03']);
      var COMPANION_IDS = exports('COMPANION_IDS', ['CO01', 'CO02']);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/enemies.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6bca2Ox2WVHDKXGq5qU9vYG", "enemies", undefined);
      /** art keys name candidate source identities, not visual/animation approval. */
      var ENEMIES = exports('ENEMIES', [{
        id: 'EN01',
        name: '翼蝠妖',
        behavior: 'chase',
        hp: 20,
        damage: 5,
        speed: 96,
        radius: 15,
        xp: 2,
        armor: 0,
        attackInterval: 0.9,
        art: 'EN01'
      }, {
        id: 'EN02',
        name: '雾灯魇',
        behavior: 'chase',
        hp: 36,
        damage: 7,
        speed: 82,
        radius: 18,
        xp: 2,
        armor: 0,
        attackInterval: 1,
        art: 'EN02'
      }, {
        id: 'EN03',
        name: '铁背甲虫',
        behavior: 'guard',
        hp: 80,
        damage: 11,
        speed: 60,
        radius: 23,
        xp: 3,
        armor: 0.25,
        attackInterval: 1.2,
        art: 'EN03'
      }, {
        id: 'EN04',
        name: '镰肢螳妖',
        behavior: 'charge',
        hp: 70,
        damage: 10,
        speed: 78,
        radius: 18,
        xp: 3,
        armor: 0.05,
        attackInterval: 3.6,
        telegraph: 0.8,
        range: 240,
        chargeSpeed: 260,
        art: 'EN04'
      }, {
        id: 'EN05',
        name: '棘背弩蜥',
        behavior: 'ranged',
        hp: 52,
        damage: 7,
        speed: 60,
        radius: 17,
        xp: 3,
        armor: 0,
        attackInterval: 3.8,
        range: 630,
        telegraph: 0.9,
        projectileSpeed: 210,
        art: 'EN05'
      }, {
        id: 'EN06',
        name: '空壳怨像',
        behavior: 'charge',
        hp: 64,
        damage: 9,
        speed: 100,
        radius: 19,
        xp: 4,
        armor: 0.1,
        attackInterval: 3.9,
        telegraph: 1,
        range: 280,
        chargeSpeed: 150,
        art: 'EN06'
      }, {
        id: 'EL01',
        name: '岩甲犀卫',
        behavior: 'guard',
        hp: 180,
        damage: 14,
        speed: 64,
        radius: 30,
        xp: 10,
        armor: 0.3,
        attackInterval: 1.4,
        art: 'EL01'
      }, {
        id: 'EL02',
        name: '三瞳蛛猎',
        behavior: 'ranged',
        hp: 145,
        damage: 11,
        speed: 76,
        radius: 26,
        xp: 10,
        armor: 0.1,
        attackInterval: 3.4,
        range: 660,
        telegraph: 1.1,
        projectileSpeed: 235,
        art: 'EL02'
      }, {
        id: 'BO01',
        name: '裂锋螳王',
        behavior: 'boss',
        bossPattern: 'fan',
        hp: 180,
        damage: 12,
        speed: 60,
        radius: 42,
        xp: 12,
        armor: 0.1,
        attackInterval: 6,
        range: 650,
        telegraph: 2.4,
        projectileSpeed: 200,
        art: 'BO01'
      }, {
        id: 'BO02',
        name: '裂地獠兽',
        behavior: 'boss',
        bossPattern: 'rings',
        hp: 300,
        damage: 16,
        speed: 60,
        radius: 42,
        xp: 16,
        armor: 0.1,
        attackInterval: 5.8,
        range: 180,
        telegraph: 1.4,
        projectileSpeed: 180,
        art: 'BO02'
      }, {
        id: 'BO03',
        name: '星核玄龟',
        behavior: 'boss',
        bossPattern: 'cross',
        hp: 360,
        damage: 14,
        speed: 45,
        radius: 44,
        xp: 18,
        armor: 0.15,
        attackInterval: 5.8,
        range: 650,
        telegraph: 1.4,
        projectileSpeed: 190,
        art: 'BO03'
      }, {
        id: 'BO04',
        name: '玄羽鸦皇',
        behavior: 'boss',
        bossPattern: 'hunt',
        hp: 420,
        damage: 12,
        speed: 72,
        radius: 42,
        xp: 20,
        armor: 0.1,
        attackInterval: 5.4,
        range: 650,
        telegraph: 1.1,
        projectileSpeed: 200,
        art: 'BO04'
      }]);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './account.ts', './BO01Presentation.ts', './PresentationLoading.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _extends, _asyncToGenerator, _regeneratorRuntime, cclegacy, SpriteFrame, Rect, Size, Vec2, director, Director, UITransform, Font, resources, AudioClip, Node, Graphics, Color, Sprite, Label, LabelOutline, UIOpacity, view, sys, Vec3, input, Input, game, Game, KeyCode, Texture2D, AudioSource, assetManager, JsonAsset, runStats, ITEM_NAMES, trainingCost, upgradeCost, SLOT, BO01Presentation, CAMP_IMAGE_KEYS;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      Rect = module.Rect;
      Size = module.Size;
      Vec2 = module.Vec2;
      director = module.director;
      Director = module.Director;
      UITransform = module.UITransform;
      Font = module.Font;
      resources = module.resources;
      AudioClip = module.AudioClip;
      Node = module.Node;
      Graphics = module.Graphics;
      Color = module.Color;
      Sprite = module.Sprite;
      Label = module.Label;
      LabelOutline = module.LabelOutline;
      UIOpacity = module.UIOpacity;
      view = module.view;
      sys = module.sys;
      Vec3 = module.Vec3;
      input = module.input;
      Input = module.Input;
      game = module.game;
      Game = module.Game;
      KeyCode = module.KeyCode;
      Texture2D = module.Texture2D;
      AudioSource = module.AudioSource;
      assetManager = module.assetManager;
      JsonAsset = module.JsonAsset;
    }, function (module) {
      runStats = module.runStats;
      ITEM_NAMES = module.ITEM_NAMES;
      trainingCost = module.trainingCost;
      upgradeCost = module.upgradeCost;
      SLOT = module.SLOT;
    }, function (module) {
      BO01Presentation = module.BO01Presentation;
    }, function (module) {
      CAMP_IMAGE_KEYS = module.CAMP_IMAGE_KEYS;
    }],
    execute: function () {
      cclegacy._RF.push({}, "23255lx+DZGJ6nar4O4CMgR", "GameView", undefined);
      var C = {
        ink: '#173e41',
        teal: '#25595b',
        gold: '#dbc18a',
        paper: '#f1e5c9',
        muted: '#c5c4ac',
        red: '#c75943'
      };
      var clamp = function clamp(n, a, b) {
        return Math.max(a, Math.min(b, n));
      };
      var num = function num(n) {
        return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
      };
      /** Native Cocos presentation only. Model mutation and durable operations belong to AppAction. */
      var GameView = exports('GameView', /*#__PURE__*/function () {
        function GameView() {
          this.host = void 0;
          this.root = void 0;
          this.world = void 0;
          this.ground = void 0;
          this.bodies = void 0;
          this.worldG = void 0;
          this.fx = void 0;
          this.objectiveG = void 0;
          this.ui = void 0;
          this.art = void 0;
          this.contentBundle = null;
          this.frames = new Map();
          this.fonts = {};
          this.current = null;
          this.inputContext = '';
          this.width = 750;
          this.height = 1334;
          this.unit = 2;
          this.cssHeight = 667;
          this.safeTop = 0;
          this.safeBottom = 0;
          this.safeLeft = 0;
          this.safeRight = 0;
          this.uiKey = '';
          this.hud = new Map();
          this.buttons = [];
          this.info = null;
          this.preparingStage = false;
          this.selectedTraining = 'ATK';
          this.infoPage = 0;
          this.infoTab = 'skills';
          this.hudState = null;
          this.firstGuidanceSeen = false;
          this.guidanceRun = '';
          this.heroPresentation = null;
          this.labelTargets = new WeakMap();
          this.hpBar = null;
          this.visuals = new Map();
          this.selectedCard = null;
          this.selectedOffer = '';
          this.selectedStage = 'ST01';
          this.stagePage = 0;
          this.selectedItem = 'EQ01';
          this.confirm = null;
          this.detail = null;
          this.detailSkill = null;
          this.localDirty = true;
          this.debugSolids = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('qaSolids') === '1';
          this.bo01Clock = new BO01Presentation();
          this.bo01Samples = [];
          this.escortHistory = null;
          this.escortPresentation = null;
          this.escortGuideState = null;
          this.escortGuide = null;
          this.escortArrow = null;
          this.escortName = null;
          this.companionFollow = null;
          this.companionPresentation = null;
          this.onAction = void 0;
          this.epoch = 0;
          this.dead = false;
          this.cam = {
            x: 750,
            y: 900
          };
          this.worldRun = '';
          this.cameraTick = -1;
          this.cameraViewport = null;
          this.cameraRebase = null;
          this.groundPresentation = null;
          this.heroEnvelope = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          };
          this.controlKeys = new Set();
          this.mouseSuppressedUntil = 0;
          this.pointers = new Set();
          this.blocked = false;
          this.pointer = null;
          this.origin = {
            x: 0,
            y: 0
          };
          this.downHit = null;
          this.dragged = false;
          this.keys = new Set();
          this.focus = 0;
          this.keyboardFocus = false;
          this.channels = [];
          this.clips = {};
          this.audioIndex = 0;
          this.audioReady = false;
          this.audioFailed = [];
          this.audioUnlocked = false;
          this.seq = 0;
          this.audioRun = '';
          this.lastFoot = 0;
          this.loading = void 0;
          this.readContext = void 0;
          this.criticalReady = false;
          this.remainingReady = false;
          this.remainingPromise = null;
          this.remainingError = null;
          this.failedAssetKey = '';
          this.assetPromises = new Map();
          this.visible = true;
          this.actionPending = false;
          this.intentSerial = 0;
          this.pendingIntent = null;
          this.revealCallback = null;
          this.audioStarted = false;
          this.heldActionKeys = new Set();
          this.blockedMovementKeys = new Set();
          this.stageLayout = null;
          this.stagePageSize = 4;
          this.handlers = null;
        }
        var _proto = GameView.prototype;
        _proto.initialize = /*#__PURE__*/function () {
          var _initialize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(host, onAction, options) {
            var _this = this;
            var epoch, _iterator, _step, key, i;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  this.host = host;
                  this.onAction = onAction;
                  this.loading = options.loading;
                  this.readContext = options.readContext;
                  this.current = options.initialView;
                  this.dead = false;
                  epoch = ++this.epoch;
                  this.root = this.layer('InkbladePresentation', host);
                  this.root.addComponent(UITransform).setContentSize(750, 1334);
                  this.world = this.layer('WorldYDown', this.root);
                  this.ground = this.layer('Ground', this.world);
                  this.worldG = this.layer('Geometry', this.world).addComponent(Graphics);
                  this.bodies = this.layer('FootSortedActors', this.world);
                  this.fx = this.layer('TelegraphsAndEffects', this.world).addComponent(Graphics);
                  this.objectiveG = this.layer('WorldObjectiveInformation', this.world).addComponent(Graphics);
                  this.ui = this.layer('Interface', this.root);
                  this.bind();
                  this.loading.begin('manifest');
                  _context.next = 20;
                  return this.load('inkblade/art', JsonAsset, '@manifest').then(function (x) {
                    return x.json;
                  });
                case 20:
                  this.art = _context.sent;
                  this.assertLive(epoch);
                  this.validateMetadata();
                  this.loading.auditCatalog(this.art.version, [].concat(Object.entries(this.art.entries).filter(function (_ref) {
                    var e = _ref[1];
                    return !!e.size;
                  }).map(function (_ref2) {
                    var key = _ref2[0],
                      e = _ref2[1];
                    return {
                      key: key,
                      kind: 'image',
                      sha256: e.sha256
                    };
                  }), ['fonts/Title', 'fonts/Body'].map(function (key) {
                    return {
                      key: key,
                      kind: 'font',
                      sha256: _this.art.entries[key].sha256
                    };
                  })));
                  this.loading.auditValidated('@manifest', 'metadata-validated');
                  this.loading.begin('bundle');
                  this.loading.auditRequested('@bundle', 'phase');
                  this.loading.auditIssued('@bundle');
                  _context.next = 30;
                  return new Promise(function (resolve, reject) {
                    return assetManager.loadBundle('inkblade-content', function (error, bundle) {
                      _this.loading.auditCallback('@bundle', !!error);
                      error ? reject(error) : resolve(bundle);
                    });
                  });
                case 30:
                  this.contentBundle = _context.sent;
                  this.assertLive(epoch);
                  this.loading.auditValidated('@bundle', 'bundle-returned');
                  if (!(options.initialView.screen === 'camp')) {
                    _context.next = 48;
                    break;
                  }
                  this.loading.begin('critical', CAMP_IMAGE_KEYS.length + 2);
                  this.loading.auditBatch('camp-critical', [].concat(CAMP_IMAGE_KEYS, ['fonts/Title', 'fonts/Body']));
                  _context.next = 38;
                  return Promise.all([].concat(CAMP_IMAGE_KEYS.map(function (key) {
                    return _this.prepareImage(key, epoch).then(function () {
                      return _this.loading.completed(key);
                    });
                  }), [this.prepareFonts(epoch)]));
                case 38:
                  this.assertLive(epoch);
                  _iterator = _createForOfIteratorHelperLoose(CAMP_IMAGE_KEYS);
                case 40:
                  if ((_step = _iterator()).done) {
                    _context.next = 46;
                    break;
                  }
                  key = _step.value;
                  if (this.frames.has(key)) {
                    _context.next = 44;
                    break;
                  }
                  throw new Error('Missing camp critical frame ' + key);
                case 44:
                  _context.next = 40;
                  break;
                case 46:
                  _context.next = 50;
                  break;
                case 48:
                  _context.next = 50;
                  return this.ensureRemaining();
                case 50:
                  this.assertLive(epoch);
                  this.loading.setMaterial(this.frames.get('ui/plaque-wide'));
                  for (i = 0; i < 8; i++) this.channels.push(this.root.addComponent(AudioSource));
                  this.criticalReady = true;
                  this.loading.criticalReady();
                  this.localDirty = true;
                case 56:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function initialize(_x, _x2, _x3) {
            return _initialize.apply(this, arguments);
          }
          return initialize;
        }();
        _proto.assertLive = function assertLive(epoch) {
          if (this.dead || epoch !== this.epoch) throw new Error('Presentation initialization superseded');
        };
        _proto.validateMetadata = function validateMetadata() {
          var _this$art$actorClips, _this$art$groundVisua, _groundEntry$size, _this$art$enemyProjec, _spineEntry$size, _this$art$enemyProjec2, _eliteSpineEntry$size;
          var startup = this.art.startupLoading;
          if (!startup || startup.version !== 'inkblade30-startup.source21.v1' || startup.criticalImages.join(',') !== CAMP_IMAGE_KEYS.join(',') || startup.criticalFonts.join(',') !== 'fonts/Title,fonts/Body' || startup.initialNonCamp !== 'full-pack-before-render' || startup.remaining !== 'one-shared-full-pack-before-noncamp-intent' || startup.failure !== 'explicit-reload-preserving-storage-no-replay') throw new Error('Invalid startup resource contract');
          if (!((_this$art$actorClips = this.art.actorClips) != null && _this$art$actorClips.BO01)) throw new Error('Missing BO01 source clip binding');
          var map04 = (_this$art$groundVisua = this.art.groundVisuals) == null ? void 0 : _this$art$groundVisua.MAP04,
            groundEntry = this.art.entries['environment/ground-map04-raw'];
          if (!map04 || map04.key !== 'environment/ground-map04-raw' || map04.stageIds.join(',') !== 'ST16,ST17,ST18,ST19,ST20' || map04.frameSize.join(',') !== '985,1596' || !map04.nonColliding || (groundEntry == null || (_groundEntry$size = groundEntry.size) == null ? void 0 : _groundEntry$size.join(',')) !== '985,1596' || groundEntry.sha256 !== 'd58de965343d3af626563646dfb6a9a0677bdc116089d6ad0523cdd8d22e8ade') throw new Error('Invalid MAP04 raw floor binding');
          var spine = (_this$art$enemyProjec = this.art.enemyProjectileVisuals) == null ? void 0 : _this$art$enemyProjec.EN05,
            spineEntry = this.art.entries['objects/EN05-SPINE-body'];
          if (!spine || spine.key !== 'objects/EN05-SPINE-body' || spine.frameSize.join(',') !== '252,245' || spine.unitsPerPixel !== 40 / 177 || spine.anchor[0] !== .49369443870167457 || spine.anchor[1] !== .5130136359476526 || spine.sourceFacing !== 'right' || spine.angleOffsetDegrees !== 0 || (spineEntry == null || (_spineEntry$size = spineEntry.size) == null ? void 0 : _spineEntry$size.join(',')) !== '252,245' || spineEntry.sha256 !== 'c7015e0ff25ad662c5922f7bb4886ff6bb716b208b8e1825fd978584f76f51af') throw new Error('Invalid EN05 projectile visual binding');
          var eliteSpine = (_this$art$enemyProjec2 = this.art.enemyProjectileVisuals) == null ? void 0 : _this$art$enemyProjec2.EL02,
            eliteSpineEntry = this.art.entries['objects/EL02-SPINE-body'];
          if (!eliteSpine || eliteSpine.key !== 'objects/EL02-SPINE-body' || eliteSpine.frameSize.join(',') !== '253,180' || eliteSpine.unitsPerPixel !== 40 / 187 || eliteSpine.anchor[0] !== .5006996961319655 || eliteSpine.anchor[1] !== .46566278804471817 || eliteSpine.sourceFacing !== 'right' || eliteSpine.angleOffsetDegrees !== 0 || (eliteSpineEntry == null || (_eliteSpineEntry$size = eliteSpineEntry.size) == null ? void 0 : _eliteSpineEntry$size.join(',')) !== '253,180' || eliteSpineEntry.sha256 !== '72608eed26eec7baf78bfdf1dba74dba5d36a3bc184e2a763a655ddc09f563ae') throw new Error('Invalid EL02 projectile visual binding');
          for (var _iterator2 = _createForOfIteratorHelperLoose([['ST09', '载灯车', 'environment/escort-lamp-carrier-st09', 289.5, 302.5, 450.25], ['ST16', '载粮车', 'environment/escort-grain-carrier-st16', 296.5, 307.5, 461.5], ['ST23', '载碑车', 'environment/escort-stele-carrier-st23', 502.5, 313.75, 504.5], ['ST28', '载碑车', 'environment/escort-stele-carrier-st23', 502.5, 313.75, 504.5]]), _step2; !(_step2 = _iterator2()).done;) {
            var _entry$size, _entry$size2;
            var _step2$value = _step2.value,
              stageId = _step2$value[0],
              name = _step2$value[1],
              key = _step2$value[2],
              ref = _step2$value[3],
              ax = _step2$value[4],
              ay = _step2$value[5];
            var binding = this.escortBinding(stageId),
              entry = this.art.entries[key];
            if (!binding || binding.name !== name || binding.key !== key || binding.referenceHeight !== ref || binding.heightU !== 40 || binding.anchorPx[0] !== ax || binding.anchorPx[1] !== ay || (entry == null || (_entry$size = entry.size) == null ? void 0 : _entry$size[0]) !== 627 || (entry == null || (_entry$size2 = entry.size) == null ? void 0 : _entry$size2[1]) !== 627) throw new Error('护送目标未能载入 ' + stageId);
          }
        };
        _proto.validateRemainingFrames = function validateRemainingFrames() {
          var map04 = this.art.groundVisuals.MAP04,
            spine = this.art.enemyProjectileVisuals.EN05;
          this.heroEnvelope = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          };
          var map04Frame = this.frames.get(map04.key);
          if (!map04Frame || map04Frame.rect.width !== 985 || map04Frame.rect.height !== 1596) throw new Error('Invalid MAP04 raw floor frame');
          var spineFrame = this.frames.get(spine.key);
          if (!spineFrame || spineFrame.rect.width !== 252 || spineFrame.rect.height !== 245) throw new Error('Invalid EN05 projectile full frame');
          var eliteSpineFrame = this.frames.get(this.art.enemyProjectileVisuals.EL02.key);
          if (!eliteSpineFrame || eliteSpineFrame.rect.width !== 253 || eliteSpineFrame.rect.height !== 180) throw new Error('Invalid EL02 projectile full frame');
          for (var _i = 0, _arr = ['idle', 'run', 'sweep', 'hurt']; _i < _arr.length; _i++) {
            var name = _arr[_i];
            for (var _iterator3 = _createForOfIteratorHelperLoose(this.art.clips[name]), _step3; !(_step3 = _iterator3()).done;) {
              var f = _step3.value;
              var sf = this.frames.get(f.key),
                ref = f.referenceHeight;
              if (!sf || ref <= 0 || f.anchor.length !== 2) throw new Error('Invalid hero frame registration');
              var s = 96 / ref,
                x = Math.max(f.anchor[0], sf.rect.width - f.anchor[0]) * s;
              this.heroEnvelope.left = Math.min(this.heroEnvelope.left, -x);
              this.heroEnvelope.right = Math.max(this.heroEnvelope.right, x);
              this.heroEnvelope.top = Math.min(this.heroEnvelope.top, -f.anchor[1] * s);
              this.heroEnvelope.bottom = Math.max(this.heroEnvelope.bottom, (sf.rect.height - f.anchor[1]) * s);
            }
          }
          for (var _i2 = 0, _arr2 = ['ST09', 'ST16', 'ST23', 'ST28']; _i2 < _arr2.length; _i2++) {
            var stageId = _arr2[_i2];
            var binding = this.escortBinding(stageId),
              _sf = this.frames.get(binding.key);
            if (!_sf || _sf.rect.width !== 627 || _sf.rect.height !== 627) throw new Error('护送目标未能载入 ' + stageId);
          }
          for (var _i3 = 0, _Object$entries = Object.entries(this.art.atlasFrames || {}); _i3 < _Object$entries.length; _i3++) {
            var _Object$entries$_i = _Object$entries[_i3],
              key = _Object$entries$_i[0],
              entry = _Object$entries$_i[1];
            var atlas = this.frames.get(entry.atlas);
            if (!atlas) throw new Error('Missing shared actor atlas ' + entry.atlas);
            var _entry$rect = entry.rect,
              _x4 = _entry$rect[0],
              y = _entry$rect[1],
              w = _entry$rect[2],
              h = _entry$rect[3];
            if (_x4 < 0 || y < 0 || w !== 270 || h !== 180 || _x4 + w > atlas.width || y + h > atlas.height) throw new Error('Invalid actor frame ' + key);
            var frame = new SpriteFrame();
            frame.texture = atlas.texture;
            frame.rect = new Rect(_x4, y, w, h);
            frame.originalSize = new Size(w, h);
            frame.offset = new Vec2();
            frame.packable = false;
            this.frames.set(key, frame);
          }
        };
        _proto.prepareImage = /*#__PURE__*/function () {
          var _prepareImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key, epoch) {
            var _e, texture, f;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  if (!this.frames.has(key)) {
                    _context2.next = 3;
                    break;
                  }
                  return _context2.abrupt("return");
                case 3:
                  _e = this.art.entries[key];
                  if (_e != null && _e.size) {
                    _context2.next = 6;
                    break;
                  }
                  throw new Error('Missing image registration ' + key);
                case 6:
                  _context2.next = 8;
                  return this.load(_e.path + '/texture', Texture2D, key);
                case 8:
                  texture = _context2.sent;
                  this.assertLive(epoch);
                  if (!(texture.width !== _e.size[0] || texture.height !== _e.size[1])) {
                    _context2.next = 12;
                    break;
                  }
                  throw new Error('Image frame dimensions changed ' + key);
                case 12:
                  if (!this.frames.has(key)) {
                    _context2.next = 14;
                    break;
                  }
                  return _context2.abrupt("return");
                case 14:
                  f = new SpriteFrame();
                  f.texture = texture;
                  f.rect = new Rect(0, 0, texture.width, texture.height);
                  f.originalSize = new Size(texture.width, texture.height);
                  f.offset = new Vec2();
                  f.packable = false;
                  this.frames.set(key, f);
                  this.loading.auditValidated(key, 'sprite-frame-created');
                  _context2.next = 28;
                  break;
                case 24:
                  _context2.prev = 24;
                  _context2.t0 = _context2["catch"](0);
                  this.loading.auditError(key);
                  throw _context2.t0;
                case 28:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this, [[0, 24]]);
          }));
          function prepareImage(_x5, _x6) {
            return _prepareImage.apply(this, arguments);
          }
          return prepareImage;
        }();
        _proto.prepareFonts = /*#__PURE__*/function () {
          var _prepareFonts = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(epoch) {
            var _this2 = this;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return Promise.all(['title', 'body'].map( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(name) {
                    var key, font;
                    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                      while (1) switch (_context3.prev = _context3.next) {
                        case 0:
                          if (!_this2.fonts[name]) {
                            _context3.next = 2;
                            break;
                          }
                          return _context3.abrupt("return");
                        case 2:
                          key = 'fonts/' + (name === 'title' ? 'Title' : 'Body');
                          _context3.prev = 3;
                          _context3.next = 6;
                          return _this2.load('inkblade/' + key, Font, key);
                        case 6:
                          font = _context3.sent;
                          _this2.assertLive(epoch);
                          _this2.fonts[name] = font;
                          _this2.loading.auditValidated(key, 'font-asset-assigned-not-glyph-proof');
                          _this2.loading.completed(key);
                          _context3.next = 17;
                          break;
                        case 13:
                          _context3.prev = 13;
                          _context3.t0 = _context3["catch"](3);
                          _this2.loading.auditError(key);
                          throw _context3.t0;
                        case 17:
                        case "end":
                          return _context3.stop();
                      }
                    }, _callee3, null, [[3, 13]]);
                  }))));
                case 2:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          }));
          function prepareFonts(_x7) {
            return _prepareFonts.apply(this, arguments);
          }
          return prepareFonts;
        }();
        _proto.ensureRemaining = function ensureRemaining() {
          var _this3 = this,
            _this$current2;
          if (this.remainingPromise) {
            var _this$current;
            if (!this.remainingReady) this.loading.resumePending(this.loading.state.firstVisible && ((_this$current = this.current) == null ? void 0 : _this$current.screen) === 'camp');
            return this.remainingPromise;
          }
          var epoch = this.epoch,
            keys = Object.entries(this.art.entries).filter(function (_ref4) {
              var key = _ref4[0],
                e = _ref4[1];
              return !!e.size && !_this3.frames.has(key);
            }).map(function (_ref5) {
              var key = _ref5[0];
              return key;
            }),
            fontCount = Number(!this.fonts.title) + Number(!this.fonts.body);
          this.loading.begin('remaining', keys.length + fontCount, this.loading.state.firstVisible && ((_this$current2 = this.current) == null ? void 0 : _this$current2.screen) === 'camp');
          this.loading.auditBatch(this.loading.state.firstVisible ? 'remaining' : 'initial-full', [].concat(keys, !this.fonts.title ? ['fonts/Title'] : [], !this.fonts.body ? ['fonts/Body'] : []));
          this.remainingPromise = Promise.all([].concat(keys.map(function (key) {
            return _this3.prepareImage(key, epoch).then(function () {
              return _this3.loading.completed(key);
            });
          }), [this.prepareFonts(epoch)])).then(function () {
            _this3.assertLive(epoch);
            _this3.validateRemainingFrames();
            _this3.remainingReady = true;
            _this3.loading.remainingReady();
          })["catch"](function (error) {
            _this3.remainingError = error;
            throw error;
          });
          return this.remainingPromise;
        };
        _proto.inspectLoading = function inspectLoading() {
          var _this4 = this,
            _this$loading;
          var imageKeys = Array.from(this.frames.keys()).filter(function (key) {
            var _this4$art;
            return !!((_this4$art = _this4.art) != null && (_this4$art = _this4$art.entries[key]) != null && _this4$art.size);
          });
          return _extends({}, (_this$loading = this.loading) == null ? void 0 : _this$loading.inspect(), {
            actionPending: this.actionPending,
            pendingIntent: this.pendingIntent !== null,
            heldActionKeys: Array.from(this.heldActionKeys),
            loadedImageKeys: imageKeys,
            loadedImages: imageKeys.length,
            loadedAtlasFrames: Array.from(this.frames.keys()).filter(function (key) {
              var _this4$art2;
              return !!((_this4$art2 = _this4.art) != null && (_this4$art2 = _this4$art2.atlasFrames) != null && _this4$art2[key]);
            }).length,
            remainingError: this.remainingError ? String(this.remainingError) : null
          });
        };
        _proto.failureKey = function failureKey() {
          return this.failedAssetKey || 'initialize';
        };
        _proto.isRemainingReady = function isRemainingReady() {
          return this.remainingReady;
        };
        _proto.isInteractive = function isInteractive() {
          return this.criticalReady && this.visible && !this.actionPending && !this.loading.state.active && this.loading.state.interactiveCritical;
        };
        _proto.canAdvance = function canAdvance() {
          return this.isInteractive() && this.remainingReady;
        };
        _proto.setActionPending = function setActionPending(pending) {
          this.actionPending = pending;
          if (pending) {
            this.zeroInput(true);
            this.stopAudio();
          }
        };
        _proto.setVisible = function setVisible(visible) {
          this.visible = visible;
          this.loading.setVisible(visible);
          if (!visible) {
            this.cancelPendingIntent();
            this.zeroInput(true);
            this.stopAudio();
          }
        };
        _proto.cancelPendingIntent = function cancelPendingIntent() {
          var _this$loading2;
          this.intentSerial++;
          this.pendingIntent = null;
          if ((_this$loading2 = this.loading) != null && _this$loading2.state.canCancel) {
            this.loading.dismissCancelled();
            this.zeroInput(true);
            this.localDirty = true;
          }
        };
        _proto.intentContext = function intentContext() {
          return JSON.stringify([this.readContext(), this.height, this.unit, this.selectedStage, this.stagePage, this.preparingStage, this.selectedTraining, this.selectedItem, this.selectedCard, this.confirm, this.detail, this.info, this.infoPage, this.infoTab]);
        };
        _proto.runHit = function runHit(hit) {
          var _this5 = this;
          if (!this.isInteractive() || !hit.enabled) return;
          if (this.remainingReady) {
            hit.run();
            return;
          }
          var serial = ++this.intentSerial,
            context = this.intentContext();
          this.pendingIntent = serial;
          this.zeroInput(true);
          this.stopAudio();
          void this.ensureRemaining().then(function () {
            var _this5$current, _this5$current2;
            if (_this5.dead || _this5.pendingIntent !== serial) return;
            if (!_this5.visible || _this5.intentContext() !== context || ((_this5$current = _this5.current) == null ? void 0 : _this5$current.saveStatus) === 'error' || ((_this5$current2 = _this5.current) == null ? void 0 : _this5$current2.saveStatus) === 'conflict') {
              _this5.cancelPendingIntent();
              return;
            }
            _this5.pendingIntent = null;
            var current = _this5.buttons.find(function (b) {
              return b.id === hit.id && b.enabled;
            });
            if (!current) {
              _this5.loading.dismissCancelled();
              return;
            }
            _this5.loading.begin('first-frame');
            _this5.localDirty = true;
            current.run();
          })["catch"](function (error) {
            if (!_this5.dead && _this5.visible && _this5.pendingIntent === serial) {
              _this5.pendingIntent = null;
              _this5.loading.fail(_this5.failedAssetKey || 'remaining', error, true);
            }
          });
        };
        _proto.scheduleReveal = function scheduleReveal() {
          var _this6 = this;
          if (this.revealCallback || !this.criticalReady || !this.visible || this.actionPending || this.loading.state.phase !== 'first-frame' || this.loading.state.status === 'failed' || !this.loading.state.active) return;
          var epoch = this.epoch,
            context = this.intentContext();
          this.revealCallback = function () {
            _this6.revealCallback = null;
            if (_this6.dead || epoch !== _this6.epoch || !_this6.visible || _this6.actionPending || context !== _this6.intentContext()) return;
            _this6.loading.revealAfterDraw();
            if (!_this6.audioStarted) {
              _this6.audioStarted = true;
              void _this6.loadAudio(epoch);
            }
          };
          director.once(Director.EVENT_AFTER_DRAW, this.revealCallback);
        };
        _proto.escortBinding = function escortBinding(stageId) {
          var _this$art$escortVisua;
          return stageId === 'ST09' || stageId === 'ST16' || stageId === 'ST23' || stageId === 'ST28' ? (_this$art$escortVisua = this.art.escortVisuals) == null ? void 0 : _this$art$escortVisua[stageId] : undefined;
        };
        _proto.groundKey = function groundKey(stage) {
          return stage.world.map === 'MAP04' && ['ST16', 'ST17', 'ST18', 'ST19', 'ST20'].includes(stage.id) ? this.art.groundVisuals.MAP04.key : 'ground';
        };
        _proto.enemyProjectileVisual = function enemyProjectileVisual(p) {
          var _this$art$enemyProjec3, _this$art$enemyProjec4;
          return p.team === 'enemy' ? p.kind === 'EN05' ? (_this$art$enemyProjec3 = this.art.enemyProjectileVisuals) == null ? void 0 : _this$art$enemyProjec3.EN05 : p.kind === 'EL02' ? (_this$art$enemyProjec4 = this.art.enemyProjectileVisuals) == null ? void 0 : _this$art$enemyProjec4.EL02 : undefined : undefined;
        };
        _proto.inspectEnemyProjectileSprites = function inspectEnemyProjectileSprites() {
          var _this$current3;
          var b = ((_this$current3 = this.current) == null ? void 0 : _this$current3.screen) === 'battle' ? this.current.battle : null,
            result = [];
          if (!b) return result;
          for (var _iterator4 = _createForOfIteratorHelperLoose(b.projectiles), _step4; !(_step4 = _iterator4()).done;) {
            var _n$parent;
            var p = _step4.value;
            var binding = this.enemyProjectileVisual(p),
              visual = this.visuals.get(p.id);
            if (!binding || !(visual != null && visual.node.active) || visual.frameKey !== binding.key) continue;
            var n = visual.node,
              u = n.getComponent(UITransform),
              sf = visual.sprite.spriteFrame;
            if (!u || !sf) continue;
            result.push({
              id: p.id,
              kind: p.kind,
              team: p.team,
              shot: {
                x: p.x,
                y: p.y,
                angleRadians: p.angle,
                radius: p.radius,
                damage: p.damage,
                speed: p.speed,
                life: p.life,
                remaining: p.remaining,
                sourceActorId: p.skill
              },
              sprite: {
                frameKey: visual.frameKey,
                frameRect: {
                  x: sf.rect.x,
                  y: sf.rect.y,
                  width: sf.rect.width,
                  height: sf.rect.height
                },
                position: {
                  x: n.position.x,
                  y: n.position.y,
                  worldYDown: -n.position.y
                },
                width: u.width,
                height: u.height,
                anchor: {
                  x: u.anchorPoint.x,
                  y: u.anchorPoint.y
                },
                scale: {
                  x: n.scale.x,
                  y: n.scale.y
                },
                eulerDegrees: {
                  x: n.eulerAngles.x,
                  y: n.eulerAngles.y,
                  z: n.eulerAngles.z
                },
                parent: (_n$parent = n.parent) == null ? void 0 : _n$parent.name,
                siblingIndex: n.getSiblingIndex()
              }
            });
          }
          return result;
        };
        _proto.hudClearance = function hudClearance(v, maximal) {
          var _v$stage, _v$stage2, _v$stage3;
          if (maximal === void 0) {
            maximal = false;
          }
          var b = v.battle,
            boss = maximal || b.enemies.some(function (e) {
              return e.hp > 0 && e.kind.startsWith('BO');
            }),
            hint = maximal ? ((_v$stage = v.stage) == null ? void 0 : _v$stage.id) === 'ST01' : b.phase === 'playing' && ((_v$stage2 = v.stage) == null ? void 0 : _v$stage2.id) === 'ST01' && v.account.clearedStages.length === 0 && !this.firstGuidanceSeen && b.time < 3;
          // These are the existing HUD's outer bounds, including Label line boxes, not new layout.
          var topContentCSS = Math.max(70, boss ? 112 : 0, ((_v$stage3 = v.stage) == null ? void 0 : _v$stage3.objective) !== 'clear' ? boss ? 145.5 : 103.5 : 0, hint ? 149 : 0),
            bottomContentCSS = 119,
            gapCSS = 6,
            u = this.unit;
          // Root's independent edge-framing minimum is more conservative than the drawn HUD.
          return {
            rect: {
              left: this.safeLeft + 12 * u,
              right: 750 - this.safeRight - 12 * u,
              top: this.safeTop + Math.max(boss ? 145 : 112, topContentCSS + gapCSS) * u,
              bottom: this.height - this.safeBottom - (bottomContentCSS + gapCSS) * u
            },
            topContentCSS: topContentCSS,
            bottomContentCSS: bottomContentCSS,
            gapCSS: gapCSS,
            minimumDisplayBandCSS: {
              top: boss ? 145 : 112,
              sides: 12,
              bottom: 125
            }
          };
        };
        _proto.cameraAxis = function cameraAxis(value, min, max) {
          return min <= max ? clamp(value, min, max) : (min + max) / 2;
        };
        _proto.cameraTarget = function cameraTarget(v) {
          var b = v.battle,
            stage = v.stage,
            choosing = !!b.offer && (b.phase === 'choice' || b.phase === 'paused'),
            x = clamp(b.hero.x, 375, Math.max(375, stage.world.width - 375));
          if (choosing) return {
            x: x,
            y: b.hero.y + this.height * .28,
            basis: 'offer-.22-anchor',
            choosing: choosing,
            limits: null
          };
          var c = this.hudClearance(v).rect,
            e = this.heroEnvelope,
            limits = {
              minX: b.hero.x + 375 + e.right - c.right,
              maxX: b.hero.x + 375 + e.left - c.left,
              minY: b.hero.y + this.height / 2 + e.bottom - c.bottom,
              maxY: b.hero.y + this.height / 2 + e.top - c.top
            };
          return {
            x: this.cameraAxis(x, limits.minX, limits.maxX),
            y: this.cameraAxis(clamp(b.hero.y, this.height / 2, Math.max(this.height / 2, stage.world.height - this.height / 2)), limits.minY, limits.maxY),
            basis: 'normal-hud-safe',
            choosing: choosing,
            limits: limits
          };
        };
        _proto.groundLayout = function groundLayout(v, frame) {
          var b = v.battle,
            W = v.stage.world.width,
            H = v.stage.world.height,
            V = this.height,
            r = b.hero.radius,
            e = this.heroEnvelope,
            c = this.hudClearance(v, true).rect;
          var normal = {
              left: Math.min(0, r + e.left - c.left),
              right: Math.max(W, W - r + e.right + 750 - c.right),
              top: Math.min(0, r + e.top - c.top),
              bottom: Math.max(H, H - r + e.bottom + V - c.bottom)
            },
            choice = {
              left: 0,
              right: W,
              top: r - .22 * V,
              bottom: H - r + .78 * V
            };
          var required = {
              left: Math.min(normal.left, choice.left),
              right: Math.max(normal.right, choice.right),
              top: Math.min(normal.top, choice.top),
              bottom: Math.max(normal.bottom, choice.bottom)
            },
            origin = {
              x: (required.left + required.right) / 2,
              y: (required.top + required.bottom) / 2
            },
            previousScale = Math.max(3600 / 1448, W / frame.width, (H + V) / frame.height),
            scale = Math.max(previousScale, (required.right - required.left) / frame.width, (required.bottom - required.top) / frame.height);
          return {
            origin: origin,
            scale: scale,
            previousScale: previousScale,
            normal: normal,
            choice: choice,
            required: required,
            maxHudClearance: c,
            stableHeroEnvelope: _extends({}, e),
            legalHeroRadius: r
          };
        };
        _proto.nodeScreenBox = function nodeScreenBox(node, inWorld) {
          if (inWorld === void 0) {
            inWorld = false;
          }
          var t = node.getComponent(UITransform);
          if (!t) return null;
          var p = node.position,
            s = node.scale,
            a = t.anchorPoint,
            wx = inWorld ? this.world.position.x : 0,
            wy = inWorld ? this.world.position.y : 0,
            x1 = p.x - a.x * t.width * s.x,
            x2 = p.x + (1 - a.x) * t.width * s.x,
            y1 = p.y - a.y * t.height * s.y,
            y2 = p.y + (1 - a.y) * t.height * s.y;
          return {
            left: 375 + wx + Math.min(x1, x2),
            right: 375 + wx + Math.max(x1, x2),
            top: this.height / 2 - wy - Math.max(y1, y2),
            bottom: this.height / 2 - wy - Math.min(y1, y2)
          };
        };
        _proto.updateHeroFraming = function updateHeroFraming(v) {
          var _this7 = this;
          var visual = this.visuals.get('hero'),
            actual = visual != null && visual.node.active ? this.nodeScreenBox(visual.node, true) : null;
          if (!this.heroPresentation || !visual || !actual) return;
          var b = v.battle,
            hud = this.hudClearance(v),
            c = hud.rect,
            margins = {
              left: actual.left - c.left,
              right: c.right - actual.right,
              top: actual.top - c.top,
              bottom: c.bottom - actual.bottom
            },
            inside = Object.values(margins).every(function (n) {
              return n >= -1e-6;
            }),
            viewport = {
              left: 0,
              right: 750,
              top: 0,
              bottom: this.height
            },
            withinViewport = actual.left >= 0 && actual.right <= 750 && actual.top >= 0 && actual.bottom <= this.height,
            choosing = !!b.offer && (b.phase === 'choice' || b.phase === 'paused'),
            overlay = b.phase !== 'playing' || !!this.confirm || !!this.detail || !!this.info || v.saveStatus === 'error' || v.saveStatus === 'conflict';
          this.heroPresentation.framing = {
            source: 'actual hero Node/UITransform/anchor/mirror plus actual World translation; full frame including transparent margin',
            frameKey: visual.frameKey,
            node: {
              x: visual.node.position.x,
              y: visual.node.position.y,
              width: visual.node.getComponent(UITransform).width,
              height: visual.node.getComponent(UITransform).height,
              scale: {
                x: visual.node.scale.x,
                y: visual.node.scale.y
              },
              anchor: {
                x: visual.node.getComponent(UITransform).anchorPoint.x,
                y: visual.node.getComponent(UITransform).anchorPoint.y
              }
            },
            screenU: actual,
            screenCSS: Object.fromEntries(Object.entries(actual).map(function (_ref6) {
              var k = _ref6[0],
                n = _ref6[1];
              return [k, n / _this7.unit];
            })),
            viewport: viewport,
            hudClearance: c,
            hudLayout: {
              contentOuterCSS: {
                top: hud.topContentCSS,
                bottom: hud.bottomContentCSS
              },
              contentGapCSS: hud.gapCSS,
              minimumDisplayBandCSS: hud.minimumDisplayBandCSS,
              reservedCSS: {
                top: (c.top - this.safeTop) / this.unit,
                bottom: (this.height - this.safeBottom - c.bottom) / this.unit,
                left: (c.left - this.safeLeft) / this.unit,
                right: (750 - this.safeRight - c.right) / this.unit
              }
            },
            clearanceU: margins,
            stableEnvelope: _extends({}, this.heroEnvelope),
            withinViewport: withinViewport,
            fullyInsideHudClearance: inside,
            normalFramingApplies: !choosing,
            obscuredByOverlay: overlay,
            fullyVisible: withinViewport && inside && !overlay,
            clearanceFitsStableEnvelope: c.right - c.left >= this.heroEnvelope.right - this.heroEnvelope.left && c.bottom - c.top >= this.heroEnvelope.bottom - this.heroEnvelope.top,
            activeHudLabels: Array.from(this.hud.entries()).filter(function (_ref7) {
              var l = _ref7[1];
              return l.node.active;
            }).map(function (_ref8) {
              var id = _ref8[0],
                l = _ref8[1];
              return {
                id: id,
                text: l.string,
                screenU: _this7.nodeScreenBox(l.node)
              };
            })
          };
        };
        _proto.load = function load(path, type, auditKey) {
          var _this8 = this;
          if (auditKey) this.loading.auditRequested(auditKey, auditKey.startsWith('@') ? 'phase' : type === Font ? 'font' : 'image');
          var existing = this.assetPromises.get(path);
          if (existing) return existing;
          var pending = new Promise(function (resolve, reject) {
            var bundle = path === 'inkblade/art' ? resources : _this8.contentBundle;
            if (!bundle) {
              reject(new Error('游戏资源包尚未载入'));
              return;
            }
            if (auditKey) _this8.loading.auditIssued(auditKey);
            bundle.load(path, type, function (error, asset) {
              if (auditKey) _this8.loading.auditCallback(auditKey, !!error);
              if (error) {
                if (type !== AudioClip && !_this8.failedAssetKey) _this8.failedAssetKey = path.replace(/^inkblade\//, '').replace(/\/texture$/, '');
                reject(error);
              } else resolve(asset);
            });
          });
          this.assetPromises.set(path, pending);
          return pending;
        };
        _proto.loadAudio = /*#__PURE__*/function () {
          var _loadAudio = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(epoch) {
            var _this9 = this;
            var all, results;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  all = Object.entries(this.art.audio);
                  _context5.next = 3;
                  return Promise.allSettled(all.map(function (_ref9) {
                    var v = _ref9[1];
                    return _this9.load(v.path, AudioClip);
                  }));
                case 3:
                  results = _context5.sent;
                  if (!(this.dead || epoch !== this.epoch)) {
                    _context5.next = 6;
                    break;
                  }
                  return _context5.abrupt("return");
                case 6:
                  results.forEach(function (r, i) {
                    var key = all[i][0];
                    if (r.status === 'fulfilled') _this9.clips[key] = r.value;else _this9.audioFailed.push(key);
                  });
                  this.audioReady = true;
                  this.localDirty = true;
                case 9:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, this);
          }));
          function loadAudio(_x9) {
            return _loadAudio.apply(this, arguments);
          }
          return loadAudio;
        }();
        _proto.layer = function layer(name, parent) {
          var n = new Node(name);
          n.layer = this.host.layer;
          parent.addChild(n);
          return n;
        };
        _proto.transform = function transform(n, w, h) {
          var u = n.getComponent(UITransform) || n.addComponent(UITransform);
          u.setContentSize(w, h);
          return u;
        };
        _proto.graphic = function graphic(parent) {
          return this.layer('InkAndCloth', parent).addComponent(Graphics);
        };
        _proto.rect = function rect(g, x, y, w, h, color, r) {
          if (r === void 0) {
            r = 0;
          }
          g.fillColor = new Color().fromHEX(color);
          if (r) g.roundRect(x - w / 2, y - h / 2, w, h, r);else g.rect(x - w / 2, y - h / 2, w, h);
          g.fill();
        };
        _proto.image = function image(key, x, y, w, h, parent, contain) {
          if (parent === void 0) {
            parent = this.ui;
          }
          if (contain === void 0) {
            contain = true;
          }
          var n = this.layer(key, parent);
          n.setPosition(x, y);
          var sf = this.frames.get(key);
          var s = n.addComponent(Sprite);
          s.sizeMode = Sprite.SizeMode.CUSTOM;
          s.spriteFrame = sf || null;
          var dw = w,
            dh = h;
          if (contain && sf) {
            var scale = Math.min(w / sf.width, h / sf.height);
            dw = sf.width * scale;
            dh = sf.height * scale;
          }
          this.transform(n, dw, dh);
          return n;
        };
        _proto.frame = function frame(key, x, y, w, h, parent) {
          if (parent === void 0) {
            parent = this.ui;
          }
          var n = this.image(key, x, y, w, h, parent, false);
          var sp = n.getComponent(Sprite);
          var source = this.frames.get(key);
          if (!source) return n;
          var sf = new SpriteFrame();
          sf.texture = source.texture;
          sf.rect = source.rect;
          sf.originalSize = source.originalSize;
          sf.offset = new Vec2();
          sf.packable = false;
          var card = key === 'ui/card-frame',
            plaque = key === 'ui/plaque-wide',
            name = key === 'ui/name-plaque';
          var edge = card ? 62 : plaque || name ? 32 : 60;
          sf.insetTop = edge;
          sf.insetBottom = edge;
          sf.insetLeft = plaque || name ? 52 : edge;
          sf.insetRight = plaque || name ? 52 : edge;
          sp.spriteFrame = sf;
          sp.type = Sprite.Type.SLICED;
          var scale = card ? 24 / 62 : name ? 14 / 32 : plaque ? 18 / 32 : 24 / 60;
          n.setScale(scale, scale);
          this.transform(n, w / scale, h / scale);
          return n;
        };
        _proto.text = function text(value, x, y, size, w, h, parent, title, color) {
          if (size === void 0) {
            size = 32;
          }
          if (w === void 0) {
            w = 660;
          }
          if (h === void 0) {
            h = 80;
          }
          if (parent === void 0) {
            parent = this.ui;
          }
          if (title === void 0) {
            title = false;
          }
          if (color === void 0) {
            color = C.paper;
          }
          var n = this.layer('Text', parent);
          n.active = false;
          n.setPosition(x, y);
          var l = n.addComponent(Label);
          l.font = this.fonts[title ? 'title' : 'body'];
          l.useSystemFont = false;
          l.fontSize = size;
          l.lineHeight = Math.ceil(size * 1.34);
          l.horizontalAlign = Label.HorizontalAlign.CENTER;
          l.verticalAlign = Label.VerticalAlign.CENTER;
          l.overflow = Label.Overflow.CLAMP;
          l.enableWrapText = true;
          l.color = new Color().fromHEX(color);
          l.string = value;
          this.transform(n, w, h);
          this.labelTargets.set(n, {
            width: w,
            height: h
          });
          n.active = true;
          return l;
        };
        _proto.hudText = function hudText(value, x, y, size, w, h, title) {
          if (title === void 0) {
            title = false;
          }
          var l = this.text(value, x, y, size, w, h, this.ui, title, '#fff1c9');
          var edge = l.node.addComponent(LabelOutline);
          edge.color = new Color().fromHEX('#10271f');
          edge.width = 2;
          return l;
        };
        _proto.hit = function hit(id, label, x, y, w, h, action, run, enabled) {
          if (enabled === void 0) {
            enabled = true;
          }
          this.buttons.push({
            id: id,
            label: label,
            action: action,
            x: x - w / 2,
            y: y - h / 2,
            width: w,
            height: h,
            enabled: enabled,
            run: run
          });
        };
        _proto.objectButton = function objectButton(id, label, x, y, w, h, run, enabled, size) {
          if (enabled === void 0) {
            enabled = true;
          }
          if (size === void 0) {
            size = 44;
          }
          var n = this.frame('ui/plaque-wide', x, y, w, h);
          if (!enabled) n.addComponent(UIOpacity).opacity = 130;
          this.text(label, x, y, size, w - (w <= 125 * this.unit ? 12 : 36) * this.unit, h - 4 * this.unit, this.ui, true, enabled ? C.paper : C.muted);
          this.hit(id, label, x, y, w, h, id, run, enabled);
        };
        _proto.pauseButton = function pauseButton(id, x, y) {
          var _this10 = this;
          var u = this.unit;
          this.image('ui/round-slot', x, y, 44 * u, 44 * u);
          var g = this.graphic(this.ui);
          g.strokeColor = new Color().fromHEX('#f6d99a');
          g.lineWidth = 1.8 * u;
          for (var _i4 = 0, _arr3 = [-4 * u, 4 * u]; _i4 < _arr3.length; _i4++) {
            var dx = _arr3[_i4];
            g.moveTo(x + dx, y - 7 * u);
            g.lineTo(x + dx, y + 7 * u);
          }
          g.stroke();
          this.hit(id, '暂停', x, y, 44 * u, 44 * u, 'pause', function () {
            return _this10.act({
              type: 'pause'
            });
          });
        };
        _proto.bodyWidth = function bodyWidth(value, size) {
          return Array.from(value).reduce(function (sum, c) {
            return sum + size * (/[\u3400-\u9fff]/.test(c) ? 1 : c === ' ' ? .25 : c === '/' ? .4 : .55);
          }, 0);
        };
        _proto.track = function track(g, x, y, w, h, ratio, color) {
          this.rect(g, x, y, w, h, '#b49358');
          this.rect(g, x, y, w - 4, h - 4, '#122f2c');
          var inner = Math.max(0, w - 8),
            fill = inner * clamp(ratio, 0, 1);
          if (fill > 0) {
            this.rect(g, x - inner / 2 + fill / 2, y, fill, Math.max(2, h - 8), color);
            this.rect(g, x - inner / 2 + fill / 2, y + h / 2 - 5, fill, 2, color === '#70d6b7' ? '#deffee' : '#e6a17a');
          }
        };
        _proto.openInfo = function openInfo(info) {
          var _this$current4, _this$current$battle;
          this.info = info;
          this.infoPage = 0;
          if (((_this$current4 = this.current) == null ? void 0 : _this$current4.screen) === 'battle' && ((_this$current$battle = this.current.battle) == null ? void 0 : _this$current$battle.phase) === 'playing') this.act({
            type: 'pause'
          });
          this.localDirty = true;
        };
        _proto.button = function button(id, label, x, y, w, h, action, run, enabled, primary) {
          if (enabled === void 0) {
            enabled = true;
          }
          if (primary === void 0) {
            primary = false;
          }
          var n = primary ? this.image('ui/cta-primary', x, y, w + 52, (w + 52) * 300 / 528) : this.frame('ui/plaque-wide', x, y, w, h);
          if (!enabled) n.addComponent(UIOpacity).opacity = 130;
          this.text(label, x, y - (primary ? 4 : 0), primary ? 43 : 33, w - 48, h - 12, this.ui, true, enabled ? C.paper : C.muted);
          this.buttons.push({
            id: id,
            label: label,
            action: action,
            x: x - w / 2,
            y: y - h / 2,
            width: w,
            height: h,
            enabled: enabled,
            run: run
          });
        };
        _proto.act = function act(a) {
          this.zeroInput(false);
          this.stopAudio();
          this.onAction(a);
        };
        _proto.nav = function nav(screen) {
          this.confirm = null;
          this.detail = null;
          this.detailSkill = null;
          this.info = null;
          this.preparingStage = false;
          this.selectedItem = screen === 'companions' ? 'CO01' : 'EQ01';
          this.act({
            type: 'navigate',
            screen: screen
          });
        };
        _proto.wallet = function wallet(v) {
          this.frame('ui/plaque-wide', 0, this.top() - 51, 414, 84);
          this.image('objects/PICK-CU01', -173, this.top() - 52, 36, 36);
          this.text(v.account.coins + " \u94DC\u94B1", -77, this.top() - 51, 30, 140, 70);
          this.image('objects/RC02-refined-iron', 23, this.top() - 52, 40, 40);
          this.text(v.account.iron + " \u7CBE\u94C1", 115, this.top() - 51, 30, 132, 70);
        };
        _proto.top = function top() {
          return this.height / 2 - this.safeTop;
        };
        _proto.bottom = function bottom() {
          return -this.height / 2 + this.safeBottom;
        };
        _proto.title = function title(name, sub) {
          if (sub === void 0) {
            sub = '';
          }
          this.text(name, 0, this.top() - 142, 54, 650, 85, this.ui, true);
          if (sub) this.text(sub, 0, this.top() - 213, 28, 650, 74);
        };
        _proto.panel = function panel(y, h, w) {
          if (w === void 0) {
            w = 690;
          }
          this.frame('ui/panel-frame', 0, y, w, h);
        };
        _proto.footer = function footer(label, run, enabled, id) {
          if (enabled === void 0) {
            enabled = true;
          }
          if (id === void 0) {
            id = 'primary';
          }
          this.button(id, label, 0, this.bottom() + 140, 500, 110, id, run, enabled, true);
        };
        _proto.back = function back(screen) {
          var _this11 = this;
          if (screen === void 0) {
            screen = 'camp';
          }
          this.button('back', '返回', -287, this.top() - 50, 132, 84, 'navigate', function () {
            return _this11.nav(screen);
          });
        };
        _proto.modal = function modal(title, body) {
          var shade = this.graphic(this.ui);
          this.rect(shade, 0, 0, 750, this.height, '#102e37db');
          this.buttons = [];
          this.panel(0, Math.min(800, this.height - 170), 690);
          this.text(title, 0, 240, 50, 600, 100, this.ui, true);
          this.text(body, 0, 52, 32, 580, 240);
        };
        _proto.render = function render(v, dt) {
          var _b$offer, _v$receipt, _b$offer3;
          if (this.dead || !this.art || !this.criticalReady) return;
          this.current = v;
          var size = this.host.getComponent(UITransform).contentSize,
            css = view.getFrameSize(),
            unit = css.width > 0 ? 750 / css.width : 2;
          var resized = this.height !== size.height || this.unit !== unit;
          this.height = size.height;
          this.unit = unit;
          this.cssHeight = this.height / unit;
          this.transform(this.root, 750, this.height);
          try {
            var safe = sys.getSafeAreaRect(),
              frame = view.getVisibleSize();
            this.safeTop = Math.max(0, frame.height - safe.y - safe.height);
            this.safeBottom = Math.max(0, safe.y);
            this.safeLeft = Math.max(0, safe.x);
            this.safeRight = Math.max(0, frame.width - safe.x - safe.width);
          } catch (_unused) {
            this.safeTop = 0;
            this.safeBottom = 0;
            this.safeLeft = 0;
            this.safeRight = 0;
          }
          var b = v.battle;
          if (b && ((_b$offer = b.offer) == null ? void 0 : _b$offer.id) !== this.selectedOffer) {
            var _b$offer2;
            this.selectedOffer = ((_b$offer2 = b.offer) == null ? void 0 : _b$offer2.id) || '';
            this.selectedCard = null;
          }
          if (v.screen === 'battle' && b) {
            if (this.guidanceRun !== b.runId) {
              this.guidanceRun = b.runId;
              this.firstGuidanceSeen = b.time >= 3;
            }
            if (b.hero.pose === 'run') this.firstGuidanceSeen = true;
            this.drawWorld(v, dt, resized);
            this.processAudio(v);
            this.world.active = true;
          } else {
            this.world.active = false;
            this.hudState = null;
            this.escortPresentation = null;
            this.escortGuideState = null;
            this.companionPresentation = null;
            this.groundPresentation = null;
            this.stopAudio();
          }
          // A checkpoint must not rebuild live movement controls. Menus and frozen/read-only
          // layers must distinguish saving→saved because their buttons bind availability.
          var continuousPlay = v.screen === 'battle' && (b == null ? void 0 : b.phase) === 'playing' && !this.confirm && !this.detail && !this.info;
          var uiSaveState = continuousPlay && (v.saveStatus === 'saved' || v.saveStatus === 'saving') ? 'normal' : v.saveStatus;
          var key = JSON.stringify([v.screen, v.account.revision, uiSaveState, v.canContinue, v.soundEnabled, v.message, (_v$receipt = v.receipt) == null ? void 0 : _v$receipt.id, b == null ? void 0 : b.phase, b == null || (_b$offer3 = b.offer) == null ? void 0 : _b$offer3.id, b == null ? void 0 : b.reviveUsed, b == null ? void 0 : b.skills.map(function (s) {
            return [s.id, s.rank];
          }), this.selectedStage, this.stagePage, this.preparingStage, this.selectedTraining, this.selectedItem, this.selectedCard, this.confirm, this.detail, this.info, this.infoPage, this.infoTab, this.audioReady, this.audioFailed, resized ? this.height : 0]);
          var inputContext = JSON.stringify([v.screen, b == null ? void 0 : b.phase, !!this.confirm, !!this.detail, !!this.info, v.saveStatus === 'error' || v.saveStatus === 'conflict']);
          if (inputContext !== this.inputContext) {
            this.inputContext = inputContext;
            this.zeroInput(false);
          }
          if (this.localDirty || resized || key !== this.uiKey) {
            this.uiKey = key;
            this.localDirty = false;
            this.rebuild(v);
          }
          if (v.screen === 'battle' && b) {
            this.updateHud(v);
            this.updateEscortGuide(v);
            this.updateHeroFraming(v);
          }
          this.scheduleReveal();
        };
        _proto.rebuild = function rebuild(v) {
          var _this12 = this;
          for (var _i5 = 0, _arr4 = [].concat(this.ui.children); _i5 < _arr4.length; _i5++) {
            var n = _arr4[_i5];
            n.destroy();
          }
          this.hud.clear();
          this.hpBar = null;
          this.buttons = [];
          this.stageLayout = null;
          this.escortGuide = null;
          this.escortArrow = null;
          this.escortGuideState = null;
          if (v.screen !== 'battle') {
            var bg = this.image('camp', 0, 0, 750, this.height, this.ui, false);
            var sf = this.frames.get('camp');
            var scale = Math.max(750 / sf.width, this.height / sf.height);
            this.transform(bg, sf.width * scale, sf.height * scale);
            if (v.screen !== 'camp' && v.screen !== 'settlement') {
              var dim = this.graphic(this.ui);
              this.rect(dim, 0, 0, 750, this.height, '#081d1c9e');
            }
          }
          if (v.screen === 'camp') this.camp(v);else if (v.screen === 'stages') this.stages(v);else if (v.screen === 'battle') this.battle(v);else if (v.screen === 'training') this.training(v);else if (v.screen === 'equipment' || v.screen === 'companions') this.items(v);else if (v.screen === 'settlement') this.settlement(v);
          if (this.detail) {
            if (this.detailSkill) this.skillDetail(v);else {
              this.modal('行路须知', this.detail);
              this.objectButton('detail-back', '返回原处', 0, -235, 520, 106, function () {
                _this12.detail = null;
                _this12.localDirty = true;
              });
            }
          }
          if (this.confirm) this.confirmPanel(v);
          if (this.info) this.infoPanel(v);
          if (v.saveStatus === 'error' || v.saveStatus === 'conflict') this.savePanel(v);
          var enabled = this.buttons.filter(function (b) {
            return b.enabled;
          });
          if (this.focus >= enabled.length) this.focus = 0;
          var focus = enabled[this.focus];
          if (this.keyboardFocus && focus) {
            var g = this.graphic(this.ui);
            g.strokeColor = new Color(250, 228, 163, 230);
            g.lineWidth = 4;
            g.roundRect(focus.x + 4, focus.y + 4, focus.width - 8, focus.height - 8, 12);
            g.stroke();
          }
        };
        _proto.camp = function camp(v) {
          var _this13 = this;
          var u = this.unit,
            _short = this.cssHeight <= 720,
            badgeW = (_short ? 62 : 66) * u,
            badgeH = (_short ? 67 : 72) * u,
            firstY = this.height / 2 - this.height * (_short ? .39 : .4) - badgeH / 2;
          var f = this.art.clips.idle[0],
            sf = this.frames.get(f.key),
            figureHeight = 750 * sf.rect.height / sf.rect.width,
            figureY = -this.height / 2 + this.height * (_short ? .255 : .245) + figureHeight / 2;
          this.image(f.key, 0, figureY, 750, figureHeight, this.ui, false);
          // Two genuine wallet objects replace the five obsolete currencies; no dummy balances.
          for (var _iterator5 = _createForOfIteratorHelperLoose([[0, 'objects/PICK-CU01', v.account.coins], [1, 'objects/RC02-refined-iron', v.account.iron]]), _step5; !(_step5 = _iterator5()).done;) {
            var _step5$value = _step5.value,
              i = _step5$value[0],
              key = _step5$value[1],
              value = _step5$value[2];
            var x = (i - .5) * 111 * u;
            this.frame('ui/plaque-wide', x, this.top() - 24.5 * u, 106 * u, 39 * u);
            this.image(key, x - 32.5 * u, this.top() - 24.5 * u, 25 * u, 29 * u);
            this.text(String(value), x + 11.5 * u, this.top() - 24.5 * u, 20 * u, 65 * u, 31 * u, this.ui, true);
          }
          var nav = [['equipment', '器物', 'ui/camp-equipment-icon', function () {
            return _this13.nav('equipment');
          }], ['training', '修行', 'ui/camp-training-icon', function () {
            return _this13.nav('training');
          }], ['stages', '选卷', 'ui/icon-scroll', function () {
            return _this13.nav('stages');
          }], ['companions', '伙伴', 'ui/companion-emblem', function () {
            return _this13.nav('companions');
          }], ['codex', '图鉴', 'ui/icon-book', function () {
            return _this13.openInfo('codex');
          }], ['help', '须知', 'ui/icon-scroll', function () {
            return _this13.openInfo('help');
          }]];
          nav.forEach(function (_ref10, i) {
            var id = _ref10[0],
              name = _ref10[1],
              icon = _ref10[2],
              run = _ref10[3];
            var column = i < 3 ? -1 : 1,
              row = i % 3,
              x = column * (375 - 5 * u - badgeW / 2),
              y = firstY - row * (badgeH + 6 * u);
            _this13.image('ui/round-slot', x, y, badgeW, badgeH);
            _this13.image(icon, x, y + 10 * u, (_short ? 45 : 48) * u, (_short ? 43 : 47) * u);
            _this13.frame('ui/name-plaque', x, y - badgeH / 2 + (_short ? 14.5 : 15) * u, badgeW, (_short ? 29 : 30) * u);
            _this13.text(name, x, y - badgeH / 2 + (_short ? 15.5 : 16) * u, (_short ? 19 : 20) * u, badgeW - 4 * u, 28 * u, _this13.ui, true);
            _this13.hit('camp-' + id, name, x, y, badgeW, badgeH, 'navigate', run);
          });
          var primaryY = this.bottom() + 67.5 * u;
          this.image('ui/cta-primary', 0, primaryY, 220 * u, 125 * u);
          this.text(v.canContinue ? '继续' : '出发', 0, primaryY - 5 * u, 49 * u, 200 * u, 76 * u, this.ui, true, '#f6e2a0');
          this.hit(v.canContinue ? 'continue' : 'primary', v.canContinue ? '继续上次行程' : '出发', 0, primaryY, 220 * u, 125 * u, v.canContinue ? 'continue' : 'navigate', function () {
            return v.canContinue ? _this13.act({
              type: 'continue'
            }) : _this13.nav('stages');
          });
          this.objectButton('camp-history', '行程', -375 + 36 * u, this.bottom() + 36.5 * u, 60 * u, 51 * u, function () {
            return _this13.openInfo('history');
          }, true, 19 * u);
          this.objectButton('settings', '设置', 375 - 36 * u, this.bottom() + 36.5 * u, 60 * u, 51 * u, function () {
            return _this13.openInfo('settings');
          }, true, 19 * u);
        };
        _proto.folio = function folio(name, onBack) {
          var _this14 = this;
          if (onBack === void 0) {
            onBack = function onBack() {
              return _this14.nav('camp');
            };
          }
          var u = this.unit,
            _short2 = this.cssHeight <= 720,
            top = this.top() - (_short2 ? 65 : 70) * u,
            bottom = this.bottom() + (_short2 ? 10 : 13) * u;
          this.image('ui/round-slot', -375 + 33 * u, this.top() - 28 * u, 44 * u, 44 * u);
          this.text('‹', -375 + 33 * u, this.top() - 29 * u, 34 * u, 40 * u, 42 * u);
          this.hit('back', '返回', -375 + 33 * u, this.top() - 28 * u, 44 * u, 44 * u, 'navigate', onBack);
          this.frame('ui/plaque-wide', 28 * u, this.top() - 31 * u, 750 - 78 * u, 46 * u);
          this.text(name, 28 * u, this.top() - 31 * u, 27 * u, 750 - 123 * u, 42 * u, this.ui, true);
          this.frame('ui/panel-frame', 0, (top + bottom) / 2, 750 - 22 * u, top - bottom);
          return {
            top: top,
            bottom: bottom,
            contentTop: top - 13 * u,
            footerY: bottom + 40 * u,
            bodyHeight: (top - bottom) / u - 93
          };
        };
        _proto.folioFoot = function folioFoot(id, label, y, run, enabled) {
          if (enabled === void 0) {
            enabled = true;
          }
          this.objectButton(id, label, 0, y, 750 - 58 * this.unit, 55 * this.unit, run, enabled, 21 * this.unit);
        };
        _proto.selectedBorder = function selectedBorder(x, y, w, h) {
          var g = this.graphic(this.ui);
          g.strokeColor = new Color().fromHEX('#edc269');
          g.lineWidth = 2 * this.unit;
          g.rect(x - w / 2, y - h / 2, w, h);
          g.stroke();
        };
        _proto.chapterScene = function chapterScene(index, x, y, w, h) {
          var source = this.frames.get('ui/chapter-scenes');
          if (!source) return;
          var col = index % 3,
            row = Math.floor(index / 3),
            cropW = 324,
            cropH = Math.min(660, cropW * h / w),
            f = new SpriteFrame();
          f.texture = source.texture;
          f.rect = new Rect(8 + col * 342, 48 + row * 712, cropW, cropH);
          f.originalSize = new Size(cropW, cropH);
          f.offset = new Vec2();
          f.packable = false;
          var n = this.layer('ChapterThemePreview', this.ui),
            sp = n.addComponent(Sprite);
          sp.sizeMode = Sprite.SizeMode.CUSTOM;
          sp.spriteFrame = f;
          this.transform(n, w, h);
          n.setPosition(x, y);
        };
        _proto.costLine = function costLine(coins, iron, y, v) {
          var u = this.unit;
          if (iron > 0) {
            this.image('objects/PICK-CU01', -115 * u, y, 27 * u, 30 * u);
            this.text(String(coins) + ' 铜钱', -60 * u, y, 19 * u, 100 * u, 32 * u);
            this.image('objects/RC02-refined-iron', 44 * u, y, 30 * u, 30 * u);
            this.text(String(iron) + ' 精铁', 98 * u, y, 19 * u, 95 * u, 32 * u);
          } else {
            this.image('objects/PICK-CU01', -56 * u, y, 29 * u, 32 * u);
            this.text('铜钱 ' + coins, 18 * u, y, 21 * u, 120 * u, 34 * u);
          }
          this.text("\u6301\u6709 " + v.account.coins + " \u94DC\u94B1" + (iron > 0 ? ' / ' + v.account.iron + ' 精铁' : ''), 0, y - 31 * u, 14 * u, 310 * u, 26 * u, this.ui, false, C.muted);
        };
        _proto.prepareStart = function prepareStart(v) {
          var _this15 = this;
          var stage = v.stages.find(function (s) {
            return s.id === _this15.selectedStage;
          });
          if (!stage) return;
          var stats = runStats(v.account);
          this.confirm = {
            title: '此番出发',
            subject: this.art.clips.idle[0].key,
            copy: stage.name + '\n额外招式从零开始，沿途拾取经验取招。',
            rows: [{
              label: '气血',
              before: '',
              after: num(stats.maxHp)
            }, {
              label: '攻击倍率',
              before: '',
              after: num(stats.damageMultiplier * 100) + '%'
            }, {
              label: '同行',
              before: '',
              after: stats.companion ? ITEM_NAMES[stats.companion.id] : '独行'
            }],
            label: '确认出发',
            action: {
              type: 'start',
              stageId: stage.id
            }
          };
          this.localDirty = true;
        };
        _proto.stages = function stages(v) {
          var _this16 = this;
          var u = this.unit,
            f = this.folio(this.preparingStage ? '出战整备' : '山河行卷', function () {
              if (_this16.preparingStage) {
                _this16.preparingStage = false;
                _this16.localDirty = true;
              } else _this16.nav('camp');
            }),
            a = v.account,
            stage = v.stages.find(function (s) {
              return s.id === _this16.selectedStage;
            }) || v.stages[0];
          if (!stage) return;
          if (this.preparingStage) {
            var stats = runStats(a),
              subjectH = (this.cssHeight <= 720 ? 155 : 176) * u,
              offset = this.cssHeight <= 720 ? 0 : 22 * u;
            this.image(this.art.clips.idle[0].key, 0, f.contentTop - subjectH / 2, 310 * u, subjectH);
            this.text(stage.name, 0, f.contentTop - 180 * u - offset, 30 * u, 310 * u, 42 * u, this.ui, true);
            this.text('基础长枪起行', 0, f.contentTop - 215 * u - offset, 16 * u, 300 * u, 29 * u);
            var _rows = [{
              label: '攻击',
              value: num(stats.damageMultiplier * 100) + '%',
              icon: 'ui/EQ01-navigation'
            }, {
              label: '气血',
              value: num(stats.maxHp),
              icon: 'objects/ITEM-GE04-RA02'
            }, {
              label: stats.companion ? ITEM_NAMES[stats.companion.id] : '独行',
              value: stats.companion ? stats.companion.level + '级' : '暂无伙伴',
              icon: stats.companion ? this.itemIcon(stats.companion.id) : ''
            }];
            _rows.forEach(function (r, i) {
              var x = (i - 1) * 103 * u,
                y = f.contentTop - 310 * u - offset,
                g = _this16.graphic(_this16.ui);
              _this16.rect(g, x, y, 98 * u, 123 * u, '#0c302b55');
              g.strokeColor = new Color().fromHEX('#9c8554');
              g.lineWidth = u;
              g.rect(x - 49 * u, y - 61.5 * u, 98 * u, 123 * u);
              g.stroke();
              if (r.icon) _this16.image(r.icon, x, y + 30 * u, 61 * u, 54 * u);else _this16.image('ui/round-slot', x, y + 30 * u, 44 * u, 44 * u);
              _this16.text(r.label, x, y - 10 * u, 20 * u, 92 * u, 29 * u, _this16.ui, true);
              _this16.text(r.value, x, y - 41 * u, 15 * u, 92 * u, 26 * u);
            });
            this.text('额外招式 0 / 6\n局外修行与装备，在这次出发时生效。', 0, f.contentTop - 423 * u - offset, 16 * u, 305 * u, 70 * u);
            this.objectButton('prepare-back', '重择山道', -80 * u, f.footerY, 153 * u, 55 * u, function () {
              _this16.preparingStage = false;
              _this16.localDirty = true;
            }, true, 21 * u);
            this.objectButton('primary', '启程', 80 * u, f.footerY, 153 * u, 55 * u, function () {
              return _this16.prepareStart(v);
            }, v.saveStatus === 'saved', 21 * u);
            return;
          }
          var extra = Math.max(0, f.bodyHeight - 518),
            preferredHero = 145 + Math.min(25, extra * .2),
            preferredCard = 108 + Math.min(30, extra * .22),
            pagerY = f.bottom + 102 * u,
            pagerTop = pagerY + 22 * u,
            gridBottomLimit = pagerTop + 12 * u,
            available = (f.contentTop - gridBottomLimit) / u;
          var rows = 2,
            cardCSS = preferredCard,
            heroCSS = Math.min(preferredHero, available - 81 - (2 * cardCSS + 10));
          if (heroCSS < 96) {
            cardCSS = Math.max(108, Math.min(preferredCard, (available - 81 - 96 - 10) / 2));
            heroCSS = Math.min(preferredHero, available - 81 - (2 * cardCSS + 10));
          }
          if (heroCSS < 96) {
            rows = 1;
            cardCSS = 108;
            heroCSS = Math.min(preferredHero, available - 81 - cardCSS);
          }
          heroCSS = Math.max(96, heroCSS);
          var pageSize = rows * 2;
          if (pageSize !== this.stagePageSize) {
            this.stagePageSize = pageSize;
            this.stagePage = Math.floor(Math.max(0, v.stages.findIndex(function (st) {
              return st.id === _this16.selectedStage;
            })) / pageSize);
          }
          this.stagePage = clamp(this.stagePage, 0, Math.max(0, Math.ceil(v.stages.length / pageSize) - 1));
          var page = v.stages.slice(this.stagePage * pageSize, this.stagePage * pageSize + pageSize);
          if (!page.some(function (st) {
            return st.id === _this16.selectedStage;
          })) {
            var _page$;
            this.selectedStage = ((_page$ = page[0]) == null ? void 0 : _page$.id) || 'ST01';
            this.localDirty = true;
          }
          var chosen = page.find(function (st) {
            return st.id === _this16.selectedStage;
          }) || page[0];
          if (!chosen) return;
          var heroH = heroCSS * u;
          this.chapterScene(Math.floor((chosen.number - 1) / 5), 0, f.contentTop - heroH / 2, 750 - 64 * u, heroH);
          var preview = this.ui.getChildByName('ChapterThemePreview');
          this.text(chosen.name, 0, f.contentTop - heroH - 16 * u, 30 * u, 310 * u, 41 * u, this.ui, true);
          this.text(chosen.description, 0, f.contentTop - heroH - 53 * u, 15 * u, 306 * u, 44 * u);
          var gridTop = f.contentTop - heroH - 81 * u,
            cardW = (750 - 74 * u) / 2,
            cardH = cardCSS * u,
            cardBoxes = [];
          page.forEach(function (st, i) {
            var x = (i % 2 ? 1 : -1) * (cardW + 10 * u) / 2,
              top = gridTop - Math.floor(i / 2) * (cardH + 10 * u),
              y = top - cardH / 2,
              locked = st.number > a.highestUnlockedStage;
            _this16.chapterScene(Math.floor((st.number - 1) / 5), x, top - (cardH - 44 * u) / 2, cardW, cardH - 44 * u);
            var g = _this16.graphic(_this16.ui);
            _this16.rect(g, x, top - cardH + 22 * u, cardW, 44 * u, '#153a35');
            g.strokeColor = new Color().fromHEX('#ba9659');
            g.lineWidth = u;
            g.rect(x - cardW / 2, top - cardH, cardW, cardH);
            g.stroke();
            var chapterNo = _this16.text('第' + st.number + '关' + (a.clearedStages.includes(st.id) ? ' 已通' : ''), x, top - cardH + 35 * u, 14 * u, cardW - 8 * u, 18 * u);
            chapterNo.lineHeight = 18 * u;
            var stageName = _this16.text(st.name, x, top - cardH + 13 * u, 22 * u, cardW - 8 * u, 26 * u, _this16.ui, true);
            stageName.lineHeight = 24 * u;
            if (locked) _this16.text('锁', x + cardW / 2 - 15 * u, top - 15 * u, 16 * u, 25 * u, 25 * u);
            if (st.id === _this16.selectedStage) _this16.selectedBorder(x, y, cardW, cardH);
            _this16.hit('stage-' + st.id, st.name, x, y, cardW, cardH, 'select-stage', function () {
              _this16.selectedStage = st.id;
              _this16.localDirty = true;
            });
            cardBoxes.push({
              id: st.id,
              card: {
                left: 375 + x - cardW / 2,
                right: 375 + x + cardW / 2,
                top: _this16.height / 2 - top,
                bottom: _this16.height / 2 - top + cardH
              },
              number: _extends({}, _this16.nodeScreenBox(chapterNo.node), {
                text: chapterNo.string,
                fontSize: chapterNo.fontSize,
                lineHeight: chapterNo.lineHeight
              }),
              name: _extends({}, _this16.nodeScreenBox(stageName.node), {
                text: stageName.string,
                fontSize: stageName.fontSize,
                lineHeight: stageName.lineHeight
              })
            });
          });
          this.objectButton('prev-page', '前页', -108 * u, pagerY, 92 * u, 44 * u, function () {
            _this16.stagePage--;
            _this16.localDirty = true;
          }, this.stagePage > 0, 18 * u);
          this.text(this.stagePage + 1 + " / " + Math.ceil(v.stages.length / pageSize), 0, pagerY, 16 * u, 100 * u, 28 * u);
          this.objectButton('next-page', '后页', 108 * u, pagerY, 92 * u, 44 * u, function () {
            _this16.stagePage++;
            _this16.localDirty = true;
          }, (this.stagePage + 1) * pageSize < v.stages.length, 18 * u);
          var unlocked = chosen.number <= a.highestUnlockedStage;
          this.folioFoot('primary', v.canContinue ? '继续上次行程' : unlocked ? '出战整备' : '先通前一关', f.footerY, function () {
            if (v.canContinue) _this16.act({
              type: 'continue'
            });else {
              _this16.preparingStage = true;
              _this16.localDirty = true;
            }
          }, v.canContinue || unlocked);
          var actualHit = function actualHit(id) {
            var b = _this16.buttons.find(function (item) {
              return item.id === id;
            });
            return b ? {
              left: 375 + b.x,
              right: 375 + b.x + b.width,
              top: _this16.height / 2 - b.y - b.height,
              bottom: _this16.height / 2 - b.y
            } : null;
          };
          this.stageLayout = {
            source: 'actual UITransform label boxes, drawn card bounds and Hit rectangles; screen x-right/y-down in design units',
            unit: u,
            pageSize: pageSize,
            rows: rows,
            selectedStage: this.selectedStage,
            page: this.stagePage,
            preview: preview ? this.nodeScreenBox(preview) : null,
            cards: cardBoxes,
            pager: {
              previous: actualHit('prev-page'),
              next: actualHit('next-page')
            },
            footer: actualHit('primary'),
            gridToPagerU: gridTop - rows * cardH - (rows - 1) * 10 * u - (pagerY + 22 * u),
            minimumPreviewFits: heroCSS >= 96,
            minimumTwoRowsFit: rows === 2
          };
        };
        _proto.training = function training(v) {
          var _v$receipt2,
            _this17 = this;
          var u = this.unit,
            f = this.folio('营地修行'),
            stat = this.selectedTraining,
            level = v.account.training[stat],
            cost = trainingCost(stat, level),
            name = stat === 'ATK' ? '攻击' : '气血',
            subject = stat === 'ATK' ? this.art.clips.idle[0].key : 'objects/ITEM-GE04-RA02',
            extra = Math.min(28, Math.max(0, f.bodyHeight - 518) * .2) * u,
            subjectH = (this.cssHeight <= 720 ? 155 : 175) * u;
          this.image(subject, 0, f.contentTop - subjectH / 2, 310 * u, subjectH);
          this.text(name, 0, f.contentTop - 180 * u - extra, 30 * u, 300 * u, 41 * u, this.ui, true);
          this.text('修行 ' + level + ' / 20', 0, f.contentTop - 215 * u - extra, 15 * u, 300 * u, 28 * u);
          var effect = stat === 'ATK' ? "\u653B\u51FB\u52A0\u7B97 +" + level * 5 + "%" : "\u6700\u5927\u6C14\u8840 +" + level * 10;
          this.text(effect, 0, f.contentTop - 260 * u - extra, 21 * u, 310 * u, 36 * u, this.ui, false, '#b9e4be');
          this.text('下一次出发生效', 0, f.contentTop - 291 * u - extra, 14 * u, 300 * u, 25 * u, this.ui, false, C.muted);
          var receipt = ((_v$receipt2 = v.receipt) == null ? void 0 : _v$receipt2.kind) === 'training' && v.receipt.details.stat === stat ? v.receipt : null;
          this.text(receipt ? "\u672C\u6B21\u4FEE\u884C " + receipt.details.from + " \u2192 " + receipt.details.to + " \u7EA7\uFF0C\u5DF2\u8BB0\u4E0B" : cost === null ? '此项已至上限' : v.account.coins < cost ? "\u94DC\u94B1\u5C1A\u5DEE " + (cost - v.account.coins) : '确认前可取消，原行囊保持。', 0, f.contentTop - 326 * u - extra, 16 * u, 310 * u, 35 * u);
          if (cost !== null) this.costLine(cost, 0, f.contentTop - 366 * u - extra, v);
          ['ATK', 'HP'].forEach(function (id, i) {
            var x = (i - .5) * 140 * u,
              y = f.bottom + 126 * u,
              icon = id === 'ATK' ? _this17.art.clips.idle[0].key : 'objects/ITEM-GE04-RA02',
              g = _this17.graphic(_this17.ui);
            _this17.rect(g, x, y, 128 * u, 84 * u, '#0c302b44');
            g.strokeColor = new Color().fromHEX('#968352');
            g.lineWidth = u;
            g.rect(x - 64 * u, y - 42 * u, 128 * u, 84 * u);
            g.stroke();
            _this17.image(icon, x, y + 17 * u, 80 * u, 43 * u);
            _this17.text(id === 'ATK' ? '攻击' : '气血', x, y - 16 * u, 16 * u, 110 * u, 25 * u);
            _this17.text(v.account.training[id] + ' / 20', x, y - 34 * u, 14 * u, 100 * u, 21 * u);
            if (stat === id) _this17.selectedBorder(x, y, 128 * u, 84 * u);
            _this17.hit('training-' + id, id === 'ATK' ? '攻击修行' : '气血修行', x, y, 128 * u, 84 * u, 'select-training', function () {
              _this17.selectedTraining = id;
              _this17.localDirty = true;
            });
          });
          this.folioFoot('train-' + stat, cost === null ? '此项已满' : v.account.coins < (cost || 0) ? '铜钱不足' : '预览 ' + name, f.footerY, function () {
            _this17.confirm = {
              title: '修行 ' + name,
              subject: subject,
              rows: [{
                label: '修行等级',
                before: level + '级',
                after: level + 1 + '级'
              }, {
                label: stat === 'ATK' ? '攻击加算' : '最大气血加值',
                before: stat === 'ATK' ? '+' + level * 5 + '%' : '+' + level * 10,
                after: stat === 'ATK' ? '+' + (level + 1) * 5 + '%' : '+' + (level + 1) * 10
              }],
              cost: {
                coins: cost || 0
              },
              copy: '确认前可取消。修行保留，下一次出发生效。',
              label: '确认 ' + name,
              action: {
                type: 'train',
                stat: stat
              }
            };
            _this17.localDirty = true;
          }, cost !== null && v.account.coins >= cost && v.saveStatus === 'saved');
        };
        _proto.itemEffect = function itemEffect(id, level) {
          if (id === 'EQ01') return "\u653B\u51FB +" + level * 5 + "%";
          if (id === 'EQ02') return "\u6700\u5927\u6C14\u8840 +" + level * 10;
          if (id === 'EQ03') return "\u653B\u51FB +" + level * 2 + "% \xB7 \u6C14\u8840 +" + level * 4;
          if (id === 'CO01') return "\u79FB\u901F +" + (5 + level) + " \xB7 \u62FE\u53D6\u8303\u56F4 +" + (8 + level * 2);
          return "\u706B\u5F39\u5A01\u529B " + (level + 3) + " \xB7 \u95F4\u9694 2.6\u79D2";
        };
        _proto.itemIcon = function itemIcon(id) {
          return id === 'CO01' ? 'ui/CO01-portrait' : id === 'CO02' ? 'ui/companion-emblem' : id === 'EQ02' ? 'objects/ITEM-GE04-RA02' : id === 'EQ03' ? 'objects/ITEM-GE02-RA02' : 'ui/EQ01-full-detail';
        };
        _proto.itemNavIcon = function itemNavIcon(id) {
          return id === 'EQ01' ? 'ui/EQ01-navigation' : this.itemIcon(id);
        };
        _proto.itemUnlock = function itemUnlock(v, id) {
          var stage = v.stages.find(function (s) {
            return s.reward.unlockItems.includes(id);
          });
          return stage ? '通关' + stage.name + '后解锁' : '尚未解锁';
        };
        _proto.items = function items(v) {
          var _this18 = this;
          var companion = v.screen === 'companions',
            u = this.unit,
            f = this.folio(companion ? '同行伙伴' : '随身器物'),
            ids = companion ? ['CO01', 'CO02'] : ['EQ01', 'EQ02', 'EQ03'];
          if (!ids.includes(this.selectedItem)) this.selectedItem = ids[0];
          var id = this.selectedItem,
            a = v.account,
            level = a.items[id] || 0,
            unlocked = a.unlockedItems.includes(id),
            shards = a.shards[id] || 0,
            cost = upgradeCost(id, level),
            active = companion ? a.equippedCompanionId === id : a.equipped[SLOT[id]] === id,
            receipt = v.receipt && (v.receipt.details.item === id || v.receipt.kind === 'equip' && v.receipt.details.item === null && v.receipt.details.previous === id) ? v.receipt : null;
          var pictureH = (companion ? this.cssHeight <= 720 ? 170 : 226 : this.cssHeight <= 720 ? 172 : 215) * u,
            pictureTop = f.contentTop;
          this.image(this.itemIcon(id), 0, pictureTop - pictureH / 2, 310 * u, pictureH);
          var nameY = pictureTop - pictureH - 24 * u;
          this.text(ITEM_NAMES[id], 0, nameY, 30 * u, 310 * u, 41 * u, this.ui, true);
          this.text((level ? level + '级' + (active ? companion ? ' 正在同行' : ' 已装备' : companion ? ' 暂歇' : ' 未装备') : unlocked ? '尚未激活' : '尚未解锁') + (companion && !active && a.equippedCompanionId ? ' / 同行 ' + ITEM_NAMES[a.equippedCompanionId] : ''), 0, nameY - 33 * u, 15 * u, 300 * u, 27 * u);
          var picksY = nameY - 105 * u,
            pickW = (companion ? 118 : 92) * u,
            pickH = (companion ? 104 : 96) * u;
          ids.forEach(function (item, i) {
            var x = (i - (ids.length - 1) / 2) * (pickW + 14 * u),
              g = _this18.graphic(_this18.ui);
            _this18.rect(g, x, picksY, pickW, pickH, '#0c302b33');
            g.strokeColor = new Color().fromHEX('#9c8854');
            g.lineWidth = u;
            g.rect(x - pickW / 2, picksY - pickH / 2, pickW, pickH);
            g.stroke();
            _this18.image(_this18.itemNavIcon(item), x, picksY + 15 * u, pickW - 16 * u, 56 * u);
            _this18.text(ITEM_NAMES[item], x, picksY - 25 * u, companion ? 20 * u : 18 * u, pickW - 4 * u, 28 * u, _this18.ui, true);
            if (item === id) _this18.selectedBorder(x, picksY, pickW, pickH);
            _this18.hit('item-' + item, ITEM_NAMES[item], x, picksY, pickW, pickH, 'select-item', function () {
              _this18.selectedItem = item;
              _this18.localDirty = true;
            });
          });
          var stateY = picksY - pickH / 2 - 27 * u,
            info = level ? this.itemEffect(id, level) : unlocked ? "\u672C\u4F53\u788E\u7247 " + shards + " / 10" : this.itemUnlock(v, id);
          var saved = receipt ? receipt.kind === 'upgrade' ? "\u672C\u6B21 " + receipt.details.from + " \u2192 " + receipt.details.to + " \u7EA7\uFF0C\u5DF2\u8BB0\u4E0B" : receipt.kind === 'activate' ? '已激活' + (receipt.details.equipped ? companion ? '并同行' : '并装备' : '') + (Number(receipt.details.convertedShards) > 0 ? '，余' + receipt.details.convertedShards + '片转铁' : '，已记下') : receipt.kind === 'equip' ? (active ? companion ? '已改为同行' : '已装备' : companion ? '已暂歇' : '已卸下') + '，已记下' : '' : '';
          this.text(info + (saved ? '\n' + saved : ''), 0, stateY, 17 * u, 310 * u, 48 * u);
          var receiptCopy = receipt ? receipt.message : level ? companion ? '只可一位同行，变化下次出发生效。' : '永久装备保留，变化下次出发生效。' : unlocked ? shards >= 10 ? '集齐十片，可激活一级。' : "\u5C1A\u5DEE " + (10 - shards) + " \u7247\u672C\u4F53\u788E\u7247\u3002" : '先赴山道，通关后可收集本体碎片。';
          var extraLine = level ? "\u6301\u6709 " + a.coins + " \u94DC\u94B1 / " + a.iron + " \u7CBE\u94C1" : receiptCopy;
          this.text(extraLine, 0, stateY - 50 * u, 15 * u, 310 * u, 32 * u, this.ui, false, C.muted);
          if (!level) {
            var auto = companion ? !a.equippedCompanionId : !a.equipped[SLOT[id]],
              label = auto ? companion ? '激活并同行' : '激活并装备' : '激活';
            this.folioFoot('primary', !unlocked ? '尚未解锁' : shards < 10 ? '碎片未齐' : label, f.footerY, function () {
              _this18.confirm = {
                title: label + ' ' + ITEM_NAMES[id],
                subject: _this18.itemIcon(id),
                rows: [{
                  label: '本体碎片',
                  before: String(shards),
                  after: '消耗10片'
                }, {
                  label: '等级',
                  before: '未激活',
                  after: '1级'
                }, {
                  label: companion ? '同行' : '装备',
                  before: companion ? a.equippedCompanionId ? ITEM_NAMES[a.equippedCompanionId] : '无' : '空置',
                  after: auto ? ITEM_NAMES[id] : companion && a.equippedCompanionId ? ITEM_NAMES[a.equippedCompanionId] : '保持原状'
                }],
                copy: (shards > 10 ? "\u4F59\u4E0B" + (shards - 10) + "\u7247\u8F6C\u4E3A\u7B49\u91CF\u7CBE\u94C1\u3002" : '') + (auto ? '激活后同时' + (companion ? '同行。' : '装备。') : '原同行' + (a.equippedCompanionId ? ITEM_NAMES[a.equippedCompanionId] : '无') + '保持，可另行确认更换。') + '下次出发生效。',
                label: '确认激活',
                action: {
                  type: 'activate',
                  itemId: id
                }
              };
              _this18.localDirty = true;
            }, unlocked && shards >= 10 && v.saveStatus === 'saved');
          } else {
            var upgradeY = f.bottom + 112 * u;
            this.objectButton('upgrade', !cost ? '已满十级' : a.coins < cost.coins || a.iron < cost.iron ? "\u9700" + cost.coins + "\u94B1" + cost.iron + "\u94C1" : "\u5347\u7EA7 " + cost.coins + "\u94B1" + cost.iron + "\u94C1", 0, upgradeY, 750 - 70 * u, 47 * u, function () {
              _this18.confirm = {
                title: '升级 ' + ITEM_NAMES[id],
                subject: _this18.itemIcon(id),
                rows: [{
                  label: '等级',
                  before: level + '级',
                  after: level + 1 + '级'
                }, {
                  label: '能力',
                  before: _this18.itemEffect(id, level),
                  after: _this18.itemEffect(id, level + 1)
                }],
                cost: cost || undefined,
                copy: "\u6301\u6709 " + a.coins + " \u94DC\u94B1\u3001" + a.iron + " \u7CBE\u94C1\u3002\u6210\u957F\u4FDD\u7559\uFF0C\u4E0B\u6B21\u51FA\u53D1\u751F\u6548\u3002",
                label: '确认升级',
                action: {
                  type: 'upgrade',
                  itemId: id
                }
              };
              _this18.localDirty = true;
            }, !!cost && a.coins >= cost.coins && a.iron >= cost.iron && v.saveStatus === 'saved', 21 * u);
            var previous = companion ? a.equippedCompanionId : a.equipped[SLOT[id]];
            this.folioFoot('primary', active ? companion ? '暂歇' : '卸下' : companion ? '改为同行' : '装备', f.footerY, function () {
              _this18.confirm = {
                title: active ? '确认' + (companion ? '暂歇' : '卸下') : '确认' + (companion ? '更换同行' : '装备'),
                subject: _this18.itemIcon(id),
                rows: [{
                  label: companion ? '同行' : '装备',
                  before: previous ? ITEM_NAMES[previous] + (companion ? ' ' + a.items[previous] + '级' : '') : '无',
                  after: active ? '无' : ITEM_NAMES[id] + (companion ? ' ' + level + '级' : '')
                }],
                copy: '不消耗资源，下一次出发生效。' + (companion ? '只保留一位同行。' : ''),
                label: active ? '确认卸下' : '确认更换',
                action: {
                  type: 'equip',
                  itemId: active ? null : id,
                  slot: companion ? 'companion' : SLOT[id]
                }
              };
              _this18.localDirty = true;
            }, v.saveStatus === 'saved');
          }
        };
        _proto.battle = function battle(v) {
          var _v$stage4,
            _this19 = this,
            _v$stage5;
          var b = v.battle,
            u = this.unit;
          this.pauseButton('pause', -375 + 30 * u, this.top() - 28 * u);
          this.frame('ui/plaque-wide', 0, this.top() - 25 * u, 232 * u, 38 * u);
          this.hud.set('wave', this.text('', -45 * u, this.top() - 25 * u, 20 * u, 120 * u, 29 * u, this.ui, true));
          this.hud.set('clock', this.text('', 57 * u, this.top() - 25 * u, 20 * u, 70 * u, 29 * u, this.ui, true));
          this.hudText('气血', -375 + 28 * u, this.top() - 59 * u, 14 * u, 32 * u, 22 * u);
          this.hud.set('hp', this.hudText('', 0, this.top() - 59 * u, 14 * u, 70 * u, 22 * u));
          this.hud.set('boss', this.hudText('', 0, this.top() - 89 * u, 19 * u, 300 * u, 28 * u, true));
          if (((_v$stage4 = v.stage) == null ? void 0 : _v$stage4.objective) !== 'clear') this.hud.set('objective', this.hudText('', 0, this.top() - 92 * u, 14 * u, 330 * u, 25 * u));
          var xpY = this.bottom() + 84 * u;
          this.hud.set('level', this.hudText('', 0, xpY, 14 * u, 40 * u, 22 * u));
          this.hud.set('xp', this.hudText('', 0, xpY, 14 * u, 70 * u, 22 * u));
          var rowWidth = 750 - 16 * u,
            spacing = (rowWidth + 4 * u) / 6,
            slot = Math.min(58 * u, spacing - 4 * u),
            slotY = this.bottom() + 67 * u - slot / 2;
          for (var i = 0; i < 6; i++) {
            var x = (i - 2.5) * spacing;
            this.image('ui/round-slot', x, slotY, slot, slot);
            var skill = b.skills[i];
            if (skill) {
              this.skillIcon(skill.id, x, slotY, slot - 14 * u);
              this.rankBadge(skill.rank, x, slotY - slot / 2 + 8.5 * u);
            }
          }
          var smallY = this.bottom() + 102 * u,
            gunX = 375 - 64 * u,
            companionX = 375 - 25 * u;
          this.image('ui/round-slot', gunX, smallY, 34 * u, 34 * u);
          this.image('ui/EQ01-navigation', gunX, smallY, 25 * u, 25 * u);
          this.hit('basic-info', '基础长枪须知', gunX, smallY, 44 * u, 44 * u, 'local-info', function () {
            return _this19.openInfo('basic');
          });
          this.image('ui/round-slot', companionX, smallY, 34 * u, 34 * u);
          var companion = b.stats.companion;
          if (companion) this.image(companion.id === 'CO01' ? 'objects/CO01-idle' : 'ui/companion-emblem', companionX, smallY, 25 * u, 25 * u);
          this.hud.set('hint', this.hudText('按住拖动走位，松手停步', 0, this.top() - 130 * u, 15 * u, 300 * u, 38 * u));
          this.hpBar = this.graphic(this.ui);
          var escortBinding = this.escortBinding((_v$stage5 = v.stage) == null ? void 0 : _v$stage5.id);
          if (escortBinding) {
            this.escortGuide = this.layer('EscortDirectionGuide', this.ui);
            this.image('ui/round-slot', 0, 0, 38 * u, 38 * u, this.escortGuide);
            this.frame('ui/plaque-wide', 0, -30 * u, 82 * u, 28 * u, this.escortGuide);
            this.text(escortBinding.name, 0, -30 * u, 14 * u, 72 * u, 24 * u, this.escortGuide);
            this.escortArrow = this.layer('Direction', this.escortGuide);
            var arrow = this.escortArrow.addComponent(Graphics);
            arrow.fillColor = new Color().fromHEX(C.gold);
            arrow.moveTo(-8.5 * u, 7 * u);
            arrow.lineTo(9.5 * u, 0);
            arrow.lineTo(-8.5 * u, -7 * u);
            arrow.lineTo(-3.5 * u, 0);
            arrow.close();
            arrow.fill();
          }
          if (b.phase === 'choice') this.choice(v);else if (b.phase === 'paused') this.pausePanel(v);else if (b.phase === 'defeat') this.downPanel(v);else if (b.phase === 'victory') this.victoryPanel(v);
        };
        _proto.pausePanel = function pausePanel(v) {
          var _this20 = this;
          var u = this.unit,
            _short3 = this.cssHeight <= 720,
            b = v.battle,
            g = this.graphic(this.ui);
          this.rect(g, 0, 0, 750, this.height, '#071b1ab8');
          this.buttons = [];
          var cy = -this.height * (_short3 ? .015 : .01),
            h = this.height * (_short3 ? .79 : .68),
            top = cy + h / 2;
          this.frame('ui/panel-frame', 0, cy, 750 - 22 * u, h);
          this.text('暂歇片刻', 0, top - 40 * u, (_short3 ? 30 : 32) * u, 600, 48 * u, this.ui, true);
          this.image(this.art.clips.idle[0].key, 0, top - 112 * u, (_short3 ? 215 : 230) * u, (_short3 ? 86 : 100) * u);
          this.text(b.pauseReason === 'revived' ? '已恢复六成气血。待你准备妥当，再继续这段交锋。' : '山道暂歇。待你准备妥当，再继续这段交锋。', 0, top - 191 * u, (_short3 ? 16 : 17) * u, 600, 76 * u);
          var y = top - (_short3 ? 255 : 280) * u,
            step = (_short3 ? 60 : 63) * u;
          this.objectButton('resume', b.offer ? '继续选择' : '继续交锋', 0, y, 600, 51 * u, function () {
            return _this20.act({
              type: 'resume'
            });
          }, true, 24 * u);
          this.objectButton('pause-settings', '声音设置', 0, y - step, 600, 51 * u, function () {
            return _this20.openInfo('settings');
          }, true, 24 * u);
          this.objectButton('pause-help', '行程须知', 0, y - 2 * step, 600, 51 * u, function () {
            return _this20.openInfo('help');
          }, true, 24 * u);
          this.objectButton('abandon', '就此归营', 0, y - 3 * step, 600, 51 * u, function () {
            _this20.confirm = {
              title: '就此归营？',
              copy: '本次行程结束，不领取通关奖励。\n取消将回到原暂停与选择。',
              label: '确认归营',
              action: {
                type: 'abandon'
              }
            };
            _this20.localDirty = true;
          }, true, 24 * u);
          this.text('离开窗口也会暂停。回来后，明确继续并重新按住移动。', 0, cy - h / 2 + 29 * u, 14 * u, 600, 48 * u);
        };
        _proto.skillIcon = function skillIcon(id, x, y, size) {
          var source = this.frames.get('skill-icons');
          if (!source) return;
          var i = Number(id.slice(2)) - 1;
          var f = new SpriteFrame();
          f.texture = source.texture;
          f.rect = new Rect(i % 4 * 362, Math.floor(i / 4) * 362, 362, 362);
          f.packable = false;
          var n = this.layer(id, this.ui);
          n.setPosition(x, y);
          this.transform(n, size, size);
          var s = n.addComponent(Sprite);
          s.sizeMode = Sprite.SizeMode.CUSTOM;
          s.spriteFrame = f;
        };
        _proto.rankBadge = function rankBadge(rank, x, y) {
          var u = this.unit,
            w = (rank >= 10 ? 38 : 32) * u,
            g = this.graphic(this.ui);
          this.rect(g, x, y, w, 19 * u, '#19392e');
          g.strokeColor = new Color().fromHEX('#aa8b50');
          g.lineWidth = u;
          g.rect(x - w / 2, y - 9.5 * u, w, 19 * u);
          g.stroke();
          var l = this.text(rank + '重', x, y, 14 * u, w - 2 * u, 19 * u, this.ui, false, '#fbe4ac');
          l.lineHeight = 17 * u;
        };
        _proto.skillWorld = function skillWorld(id, age, variant) {
          if (age === void 0) {
            age = 0;
          }
          if (variant === void 0) {
            variant = 0;
          }
          var art = this.art.skillVisuals[id];
          if (!(art != null && art.frames.length)) return null;
          var index = art.mode === 'paired-orbits' ? variant % art.frames.length : Math.floor(Math.max(0, age) / art.frameSeconds) % art.frames.length;
          return {
            key: art.frames[index],
            height: art.heightU
          };
        };
        _proto.choice = function choice(v) {
          var _this21 = this;
          var b = v.battle,
            offer = b.offer;
          if (!offer) return;
          var u = this.unit,
            _short4 = this.cssHeight <= 720,
            g = this.graphic(this.ui);
          this.rect(g, 0, 0, 750, this.height, '#0b151a70');
          this.buttons = [];
          this.hit('pause', '暂停', -375 + 30 * u, this.top() - 28 * u, 44 * u, 44 * u, 'pause', function () {
            return _this21.act({
              type: 'pause'
            });
          });
          var stageTop = this.height / 2 - this.height * (_short4 ? .248 : .29),
            heading = (_short4 ? 58 : 64) * u,
            gap = (_short4 ? 5 : 8) * u,
            cardH = (_short4 ? 232 : 240) * u,
            cardTop = stageTop - heading - gap,
            cy = cardTop - cardH / 2,
            count = offer.skills.length;
          var cardW = (count === 1 ? 145 : count === 2 ? (750 / u - 86) / 2 : (750 / u - 24) / 3) * u,
            spacing = cardW + 5 * u;
          this.frame('ui/plaque-wide', 0, stageTop - (_short4 ? 22 : 24) * u, 234 * u, (_short4 ? 44 : 48) * u);
          this.text('境界提升', 0, stageTop - (_short4 ? 22 : 24) * u, (_short4 ? 28 : 29) * u, 180 * u, 42 * u, this.ui, true);
          this.text('任选其一', 0, stageTop - (_short4 ? 51 : 57) * u, 19 * u, 260 * u, 24 * u, this.ui, true);
          var roles = {
            SK01: '穿透飞刃',
            SK02: '慢速贯穿滚石',
            SK03: '移动持续风区',
            SK04: '近身环绕星锤',
            SK05: '双点预告地刺',
            SK06: '定点陷阱区域',
            SK07: '脉冲小幅击退',
            SK08: '穿透冰矢短控',
            SK09: '三羽扇射',
            SK10: '三目标连锁',
            SK11: '八刺周向发射',
            SK12: '黑白双轨环绕'
          };
          offer.skills.forEach(function (id, i) {
            var _b$skills$find;
            var x = (i - (count - 1) / 2) * spacing,
              rank = ((_b$skills$find = b.skills.find(function (s) {
                return s.id === id;
              })) == null ? void 0 : _b$skills$find.rank) || 0,
              spec = v.skills.find(function (s) {
                return s.id === id;
              }),
              selected = _this21.selectedCard === id,
              pad = (_short4 ? 8 : 10) * u,
              iconH = (_short4 ? 58 : 64) * u,
              nameH = (_short4 ? 29 : 31) * u,
              primaryH = (_short4 ? 36 : 38) * u;
            _this21.frame('ui/card-frame', x, cy, cardW, cardH);
            _this21.skillIcon(id, x, cardTop - pad - iconH / 2, Math.min(72 * u, iconH));
            var rowTop = cardTop - pad - iconH - 4 * u;
            _this21.frame('ui/name-plaque', x, rowTop - nameH / 2, cardW - 13 * u, nameH);
            var name = _this21.text((spec == null ? void 0 : spec.name) || id, x, rowTop - nameH / 2, 22 * u, cardW - 19 * u, nameH, _this21.ui, true);
            name.lineHeight = 22 * u;
            rowTop -= nameH + 4 * u;
            var label = _this21.text('重数', x, rowTop - 7.5 * u, 14 * u, cardW - 12 * u, 17 * u, _this21.ui, false, '#d5c99e');
            label.lineHeight = 16 * u;
            var primary = _this21.text(rank ? rank + "\u91CD \u2192 " + (rank + 1) + "\u91CD" : '未习 → 1重', x, rowTop - 25 * u, 16 * u, cardW - 12 * u, 20 * u);
            primary.lineHeight = 18 * u;
            rowTop -= primaryH + 4 * u;
            var secondary = _this21.text(rank ? '增伤·间隔缩短' : roles[id], x, rowTop - 9 * u, 14 * u, cardW - 12 * u, 18 * u, _this21.ui, false, '#e4d8ac');
            secondary.lineHeight = 18 * u;
            rowTop -= 22 * u;
            var kind = _this21.text(rank ? '强化已有' : '学习新招', x, rowTop - 9 * u, 17 * u, cardW - 12 * u, 18 * u, _this21.ui, true, '#d2c090');
            kind.lineHeight = 18 * u;
            _this21.hit('card-' + id, (spec == null ? void 0 : spec.name) || id, x, cardTop - (cardH - 44 * u) / 2, cardW, cardH - 44 * u, 'select-card', function () {
              _this21.selectedCard = id;
              _this21.localDirty = true;
            });
            _this21.text('详情', x, cardTop - cardH + 24 * u, 14 * u, cardW - 18 * u, 40 * u);
            _this21.hit('detail-' + id, ((spec == null ? void 0 : spec.name) || id) + '详情', x, cardTop - cardH + 24 * u, cardW - 18 * u, 44 * u, 'detail', function () {
              _this21.detailSkill = id;
              _this21.detail = id;
              _this21.localDirty = true;
            });
            if (selected) {
              var ink = _this21.graphic(_this21.ui);
              ink.strokeColor = new Color().fromHEX('#edc776');
              ink.lineWidth = 2 * u;
              ink.roundRect(x - cardW / 2 - u, cy - cardH / 2 - u, cardW + 2 * u, cardH + 2 * u, 2 * u);
              ink.stroke();
              var mx = x + cardW / 2 - 20 * u,
                my = cardTop - 21 * u;
              _this21.image('ui/round-slot', mx, my, 34 * u, 34 * u);
              var check = _this21.graphic(_this21.ui);
              check.strokeColor = new Color().fromHEX('#ffe19a');
              check.lineWidth = 3.3 * u;
              check.moveTo(mx - 9 * u, my);
              check.lineTo(mx - 3 * u, my - 6 * u);
              check.lineTo(mx + 9 * u, my + 8 * u);
              check.stroke();
              var mark = _this21.text('已选', mx, my - 23 * u, 14 * u, 40 * u, 18 * u);
              mark.lineHeight = 18 * u;
            }
          });
          var actionY = cardTop - cardH - gap - (_short4 ? 27.5 : 29.5) * u,
            chosen = v.skills.find(function (s) {
              return s.id === _this21.selectedCard;
            }),
            confirmW = (750 / u - 115) * u,
            confirmX = -(53 * u + 4 * u) / 2;
          this.objectButton('confirm-choice', chosen ? '确认 ' + chosen.name : '先选一项', confirmX, actionY, confirmW, 53 * u, function () {
            if (_this21.selectedCard) _this21.act({
              type: 'choose',
              offerId: offer.id,
              skillId: _this21.selectedCard
            });
          }, !!chosen, 23 * u);
          var helpX = confirmX + confirmW / 2 + 4 * u + 26.5 * u;
          this.image('ui/round-slot', helpX, actionY + 7 * u, 43 * u, 43 * u);
          this.image('ui/icon-scroll', helpX, actionY + 7 * u, 26 * u, 26 * u);
          this.text('须知', helpX, actionY - 22 * u, 14 * u, 53 * u, 18 * u);
          this.hit('choice-help', '选择须知', helpX, actionY, 53 * u, 59 * u, 'local-info', function () {
            return _this21.openInfo('help');
          });
        };
        _proto.updateHud = function updateHud(v) {
          var _v$enemies$find,
            _this22 = this,
            _v$stage6,
            _v$stage7,
            _v$stage8,
            _this$escortBinding,
            _o$hp,
            _v$stage9,
            _v$stage10,
            _v$stage11;
          var b = v.battle,
            u = this.unit,
            o = b.objective,
            boss = b.enemies.find(function (e) {
              return e.hp > 0 && e.kind.startsWith('BO');
            }),
            bossName = boss ? ((_v$enemies$find = v.enemies.find(function (e) {
              return e.id === boss.kind;
            })) == null ? void 0 : _v$enemies$find.name) || boss.kind : '',
            seconds = Math.floor(b.time),
            clock = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
          var set = function set(key, value) {
            var l = _this22.hud.get(key);
            if (l && l.string !== value) l.string = value;
            return l;
          };
          set('wave', Math.min(((_v$stage6 = v.stage) == null ? void 0 : _v$stage6.waves.length) || 1, b.wave + 1) + " / " + (((_v$stage7 = v.stage) == null ? void 0 : _v$stage7.waves.length) || 1) + " \u6CE2");
          set('clock', clock);
          var hpText = num(Math.max(0, b.hero.hp)) + " / " + num(b.hero.maxHp),
            hpWidth = this.bodyWidth(hpText, 14 * u) + 4 * u,
            hp = set('hp', hpText),
            hpRight = 375 - 12 * u;
          if (hp) {
            this.transform(hp.node, hpWidth, 22 * u);
            this.labelTargets.set(hp.node, {
              width: hpWidth,
              height: 22 * u
            });
            hp.node.setPosition(hpRight - hpWidth / 2, this.top() - 59 * u);
          }
          var xpText = num(b.xp) + " / " + num(b.xpNext),
            levelText = "\u5883" + b.level,
            xpWidth = this.bodyWidth(xpText, 14 * u) + 4 * u,
            levelWidth = this.bodyWidth(levelText, 14 * u) + 4 * u,
            xpRight = 375 - 8 * u,
            xpLeft = -375 + 8 * u,
            xpY = this.bottom() + 84 * u,
            xp = set('xp', xpText),
            level = set('level', levelText);
          if (xp) {
            this.transform(xp.node, xpWidth, 22 * u);
            this.labelTargets.set(xp.node, {
              width: xpWidth,
              height: 22 * u
            });
            xp.node.setPosition(xpRight - xpWidth / 2, xpY);
          }
          if (level) {
            this.transform(level.node, levelWidth, 22 * u);
            this.labelTargets.set(level.node, {
              width: levelWidth,
              height: 22 * u
            });
            level.node.setPosition(xpLeft + levelWidth / 2, xpY);
          }
          var bossLabel = set('boss', bossName);
          if (bossLabel) bossLabel.node.active = !!boss;
          var distance = o.x === undefined || o.y === undefined ? Infinity : Math.hypot(b.hero.x - o.x, b.hero.y - o.y),
            objective = ((_v$stage8 = v.stage) == null ? void 0 : _v$stage8.objective) === 'escort' ? (((_this$escortBinding = this.escortBinding(v.stage.id)) == null ? void 0 : _this$escortBinding.name) || '护送目标') + " " + num(o.hp || 0) + " / " + num(o.maxHp || 0) + " \xB7 " + (((_o$hp = o.hp) != null ? _o$hp : 1) <= 0 ? '已损毁' : o.progress >= 1 ? '已抵达' : distance > 300 ? '请靠近同行' : '守住目标') : ((_v$stage9 = v.stage) == null ? void 0 : _v$stage9.objective) === 'beacon' ? "\u5B88\u4F4F\u7075\u706F " + num(o.progress) + " / " + num(o.target) + " \u79D2" : "\u575A\u5B88 " + num(o.progress) + " / " + num(o.target) + " \u79D2",
            objectiveLabel = set('objective', objective);
          if (objectiveLabel) objectiveLabel.node.setPosition(0, this.top() - (boss ? 133 : 91) * u);
          var hint = this.hud.get('hint');
          if (hint) hint.node.active = b.phase === 'playing' && ((_v$stage10 = v.stage) == null ? void 0 : _v$stage10.id) === 'ST01' && v.account.clearedStages.length === 0 && !this.firstGuidanceSeen && b.time < 3;
          if (this.hpBar) {
            var g = this.hpBar;
            g.clear();
            var hpLeft = -375 + 51 * u,
              hpEnd = hpRight - hpWidth - 7 * u;
            this.track(g, (hpLeft + hpEnd) / 2, this.top() - 59 * u, hpEnd - hpLeft, 9 * u, b.hero.hp / b.hero.maxHp, '#a74634');
            var left = xpLeft + levelWidth + 6 * u,
              right = xpRight - xpWidth - 6 * u;
            this.track(g, (left + right) / 2, xpY, right - left, 9 * u, b.xp / b.xpNext, '#70d6b7');
            if (boss) this.track(g, 0, this.top() - 108 * u, 750 - 88 * u, 8 * u, boss.hp / boss.maxHp, '#a74634');
          }
          this.hudState = {
            clock: clock,
            simTime: b.time,
            wave: b.wave + 1,
            waves: (_v$stage11 = v.stage) == null ? void 0 : _v$stage11.waves.length,
            hero: {
              hp: b.hero.hp,
              maxHp: b.hero.maxHp
            },
            xp: {
              level: b.level,
              value: b.xp,
              next: b.xpNext
            },
            boss: boss ? {
              id: boss.id,
              kind: boss.kind,
              name: bossName,
              hp: boss.hp,
              maxHp: boss.maxHp
            } : null,
            smallObjects: {
              basic: '基础长枪',
              companion: b.stats.companion
            },
            guidanceVisible: (hint == null ? void 0 : hint.node.active) || false
          };
        };
        _proto.skillDetail = function skillDetail(v) {
          var _b$skills$find2,
            _this23 = this;
          var id = this.detailSkill,
            spec = v.skills.find(function (s) {
              return s.id === id;
            });
          if (!id || !spec) return;
          var u = this.unit,
            b = v.battle,
            rank = (b == null || (_b$skills$find2 = b.skills.find(function (s) {
              return s.id === id;
            })) == null ? void 0 : _b$skills$find2.rank) || 0,
            next = Math.min(10, rank + 1),
            mult = (b == null ? void 0 : b.stats.damageMultiplier) || 1,
            damage = function damage(r) {
              return spec.damage * (1 + .12 * (r - 1)) * mult;
            },
            interval = function interval(r) {
              return spec.interval / (1 + .03 * (r - 1));
            },
            h = Math.min(this.height - 90 * u, 570 * u),
            top = h / 2,
            g = this.graphic(this.ui);
          this.rect(g, 0, 0, 750, this.height, '#071b1adb');
          this.buttons = [];
          this.frame('ui/panel-frame', 0, 0, 750 - 22 * u, h);
          this.frame('ui/plaque-wide', 0, top - 35 * u, 260 * u, 46 * u);
          this.text(spec.name + ' 招式详情', 0, top - 35 * u, 26 * u, 220 * u, 40 * u, this.ui, true);
          this.skillIcon(id, 0, top - 105 * u, 82 * u);
          this.text(rank ? rank + "\u91CD \u2192 " + next + "\u91CD" : '未习 → 1重', 0, top - 169 * u, 24 * u, 300 * u, 36 * u, this.ui, true);
          this.text(spec.description, 0, top - 226 * u, 17 * u, 306 * u, 72 * u);
          var before = rank ? num(damage(rank)) : '未习',
            after = num(damage(next)),
            beforeInterval = rank ? num(interval(rank)) + '秒' : '未习',
            afterInterval = num(interval(next)) + '秒';
          this.text("\u6BCF\u6B21\u57FA\u7840\u5A01\u529B  " + before + " \u2192 " + after + "\n\u89E6\u53D1\u95F4\u9694  " + beforeInterval + " \u2192 " + afterInterval, 0, top - 319 * u, 17 * u, 306 * u, 82 * u);
          this.text('威力已含本局攻击倍率；实际命中仍受目标防护与招式规则影响。', 0, top - 393 * u, 15 * u, 300 * u, 70 * u, this.ui, false, C.muted);
          this.objectButton('detail-back', '返回原选择', 0, -h / 2 + 39 * u, 280 * u, 48 * u, function () {
            _this23.detail = null;
            _this23.detailSkill = null;
            _this23.localDirty = true;
          }, true, 23 * u);
        };
        _proto.infoPanel = function infoPanel(v) {
          var _this24 = this;
          var info = this.info;
          if (!info) return;
          var u = this.unit,
            g = this.graphic(this.ui),
            titles = {
              settings: '声音设置',
              help: '行路须知',
              codex: '江湖图鉴',
              history: '行程',
              basic: '基础长枪',
              rewards: '所得来源'
            },
            top = this.top() - 65 * u,
            bottom = this.bottom() + 10 * u,
            cy = (top + bottom) / 2,
            h = top - bottom,
            w = 750 - 22 * u,
            contentTop = top - 35 * u;
          this.rect(g, 0, 0, 750, this.height, '#071b1ac9');
          this.buttons = [];
          this.frame('ui/panel-frame', 0, cy, w, h);
          this.frame('ui/plaque-wide', 0, this.top() - 31 * u, 297 * u, 46 * u);
          this.text(titles[info], 0, this.top() - 31 * u, 27 * u, 245 * u, 42 * u, this.ui, true);
          var close = function close() {
            _this24.info = null;
            _this24.localDirty = true;
          };
          this.image('ui/round-slot', -375 + 33 * u, this.top() - 28 * u, 44 * u, 44 * u);
          this.text('‹', -375 + 33 * u, this.top() - 29 * u, 34 * u, 40 * u, 42 * u);
          this.hit('info-back', '返回原处', -375 + 33 * u, this.top() - 28 * u, 44 * u, 44 * u, 'local-back', close);
          if (info === 'settings') {
            this.image('ui/icon-scroll', 0, contentTop - 65 * u, 140 * u, 125 * u);
            this.text('听山风，也听自己的节奏', 0, contentTop - 152 * u, 22 * u, 300 * u, 45 * u, this.ui, true);
            this.text(v.soundEnabled ? '游戏声音已开启' : '当前静音，危险仍有明确画面', 0, contentTop - 202 * u, 17 * u, 300 * u, 60 * u);
            this.objectButton('sound', v.soundEnabled ? '关闭声音' : '开启声音', 0, contentTop - 267 * u, 280 * u, 48 * u, function () {
              return _this24.act({
                type: 'sound',
                enabled: !v.soundEnabled
              });
            }, true, 23 * u);
            var save = {
              saved: '行程已记下',
              saving: '正在记下行程…',
              error: '保存未完成，请重试',
              conflict: '档案已更新，请重新核对'
            }[v.saveStatus];
            this.text(save, 0, contentTop - 333 * u, 17 * u, 300 * u, 55 * u);
            this.text(this.audioFailed.length ? '部分声音暂不可用，可静音继续。' : '声音随真实动作与界面操作播放。', 0, contentTop - 384 * u, 15 * u, 300 * u, 60 * u, this.ui, false, C.muted);
          } else if (info === 'basic') {
            var _v$battle;
            this.image('ui/EQ01-full-detail', 0, contentTop - 85 * u, 290 * u, 150 * u);
            this.text('基础枪术 不占六招槽', 0, contentTop - 188 * u, 23 * u, 310 * u, 44 * u, this.ui, true);
            var damage = 14 * (((_v$battle = v.battle) == null ? void 0 : _v$battle.stats.damageMultiplier) || 1);
            this.text("\u6A2A\u626B\u5A01\u529B " + num(damage) + "\n\u8D77\u624B\u95F4\u9694 1.6\u79D2\n\u626B\u51FB\u8303\u56F4 155 \xB7 \u6247\u89D2 140\xB0", 0, contentTop - 278 * u, 18 * u, 300 * u, 118 * u);
            this.text('自动朝近敌起手。移动与走位由你掌握；未扫到的敌人不会受伤。', 0, contentTop - 384 * u, 16 * u, 300 * u, 90 * u, this.ui, false, C.muted);
          } else if (info === 'help') {
            var pages = [['走位与交锋', '按住画面拖动走位，松手停步。\n基础长枪自动朝近敌横扫。\n避开红色预警，再寻找出手机会。\n暂停或离开窗口后，明确继续才会恢复。'], ['取招与成长', '经验实际到身后提升境界。\n三卡选中不会立即学招，具名确认才生效。\n最多六招，每招最高十重。\n营地修行、器物与伙伴在下次出发时取快照。'], ['行程与战果', '每局可免费复起一次，恢复六成气血。\n通关结算后保存奖励与解锁。\n失败只得已完整通过波次的少量铜钱。\n回到营地可整备，再择一段山道。']];
            this.infoPage = clamp(this.infoPage, 0, pages.length - 1);
            var p = pages[this.infoPage];
            this.image('ui/icon-scroll', 0, contentTop - 65 * u, 145 * u, 125 * u);
            this.text(p[0], 0, contentTop - 154 * u, 24 * u, 300 * u, 42 * u, this.ui, true);
            this.text(p[1], 0, contentTop - 294 * u, 17 * u, 304 * u, 220 * u);
            this.infoPagination(pages.length, bottom + 100 * u);
          } else if (info === 'history') {
            this.image('ui/icon-scroll', 0, contentTop - 64 * u, 145 * u, 125 * u);
            this.text("\u5DF2\u901A\u5C71\u9053 " + v.account.clearedStages.length + " / " + v.stages.length, 0, contentTop - 150 * u, 27 * u, 300 * u, 48 * u, this.ui, true);
            var highest = v.stages.find(function (s) {
              return s.number === v.account.highestUnlockedStage;
            });
            this.text('当前可赴 · ' + ((highest == null ? void 0 : highest.name) || '前路'), 0, contentTop - 202 * u, 19 * u, 304 * u, 55 * u);
            var cleared = v.stages.filter(function (s) {
                return v.account.clearedStages.includes(s.id);
              }),
              _pages = Math.max(1, Math.ceil(cleared.length / 6));
            this.infoPage = clamp(this.infoPage, 0, _pages - 1);
            this.text(cleared.slice(this.infoPage * 6, this.infoPage * 6 + 6).map(function (s) {
              return s.name;
            }).join('\n') || '第一段山道，等你启程。', 0, contentTop - 329 * u, 18 * u, 300 * u, 190 * u);
            if (_pages > 1) this.infoPagination(_pages, bottom + 100 * u);
          } else if (info === 'rewards') {
            var _d$completedWaves;
            var r = v.receipt,
              d = (r == null ? void 0 : r.details) || {},
              stage = v.stages.find(function (s) {
                return s.id === d.stageId;
              }),
              win = d.outcome === 'victory',
              first = !!d.firstClear,
              gifts = Array.isArray(d.gifts) ? d.gifts : [],
              drops = Array.isArray(d.drops) ? d.drops : [];
            var sources = [['基础所得', win ? ((stage == null ? void 0 : stage.reward.coins) || 0) + " \u94DC\u94B1 / " + ((stage == null ? void 0 : stage.reward.iron) || 0) + " \u7CBE\u94C1" : "\u5B8C\u6574\u901A\u8FC7 " + ((_d$completedWaves = d.completedWaves) != null ? _d$completedWaves : 0) + " \u6CE2\uFF0C\u94DC\u94B1 " + ((r == null ? void 0 : r.coins) || 0)], ['首通额外', win && first ? ((stage == null ? void 0 : stage.reward.firstCoins) || 0) + " \u94DC\u94B1 / " + ((stage == null ? void 0 : stage.reward.firstIron) || 0) + " \u7CBE\u94C1" : '此次无首通额外'], ['本体碎片', [].concat(gifts.map(function (x) {
              return ITEM_NAMES[x.item] + " \u9996\u901A " + x.quantity + "\u7247" + (x.converted ? '，转铁' + x.converted : '');
            }), drops.map(function (x) {
              return ITEM_NAMES[x.item] + " \u6389\u843D " + x.quantity + "\u7247" + (x.converted ? '，转铁' + x.converted : '');
            })).join('\n') || '此次无碎片'], ['本次解锁', [].concat((d.unlockedSkills || []).map(function (id) {
              var _v$skills$find;
              return ((_v$skills$find = v.skills.find(function (s) {
                return s.id === id;
              })) == null ? void 0 : _v$skills$find.name) || id;
            }), (d.unlockedItems || []).map(function (id) {
              return ITEM_NAMES[id];
            })).join('、') || '此次无新增解锁']];
            this.infoPage = clamp(this.infoPage, 0, 1);
            this.image('ui/icon-scroll', 0, contentTop - 59 * u, 140 * u, 112 * u);
            sources.slice(this.infoPage * 2, this.infoPage * 2 + 2).forEach(function (row, i) {
              var y = contentTop - (151 + i * 140) * u;
              _this24.text(row[0], 0, y, 25 * u, 300 * u, 38 * u, _this24.ui, true);
              _this24.text(row[1], 0, y - 66 * u, 17 * u, 304 * u, 100 * u);
            });
            this.text('战果已记入行囊，返回不会再次领取。', 0, bottom + 135 * u, 14 * u, 300 * u, 22 * u, this.ui, false, C.muted);
            this.infoPagination(2, bottom + 100 * u);
          } else {
            var isSkill = this.infoTab === 'skills',
              rows = isSkill ? v.skills : v.enemies,
              _pages2 = Math.ceil(rows.length / 4);
            this.infoPage = clamp(this.infoPage, 0, _pages2 - 1);
            this.objectButton('codex-skills', '招式', -76 * u, contentTop - 12 * u, 140 * u, 44 * u, function () {
              _this24.infoTab = 'skills';
              _this24.infoPage = 0;
              _this24.localDirty = true;
            }, true, 21 * u);
            this.objectButton('codex-enemies', '敌情', 76 * u, contentTop - 12 * u, 140 * u, 44 * u, function () {
              _this24.infoTab = 'enemies';
              _this24.infoPage = 0;
              _this24.localDirty = true;
            }, true, 21 * u);
            rows.slice(this.infoPage * 4, this.infoPage * 4 + 4).forEach(function (row, i) {
              var y = contentTop - (79 + i * 88) * u;
              if (isSkill) _this24.skillIcon(row.id, -118 * u, y, 58 * u);else {
                var base = String(row.art || row.id),
                  key = ['actors/' + base + '-ready', 'actors/' + base + '-idle', 'actors/' + base + '-move-01'].find(function (k) {
                    return _this24.frames.has(k);
                  });
                if (key) _this24.image(key, -118 * u, y, 68 * u, 64 * u);
              }
              _this24.text(row.name, 40 * u, y + 23 * u, 23 * u, 220 * u, 32 * u, _this24.ui, true);
              var copy = isSkill ? String(row.description) : "\u6C14\u8840 " + row.hp + " \xB7 \u4F24\u5BB3 " + row.damage;
              _this24.text(copy, 40 * u, y - 15 * u, 15 * u, 220 * u, 53 * u);
            });
            this.infoPagination(_pages2, bottom + 100 * u);
          }
          this.objectButton('info-close', '返回原处', 0, bottom + 37 * u, 280 * u, 48 * u, close, true, 23 * u);
        };
        _proto.infoPagination = function infoPagination(pages, y) {
          var _this25 = this;
          var u = this.unit;
          this.objectButton('info-prev', '上一页', -101 * u, y, 102 * u, 44 * u, function () {
            _this25.infoPage--;
            _this25.localDirty = true;
          }, this.infoPage > 0, 18 * u);
          this.text(this.infoPage + 1 + " / " + pages, 0, y, 16 * u, 80 * u, 32 * u);
          this.objectButton('info-next', '下一页', 101 * u, y, 102 * u, 44 * u, function () {
            _this25.infoPage++;
            _this25.localDirty = true;
          }, this.infoPage < pages - 1, 18 * u);
        };
        _proto.updateEscortGuide = function updateEscortGuide(v) {
          var _v$stage12, _v$stage13;
          var b = v.battle,
            o = b.objective,
            binding = this.escortBinding((_v$stage12 = v.stage) == null ? void 0 : _v$stage12.id),
            sf = binding ? this.frames.get(binding.key) : undefined;
          if (!this.escortGuide || !this.escortArrow || !binding || !sf || o.x === undefined || o.y === undefined) {
            this.objectiveG.node.active = false;
            if (this.escortGuide) this.escortGuide.active = false;
            if (this.escortPresentation) this.escortPresentation.informationVisible = false;
            this.escortGuideState = null;
            return;
          }
          var x = o.x - this.cam.x,
            y = this.cam.y - o.y,
            crop = sf.rect,
            scale = binding.heightU / binding.referenceHeight;
          var u = this.unit,
            hasBoss = b.enemies.some(function (e) {
              return e.hp > 0 && e.kind.startsWith('BO');
            }),
            clear = {
              left: -375 + 12 * u,
              right: 375 - 12 * u,
              bottom: this.bottom() + 123 * u,
              top: this.top() - (hasBoss ? 145 : 112) * u
            };
          var bounds = {
            left: x - binding.anchorPx[0] * scale,
            right: x + (crop.width - binding.anchorPx[0]) * scale,
            bottom: y - (crop.height - binding.anchorPx[1]) * scale,
            top: y + binding.anchorPx[1] * scale
          };
          // The name plaque is wider/higher than the prop. Handover also waits for complete information bounds.
          var informationBounds = {
            left: Math.min(bounds.left, x - 87),
            right: Math.max(bounds.right, x + 87),
            bottom: Math.min(bounds.bottom, y + 44),
            top: Math.max(bounds.top, y + 126)
          };
          var obscured = informationBounds.left < clear.left || informationBounds.right > clear.right || informationBounds.bottom < clear.bottom || informationBounds.top > clear.top;
          var allowed = b.phase === 'playing' && !this.confirm && !this.detail && !this.info && v.saveStatus !== 'error' && v.saveStatus !== 'conflict';
          var halfWidth = 375 - 48 * u,
            edge = {
              left: -halfWidth,
              right: halfWidth,
              bottom: clear.bottom + 40 * u,
              top: clear.top - 36 * u
            },
            centerY = (edge.top + edge.bottom) / 2,
            dx = x,
            dy = y - centerY,
            ratio = Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / Math.max(1, (edge.top - edge.bottom) / 2), 1),
            point = {
              x: dx / ratio,
              y: centerY + dy / ratio
            },
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
          // One same-frame decision owns both presentations; never leave an early drawWorld flag in inspect.
          var worldVisible = allowed && !obscured,
            guideVisible = allowed && obscured;
          this.objectiveG.node.active = worldVisible;
          this.escortGuide.active = guideVisible;
          this.escortGuide.setPosition(point.x, point.y);
          this.escortArrow.setRotationFromEuler(0, 0, angle);
          if (this.escortPresentation) {
            this.escortPresentation.informationVisible = worldVisible;
            this.escortPresentation.informationSource = worldVisible ? 'world' : guideVisible ? 'guide' : 'hidden';
          }
          this.escortGuideState = {
            stageId: (_v$stage13 = v.stage) == null ? void 0 : _v$stage13.id,
            name: binding.name,
            key: binding.key,
            visible: this.escortGuide.active,
            reason: !allowed ? 'overlay-or-frozen' : obscured ? 'outside-clear-playfield' : 'target-visible',
            point: point,
            angleDegreesYUp: angle,
            targetScreenPoint: {
              x: x,
              y: y
            },
            informationBounds: informationBounds,
            clearPlayfield: clear,
            edgeBounds: edge,
            nonInteractive: true
          };
        };
        _proto.savePanel = function savePanel(v) {
          var _this26 = this;
          var conflict = v.saveStatus === 'conflict',
            u = this.unit,
            g = this.graphic(this.ui),
            h = Math.min(this.height - 50 * u, 484 * u),
            top = h / 2;
          this.rect(g, 0, 0, 750, this.height, '#071b1adb');
          this.buttons = [];
          this.frame('ui/panel-frame', 0, 0, 750 - 22 * u, h);
          this.text(conflict ? '档案已更新' : '行程未记下', 0, top - 40 * u, 28 * u, 310 * u, 44 * u, this.ui, true);
          this.image('ui/icon-scroll', 0, top - 148 * u, 180 * u, 142 * u);
          this.text(conflict ? '另一处已更新行程。\n重新核对最新档案后，再明确继续。' : '这次变化还未记妥，交锋已暂停。\n重试仍核对同一次变化，原战果保留。', 0, top - 286 * u, 18 * u, 300 * u, 112 * u);
          this.objectButton('save-retry', conflict ? '重新核对档案' : '重试保存', 0, -h / 2 + 42 * u, 300 * u, 55 * u, function () {
            return _this26.act({
              type: conflict ? 'reload-save' : 'retry-save'
            });
          }, true, 22 * u);
        };
        _proto.encounter = function encounter(title) {
          var u = this.unit,
            _short5 = this.cssHeight <= 720,
            top = this.top() - (_short5 ? 18 : 26) * u,
            bottom = this.bottom() + (_short5 ? 17 : 23) * u,
            g = this.graphic(this.ui);
          this.rect(g, 0, 0, 750, this.height, '#051b1b88');
          this.buttons = [];
          this.frame('ui/panel-frame', 0, (top + bottom) / 2, 750 - 22 * u, top - bottom);
          this.text(title, 0, top - 35 * u, 30 * u, 310 * u, 46 * u, this.ui, true);
          return {
            top: top,
            bottom: bottom,
            footerY: bottom + 36 * u
          };
        };
        _proto.downPanel = function downPanel(v) {
          var _v$enemies$find2,
            _this27 = this;
          var b = v.battle,
            u = this.unit,
            objectLost = b.objective.hp !== undefined && b.objective.hp <= 0,
            p = this.encounter(objectLost ? '行程止步' : '气息将尽'),
            hit = b.events.slice().reverse().find(function (e) {
              return e.type === 'hit' && e.targetId === 'hero';
            }),
            source = String((hit == null ? void 0 : hit.source) || ''),
            actor = b.enemies.find(function (e) {
              return e.id === source;
            }),
            name = (_v$enemies$find2 = v.enemies.find(function (e) {
              return e.id === ((actor == null ? void 0 : actor.kind) || source);
            })) == null ? void 0 : _v$enemies$find2.name,
            canRevive = !b.reviveUsed && !objectLost;
          var n = this.image(objectLost && b.hero.hp > 0 ? this.art.clips.idle[0].key : this.art.clips.hurt[0].key, 0, p.top - 146 * u, 310 * u, 150 * u);
          if (b.hero.hp <= 0) n.getComponent(Sprite).color = new Color(185, 178, 159);
          this.text(objectLost ? '护送目标已毁' : '这一击，先记在心里', 0, p.top - 279 * u, 26 * u, 310 * u, 42 * u, this.ui, true);
          this.text(objectLost ? '此行未竟，整备后再来。' : name ? name + '的来势' : '完整通过 ' + b.completedWaves + ' 波', 0, p.top - 320 * u, 16 * u, 300 * u, 38 * u);
          this.image('ui/round-slot', -99 * u, p.top - 407 * u, 63 * u, 63 * u);
          this.text('复', -99 * u, p.top - 407 * u, 32 * u, 48 * u, 45 * u, this.ui, true);
          this.text(objectLost ? '无法复起' : '免费复起', 35 * u, p.top - 387 * u, 25 * u, 200 * u, 38 * u, this.ui, true);
          this.text(objectLost ? '目标无法恢复' : b.reviveUsed ? '本局已用' : '本局剩余一次', 35 * u, p.top - 422 * u, 18 * u, 210 * u, 31 * u);
          this.text(canRevive ? '恢复最大气血六成，保留场内危险；先回暂停，明确继续后再交锋。' : objectLost ? '护送目标已毁，本局结束。复起不恢复目标，请结算归营。' : '结算本次已完成的段落，回营再作整备。', 0, p.bottom + 106 * u, 15 * u, 300 * u, 68 * u);
          if (canRevive) {
            this.objectButton('settle', '就此归营', -80 * u, p.footerY, 153 * u, 53 * u, function () {
              return _this27.act({
                type: 'settle'
              });
            }, v.saveStatus === 'saved', 21 * u);
            this.objectButton('revive', '免费复起', 80 * u, p.footerY, 153 * u, 53 * u, function () {
              return _this27.act({
                type: 'revive'
              });
            }, v.saveStatus === 'saved', 21 * u);
          } else this.folioFoot('settle', '结算归营', p.footerY, function () {
            return _this27.act({
              type: 'settle'
            });
          }, v.saveStatus === 'saved');
        };
        _proto.victoryPanel = function victoryPanel(v) {
          var _v$stage14,
            _v$stage15,
            _this28 = this;
          var b = v.battle,
            u = this.unit,
            p = this.encounter('山道已清');
          this.image('ui/round-slot', 0, p.top - 135 * u, 118 * u, 118 * u);
          this.text('胜', 0, p.top - 135 * u, 72 * u, 100 * u, 90 * u, this.ui, true);
          this.text(((_v$stage14 = v.stage) == null ? void 0 : _v$stage14.name) || '', 0, p.top - 239 * u, 30 * u, 310 * u, 42 * u, this.ui, true);
          this.text('强敌已退，山路暂宁。', 0, p.top - 280 * u, 17 * u, 310 * u, 37 * u);
          var sec = Math.floor(b.time),
            clock = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
          this.text('行路 ' + clock + '   斩敌 ' + b.kills, 0, p.top - 326 * u, 16 * u, 310 * u, 36 * u);
          this.text("\u5B8C\u6210 " + b.completedWaves + " / " + (((_v$stage15 = v.stage) == null ? void 0 : _v$stage15.waves.length) || 0) + " \u6CE2", 0, p.top - 371 * u, 18 * u, 310 * u, 36 * u);
          this.text('收取这次战果，再回营整备。', 0, p.bottom + 120 * u, 17 * u, 310 * u, 42 * u);
          this.folioFoot('settle', '领取战果', p.footerY, function () {
            return _this28.act({
              type: 'settle'
            });
          }, v.saveStatus === 'saved');
        };
        _proto.settlement = function settlement(v) {
          var _d$completedWaves2,
            _this29 = this;
          var u = this.unit,
            r = v.receipt,
            d = (r == null ? void 0 : r.details) || {},
            victory = d.outcome === 'victory',
            stage = v.stages.find(function (s) {
              return s.id === d.stageId;
            }),
            p = this.encounter(victory ? '一程告成' : '此行未竟'),
            seal = (this.cssHeight <= 720 ? 104 : 124) * u;
          this.image('ui/round-slot', 0, p.top - 122 * u, seal, seal);
          this.text(victory ? '胜' : '败', 0, p.top - 122 * u, (this.cssHeight <= 720 ? 66 : 76) * u, seal, seal, this.ui, true, victory ? '#f2d895' : '#d39b7c');
          this.text((stage == null ? void 0 : stage.name) || '此次行程', 0, p.top - 215 * u, 30 * u, 310 * u, 42 * u, this.ui, true);
          this.text(victory ? '强敌已退，山路暂宁。' : '此行未竟，江湖尚有再会。', 0, p.top - 252 * u, 17 * u, 310 * u, 37 * u);
          this.text("\u5B8C\u6574\u901A\u8FC7 " + ((_d$completedWaves2 = d.completedWaves) != null ? _d$completedWaves2 : 0) + " / " + ((stage == null ? void 0 : stage.waves.length) || 0) + " \u6CE2", 0, p.top - 291 * u, 15 * u, 310 * u, 30 * u);
          this.text(d.firstClear ? '首次通关所得' : '本次所得', 0, p.top - 337 * u, 27 * u, 310 * u, 40 * u, this.ui, true);
          for (var _iterator6 = _createForOfIteratorHelperLoose([[0, 'objects/PICK-CU01', '铜钱', (r == null ? void 0 : r.coins) || 0], [1, 'objects/RC02-refined-iron', '精铁', (r == null ? void 0 : r.iron) || 0]]), _step6; !(_step6 = _iterator6()).done;) {
            var _step6$value = _step6.value,
              i = _step6$value[0],
              key = _step6$value[1],
              label = _step6$value[2],
              value = _step6$value[3];
            var x = (i - .5) * 147 * u;
            this.image(key, x, p.top - 398 * u, 48 * u, 48 * u);
            this.text(label, x, p.top - 439 * u, 14 * u, 110 * u, 24 * u);
            this.text((value >= 0 ? '+' : '') + value, x, p.top - 468 * u, 23 * u, 140 * u, 35 * u, this.ui, false, '#b2e5c4');
          }
          var gifts = Array.isArray(d.gifts) ? d.gifts : [],
            drops = Array.isArray(d.drops) ? d.drops : [],
            quantity = [].concat(gifts, drops).reduce(function (n, x) {
              return n + Number(x.quantity || 0);
            }, 0),
            converted = [].concat(gifts, drops).reduce(function (n, x) {
              return n + Number(x.converted || 0);
            }, 0);
          this.text(quantity ? "\u672C\u4F53\u788E\u7247 " + quantity + "\u7247" + (converted ? '，其中' + converted + '片转铁' : '') : '此次没有本体碎片', 0, p.top - 501 * u, 15 * u, 310 * u, 30 * u);
          this.objectButton('result-sources', '查看所得来源', 0, p.top - 541 * u, 240 * u, 45 * u, function () {
            return _this29.openInfo('rewards');
          }, true, 18 * u);
          this.objectButton('result-stages', '再择山道', -80 * u, p.footerY, 153 * u, 55 * u, function () {
            return _this29.nav('stages');
          }, true, 21 * u);
          this.objectButton('primary', '归营整备', 80 * u, p.footerY, 153 * u, 55 * u, function () {
            return _this29.nav('camp');
          }, true, 21 * u);
        };
        _proto.confirmPanel = function confirmPanel(v) {
          var _this30 = this;
          var c = this.confirm;
          if (!c) return;
          var u = this.unit,
            g = this.graphic(this.ui),
            rows = c.rows || [],
            h = Math.min(this.height - 36 * u, (c.subject ? rows.some(function (r) {
              return r.label === '能力';
            }) ? 608 : 584 : 340) * u),
            top = h / 2,
            bottom = -h / 2;
          this.rect(g, 0, 0, 750, this.height, '#071b1adb');
          this.buttons = [];
          this.frame('ui/panel-frame', 0, 0, 750 - 22 * u, h);
          this.text(c.title, 0, top - 36 * u, 27 * u, 300 * u, 45 * u, this.ui, true);
          var y = top - 89 * u;
          if (c.subject) {
            this.image(c.subject, 0, y - 68 * u, 290 * u, 136 * u);
            y -= 163 * u;
          }
          for (var _iterator7 = _createForOfIteratorHelperLoose(rows), _step7; !(_step7 = _iterator7()).done;) {
            var row = _step7.value;
            this.text(row.label, 0, y, 14 * u, 310 * u, 24 * u, this.ui, false, C.muted);
            if (row.label === '能力') {
              this.text(row.before, -85 * u, y - 47 * u, 17 * u, 132 * u, 60 * u);
              this.text('→', 0, y - 47 * u, 22 * u, 26 * u, 35 * u);
              this.text(row.after, 85 * u, y - 47 * u, 17 * u, 132 * u, 60 * u);
              y -= 104 * u;
            } else {
              var value = row.before ? row.before + ' → ' + row.after : row.after;
              this.text(value, 0, y - 30 * u, rows.length > 2 ? 19 * u : 21 * u, 310 * u, 37 * u);
              y -= 67 * u;
            }
          }
          if (c.cost) {
            var parts = [c.cost.coins !== undefined ? c.cost.coins + ' 铜钱' : '', c.cost.iron !== undefined ? c.cost.iron + ' 精铁' : '', c.cost.shards !== undefined ? c.cost.shards + ' 片本体碎片' : ''].filter(Boolean);
            this.text(parts.join(' / '), 0, y - 4 * u, 18 * u, 310 * u, 38 * u);
            y -= 49 * u;
          }
          var copyY = rows.length ? Math.max(bottom + 113 * u, y - 25 * u) : y - 48 * u;
          this.text(c.copy, 0, copyY, 16 * u, 306 * u, rows.length ? 68 * u : 130 * u);
          this.objectButton('cancel', '取消', -80 * u, bottom + 38 * u, 153 * u, 53 * u, function () {
            _this30.confirm = null;
            _this30.localDirty = true;
          }, true, 21 * u);
          this.objectButton('confirm', c.label, 80 * u, bottom + 38 * u, 153 * u, 53 * u, function () {
            _this30.confirm = null;
            _this30.localDirty = true;
            _this30.act(c.action);
          }, v.saveStatus === 'saved', 21 * u);
        };
        _proto.actor = function actor(key, frameKey, x, y, height, anchor, face, nativeFacingX) {
          if (face === void 0) {
            face = 0;
          }
          if (nativeFacingX === void 0) {
            nativeFacingX = 1;
          }
          var visual = this.visuals.get(key);
          if (!visual) {
            var node = this.layer(key, this.bodies);
            var sprite = node.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            visual = {
              node: node,
              sprite: sprite,
              frameKey: frameKey
            };
            this.visuals.set(key, visual);
          }
          var sf = this.frames.get(frameKey);
          visual.node.active = !!sf;
          if (!sf) return visual.node;
          visual.frameKey = frameKey;
          visual.sprite.spriteFrame = sf;
          var crop = sf.rect,
            scale = height / crop.height;
          var u = this.transform(visual.node, crop.width * scale, height);
          u.setAnchorPoint(anchor ? anchor[0] : .5, anchor ? anchor[1] : .2);
          visual.node.setPosition(x, -y);
          visual.node.setScale((Math.cos(face) < 0 ? -1 : 1) * nativeFacingX, 1);
          return visual.node;
        };
        _proto.bo01Frame = function bo01Frame(e, b) {
          var _this$art$actorClips2, _this$art$entries$key;
          var binding = (_this$art$actorClips2 = this.art.actorClips) == null ? void 0 : _this$art$actorClips2.BO01;
          if (!binding) return null;
          var sample = this.bo01Clock.sample(e, b.time, b.phase);
          var key = 'actors/BO01-' + sample.clip,
            height = 150,
            anchor = ((_this$art$entries$key = this.art.entries[key]) == null ? void 0 : _this$art$entries$key.anchor) || [.5, .1566864525139665];
          var clip = binding.clips[sample.clip];
          if (clip) {
            var elapsedFrames = Math.floor((Math.max(0, sample.age) + 1e-8) * binding.frameRate),
              index = clip.loop ? elapsedFrames % clip.frames.length : Math.min(clip.frames.length - 1, elapsedFrames);
            var frame = clip.frames[index];
            key = frame.key;
            var sf = this.frames.get(key);
            if (!sf) throw new Error('Missing BO01 cropped frame ' + key);
            var crop = sf.rect;
            if (crop.width !== 270 || crop.height !== 180) throw new Error('Invalid BO01 cropped dimensions ' + key);
            height = crop.height * binding.heightU / binding.referenceHeight;
            anchor = [binding.anchorTopLeftPx[0] / crop.width, 1 - binding.anchorTopLeftPx[1] / crop.height];
          }
          this.bo01Samples.push({
            actorId: e.id,
            modelPose: e.pose,
            clip: sample.clip,
            age: sample.age,
            reason: sample.reason,
            held: sample.held,
            frameKey: key,
            referenceHeight: clip ? binding.referenceHeight : null,
            drawHeightU: height,
            nativeFacingX: binding.nativeFacingX
          });
          return {
            key: key,
            height: height,
            anchor: anchor
          };
        };
        _proto.hero = function hero(a, time, phase) {
          var clipName = a.pose === 'run' ? 'run' : a.pose === 'sweep' ? 'sweep' : a.pose === 'hurt' ? 'hurt' : 'idle',
            clip = this.art.clips[clipName];
          var age = a.poseAge;
          if (a.pose === 'run') age %= .8;
          var frame = clip[clip.length - 1];
          for (var _iterator8 = _createForOfIteratorHelperLoose(clip), _step8; !(_step8 = _iterator8()).done;) {
            var f = _step8.value;
            age -= f.duration;
            if (age < 0) {
              frame = f;
              break;
            }
          }
          var sf = this.frames.get(frame.key);
          var anchor = [frame.anchor[0] / sf.width, 1 - frame.anchor[1] / sf.height];
          var node = this.actor('hero', frame.key, a.x, a.y, sf.height * 96 / frame.referenceHeight, anchor, a.face);
          // Battle time owns feedback lifetime. Running hurt stays in the approved run clip.
          var hitAge = time - a.hitAt,
            feedback = phase === 'playing' && a.hp > 0 && hitAge >= 0 && hitAge < .27,
            strength = feedback ? 1 - hitAge / .27 : 0;
          var color = a.hp <= 0 ? new Color(135, 131, 122) : new Color(255, Math.round(255 - 80 * strength), Math.round(255 - 100 * strength));
          node.getComponent(Sprite).color = color;
          this.heroPresentation = {
            pose: a.pose,
            clip: clipName,
            frameKey: frame.key,
            poseAge: a.poseAge,
            hitAge: hitAge,
            feedback: feedback,
            tint: [color.r, color.g, color.b, color.a],
            phase: phase
          };
        };
        _proto.drawEscort = function drawEscort(v, b) {
          var _v$stage16, _this$escortName$pare;
          this.escortPresentation = null;
          if (this.escortName) this.escortName.active = false;
          var binding = this.escortBinding((_v$stage16 = v.stage) == null ? void 0 : _v$stage16.id),
            o = b.objective;
          if (!binding || o.x === undefined || o.y === undefined || o.hp === undefined || o.maxHp === undefined) return;
          var sf = this.frames.get(binding.key);
          if (!sf) return;
          var crop = sf.rect,
            height = crop.height * binding.heightU / binding.referenceHeight,
            anchor = [binding.anchorPx[0] / crop.width, 1 - binding.anchorPx[1] / crop.height];
          // This is a fixed-view prop at the existing objective point, not an extra actor/collider.
          var node = this.actor('escort-target', binding.key, o.x, o.y, height, anchor);
          if (!this.escortHistory || this.escortHistory.runId !== b.runId) this.escortHistory = {
            runId: b.runId,
            hp: o.hp,
            hitAt: -1
          };
          if (o.hp < this.escortHistory.hp) this.escortHistory.hitAt = b.time;
          this.escortHistory.hp = o.hp;
          var feedback = b.phase === 'playing' && b.time - this.escortHistory.hitAt >= 0 && b.time - this.escortHistory.hitAt < .2;
          node.getComponent(Sprite).color = feedback ? new Color(255, 195, 167) : new Color(255, 255, 255);
          var g = this.objectiveG,
            barY = -o.y + 52,
            ratio = o.maxHp > 0 ? clamp(o.hp / o.maxHp, 0, 1) : 0;
          this.rect(g, o.x, barY, 104, 16, C.ink, 3);
          if (ratio > 0) this.rect(g, o.x - 48 + 48 * ratio, barY, 96 * ratio, 8, ratio <= .25 ? C.red : '#79c4b1');
          g.strokeColor = new Color().fromHEX(C.gold);
          g.lineWidth = 2;
          g.roundRect(o.x - 50, barY - 6, 100, 12, 3);
          g.stroke();
          if (!this.escortName) {
            this.escortName = this.layer('EscortWorldName', this.objectiveG.node);
            this.frame('ui/plaque-wide', 0, 0, 174, 56, this.escortName);
            this.text(binding.name, 0, 0, 32, 146, 50, this.escortName);
          }
          this.escortName.active = true;
          this.escortName.setPosition(o.x, -o.y + 98);
          var nameLabel = this.escortName.getComponentInChildren(Label);
          if (nameLabel.string !== binding.name) nameLabel.string = binding.name;
          var distance = Math.hypot(b.hero.x - o.x, b.hero.y - o.y);
          this.escortPresentation = {
            stageId: v.stage.id,
            name: binding.name,
            key: binding.key,
            point: {
              x: o.x,
              y: o.y
            },
            hp: o.hp,
            maxHp: o.maxHp,
            radius: o.radius,
            drawHeightU: height,
            visibleReferenceHeightU: binding.heightU,
            anchor: {
              x: anchor[0],
              y: anchor[1]
            },
            distance: distance,
            withinEscortRange: distance <= 300,
            hitFeedback: feedback,
            hitAt: this.escortHistory.hitAt,
            informationVisible: this.objectiveG.node.active,
            worldBar: {
              x: o.x,
              y: o.y - 52,
              width: 104,
              height: 16
            },
            worldName: {
              nodeName: this.escortName.name,
              text: nameLabel.string,
              x: this.escortName.position.x,
              y: -this.escortName.position.y,
              panelWidth: 174,
              panelHeight: 56,
              labelWidth: nameLabel.node.getComponent(UITransform).width,
              labelHeight: nameLabel.node.getComponent(UITransform).height,
              fontSize: nameLabel.fontSize,
              layer: (_this$escortName$pare = this.escortName.parent) == null ? void 0 : _this$escortName$pare.name
            },
            fixedView: true
          };
        };
        _proto.drawCompanion = function drawCompanion(v, b) {
          var _this$art$companionVi;
          var snapshot = b.stats.companion,
            binding = (snapshot == null ? void 0 : snapshot.id) === 'CO01' ? (_this$art$companionVi = this.art.companionVisuals) == null ? void 0 : _this$art$companionVi.CO01 : undefined,
            stage = v.stage;
          if (!binding || !stage) {
            this.companionFollow = null;
            this.companionPresentation = {
              visible: false,
              snapshot: snapshot ? {
                id: snapshot.id,
                level: snapshot.level
              } : null,
              reason: snapshot ? 'source-not-approved' : 'no-run-companion'
            };
            return;
          }
          var sf = this.frames.get(binding.key);
          if (!sf) return;
          var crop = sf.rect,
            scale = binding.heightU / binding.referenceHeight,
            origin = binding.displayOriginPx;
          var candidate = function candidate(side) {
            return {
              x: clamp(b.hero.x + side * 100, origin[0] * scale, stage.world.width - (crop.width - origin[0]) * scale),
              y: clamp(b.hero.y - 16, origin[1] * scale, stage.world.height - (crop.height - origin[1]) * scale)
            };
          };
          var initialized = !this.companionFollow || this.companionFollow.runId !== b.runId || b.time < this.companionFollow.time || b.tick < this.companionFollow.tick;
          var elapsed = initialized ? 0 : Math.max(0, b.time - this.companionFollow.time),
            advance = !initialized && b.phase === 'playing' && b.tick > this.companionFollow.tick && elapsed > 0;
          var side = initialized ? -1 : this.companionFollow.side,
            sideUntil = initialized ? b.time : this.companionFollow.sideUntil,
            switched = false;
          var carrier = this.escortBinding(stage.id),
            carrierFrame = carrier ? this.frames.get(carrier.key) : undefined,
            o = b.objective;
          var carrierScale = carrier ? carrier.heightU / carrier.referenceHeight : 0;
          var carrierBox = carrier && carrierFrame && o.x !== undefined && o.y !== undefined ? {
            left: o.x - carrier.anchorPx[0] * carrierScale,
            right: o.x + (carrierFrame.rect.width - carrier.anchorPx[0]) * carrierScale,
            top: o.y - carrier.anchorPx[1] * carrierScale,
            bottom: o.y + (carrierFrame.rect.height - carrier.anchorPx[1]) * carrierScale
          } : null;
          // Display rectangles only. They are never used by combat, navigation or collision.
          var overlaps = function overlaps(p, padding) {
            if (padding === void 0) {
              padding = 0;
            }
            return !!carrierBox && p.x - origin[0] * scale < carrierBox.right + padding && p.x + (crop.width - origin[0]) * scale > carrierBox.left - padding && p.y - origin[1] * scale < carrierBox.bottom + padding && p.y + (crop.height - origin[1]) * scale > carrierBox.top - padding;
          };
          var left = candidate(-1),
            right = candidate(1);
          if (carrierBox && (initialized || advance && b.time >= sideUntil)) {
            var other = side === -1 ? 1 : -1,
              currentBlocked = overlaps(side === -1 ? left : right),
              otherBlocked = overlaps(other === -1 ? left : right);
            var returnLeft = side === 1 && !overlaps(left, 24);
            if (currentBlocked && !otherBlocked || returnLeft) {
              side = other;
              sideUntil = b.time + .65;
              switched = true;
            }
          }
          var target = side === -1 ? left : right;
          if (initialized) this.companionFollow = {
            runId: b.runId,
            x: target.x,
            y: target.y,
            time: b.time,
            tick: b.tick,
            side: side,
            sideUntil: sideUntil
          };
          var c = this.companionFollow;
          if (advance) {
            c.side = side;
            c.sideUntil = sideUntil;
          }
          if (advance) {
            var amount = 1 - Math.exp(-8 * elapsed);
            c.x += (target.x - c.x) * amount;
            c.y += (target.y - c.y) * amount;
          }
          c.time = b.time;
          c.tick = b.tick;
          // One complete fixed-view pair; the origin is a display projection, not contact or an axle.
          var node = this.actor('companion-CO01-pair', binding.key, c.x, c.y, crop.height * scale, [origin[0] / crop.width, 1 - origin[1] / crop.height]);
          node.setRotationFromEuler(0, 0, 0);
          this.companionPresentation = {
            visible: true,
            snapshot: {
              id: snapshot.id,
              level: snapshot.level
            },
            nodeId: 'companion-CO01-pair',
            key: binding.key,
            point: {
              x: c.x,
              y: c.y
            },
            target: target,
            phase: b.phase,
            time: b.time,
            tick: b.tick,
            initialized: initialized,
            advanced: advance,
            simDelta: elapsed,
            fixedView: true,
            runSnapshotOnly: true,
            avoidEscort: {
              boundStage: carrierBox ? stage.id : null,
              side: c.side === -1 ? 'left' : 'right',
              sideUntil: c.sideUntil,
              switched: switched,
              defaultTarget: left,
              oppositeTarget: right,
              selectedTargetOverlaps: overlaps(target),
              currentPairOverlaps: overlaps(c),
              bothCandidatesOverlap: overlaps(left) && overlaps(right),
              displayRectOnly: true
            },
            reason: initialized ? 'new-view-or-run-display-initialize' : advance ? 'battle-clock-follow' : b.phase !== 'playing' ? 'phase-hold' : 'same-tick-hold'
          };
        };
        _proto.drawWorld = function drawWorld(v, dt, resized) {
          var _this$art$solidVisual,
            _this31 = this;
          var b = v.battle,
            stage = v.stage;
          if (!stage) return;
          var W = stage.world.width,
            H = stage.world.height;
          // A world name is navigation information, not part of the carrier artwork.
          // The approved choice/detail/pause layer owns reading priority while simulation is frozen.
          // Final world/guide visibility is applied together by updateEscortGuide after UI rebuilding.
          this.objectiveG.node.active = false;
          var target = this.cameraTarget(v),
            groundKey = this.groundKey(stage),
            newRun = this.worldRun !== b.runId;
          if (newRun) {
            this.worldRun = b.runId;
            this.bo01Clock.clear();
            for (var _i6 = 0, _arr5 = [].concat(this.ground.children); _i6 < _arr5.length; _i6++) {
              var n = _arr5[_i6];
              n.destroy();
            }
            for (var _i7 = 0, _Array$from = Array.from(this.visuals.values()); _i7 < _Array$from.length; _i7++) {
              var o = _Array$from[_i7];
              o.node.destroy();
            }
            this.visuals.clear();
            this.image(groundKey, W / 2, -H / 2, W, H, this.ground, false);
          }
          var viewport = {
              height: this.height,
              unit: this.unit,
              safeTop: this.safeTop,
              safeBottom: this.safeBottom,
              safeLeft: this.safeLeft,
              safeRight: this.safeRight
            },
            viewportChanged = resized || JSON.stringify(this.cameraViewport) !== JSON.stringify(viewport),
            rebaseReason = newRun ? 'run-or-restored-view' : viewportChanged ? 'viewport-resize' : b.tick < this.cameraTick ? 'restored-tick-rollback' : null;
          if (rebaseReason) {
            this.cam = {
              x: target.x,
              y: target.y
            };
            this.cameraRebase = {
              reason: rebaseReason,
              runId: b.runId,
              tick: b.tick,
              viewport: _extends({
                width: 750
              }, viewport),
              target: _extends({}, target)
            };
          }
          this.cameraTick = b.tick;
          this.cameraViewport = viewport;
          // The same static origin covers the normal/choice viewport union; it never follows phase.
          // Actual full-frame dimensions and the approved texel scale remain authoritative.
          var groundNode = this.ground.children[0],
            groundFrame = this.frames.get(groundKey),
            frame = groundFrame.rect,
            layout = this.groundLayout(v, frame),
            scale = layout.scale,
            origin = layout.origin;
          if (groundNode) {
            groundNode.setPosition(origin.x, -origin.y);
            this.transform(groundNode, frame.width * scale, frame.height * scale);
          }
          var t = 1 - Math.exp(-Math.max(0, dt) * 12);
          this.cam.x += (target.x - this.cam.x) * t;
          this.cam.y += (target.y - this.cam.y) * t;
          var interpolated = _extends({}, this.cam);
          if (target.limits) {
            this.cam.x = this.cameraAxis(this.cam.x, target.limits.minX, target.limits.maxX);
            this.cam.y = this.cameraAxis(this.cam.y, target.limits.minY, target.limits.maxY);
          }
          this.world.setPosition(-this.cam.x, this.cam.y);
          var quad = {
              left: origin.x - frame.width * scale / 2,
              right: origin.x + frame.width * scale / 2,
              top: origin.y - frame.height * scale / 2,
              bottom: origin.y + frame.height * scale / 2
            },
            actualViewport = {
              left: this.cam.x - 375,
              right: this.cam.x + 375,
              top: this.cam.y - this.height / 2,
              bottom: this.cam.y + this.height / 2,
              width: 750,
              height: this.height
            },
            margins = {
              left: actualViewport.left - quad.left,
              right: quad.right - actualViewport.right,
              top: actualViewport.top - quad.top,
              bottom: quad.bottom - actualViewport.bottom
            };
          this.groundPresentation = {
            key: groundKey,
            stageId: stage.id,
            map: stage.world.map,
            frame: {
              width: frame.width,
              height: frame.height
            },
            uniformScale: scale,
            previousScale: layout.previousScale,
            overscanScaleRatio: scale / layout.previousScale,
            staticOrigin: origin,
            phaseIndependentOrigin: true,
            requiredViewportUnion: layout.required,
            normalViewportUnion: layout.normal,
            choiceViewportUnion: layout.choice,
            maxHudClearance: layout.maxHudClearance,
            stableHeroEnvelope: layout.stableHeroEnvelope,
            quad: quad,
            viewport: actualViewport,
            coverage: _extends({}, margins, {
              covered: Object.values(margins).every(function (n) {
                return n >= -1e-6;
              })
            }),
            cameraTarget: _extends({}, target),
            safetyProjection: {
              interpolated: interpolated,
              actual: _extends({}, this.cam),
              x: interpolated.x !== this.cam.x,
              y: interpolated.y !== this.cam.y
            },
            rebasedThisRender: !!rebaseReason,
            lastRebase: this.cameraRebase
          };
          for (var _i8 = 0, _Array$from2 = Array.from(this.visuals.values()); _i8 < _Array$from2.length; _i8++) {
            var _o = _Array$from2[_i8];
            _o.node.active = false;
          }
          this.worldG.clear();
          this.fx.clear();
          this.objectiveG.clear();
          var g = this.worldG;
          g.strokeColor = new Color(48, 78, 66, 160);
          g.lineWidth = 4;
          g.rect(0, -H, W, H);
          g.stroke();
          var solid = (_this$art$solidVisual = this.art.solidVisuals) == null ? void 0 : _this$art$solidVisual[stage.id],
            solidFrame = solid ? this.frames.get(solid.key) : undefined;
          for (var i = 0; i < stage.world.obstacles.length; i++) {
            var r = stage.world.obstacles[i];
            var painted = solid && solidFrame && r.width === solid.footprintU[0] && r.height === solid.footprintU[1];
            if (painted) this.actor('solid-' + i, solid.key, r.x + r.width / 2, r.y + r.height, solidFrame.height * solid.unitsPerPixel, [solid.anchorPx[0] / solidFrame.width, 1 - solid.anchorPx[1] / solidFrame.height]);else this.rect(g, r.x + r.width / 2, -r.y - r.height / 2, r.width, r.height, '#485b51');
            if (!painted || this.debugSolids) {
              var outline = painted ? this.fx : g;
              outline.strokeColor = new Color().fromHEX('#b9b18a');
              outline.lineWidth = painted ? 2 : 4;
              outline.rect(r.x, -r.y - r.height, r.width, r.height);
              outline.stroke();
            }
          }
          // Low props share the existing foot sort; health information remains above their pixels.
          var healthG = solidFrame ? this.fx : g;
          for (var _iterator9 = _createForOfIteratorHelperLoose(stage.mechanics), _step9; !(_step9 = _iterator9()).done;) {
            var m = _step9.value;
            if (m.kind === 'beacon') {
              var _this$art$beaconVisua;
              g.strokeColor = new Color(87, 187, 178, 200);
              g.lineWidth = 4;
              g.circle(m.x, -m.y, m.radius);
              g.stroke();
              var lamp = (_this$art$beaconVisua = this.art.beaconVisuals) == null ? void 0 : _this$art$beaconVisua[stage.id],
                sf = lamp ? this.frames.get(lamp.key) : undefined;
              if (lamp && sf) this.actor('beacon-' + m.id, lamp.key, m.x, m.y, sf.height * lamp.heightU / lamp.referenceHeight, [lamp.anchorPx[0] / sf.width, 1 - lamp.anchorPx[1] / sf.height]);
            }
          }
          this.drawEscort(v, b);
          g.fillColor = new Color(24, 37, 25, 65);
          g.ellipse(b.hero.x, -b.hero.y + 2, 23, 9);
          g.fill();
          this.hero(b.hero, b.time, b.phase);
          this.drawCompanion(v, b);
          this.bo01Samples = [];
          this.bo01Clock.prune(b.enemies.filter(function (e) {
            return e.kind === 'BO01';
          }).map(function (e) {
            return e.id;
          }));
          var _loop = function _loop() {
            var e = _step10.value;
            g.fillColor = new Color(24, 37, 25, 55);
            g.ellipse(e.x, -e.y + 2, e.radius * 1.1, e.radius * .45);
            g.fill();
            var spec = v.enemies.find(function (s) {
                return s.id === e.kind;
              }),
              base = (spec == null ? void 0 : spec.art) || e.kind;
            var moving = e.pose === 'move',
              pose = e.pose === 'windup' ? 'anticipation' : e.pose === 'attack' ? 'execute' : moving ? 'move-0' + (Math.floor(e.poseAge / .14) % 3 + 1) : 'ready';
            var key = 'actors/' + base + '-' + pose;
            if (!_this31.frames.has(key)) key = ['actors/' + base + '-ready', 'actors/' + base + '-idle', 'actors/' + base + '-move-01'].find(function (k) {
              return _this31.frames.has(k);
            }) || '';
            var art = _this31.art.entries[key];
            var h = e.kind.startsWith('BO') ? 150 : e.kind.startsWith('EL') ? 118 : Math.max(56, e.radius * 3.8);
            var selected = e.kind === 'BO01' ? _this31.bo01Frame(e, b) : null;
            var node = _this31.actor(e.id, (selected == null ? void 0 : selected.key) || key, e.x, e.y, (selected == null ? void 0 : selected.height) || h, (selected == null ? void 0 : selected.anchor) || (art == null ? void 0 : art.anchor), e.face, e.kind === 'BO01' ? -1 : 1);
            node.getComponent(Sprite).color = new Color().fromHEX(e.pose === 'frozen' ? '#a9e7f3' : b.time - e.hitAt < .1 ? '#ffd3a9' : '#ffffff');
            if (e.guarding) {
              _this31.fx.strokeColor = new Color(224, 185, 101, 220);
              _this31.fx.lineWidth = 5;
              _this31.fx.arc(e.x, -e.y, e.radius + 10, -e.face - Math.PI / 3, -e.face + Math.PI / 3, false);
              _this31.fx.stroke();
            }
            if (e.hp < e.maxHp) {
              _this31.rect(healthG, e.x, -e.y + h + 10, 60, 7, '#263b35');
              _this31.rect(healthG, e.x - 30 + 30 * e.hp / e.maxHp, -e.y + h + 10, 60 * e.hp / e.maxHp, 7, C.red);
            }
            if (e.pose === 'spawn') {
              g.strokeColor = new Color(180, 64, 45, 200);
              g.lineWidth = 3;
              g.ellipse(e.x, -e.y, e.radius * 1.5, e.radius * .7);
              g.stroke();
            }
          };
          for (var _iterator10 = _createForOfIteratorHelperLoose(b.enemies), _step10; !(_step10 = _iterator10()).done;) {
            _loop();
          }
          for (var _iterator11 = _createForOfIteratorHelperLoose(b.pickups), _step11; !(_step11 = _iterator11()).done;) {
            var _p = _step11.value;
            this.actor(_p.id, 'objects/PICK-XP01', _p.x, _p.y, 31, [.5, .3]);
          }
          for (var _iterator12 = _createForOfIteratorHelperLoose(b.projectiles), _step12; !(_step12 = _iterator12()).done;) {
            var _p2 = _step12.value;
            var binding = this.enemyProjectileVisual(_p2);
            if (binding) {
              var _sf2 = this.frames.get(binding.key);
              var _n = this.actor(_p2.id, binding.key, _p2.x, _p2.y, _sf2.rect.height * binding.unitsPerPixel, binding.anchor);
              _n.setRotationFromEuler(0, 0, -_p2.angle * 180 / Math.PI + binding.angleOffsetDegrees);
              continue;
            }
            var visual = this.skillWorld(_p2.kind, b.time),
              key = (visual == null ? void 0 : visual.key) || '';
            if (key && visual) {
              var _this$art$entries$key2;
              var _n2 = this.actor(_p2.id, key, _p2.x, _p2.y, visual.height, (_this$art$entries$key2 = this.art.entries[key]) == null ? void 0 : _this$art$entries$key2.anchor);
              _n2.setRotationFromEuler(0, 0, -_p2.angle * 180 / Math.PI);
            } else {
              this.fx.fillColor = new Color().fromHEX(_p2.team === 'enemy' ? '#d2653c' : '#ccebd8');
              this.fx.circle(_p2.x, -_p2.y, Math.max(4, _p2.radius));
              this.fx.fill();
            }
          }
          for (var _iterator13 = _createForOfIteratorHelperLoose(b.effects), _step13; !(_step13 = _iterator13()).done;) {
            var _e2 = _step13.value;
            this.effect(_e2);
          }
          var a = b.hero;
          if (a.pose === 'sweep' && a.poseAge >= .4 && a.poseAge <= .567) {
            var p = clamp((a.poseAge - .4) / .167, 0, 1),
              right = Math.cos(a.face) >= 0,
              angle = right ? (-70 + 140 * p) * Math.PI / 180 : (250 - 140 * p) * Math.PI / 180;
            this.fx.strokeColor = new Color(236, 226, 166, 190);
            this.fx.lineWidth = 4;
            this.fx.arc(a.x, -a.y, 155, -angle - .06, -angle + .06, false);
            this.fx.stroke();
          }
          for (var _i9 = 0, _Array$from3 = Array.from(this.visuals.entries()); _i9 < _Array$from3.length; _i9++) {
            var _Array$from3$_i = _Array$from3[_i9],
              id = _Array$from3$_i[0],
              _o2 = _Array$from3$_i[1];
            if (!_o2.node.active) {
              _o2.node.destroy();
              this.visuals["delete"](id);
            }
          }
          this.bodies.children.slice().sort(function (a, b) {
            return b.position.y - a.position.y || a.name.localeCompare(b.name);
          }).forEach(function (n, i) {
            return n.setSiblingIndex(i);
          });
        };
        _proto.effect = function effect(e) {
          var g = this.fx,
            warning = e.kind.startsWith('warning') || e.kind.startsWith('hazard'),
            active = e.kind.startsWith('hazard') && e.age >= Number(e.warning || 0);
          g.strokeColor = new Color().fromHEX(warning ? active ? '#ff774c' : '#b5452c' : '#92d1bc');
          g.fillColor = new Color().fromHEX(warning ? active ? '#c644285c' : '#b54d2824' : '#86cdb52a');
          g.lineWidth = warning ? 4 : 3;
          var shape = String(e.shape || 'circle'),
            angle = Number(e.angle || 0),
            length = Number(e.length || e.radius),
            width = Number(e.width || 20);
          if (e.kind === 'SK10') {
            g.moveTo(e.x, -e.y);
            g.lineTo(e.x + Math.cos(angle) * e.radius, -e.y - Math.sin(angle) * e.radius);
            g.stroke();
            return;
          }
          if (shape === 'rect') {
            g.rect(e.x - width / 2, -e.y - Number(e.height || 40) / 2, width, Number(e.height || 40));
            g.fill();
            g.stroke();
            return;
          }
          if (shape === 'line') {
            var dx = Math.cos(angle) * length,
              dy = -Math.sin(angle) * length,
              px = Math.sin(angle) * width / 2,
              py = Math.cos(angle) * width / 2;
            g.moveTo(e.x + px, -e.y + py);
            g.lineTo(e.x + dx + px, -e.y + dy + py);
            g.lineTo(e.x + dx - px, -e.y + dy - py);
            g.lineTo(e.x - px, -e.y - py);
            g.close();
            g.fill();
            g.stroke();
            return;
          }
          if (shape === 'fan') {
            var arc = Number(e.arcRad || 1.32);
            g.moveTo(e.x, -e.y);
            for (var i = 0; i <= 24; i++) {
              var _a = angle - arc / 2 + i * arc / 24;
              g.lineTo(e.x + Math.cos(_a) * length, -e.y - Math.sin(_a) * length);
            }
            g.close();
            g.fill();
            g.stroke();
            return;
          }
          if (shape === 'rays' || shape === 'radial') {
            var count = Number(e.count || 8);
            for (var _i10 = 0; _i10 < count; _i10++) {
              var _a2 = angle + _i10 * Math.PI * 2 / count;
              g.moveTo(e.x, -e.y);
              g.lineTo(e.x + Math.cos(_a2) * length, -e.y - Math.sin(_a2) * length);
            }
            g.stroke();
            return;
          }
          if (e.orbit) {
            var variant = Number(e.id.split('-').pop()) || 0,
              _visual = this.skillWorld(e.kind, e.age, variant);
            if (_visual) {
              var _this$art$entries$_vi;
              var n = this.actor(e.id, _visual.key, e.x, e.y, _visual.height, (_this$art$entries$_vi = this.art.entries[_visual.key]) == null ? void 0 : _this$art$entries$_vi.anchor);
              n.setRotationFromEuler(0, 0, -(angle + (variant % 2 ? -Math.PI / 2 : Math.PI / 2)) * 180 / Math.PI);
            } else {
              g.circle(e.x, -e.y, e.radius);
              g.fill();
            }
            return;
          }
          g.circle(e.x, -e.y, e.radius);
          g.fill();
          g.stroke();
          var visual = this.skillWorld(e.kind, e.age - Number(e.warning || 0));
          if (visual && e.age >= Number(e.warning || 0)) {
            var _this$art$entries$vis;
            var _n3 = this.actor(e.id, visual.key, e.x, e.y, visual.height, (_this$art$entries$vis = this.art.entries[visual.key]) == null ? void 0 : _this$art$entries$vis.anchor);
            _n3.setRotationFromEuler(0, 0, 0);
          }
        };
        _proto.processAudio = function processAudio(v) {
          var b = v.battle;
          if (this.audioRun !== b.runId) {
            this.audioRun = b.runId;
            this.seq = 0;
            this.lastFoot = 0;
          }
          for (var _iterator14 = _createForOfIteratorHelperLoose(b.events), _step14; !(_step14 = _iterator14()).done;) {
            var _e3 = _step14.value;
            if (_e3.seq <= this.seq) continue;
            this.seq = _e3.seq;
            var key = _e3.type === 'sweep' ? 'knife-cast' : _e3.type === 'hit' ? _e3.targetId === 'hero' ? 'hero-hurt' : 'hit' : _e3.type === 'pickup' ? 'xp-pickup' : _e3.type === 'levelup' ? 'level-up' : _e3.type === 'enemyattack' ? 'thorn-cast' : _e3.type === 'defeat' ? 'segment-fail' : _e3.type === 'choice' ? 'cloth-menu' : '';
            if (key) this.play(key, v);
          }
          if (b.phase === 'paused') {
            this.stopAudio();
            return;
          }
          if (b.phase !== 'playing') return;
          if (b.hero.pose === 'run' && b.time - this.lastFoot > .28) {
            this.lastFoot = b.time;
            this.play('footstep', v);
          }
        };
        _proto.play = function play(key, v) {
          var _v, _v$battle2, _this$art$audio$key;
          if (v === void 0) {
            v = this.current;
          }
          if (!this.visible || this.loading.state.active || this.actionPending || !((_v = v) != null && _v.soundEnabled) || !this.audioUnlocked || !this.clips[key] || ((_v$battle2 = v.battle) == null ? void 0 : _v$battle2.phase) === 'paused') return;
          var source = this.channels[this.audioIndex++ % this.channels.length];
          if (!source) return;
          source.stop();
          source.clip = this.clips[key];
          source.volume = (((_this$art$audio$key = this.art.audio[key]) == null ? void 0 : _this$art$audio$key.gain) || .5) * .42;
          source.play();
        };
        _proto.stopAudio = function stopAudio() {
          this.channels.forEach(function (s) {
            return s.stop();
          });
        };
        _proto.point = function point(e) {
          var p = e.getUILocation();
          var local = this.host.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
          return {
            x: local.x,
            y: local.y
          };
        };
        _proto.canMove = function canMove() {
          var _this$current5, _this$current$battle2;
          return this.isInteractive() && ((_this$current5 = this.current) == null ? void 0 : _this$current5.screen) === 'battle' && ((_this$current$battle2 = this.current.battle) == null ? void 0 : _this$current$battle2.phase) === 'playing' && this.current.saveStatus !== 'error' && this.current.saveStatus !== 'conflict' && !this.confirm && !this.detail && !this.info;
        };
        _proto.zeroInput = function zeroInput(hard) {
          var _this$onAction;
          for (var _i11 = 0, _Array$from4 = Array.from(this.keys); _i11 < _Array$from4.length; _i11++) {
            var key = _Array$from4[_i11];
            this.blockedMovementKeys.add(key);
          }
          if (hard) {
            this.pointers.clear();
            this.controlKeys.clear();
            this.blocked = false;
          }
          this.pointer = null;
          this.downHit = null;
          this.keys.clear();
          (_this$onAction = this.onAction) == null || _this$onAction.call(this, {
            type: 'move',
            x: 0,
            y: 0
          });
        };
        _proto.bind = function bind() {
          var _this32 = this;
          var down = function down(e) {
            var _e$getID;
            if (!_this32.isInteractive()) return;
            _this32.audioUnlocked = true;
            _this32.keyboardFocus = false;
            var id = (_e$getID = e.getID()) != null ? _e$getID : -1;
            if (id >= 0) _this32.mouseSuppressedUntil = Date.now() + 700;
            _this32.pointers.add(id);
            if (_this32.pointers.size > 1) {
              _this32.blocked = true;
              _this32.zeroInput(false);
              return;
            }
            if (_this32.blocked) return;
            _this32.pointer = id;
            _this32.origin = _this32.point(e);
            _this32.dragged = false;
            _this32.downHit = _this32.buttons.slice().reverse().find(function (b) {
              return _this32.origin.x >= b.x && _this32.origin.x <= b.x + b.width && _this32.origin.y >= b.y && _this32.origin.y <= b.y + b.height;
            }) || null;
            if (!_this32.downHit && _this32.canMove()) _this32.onAction({
              type: 'move',
              x: 0,
              y: 0
            });
          };
          var move = function move(e) {
            var _e$getID2;
            if (!_this32.isInteractive() || _this32.blocked || _this32.pointer !== ((_e$getID2 = e.getID()) != null ? _e$getID2 : -1)) return;
            var p = _this32.point(e),
              dx = p.x - _this32.origin.x,
              dy = p.y - _this32.origin.y;
            if (Math.hypot(dx, dy) > 14) _this32.dragged = true;
            if (!_this32.downHit && _this32.canMove()) {
              var norm = Math.max(72, Math.hypot(dx, dy));
              _this32.onAction({
                type: 'move',
                x: dx / norm,
                y: -dy / norm
              });
            }
          };
          var up = function up(e) {
            var _e$getID3;
            var id = (_e$getID3 = e.getID()) != null ? _e$getID3 : -1,
              hit = _this32.downHit,
              p = _this32.point(e),
              execute = _this32.isInteractive() && !_this32.blocked && _this32.pointer === id && !_this32.dragged && (hit == null ? void 0 : hit.enabled) && p.x >= hit.x && p.x <= hit.x + hit.width && p.y >= hit.y && p.y <= hit.y + hit.height;
            _this32.pointers["delete"](id);
            if (_this32.pointer === id) {
              _this32.pointer = null;
              _this32.downHit = null;
              _this32.onAction({
                type: 'move',
                x: 0,
                y: 0
              });
            }
            if (!_this32.pointers.size) _this32.blocked = false;
            if (execute) {
              _this32.play('cloth-menu');
              _this32.runHit(hit);
            }
          };
          var cancel = function cancel(e) {
            var _e$getID4;
            _this32.pointers["delete"]((_e$getID4 = e.getID()) != null ? _e$getID4 : -1);
            _this32.zeroInput(false);
            if (!_this32.pointers.size) _this32.blocked = false;
          };
          var keys = function keys() {
            if (!_this32.canMove()) return;
            _this32.onAction({
              type: 'move',
              x: (_this32.keys.has(KeyCode.KEY_D) || _this32.keys.has(KeyCode.ARROW_RIGHT) ? 1 : 0) - (_this32.keys.has(KeyCode.KEY_A) || _this32.keys.has(KeyCode.ARROW_LEFT) ? 1 : 0),
              y: (_this32.keys.has(KeyCode.KEY_S) || _this32.keys.has(KeyCode.ARROW_DOWN) ? 1 : 0) - (_this32.keys.has(KeyCode.KEY_W) || _this32.keys.has(KeyCode.ARROW_UP) ? 1 : 0)
            });
          };
          var kd = function kd(e) {
            var actionKey = [KeyCode.KEY_P, KeyCode.ESCAPE, KeyCode.ENTER, KeyCode.SPACE, KeyCode.TAB].includes(e.keyCode);
            if (actionKey) {
              if (_this32.heldActionKeys.has(e.keyCode)) return;
              _this32.heldActionKeys.add(e.keyCode);
            }
            if (_this32.loading.state.active) {
              if (actionKey) _this32.loading.handleKey(e.keyCode);else _this32.blockedMovementKeys.add(e.keyCode);
              return;
            }
            if (!_this32.isInteractive()) {
              if (!actionKey) _this32.blockedMovementKeys.add(e.keyCode);
              return;
            }
            if (_this32.blockedMovementKeys.has(e.keyCode)) return;
            _this32.audioUnlocked = true;
            if (e.keyCode === KeyCode.KEY_P || e.keyCode === KeyCode.ESCAPE) {
              var _this32$current, _this32$current2, _this32$current3;
              if (_this32.controlKeys.has(e.keyCode)) return;
              _this32.controlKeys.add(e.keyCode);
              if (((_this32$current = _this32.current) == null ? void 0 : _this32$current.saveStatus) === 'error' || ((_this32$current2 = _this32.current) == null ? void 0 : _this32$current2.saveStatus) === 'conflict') return;
              if (_this32.info) {
                _this32.info = null;
                _this32.localDirty = true;
                return;
              }
              if (_this32.confirm) {
                _this32.confirm = null;
                _this32.localDirty = true;
                return;
              }
              if (_this32.detail) {
                _this32.detail = null;
                _this32.detailSkill = null;
                _this32.localDirty = true;
                return;
              }
              if (((_this32$current3 = _this32.current) == null ? void 0 : _this32$current3.screen) === 'battle') {
                var _this32$current$battl;
                _this32.act({
                  type: ((_this32$current$battl = _this32.current.battle) == null ? void 0 : _this32$current$battl.phase) === 'paused' ? 'resume' : 'pause'
                });
              }
              return;
            }
            if (e.keyCode === KeyCode.TAB) {
              _this32.keyboardFocus = true;
              var enabled = _this32.buttons.filter(function (b) {
                return b.enabled;
              });
              _this32.focus = (_this32.focus + 1) % Math.max(1, enabled.length);
              _this32.localDirty = true;
              return;
            }
            if (e.keyCode === KeyCode.ENTER || e.keyCode === KeyCode.SPACE) {
              var focused = _this32.buttons.filter(function (b) {
                return b.enabled;
              })[_this32.focus];
              if (focused) _this32.runHit(focused);
              return;
            }
            _this32.keys.add(e.keyCode);
            keys();
          };
          var ku = function ku(e) {
            _this32.heldActionKeys["delete"](e.keyCode);
            _this32.blockedMovementKeys["delete"](e.keyCode);
            _this32.controlKeys["delete"](e.keyCode);
            _this32.keys["delete"](e.keyCode);
            keys();
          };
          var blur = function blur() {
            _this32.setVisible(false);
          };
          var hide = function hide() {
            return blur();
          };
          var mouse = function mouse(e) {
            return {
              getID: function getID() {
                return -100;
              },
              getUILocation: function getUILocation() {
                return e.getUILocation();
              }
            };
          };
          var md = function md(e) {
              if (e.getButton() === 0 && Date.now() >= _this32.mouseSuppressedUntil) down(mouse(e));
            },
            mm = function mm(e) {
              if (Date.now() >= _this32.mouseSuppressedUntil) move(mouse(e));
            },
            mu = function mu(e) {
              if (e.getButton() === 0 && Date.now() >= _this32.mouseSuppressedUntil) up(mouse(e));
            };
          this.handlers = {
            down: down,
            move: move,
            up: up,
            cancel: cancel,
            kd: kd,
            ku: ku,
            md: md,
            mm: mm,
            mu: mu,
            blur: blur,
            hide: hide
          };
          input.on(Input.EventType.TOUCH_START, down);
          input.on(Input.EventType.TOUCH_MOVE, move);
          input.on(Input.EventType.TOUCH_END, up);
          input.on(Input.EventType.TOUCH_CANCEL, cancel);
          input.on(Input.EventType.MOUSE_DOWN, md);
          input.on(Input.EventType.MOUSE_MOVE, mm);
          input.on(Input.EventType.MOUSE_UP, mu);
          input.on(Input.EventType.KEY_DOWN, kd);
          input.on(Input.EventType.KEY_UP, ku);
          if (typeof window !== 'undefined') window.addEventListener('blur', blur);
          game.on(Game.EVENT_HIDE, hide);
        }
        /** Read-only diagnostics: no callbacks, setters or writable model references. */;
        _proto.inspect = function inspect() {
          var _this$current6,
            _this$current7,
            _this$confirm,
            _this$current8,
            _this33 = this;
          return {
            loading: this.inspectLoading(),
            stageLayout: this.stageLayout ? JSON.parse(JSON.stringify(this.stageLayout)) : null,
            screen: (_this$current6 = this.current) == null ? void 0 : _this$current6.screen,
            phase: (_this$current7 = this.current) == null || (_this$current7 = _this$current7.battle) == null ? void 0 : _this$current7.phase,
            design: {
              width: 750,
              height: this.height,
              cssWidth: 750 / this.unit,
              cssHeight: this.cssHeight,
              unitsPerCSSPixel: this.unit,
              safeTop: this.safeTop,
              safeBottom: this.safeBottom,
              safeLeft: this.safeLeft,
              safeRight: this.safeRight,
              reference: 'final-design-reference.20261106-review.2'
            },
            localOverlay: {
              info: this.info,
              page: this.infoPage,
              tab: this.infoTab,
              detailSkill: this.detailSkill,
              preparingStage: this.preparingStage,
              selectedStage: this.selectedStage,
              stagePage: this.stagePage,
              selectedTraining: this.selectedTraining,
              selectedItem: this.selectedItem
            },
            hud: this.hudState ? JSON.parse(JSON.stringify(this.hudState)) : null,
            selectedCard: this.selectedCard,
            selectedOffer: this.selectedOffer,
            confirmation: ((_this$confirm = this.confirm) == null ? void 0 : _this$confirm.title) || null,
            input: {
              pointers: Array.from(this.pointers),
              blocked: this.blocked,
              keys: Array.from(this.keys)
            },
            audio: {
              ready: this.audioReady,
              unlocked: this.audioUnlocked,
              available: Object.keys(this.clips),
              failed: Array.from(this.audioFailed)
            },
            camera: {
              x: this.cam.x,
              y: this.cam.y
            },
            ground: this.groundPresentation ? JSON.parse(JSON.stringify(this.groundPresentation)) : null,
            companion: this.companionPresentation ? JSON.parse(JSON.stringify(this.companionPresentation)) : null,
            escort: {
              target: this.escortPresentation ? JSON.parse(JSON.stringify(this.escortPresentation)) : null,
              guide: this.escortGuideState ? JSON.parse(JSON.stringify(this.escortGuideState)) : null
            },
            heroPresentation: this.heroPresentation ? JSON.parse(JSON.stringify(this.heroPresentation)) : null,
            enemyProjectileSprites: this.inspectEnemyProjectileSprites(),
            worldSprites: Array.from(this.visuals.entries()).filter(function (_ref11) {
              var o = _ref11[1];
              return o.node.active;
            }).map(function (_ref12) {
              var _o$node$getComponent, _o$node$getComponent2, _o$node$getComponent3, _o$node$getComponent4;
              var id = _ref12[0],
                o = _ref12[1];
              return {
                id: id,
                frameKey: o.frameKey,
                x: o.node.position.x,
                y: -o.node.position.y,
                width: (_o$node$getComponent = o.node.getComponent(UITransform)) == null ? void 0 : _o$node$getComponent.width,
                height: (_o$node$getComponent2 = o.node.getComponent(UITransform)) == null ? void 0 : _o$node$getComponent2.height,
                scale: {
                  x: o.node.scale.x,
                  y: o.node.scale.y
                },
                anchor: {
                  x: (_o$node$getComponent3 = o.node.getComponent(UITransform)) == null ? void 0 : _o$node$getComponent3.anchorPoint.x,
                  y: (_o$node$getComponent4 = o.node.getComponent(UITransform)) == null ? void 0 : _o$node$getComponent4.anchorPoint.y
                },
                siblingIndex: o.node.getSiblingIndex()
              };
            }),
            bo01: ((_this$current8 = this.current) == null ? void 0 : _this$current8.screen) === 'battle' ? this.bo01Samples.map(function (s) {
              return _extends({}, s);
            }) : [],
            labels: this.ui.getComponentsInChildren(Label).map(function (l) {
              var _l$font, _l$node$getComponent, _l$node$getComponent2;
              return {
                string: l.string,
                fontSize: l.fontSize,
                lineHeight: l.lineHeight,
                overflow: l.overflow,
                fontName: (_l$font = l.font) == null ? void 0 : _l$font.name,
                width: (_l$node$getComponent = l.node.getComponent(UITransform)) == null ? void 0 : _l$node$getComponent.width,
                height: (_l$node$getComponent2 = l.node.getComponent(UITransform)) == null ? void 0 : _l$node$getComponent2.height,
                requested: _this33.labelTargets.get(l.node),
                x: l.node.position.x,
                y: l.node.position.y
              };
            }),
            buttons: this.loading.state.active ? this.loading.inspect().buttons || [] : this.buttons.map(function (_ref13) {
              var id = _ref13.id,
                label = _ref13.label,
                action = _ref13.action,
                x = _ref13.x,
                y = _ref13.y,
                width = _ref13.width,
                height = _ref13.height,
                enabled = _ref13.enabled;
              return {
                id: id,
                label: label,
                action: action,
                enabled: enabled && _this33.isInteractive(),
                rect: {
                  x: x + 375,
                  y: _this33.height / 2 - y - height,
                  width: width,
                  height: height
                }
              };
            })
          };
        };
        _proto.destroy = function destroy() {
          var _this$root;
          this.dead = true;
          this.epoch++;
          this.intentSerial++;
          this.pendingIntent = null;
          if (this.revealCallback) director.off(Director.EVENT_AFTER_DRAW, this.revealCallback);
          this.revealCallback = null;
          this.zeroInput(true);
          this.stopAudio();
          var h = this.handlers;
          if (h) {
            input.off(Input.EventType.TOUCH_START, h.down);
            input.off(Input.EventType.TOUCH_MOVE, h.move);
            input.off(Input.EventType.TOUCH_END, h.up);
            input.off(Input.EventType.TOUCH_CANCEL, h.cancel);
            input.off(Input.EventType.MOUSE_DOWN, h.md);
            input.off(Input.EventType.MOUSE_MOVE, h.mm);
            input.off(Input.EventType.MOUSE_UP, h.mu);
            input.off(Input.EventType.KEY_DOWN, h.kd);
            input.off(Input.EventType.KEY_UP, h.ku);
            if (typeof window !== 'undefined') window.removeEventListener('blur', h.blur);
            game.off(Game.EVENT_HIDE, h.hide);
          }
          this.handlers = null;
          (_this$root = this.root) == null || _this$root.destroy();
          this.frames.clear();
          this.visuals.clear();
          this.bo01Clock.clear();
        };
        return GameView;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './skills.ts', './enemies.ts', './stages.ts', './economy.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('SKILLS', module.SKILLS);
    }, function (module) {
      exports('ENEMIES', module.ENEMIES);
    }, function (module) {
      exports('STAGES', module.STAGES);
    }, function (module) {
      var _setter = {};
      _setter.COMPANION_IDS = module.COMPANION_IDS;
      _setter.ECONOMY_RULES = module.ECONOMY_RULES;
      _setter.EQUIPMENT_IDS = module.EQUIPMENT_IDS;
      _setter.INITIAL_SKILL_IDS = module.INITIAL_SKILL_IDS;
      _setter.ITEMS = module.ITEMS;
      _setter.ITEM_UPGRADE_COSTS = module.ITEM_UPGRADE_COSTS;
      _setter.TRAINING_COSTS = module.TRAINING_COSTS;
      exports(_setter);
    }],
    execute: function () {
      cclegacy._RF.push({}, "30f64pWNeBGMZM8ct2GWlPG", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Inkblade30.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameView.ts', './PresentationLoading.ts', './session.ts', './storage.ts', './index.ts', './contract.ts', './stages.ts', './skills.ts', './enemies.ts'], function (exports) {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, _extends, cclegacy, _decorator, game, Game, view, ResolutionPolicy, UITransform, sys, director, Component, profiler, Node, GameView, PresentationLoading, GameSession, platformStorage, freshAccountSeed, GAME_VERSION, STAGES, SKILLS, ENEMIES;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      game = module.game;
      Game = module.Game;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      UITransform = module.UITransform;
      sys = module.sys;
      director = module.director;
      Component = module.Component;
      profiler = module.profiler;
      Node = module.Node;
    }, function (module) {
      GameView = module.GameView;
    }, function (module) {
      PresentationLoading = module.PresentationLoading;
    }, function (module) {
      GameSession = module.GameSession;
    }, function (module) {
      platformStorage = module.platformStorage;
      freshAccountSeed = module.freshAccountSeed;
    }, null, function (module) {
      GAME_VERSION = module.GAME_VERSION;
    }, function (module) {
      STAGES = module.STAGES;
    }, function (module) {
      SKILLS = module.SKILLS;
    }, function (module) {
      ENEMIES = module.ENEMIES;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "18322UDb/lHn5PwmffmSJEa", "Inkblade30", undefined);
      var ccclass = _decorator.ccclass;
      var Inkblade30 = exports('Inkblade30', (_dec = ccclass('Inkblade30'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Inkblade30, _Component);
        function Inkblade30() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.session = null;
          _this.presentation = null;
          _this.loading = null;
          _this.host = null;
          _this.initialized = false;
          _this.dead = false;
          _this.generation = 0;
          _this.visible = true;
          _this.reloading = false;
          _this.actionPending = false;
          _this.diagnostics = null;
          _this.resize = function () {
            var _this$node$getCompone, _this$host, _this$loading;
            view.setDesignResolutionSize(750, 1334, ResolutionPolicy.FIXED_WIDTH);
            var size = view.getVisibleSize();
            (_this$node$getCompone = _this.node.getComponent(UITransform)) == null || _this$node$getCompone.setContentSize(750, size.height);
            (_this$host = _this.host) == null || (_this$host = _this$host.getComponent(UITransform)) == null || _this$host.setContentSize(750, size.height);
            var css = view.getFrameSize();
            (_this$loading = _this.loading) == null || _this$loading.resize(size.height, css.width > 0 ? 750 / css.width : 2);
          };
          _this.hide = function () {
            var _this$presentation, _this$loading2, _this$session;
            if (_this.dead) return;
            _this.visible = false;
            (_this$presentation = _this.presentation) == null || _this$presentation.setVisible(false);
            (_this$loading2 = _this.loading) == null || _this$loading2.setVisible(false);
            void ((_this$session = _this.session) == null ? void 0 : _this$session.hide());
          };
          _this.show = function () {
            var _this$presentation2, _this$loading3;
            if (_this.dead) return;
            _this.visible = typeof document === 'undefined' || !document.hidden;
            (_this$presentation2 = _this.presentation) == null || _this$presentation2.setVisible(_this.visible);
            (_this$loading3 = _this.loading) == null || _this$loading3.setVisible(_this.visible);
          };
          _this.visibility = function () {
            if (typeof document !== 'undefined' && document.hidden) _this.hide();else _this.show();
          };
          _this.context = function () {
            var _this$session2, _this$session3, _this$session4, _this$session5, _this$session6;
            return JSON.stringify([_this.generation, (_this$session2 = _this.session) == null ? void 0 : _this$session2.store.document.revision, (_this$session3 = _this.session) == null ? void 0 : _this$session3.view.screen, (_this$session4 = _this.session) == null || (_this$session4 = _this$session4.view.battle) == null ? void 0 : _this$session4.runId, (_this$session5 = _this.session) == null || (_this$session5 = _this$session5.view.battle) == null || (_this$session5 = _this$session5.offer) == null ? void 0 : _this$session5.id, (_this$session6 = _this.session) == null ? void 0 : _this$session6.view.saveStatus]);
          };
          _this.reload = function () {
            var _this$presentation3, _window$location;
            if (_this.dead || _this.reloading) return;
            _this.reloading = true;
            (_this$presentation3 = _this.presentation) == null || _this$presentation3.cancelPendingIntent();
            if (sys.isBrowser && typeof window !== 'undefined' && typeof ((_window$location = window.location) == null ? void 0 : _window$location.reload) === 'function') {
              window.location.reload();
              return;
            }
            var scene = director.getScene();
            if (!scene) {
              var _this$loading4;
              _this.reloading = false;
              (_this$loading4 = _this.loading) == null || _this$loading4.fail('reload', new Error('No active scene'));
              return;
            }
            var accepted = director.loadScene(scene.name, function (error) {
              if (error && !_this.dead) {
                var _this$loading5;
                _this.reloading = false;
                (_this$loading5 = _this.loading) == null || _this$loading5.fail('reload', error);
              }
            });
            if (!accepted) {
              var _this$loading6;
              _this.reloading = false;
              (_this$loading6 = _this.loading) == null || _this$loading6.fail('reload', new Error('Scene reload not accepted'));
            }
          };
          return _this;
        }
        var _proto = Inkblade30.prototype;
        _proto.dispatch = /*#__PURE__*/function () {
          var _dispatch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(action) {
            var session, presentation, generation;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  session = this.session, presentation = this.presentation;
                  if (!(this.dead || !session || !presentation)) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return");
                case 3:
                  if (!(action.type === 'move')) {
                    _context.next = 8;
                    break;
                  }
                  if (!(action.x === 0 && action.y === 0 || this.initialized && this.visible && presentation.isInteractive())) {
                    _context.next = 7;
                    break;
                  }
                  _context.next = 7;
                  return session.dispatch(action);
                case 7:
                  return _context.abrupt("return");
                case 8:
                  if (!(!this.initialized || !this.visible || this.actionPending || !presentation.isRemainingReady() || !presentation.isInteractive() && action.type !== 'navigate' && action.type !== 'continue' && action.type !== 'start')) {
                    _context.next = 10;
                    break;
                  }
                  return _context.abrupt("return");
                case 10:
                  generation = this.generation;
                  this.actionPending = true;
                  presentation.setActionPending(true);
                  _context.prev = 13;
                  _context.next = 16;
                  return session.dispatch(action);
                case 16:
                  _context.next = 21;
                  break;
                case 18:
                  _context.prev = 18;
                  _context.t0 = _context["catch"](13);
                  console.error('[Inkblade30] action failed', action.type, _context.t0);
                case 21:
                  _context.prev = 21;
                  if (!this.dead && generation === this.generation) {
                    this.actionPending = false;
                    presentation.setActionPending(false);
                  }
                  return _context.finish(21);
                case 24:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[13, 18, 21, 24]]);
          }));
          function dispatch(_x) {
            return _dispatch.apply(this, arguments);
          }
          return dispatch;
        }();
        _proto.start = /*#__PURE__*/function () {
          var _start = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _this2 = this;
            var generation, initialization, _this$presentation4;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  generation = ++this.generation;
                  profiler.hideStats();
                  this.resize();
                  this.host = new Node('Inkblade30Presentation');
                  this.host.layer = this.node.layer;
                  this.node.addChild(this.host);
                  this.host.addComponent(UITransform).setContentSize(750, view.getVisibleSize().height);
                  this.loading = new PresentationLoading(this.host, this.reload, function () {
                    var _this2$presentation;
                    return (_this2$presentation = _this2.presentation) == null ? void 0 : _this2$presentation.cancelPendingIntent();
                  });
                  this.resize();
                  game.on(Game.EVENT_HIDE, this.hide, this);
                  game.on(Game.EVENT_SHOW, this.show, this);
                  if (typeof window !== 'undefined') {
                    window.addEventListener('blur', this.hide);
                    window.addEventListener('focus', this.show);
                    window.addEventListener('resize', this.resize);
                  }
                  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', this.visibility);
                  this.visible = typeof document === 'undefined' || !document.hidden;
                  this.loading.setVisible(this.visible);
                  _context2.prev = 15;
                  this.session = new GameSession(platformStorage(), STAGES, SKILLS, ENEMIES, freshAccountSeed());
                  this.presentation = new GameView();
                  this.diagnostics = _extends({
                    version: GAME_VERSION,
                    snapshot: function snapshot() {
                      var _this2$session;
                      return JSON.parse(JSON.stringify((_this2$session = _this2.session) == null ? void 0 : _this2$session.view));
                    },
                    ready: function ready() {
                      var _this2$presentation2;
                      return !_this2.dead && _this2.initialized && _this2.visible && !!((_this2$presentation2 = _this2.presentation) != null && _this2$presentation2.isInteractive());
                    },
                    loading: function loading() {
                      var _this2$loading;
                      return (_this2$loading = _this2.loading) == null ? void 0 : _this2$loading.inspect();
                    }
                  }, typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('qa') === '1' ? {
                    ui: function ui() {
                      var _this2$presentation3, _this2$presentation4, _this2$loading2, _this2$loading3;
                      return _this2.initialized ? (_this2$presentation3 = _this2.presentation) == null ? void 0 : _this2$presentation3.inspect() : {
                        loading: ((_this2$presentation4 = _this2.presentation) == null ? void 0 : _this2$presentation4.inspectLoading()) || ((_this2$loading2 = _this2.loading) == null ? void 0 : _this2$loading2.inspect()),
                        buttons: ((_this2$loading3 = _this2.loading) == null ? void 0 : _this2$loading3.inspect().buttons) || []
                      };
                    }
                  } : {});
                  globalThis.__inkblade30 = this.diagnostics;
                  initialization = this.presentation.initialize(this.host, function (action) {
                    void _this2.dispatch(action);
                  }, {
                    initialView: this.session.view,
                    loading: this.loading,
                    readContext: this.context
                  });
                  this.presentation.setVisible(this.visible);
                  _context2.next = 24;
                  return initialization;
                case 24:
                  if (!(this.dead || generation !== this.generation)) {
                    _context2.next = 26;
                    break;
                  }
                  return _context2.abrupt("return");
                case 26:
                  this.initialized = true;
                  _context2.next = 32;
                  break;
                case 29:
                  _context2.prev = 29;
                  _context2.t0 = _context2["catch"](15);
                  if (!this.dead && generation === this.generation) this.loading.fail(((_this$presentation4 = this.presentation) == null ? void 0 : _this$presentation4.failureKey()) || 'initialize', _context2.t0, false);
                case 32:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this, [[15, 29]]);
          }));
          function start() {
            return _start.apply(this, arguments);
          }
          return start;
        }();
        _proto.update = function update(dt) {
          var _this$loading7;
          (_this$loading7 = this.loading) == null || _this$loading7.tick();
          if (this.dead || !this.initialized || !this.session || !this.presentation) return;
          var advance = this.visible && !this.actionPending && this.presentation.canAdvance();
          if (advance) this.session.advance(dt);
          this.presentation.render(this.session.view, advance ? dt : 0);
        };
        _proto.onDestroy = function onDestroy() {
          var _this$presentation5, _this$loading8;
          this.dead = true;
          this.generation++;
          this.initialized = false;
          game.off(Game.EVENT_HIDE, this.hide, this);
          game.off(Game.EVENT_SHOW, this.show, this);
          if (typeof window !== 'undefined') {
            window.removeEventListener('blur', this.hide);
            window.removeEventListener('focus', this.show);
            window.removeEventListener('resize', this.resize);
          }
          if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.visibility);
          (_this$presentation5 = this.presentation) == null || _this$presentation5.destroy();
          (_this$loading8 = this.loading) == null || _this$loading8.destroy();
          if (globalThis.__inkblade30 === this.diagnostics) delete globalThis.__inkblade30;
        };
        return Inkblade30;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./Inkblade30.ts', './economy.ts', './enemies.ts', './index.ts', './skills.ts', './stage01.ts', './stages.ts', './contract.ts', './account.ts', './combat-navigation.ts', './combat.ts', './session.ts', './storage.ts', './BO01Presentation.ts', './GameView.ts', './PresentationLoading.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/PresentationLoading.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _extends, cclegacy, Node, Label, Color, UITransform, Sprite, KeyCode, director, Director, Graphics;
  return {
    setters: [function (module) {
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      Color = module.Color;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      KeyCode = module.KeyCode;
      director = module.director;
      Director = module.Director;
      Graphics = module.Graphics;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9b38ai3TehMhr8PQhbL0XQ9", "PresentationLoading", undefined);
      var CAMP_IMAGE_KEYS = exports('CAMP_IMAGE_KEYS', ['camp', 'hero/sweep-01', 'ui/plaque-wide', 'objects/PICK-CU01', 'objects/RC02-refined-iron', 'ui/round-slot', 'ui/name-plaque', 'ui/camp-equipment-icon', 'ui/camp-training-icon', 'ui/icon-scroll', 'ui/companion-emblem', 'ui/icon-book', 'ui/cta-primary']);
      // This copy is rendered only by system-font loading feedback, never by the authored font bank.
      var COPY = {
        title: '展开山河',
        manifest: '正在核对图卷',
        bundle: '正在展开图卷',
        critical: '正在铺开营地',
        remaining: '正在备齐行装',
        frame: '正在铺开画面',
        slow: '仍在载入，请稍候',
        failed: '图卷未能展开',
        failure: '已有行程不会被清除。\n请重新载入后，再选择要走的山道。',
        reload: '重新载入',
        cancel: '返回营地',
        count: function count(n, total) {
          return "\u5DF2\u5907\u59A5 " + n + " / " + total + " \u9879";
        }
      };
      var bridge = function bridge() {
        return typeof window === 'undefined' ? undefined : window.__inkbladeStartup;
      };

      /** A transient status surface; it never dispatches a model or storage action. */
      var PresentationLoading = exports('PresentationLoading', /*#__PURE__*/function () {
        function PresentationLoading(host, onReload, onCancel) {
          var _this = this,
            _bridge;
          this.state = {
            phase: 'engine',
            status: 'loading',
            completed: 0,
            total: null,
            failedKeys: [],
            active: true,
            canCancel: false,
            criticalReady: false,
            firstVisible: false,
            interactiveCritical: false,
            remainingReady: false,
            visible: true,
            nativeReady: false,
            startedAt: Date.now(),
            lastProgressAt: Date.now(),
            criticalReadyAt: null,
            firstVisibleAt: null,
            interactiveAt: null,
            remainingReadyAt: null,
            phaseTimes: [{
              phase: 'engine',
              at: Date.now()
            }]
          };
          this.auditSink = void 0;
          this.auditLoadId = '';
          this.root = void 0;
          this.g = void 0;
          this.title = void 0;
          this.message = void 0;
          this.detail = void 0;
          this.count = void 0;
          this.cancelNode = void 0;
          this.reloadNode = void 0;
          this.material = null;
          this.width = 750;
          this.height = 1334;
          this.unit = 2;
          this.dead = false;
          this.focused = 0;
          this.keyboardFocus = false;
          this.armed = new Map();
          this.serial = 0;
          this.buttons = [];
          this.initialDraw = function () {
            if (_this.dead) return;
            _this.state.nativeReady = true;
            _this.publish();
          };
          this.host = host;
          this.onReload = onReload;
          this.onCancel = onCancel;
          this.auditSink = (_bridge = bridge()) == null ? void 0 : _bridge.audit;
          try {
            var _this$auditSink;
            this.auditLoadId = ((_this$auditSink = this.auditSink) == null ? void 0 : _this$auditSink.openLoad()) || '';
          } catch (_unused) {
            this.auditSink = undefined;
          }
          this.root = new Node('PresentationLoading');
          this.root.layer = host.layer;
          host.addChild(this.root);
          this.root.addComponent(UITransform);
          this.g = this.root.addComponent(Graphics);
          this.title = this.label('LoadingHeading', 30);
          this.message = this.label('LoadingStatus', 19);
          this.detail = this.label('LoadingExplanation', 16);
          this.count = this.label('LoadingItemCount', 16);
          this.cancelNode = this.button('loading-cancel', COPY.cancel, function () {
            return _this.cancel();
          });
          this.reloadNode = this.button('loading-reload', COPY.reload, function () {
            return _this.reload();
          });
          director.once(Director.EVENT_AFTER_DRAW, this.initialDraw);
          this.draw();
        }
        var _proto = PresentationLoading.prototype;
        _proto.label = function label(name, size) {
          var n = new Node(name);
          n.layer = this.host.layer;
          this.root.addChild(n);
          var l = n.addComponent(Label);
          l.useSystemFont = true;
          l.fontSize = size;
          l.lineHeight = Math.ceil(size * 1.45);
          l.color = new Color().fromHEX('#f1e5c9');
          l.horizontalAlign = Label.HorizontalAlign.CENTER;
          l.verticalAlign = Label.VerticalAlign.CENTER;
          l.overflow = Label.Overflow.CLAMP;
          l.enableWrapText = true;
          if (!n.getComponent(UITransform)) n.addComponent(UITransform);
          return l;
        };
        _proto.button = function button(id, copy, run) {
          var _this2 = this;
          var n = new Node(id);
          n.layer = this.host.layer;
          this.root.addChild(n);
          n.addComponent(UITransform);
          var label = new Node('Label');
          label.layer = n.layer;
          n.addChild(label);
          var l = label.addComponent(Label);
          l.useSystemFont = true;
          l.string = copy;
          l.horizontalAlign = Label.HorizontalAlign.CENTER;
          l.verticalAlign = Label.VerticalAlign.CENTER;
          l.overflow = Label.Overflow.CLAMP;
          if (!label.getComponent(UITransform)) label.addComponent(UITransform);
          n.on(Node.EventType.TOUCH_START, function (e) {
            var _e$getID;
            _this2.keyboardFocus = false;
            if (n.active && _this2.state.active) _this2.armed.set(n, {
              id: (_e$getID = e.getID()) != null ? _e$getID : -1,
              serial: _this2.serial
            });
          });
          n.on(Node.EventType.TOUCH_CANCEL, function () {
            return _this2.armed["delete"](n);
          });
          n.on(Node.EventType.TOUCH_END, function (e) {
            var _e$getID2;
            var a = _this2.armed.get(n);
            _this2.armed["delete"](n);
            if (_this2.dead || !_this2.state.active || !n.active || !a || a.id !== ((_e$getID2 = e.getID()) != null ? _e$getID2 : -1) || a.serial !== _this2.serial) return;
            var p = e.getUILocation(),
              u = n.getComponent(UITransform);
            if (!u.isHit(p)) return;
            run();
          });
          this.buttons.push({
            id: id,
            label: copy,
            node: n,
            run: run
          });
          return n;
        };
        _proto.auditCall = function auditCall(method) {
          if (!this.auditSink || !this.auditLoadId) return;
          try {
            var _this$auditSink2;
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            (_this$auditSink2 = this.auditSink)[method].apply(_this$auditSink2, [this.auditLoadId].concat(args));
          } catch (_unused2) {
            this.auditSink = undefined;
          }
        };
        _proto.auditCatalog = function auditCatalog(art, defs) {
          this.auditCall('catalog', art, defs);
        };
        _proto.auditBatch = function auditBatch(kind, keys) {
          this.auditCall('batch', kind, keys);
        };
        _proto.auditRequested = function auditRequested(key, kind) {
          this.auditCall('event', key, 'logical-requested', kind);
        };
        _proto.auditIssued = function auditIssued(key) {
          this.auditCall('event', key, 'bundle-load-called');
        };
        _proto.auditCallback = function auditCallback(key, failed) {
          this.auditCall('event', key, failed ? 'asset-callback-error' : 'asset-callback-success');
        };
        _proto.auditValidated = function auditValidated(key, stage) {
          this.auditCall('event', key, 'validated', stage);
        };
        _proto.auditError = function auditError(key) {
          this.auditCall('event', key, 'prepare-error');
        };
        _proto.publish = function publish() {
          var _bridge2;
          this.auditCall('state', this.state);
          (_bridge2 = bridge()) == null || _bridge2.update(_extends({}, this.state, {
            failedKeys: [],
            phaseTimes: undefined
          }));
        };
        _proto.draw = function draw() {
          var _this3 = this;
          if (this.dead) return;
          this.root.active = this.state.active;
          if (!this.root.active) {
            this.armed.clear();
            this.publish();
            return;
          }
          this.root.setSiblingIndex(this.host.children.length - 1);
          var u = this.unit,
            s = this.state,
            failed = s.status === 'failed';
          this.root.getComponent(UITransform).setContentSize(this.width, this.height);
          this.g.clear();
          this.g.fillColor = new Color(7, 27, 26, s.firstVisible ? 230 : 255);
          this.g.rect(-375, -this.height / 2, 750, this.height);
          this.g.fill();
          this.title.string = failed ? COPY.failed : COPY.title;
          this.message.string = failed ? '' : s.status === 'slow' ? COPY.slow : s.phase === 'manifest' ? COPY.manifest : s.phase === 'bundle' ? COPY.bundle : s.phase === 'critical' ? COPY.critical : s.phase === 'remaining' ? COPY.remaining : COPY.frame;
          this.detail.string = failed ? COPY.failure : '';
          this.count.string = !failed && s.total !== null ? COPY.count(s.completed, s.total) : '';
          for (var _i = 0, _arr = [[this.title, 104, 30, 320, 48], [this.message, 49, 19, 320, 40], [this.detail, 5, 16, 300, 82], [this.count, -7, 16, 310, 34]]; _i < _arr.length; _i++) {
            var _arr$_i = _arr[_i],
              l = _arr$_i[0],
              y = _arr$_i[1],
              font = _arr$_i[2],
              w = _arr$_i[3],
              h = _arr$_i[4];
            l.fontSize = font * u;
            l.lineHeight = Math.ceil(font * 1.45) * u;
            l.node.setPosition(0, y * u);
            l.node.getComponent(UITransform).setContentSize(w * u, h * u);
          }
          if (!failed) {
            var ratio = s.total ? Math.max(0, Math.min(1, s.completed / s.total)) : 0,
              _w = 270 * u;
            this.g.strokeColor = new Color().fromHEX('#b89a5e');
            this.g.lineWidth = u;
            this.g.rect(-_w / 2, -45 * u, _w, 6 * u);
            this.g.stroke();
            if (ratio > 0) {
              this.g.fillColor = new Color().fromHEX('#d7bc7c');
              this.g.rect(-_w / 2 + 2 * u, -43 * u, Math.max(0, (_w - 4 * u) * ratio), 2 * u);
              this.g.fill();
            }
          }
          this.cancelNode.active = s.canCancel;
          this.reloadNode.active = failed || s.status === 'slow';
          var shown = this.buttons.filter(function (b) {
            return b.node.active;
          });
          if (this.focused >= shown.length) this.focused = 0;
          shown.forEach(function (b, i) {
            var w = shown.length === 1 ? 160 : 148,
              x = shown.length === 1 ? 0 : (i - .5) * 160,
              y = -111;
            b.node.setPosition(x * u, y * u);
            b.node.getComponent(UITransform).setContentSize(w * u, 49 * u);
            var l = b.node.getChildByName('Label').getComponent(Label);
            l.fontSize = 19 * u;
            l.lineHeight = 27 * u;
            l.color = new Color().fromHEX('#f1e5c9');
            l.node.getComponent(UITransform).setContentSize((w - 16) * u, 44 * u);
            if (_this3.material) {
              var plate = b.node.getChildByName('Plate');
              if (!plate) {
                plate = new Node('Plate');
                plate.layer = b.node.layer;
                b.node.addChild(plate);
                plate.addComponent(UITransform);
                plate.addComponent(Sprite);
                plate.setSiblingIndex(0);
              }
              var sp = plate.getComponent(Sprite);
              sp.sizeMode = Sprite.SizeMode.CUSTOM;
              sp.spriteFrame = _this3.material;
              plate.getComponent(UITransform).setContentSize(w * u, w * u * _this3.material.rect.height / _this3.material.rect.width);
            } else {
              _this3.g.strokeColor = new Color().fromHEX('#d7bc7c');
              _this3.g.lineWidth = u;
              _this3.g.rect((x - w / 2) * u, (y - 24.5) * u, w * u, 49 * u);
              _this3.g.stroke();
            }
            if (_this3.keyboardFocus && i === _this3.focused) {
              _this3.g.strokeColor = new Color().fromHEX('#f6df9e');
              _this3.g.lineWidth = 2 * u;
              _this3.g.rect((x - w / 2 - 3) * u, (y - 27.5) * u, (w + 6) * u, 55 * u);
              _this3.g.stroke();
            }
          });
          this.publish();
        };
        _proto.begin = function begin(phase, total, canCancel) {
          if (total === void 0) {
            total = null;
          }
          if (canCancel === void 0) {
            canCancel = false;
          }
          this.serial++;
          this.armed.clear();
          Object.assign(this.state, {
            phase: phase,
            status: 'loading',
            completed: 0,
            total: total,
            active: true,
            canCancel: canCancel,
            interactiveCritical: false,
            lastProgressAt: Date.now()
          });
          this.state.phaseTimes.push({
            phase: phase,
            at: Date.now()
          });
          this.draw();
        };
        _proto.resumePending = function resumePending(canCancel) {
          this.serial++;
          this.armed.clear();
          this.state.active = true;
          this.state.canCancel = canCancel;
          this.state.interactiveCritical = false;
          this.draw();
        };
        _proto.completed = function completed(key) {
          if (this.dead || this.state.status === 'failed') return;
          this.state.completed++;
          this.state.lastProgressAt = Date.now();
          this.state.status = 'loading';
          this.auditCall('event', key, 'counted');
          this.draw();
        };
        _proto.fail = function fail(key, error, canCancel) {
          if (canCancel === void 0) {
            canCancel = this.state.canCancel;
          }
          if (this.dead) return;
          console.error('[Inkblade30] presentation load failed', key, error);
          this.serial++;
          this.armed.clear();
          Object.assign(this.state, {
            status: 'failed',
            active: true,
            interactiveCritical: false,
            canCancel: canCancel
          });
          if (!this.state.failedKeys.includes(key)) this.state.failedKeys.push(key);
          this.draw();
        };
        _proto.criticalReady = function criticalReady() {
          this.state.criticalReady = true;
          this.state.criticalReadyAt = Date.now();
          this.state.phase = 'first-frame';
          this.state.phaseTimes.push({
            phase: 'first-frame',
            at: Date.now()
          });
          this.draw();
        };
        _proto.remainingReady = function remainingReady() {
          this.state.remainingReady = true;
          this.state.remainingReadyAt = Date.now();
          if (!this.state.active) this.state.status = 'ready';
          this.publish();
        };
        _proto.revealAfterDraw = function revealAfterDraw() {
          if (this.dead || this.state.status === 'failed' || !this.state.visible) return;
          this.serial++;
          if (this.state.firstVisibleAt === null) this.state.firstVisibleAt = Date.now();
          this.state.interactiveAt = Date.now();
          Object.assign(this.state, {
            firstVisible: true,
            interactiveCritical: true,
            active: false,
            canCancel: false,
            status: 'ready'
          });
          this.draw();
        };
        _proto.setVisible = function setVisible(visible) {
          this.state.visible = visible;
          if (!visible) {
            this.armed.clear();
            this.state.interactiveCritical = false;
          } else if (!this.state.active && this.state.firstVisible) this.state.interactiveCritical = true;
          this.publish();
        };
        _proto.setMaterial = function setMaterial(frame) {
          this.material = frame || null;
          this.draw();
        };
        _proto.resize = function resize(height, unit) {
          if (this.height === height && this.unit === unit) return;
          this.height = height;
          this.unit = unit;
          this.draw();
        };
        _proto.tick = function tick() {
          if (!this.dead) this.auditCall('heartbeat');
          if (!this.dead && this.state.active && this.state.status === 'loading' && Date.now() - this.state.lastProgressAt >= 15000) {
            this.state.status = 'slow';
            this.draw();
          }
          if (this.state.active) this.root.setSiblingIndex(this.host.children.length - 1);
        };
        _proto.cancel = function cancel() {
          if (!this.state.active || !this.state.canCancel) return;
          this.serial++;
          this.armed.clear();
          this.onCancel();
        };
        _proto.dismissCancelled = function dismissCancelled() {
          this.serial++;
          this.armed.clear();
          Object.assign(this.state, {
            active: false,
            canCancel: false,
            interactiveCritical: this.state.visible && this.state.firstVisible
          });
          this.draw();
        };
        _proto.reload = function reload() {
          if (this.dead) return;
          this.serial++;
          this.armed.clear();
          this.state.interactiveCritical = false;
          this.onReload();
        };
        _proto.handleKey = function handleKey(key) {
          var _b$this$focused;
          if (key === KeyCode.ESCAPE) {
            this.cancel();
            return;
          }
          var b = this.buttons.filter(function (b) {
            return b.node.active;
          });
          if (key === KeyCode.TAB) {
            this.keyboardFocus = true;
            this.focused = (this.focused + 1) % Math.max(1, b.length);
            this.draw();
            return;
          }
          if (key === KeyCode.ENTER || key === KeyCode.SPACE) (_b$this$focused = b[this.focused]) == null || _b$this$focused.run();
        };
        _proto.inspect = function inspect() {
          var _bridge3,
            _this4 = this;
          var audit = null;
          try {
            var _this$auditSink3;
            audit = ((_this$auditSink3 = this.auditSink) == null ? void 0 : _this$auditSink3.snapshot()) || null;
          } catch (_unused3) {}
          return _extends({
            startupAudit: audit
          }, this.state, {
            webEntry: ((_bridge3 = bridge()) == null || _bridge3.snapshot == null ? void 0 : _bridge3.snapshot()) || null,
            failedKeys: Array.from(this.state.failedKeys),
            phaseTimes: this.state.phaseTimes.map(function (p) {
              return _extends({}, p);
            }),
            buttons: this.state.active ? this.buttons.filter(function (b) {
              return b.node.active;
            }).map(function (b) {
              var p = b.node.position,
                u = b.node.getComponent(UITransform);
              return {
                id: b.id,
                label: b.label,
                action: 'loading-control',
                enabled: true,
                rect: {
                  x: 375 + p.x - u.width / 2,
                  y: _this4.height / 2 - p.y - u.height / 2,
                  width: u.width,
                  height: u.height
                }
              };
            }) : []
          });
        };
        _proto.destroy = function destroy() {
          this.auditCall('closeLoad');
          this.dead = true;
          director.off(Director.EVENT_AFTER_DRAW, this.initialDraw);
          this.armed.clear();
          this.root.destroy();
        };
        return PresentationLoading;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/session.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './contract.ts', './account.ts', './combat.ts', './storage.ts'], function (exports) {
  var _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, GAME_VERSION, runStats, train, activate, upgrade, equip, settle, BattleSim, SaveStore, SaveConflict;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GAME_VERSION = module.GAME_VERSION;
    }, function (module) {
      runStats = module.runStats;
      train = module.train;
      activate = module.activate;
      upgrade = module.upgrade;
      equip = module.equip;
      settle = module.settle;
    }, function (module) {
      BattleSim = module.BattleSim;
    }, function (module) {
      SaveStore = module.SaveStore;
      SaveConflict = module.SaveConflict;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c04acp07LVDx7xCkZebZRAl", "session", undefined);
      /** Coordinates durable commands. A failed commit freezes play until the candidate is resolved. */
      var GameSession = exports('GameSession', /*#__PURE__*/function () {
        function GameSession(port, stages, skills, enemies, initialSeed) {
          this.store = void 0;
          this.battle = null;
          this.saveStatus = 'saved';
          this.message = '按住空白处拖动走位，长枪自动横扫';
          this.work = Promise.resolve();
          this.inFlight = null;
          this.checkpointAge = 0;
          this.accumulator = 0;
          this.stages = stages;
          this.skills = skills;
          this.enemies = enemies;
          this.store = new SaveStore(port, initialSeed);
          this.restore(true);
        }
        var _proto = GameSession.prototype;
        _proto.restore = function restore(recovered) {
          if (recovered === void 0) {
            recovered = false;
          }
          var d = this.store.document;
          this.battle = null;
          this.accumulator = 0;
          this.checkpointAge = 0;
          if (d.run) {
            var stage = this.stages.find(function (s) {
              return s.id === d.run.stageId;
            });
            if (!stage) throw new Error('存档关卡不属于当前版本，保留原存档');
            this.battle = new BattleSim(stage, this.enemies, this.skills, runStats(d.account), 1, d.run.runId, d.run.snapshot);
            if (recovered && this.battle.state.phase === 'playing') this.battle.pause('recovered');
          }
        };
        _proto.snapshot = function snapshot(d) {
          if (this.battle) d.run = {
            runId: this.battle.state.runId,
            stageId: this.battle.state.stageId,
            snapshot: this.battle.serialize()
          };
        };
        _proto.commit = /*#__PURE__*/function () {
          var _commit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(id, change) {
            var operation, _this$battle;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  this.saveStatus = 'saving';
                  operation = this.store.transact(id, change);
                  this.inFlight = operation;
                  _context.prev = 3;
                  _context.next = 6;
                  return operation;
                case 6:
                  this.saveStatus = 'saved';
                  _context.next = 15;
                  break;
                case 9:
                  _context.prev = 9;
                  _context.t0 = _context["catch"](3);
                  (_this$battle = this.battle) == null || _this$battle.setMove(0, 0);
                  this.saveStatus = _context.t0 instanceof SaveConflict ? 'conflict' : 'error';
                  this.message = _context.t0 instanceof Error ? _context.t0.message : String(_context.t0);
                  throw _context.t0;
                case 15:
                  _context.prev = 15;
                  if (this.inFlight === operation) this.inFlight = null;
                  return _context.finish(15);
                case 18:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[3, 9, 15, 18]]);
          }));
          function commit(_x, _x2) {
            return _commit.apply(this, arguments);
          }
          return commit;
        }();
        _proto.dispatch = function dispatch(action) {
          var _this = this;
          if (action.type === 'move') {
            var _this$battle2;
            if ((this.saveStatus === 'saved' || this.saveStatus === 'saving' || action.x === 0 && action.y === 0) && this.view.screen === 'battle') (_this$battle2 = this.battle) == null || _this$battle2.setMove(action.x, action.y);
            return Promise.resolve();
          }
          if (action.type === 'pause') return this.pauseNow('manual');
          // Capture the revision at the input boundary so duplicate clicks share one operation identity.
          var token = this.store.document.account.revision + ":" + JSON.stringify(action);
          var run = function run() {
            return _this.act(action, token);
          };
          var promise = this.work.then(run, run);
          this.work = promise["catch"](function (e) {
            if (_this.saveStatus === 'saved') _this.message = e instanceof Error ? e.message : String(e);
          });
          return this.work;
        };
        _proto.act = /*#__PURE__*/function () {
          var _act = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(action, token) {
            var _this2 = this;
            var b, stage, d, runId, ok, _stage, outcome, result, before, id, _result;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(action.type === 'retry-save')) {
                    _context2.next = 15;
                    break;
                  }
                  _context2.prev = 1;
                  this.saveStatus = 'saving';
                  _context2.next = 5;
                  return this.store.retry();
                case 5:
                  this.restore(true);
                  this.saveStatus = 'saved';
                  this.message = '保存已核对，结果没有重抽';
                  _context2.next = 14;
                  break;
                case 10:
                  _context2.prev = 10;
                  _context2.t0 = _context2["catch"](1);
                  this.saveStatus = _context2.t0 instanceof SaveConflict ? 'conflict' : 'error';
                  this.message = _context2.t0 instanceof Error ? _context2.t0.message : String(_context2.t0);
                case 14:
                  return _context2.abrupt("return");
                case 15:
                  if (!(action.type === 'reload-save')) {
                    _context2.next = 18;
                    break;
                  }
                  try {
                    this.store.reload();
                    this.restore(true);
                    this.saveStatus = 'saved';
                    this.message = '已读取最新存档，继续前请确认当前状态';
                  } catch (e) {
                    this.saveStatus = 'error';
                    this.message = e instanceof Error ? e.message : String(e);
                  }
                  return _context2.abrupt("return");
                case 18:
                  if (!this.inFlight) {
                    _context2.next = 21;
                    break;
                  }
                  _context2.next = 21;
                  return this.inFlight["catch"](function () {});
                case 21:
                  if (!(this.saveStatus !== 'saved')) {
                    _context2.next = 23;
                    break;
                  }
                  return _context2.abrupt("return");
                case 23:
                  b = this.battle;
                  if (!(action.type === 'navigate')) {
                    _context2.next = 34;
                    break;
                  }
                  if (!(action.screen === 'battle')) {
                    _context2.next = 30;
                    break;
                  }
                  if (b) {
                    _context2.next = 28;
                    break;
                  }
                  return _context2.abrupt("return");
                case 28:
                  _context2.next = 31;
                  break;
                case 30:
                  if ((b == null ? void 0 : b.state.phase) === 'playing') b.pause('navigation');
                case 31:
                  _context2.next = 33;
                  return this.commit("navigate:" + (this.store.document.revision + 1), function (d) {
                    d.screen = action.screen;
                    _this2.snapshot(d);
                  });
                case 33:
                  return _context2.abrupt("return");
                case 34:
                  if (!(action.type === 'start')) {
                    _context2.next = 47;
                    break;
                  }
                  if (!b) {
                    _context2.next = 37;
                    break;
                  }
                  throw new Error('请先继续或结束当前一局');
                case 37:
                  stage = this.stages.find(function (s) {
                    return s.id === action.stageId;
                  });
                  if (!(!stage || stage.number > this.store.document.account.highestUnlockedStage)) {
                    _context2.next = 40;
                    break;
                  }
                  throw new Error('此关尚未解锁');
                case 40:
                  d = this.store.document, runId = GAME_VERSION + ":" + d.account.rng.toString(16) + ":" + d.nextRun;
                  this.battle = new BattleSim(stage, this.enemies, this.skills, runStats(d.account), (d.account.rng ^ Math.imul(d.nextRun, 0x9e3779b9)) >>> 0, runId);
                  _context2.next = 44;
                  return this.commit("start:" + runId, function (draft) {
                    draft.nextRun++;
                    draft.screen = 'battle';
                    draft.receipt = null;
                    _this2.snapshot(draft);
                  });
                case 44:
                  this.checkpointAge = 0;
                  this.message = stage.description;
                  return _context2.abrupt("return");
                case 47:
                  if (!(action.type === 'continue')) {
                    _context2.next = 53;
                    break;
                  }
                  if (b) {
                    _context2.next = 50;
                    break;
                  }
                  throw new Error('没有进行中的对局');
                case 50:
                  _context2.next = 52;
                  return this.commit("continue:" + (this.store.document.revision + 1), function (d) {
                    d.screen = 'battle';
                    _this2.snapshot(d);
                  });
                case 52:
                  return _context2.abrupt("return");
                case 53:
                  if (!(action.type === 'sound')) {
                    _context2.next = 57;
                    break;
                  }
                  _context2.next = 56;
                  return this.commit("sound:" + (this.store.document.revision + 1), function (d) {
                    d.soundEnabled = action.enabled;
                    _this2.snapshot(d);
                  });
                case 56:
                  return _context2.abrupt("return");
                case 57:
                  if (!(action.type === 'pause' || action.type === 'resume' || action.type === 'revive' || action.type === 'choose')) {
                    _context2.next = 67;
                    break;
                  }
                  if (b) {
                    _context2.next = 60;
                    break;
                  }
                  return _context2.abrupt("return");
                case 60:
                  ok = action.type === 'pause' ? b.pause('manual') : action.type === 'resume' ? b.resume() : action.type === 'revive' ? b.revive() : b.choose(action.offerId, action.skillId);
                  if (ok) {
                    _context2.next = 63;
                    break;
                  }
                  return _context2.abrupt("return");
                case 63:
                  _context2.next = 65;
                  return this.commit("battle-action:" + b.state.runId + ":" + token, function (d) {
                    return _this2.snapshot(d);
                  });
                case 65:
                  this.accumulator = 0;
                  return _context2.abrupt("return");
                case 67:
                  if (!(action.type === 'settle' || action.type === 'abandon')) {
                    _context2.next = 81;
                    break;
                  }
                  if (b) {
                    _context2.next = 70;
                    break;
                  }
                  return _context2.abrupt("return");
                case 70:
                  _stage = this.stages.find(function (s) {
                    return s.id === b.state.stageId;
                  });
                  if (!(action.type === 'settle' && b.state.phase !== 'victory' && b.state.phase !== 'defeat')) {
                    _context2.next = 73;
                    break;
                  }
                  throw new Error('对局尚未结束');
                case 73:
                  outcome = action.type === 'abandon' ? 'abandon' : b.state.phase === 'victory' ? 'victory' : 'defeat';
                  result = settle(this.store.document.account, _stage, b.state.runId, outcome, b.state.completedWaves);
                  _context2.next = 77;
                  return this.commit(result.receipt.id, function (d) {
                    d.account = result.account;
                    d.receipt = result.receipt;
                    d.run = null;
                    d.screen = outcome === 'abandon' ? 'camp' : 'settlement';
                  });
                case 77:
                  this.battle = null;
                  this.message = result.receipt.message;
                  this.accumulator = 0;
                  return _context2.abrupt("return");
                case 81:
                  if (!(action.type === 'train' || action.type === 'activate' || action.type === 'upgrade' || action.type === 'equip')) {
                    _context2.next = 89;
                    break;
                  }
                  if ((b == null ? void 0 : b.state.phase) === 'playing') b.pause('account-change');
                  before = this.store.document.account, id = "account:" + token;
                  _result = action.type === 'train' ? train(before, action.stat, id) : action.type === 'activate' ? activate(before, action.itemId, id) : action.type === 'upgrade' ? upgrade(before, action.itemId, id) : equip(before, action.itemId, action.slot, id);
                  _context2.next = 87;
                  return this.commit(id, function (d) {
                    d.account = _result.account;
                    d.receipt = _result.receipt;
                    _this2.snapshot(d);
                  });
                case 87:
                  this.message = _result.receipt.message;
                  return _context2.abrupt("return");
                case 89:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this, [[1, 10]]);
          }));
          function act(_x3, _x4) {
            return _act.apply(this, arguments);
          }
          return act;
        }();
        _proto.advance = function advance(dt) {
          var _this3 = this;
          if (!this.battle || this.view.screen !== 'battle' || this.saveStatus !== 'saved' || this.battle.state.phase !== 'playing') return;
          if (!Number.isFinite(dt) || dt <= 0) return;
          this.accumulator += dt;
          var previousPhase = this.battle.state.phase;
          while (this.accumulator >= 1 / 60 && this.battle.state.phase === 'playing') {
            this.battle.step(1 / 60);
            this.accumulator -= 1 / 60;
          }
          this.checkpointAge += dt;
          if (this.battle.state.phase !== previousPhase || this.checkpointAge >= 1) {
            this.checkpointAge = 0;
            var id = "checkpoint:" + this.battle.state.runId + ":" + this.battle.state.tick;
            // commit starts synchronously, stopping further ticks until this exact snapshot is durable.
            void this.commit(id, function (d) {
              return _this3.snapshot(d);
            })["catch"](function () {});
          }
        };
        _proto.pauseNow = function pauseNow(reason) {
          var _this4 = this;
          var battle = this.battle;
          battle == null || battle.setMove(0, 0);
          if (!(battle != null && battle.pause(reason))) return this.work.then(function () {});
          this.accumulator = 0;
          var pending = this.inFlight;
          var save = /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!pending) {
                      _context3.next = 3;
                      break;
                    }
                    _context3.next = 3;
                    return pending["catch"](function () {});
                  case 3:
                    if (!(_this4.saveStatus !== 'saved' || _this4.battle !== battle)) {
                      _context3.next = 5;
                      break;
                    }
                    return _context3.abrupt("return");
                  case 5:
                    _context3.next = 7;
                    return _this4.commit("pause:" + battle.state.runId + ":" + (_this4.store.document.revision + 1), function (d) {
                      return _this4.snapshot(d);
                    });
                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function save() {
              return _ref.apply(this, arguments);
            };
          }();
          var operation = this.work.then(save, save);
          this.work = operation["catch"](function (e) {
            if (_this4.saveStatus === 'saved') _this4.message = String(e);
          });
          return this.work;
        };
        _proto.hide = /*#__PURE__*/function () {
          var _hide = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.pauseNow('background');
                case 2:
                case "end":
                  return _context4.stop();
              }
            }, _callee4, this);
          }));
          function hide() {
            return _hide.apply(this, arguments);
          }
          return hide;
        }();
        _createClass(GameSession, [{
          key: "view",
          get: function get() {
            var _this$stages$find,
              _this5 = this,
              _this$battle$state,
              _this$battle3;
            var d = this.store.document;
            return {
              version: GAME_VERSION,
              screen: d.screen === 'battle' && !this.battle ? 'camp' : d.screen,
              account: d.account,
              stages: this.stages,
              skills: this.skills,
              enemies: this.enemies,
              stage: this.battle ? (_this$stages$find = this.stages.find(function (s) {
                return s.id === _this5.battle.state.stageId;
              })) != null ? _this$stages$find : null : null,
              battle: (_this$battle$state = (_this$battle3 = this.battle) == null ? void 0 : _this$battle3.state) != null ? _this$battle$state : null,
              receipt: d.receipt,
              message: this.message,
              saveStatus: this.saveStatus,
              canContinue: !!this.battle,
              soundEnabled: d.soundEnabled
            };
          }
        }]);
        return GameSession;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/skills.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "46438Mj0V5LG493oM95YqWR", "skills", undefined);
      /** No routes, awakening, mod points or permanent per-skill training. */
      var SKILLS = exports('SKILLS', [{
        id: 'SK01',
        name: '回锋',
        description: '朝最近目标发出穿透飞刃，同弹每敌只中一次。',
        damage: 14,
        interval: 1.05,
        range: 620,
        speed: 480,
        radius: 7,
        count: 1,
        pierce: 2
      }, {
        id: 'SK02',
        name: '震岳',
        description: '慢速滚石贯穿重甲阵列；累计行程不重置。',
        damage: 26,
        interval: 3.4,
        range: 560,
        speed: 190,
        radius: 24,
        count: 1,
        pierce: 4
      }, {
        id: 'SK03',
        name: '风卷',
        description: '向敌群移动的持续风区，同敌按脉冲门限命中。',
        damage: 6,
        interval: 3.6,
        range: 600,
        speed: 65,
        radius: 68,
        duration: 3,
        count: 1,
        pulse: 0.35
      }, {
        id: 'SK04',
        name: '星锤',
        description: '近圈星锤环绕，每敌共享命中间隔。',
        damage: 16,
        interval: 0.7,
        range: 118,
        radius: 18,
        count: 1,
        angularSpeed: 3.8
      }, {
        id: 'SK05',
        name: '地龙',
        description: '预告后刺击两个固定落点，重叠不绕过同轮门限。',
        damage: 13,
        interval: 3.2,
        range: 480,
        radius: 58,
        duration: 1.4,
        count: 2,
        pulse: 0.35,
        warning: 0.3
      }, {
        id: 'SK06',
        name: '墨爪',
        description: '在近敌处留下固定陷阱区，不追踪移动目标。',
        damage: 10,
        interval: 3.8,
        range: 480,
        radius: 82,
        duration: 2.4,
        count: 1,
        pulse: 0.4
      }, {
        id: 'SK07',
        name: '气环',
        description: '脚下周期脉冲，给近身敌人可读的小幅击退。',
        damage: 6,
        interval: 0.85,
        range: 110,
        radius: 110,
        count: 1,
        knockback: 6
      }, {
        id: 'SK08',
        name: '霜线',
        description: '直线冰矢穿透并短控，精英与Boss衰减且有再控间隔。',
        damage: 5,
        interval: 3.5,
        range: 600,
        speed: 420,
        radius: 8,
        count: 1,
        control: 1.1,
        pierce: 3
      }, {
        id: 'SK09',
        name: '飞羽',
        description: '向最近目标扇射三羽，同轮重合命中受限。',
        damage: 9,
        interval: 2.1,
        range: 570,
        speed: 370,
        radius: 8,
        count: 3,
        spread: 18
      }, {
        id: 'SK10',
        name: '雷引',
        description: '向邻近不同目标连锁，同链不重复命中。',
        damage: 20,
        interval: 2.9,
        range: 500,
        radius: 165,
        count: 3,
        jumpFalloff: 0.85
      }, {
        id: 'SK11',
        name: '青刺',
        description: '均匀向周围发出八刺，同轮重合命中受限。',
        damage: 8,
        interval: 2.8,
        range: 480,
        speed: 300,
        radius: 6,
        count: 8
      }, {
        id: 'SK12',
        name: '两仪',
        description: '黑白双轨相向环绕，每敌共享两仪命中间隔。',
        damage: 12,
        interval: 0.8,
        range: 156,
        radius: 18,
        count: 2,
        angularSpeed: 2.6
      }]);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage01.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e4067HZkOJKSJ20T1xX2pTO", "stage01", undefined);
      /** Preserved ST01 first-gate object. Full30 are exported from stages.ts. */
      var STAGE01 = exports('STAGE01', {
        id: 'ST01',
        number: 1,
        name: '青溪试刃',
        chapter: '一·青溪启程',
        description: '五蝠起手，拾取10经验学第一招；在开阔地练短步转身，再击退螳王。',
        objective: 'clear',
        world: {
          width: 1500,
          height: 1800,
          spawn: {
            x: 750,
            y: 1080
          },
          obstacles: [],
          map: 'MAP01'
        },
        waves: [{
          id: 'ST01-W01',
          label: '五蝠试刃',
          groups: [{
            enemy: 'EN01',
            count: 5,
            pattern: 'north'
          }],
          rest: 3,
          maxSeconds: 40
        }, {
          id: 'ST01-W02',
          label: '两翼短步',
          groups: [{
            enemy: 'EN01',
            count: 6,
            pattern: 'flank'
          }],
          rest: 3,
          maxSeconds: 40
        }, {
          id: 'ST01-W03',
          label: '雾灯追近',
          groups: [{
            enemy: 'EN02',
            count: 4,
            pattern: 'south'
          }],
          rest: 3,
          maxSeconds: 45
        }, {
          id: 'ST01-W04',
          label: '留出退路',
          groups: [{
            enemy: 'EN01',
            count: 6,
            pattern: 'north'
          }, {
            enemy: 'EN02',
            count: 2,
            pattern: 'west',
            delay: 3
          }],
          rest: 4,
          maxSeconds: 50
        }, {
          id: 'ST01-W05',
          label: '螳王·横切扇隙',
          groups: [{
            enemy: 'BO01',
            count: 1,
            pattern: 'north'
          }, {
            enemy: 'EN01',
            count: 3,
            pattern: 'east',
            delay: 6
          }],
          rest: 0,
          maxSeconds: 90
        }],
        mechanics: [],
        reward: {
          coins: 120,
          iron: 4,
          firstCoins: 100,
          firstIron: 8,
          equipmentPool: ['EQ01'],
          companionPool: [],
          firstShards: {
            EQ01: 6
          },
          unlockSkills: ['SK07'],
          unlockItems: ['EQ01']
        },
        authoredXp: 64,
        teaching: '走位/横扫/真实拾取/首选/扇形横切'
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stages.ts", ['cc', './stage01.ts'], function (exports) {
  var cclegacy, STAGE01;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      STAGE01 = module.STAGE01;
    }],
    execute: function () {
      cclegacy._RF.push({}, "acff24qBadGRLvTPblnk4lm", "stages", undefined);

      /** Explicit authored30, not a six-stage loop. ST01 object identity stays frozen for first gate. */
      var STAGES = exports('STAGES', [STAGE01, {
        "id": "ST02",
        "number": 2,
        "name": "溪岸绕行",
        "chapter": "一·青溪启程",
        "description": "双岩绕行与侧向收尾",
        "objective": "clear",
        "world": {
          "width": 1500,
          "height": 1800,
          "spawn": {
            "x": 750,
            "y": 1400
          },
          "obstacles": [{
            "x": 480,
            "y": 680,
            "width": 140,
            "height": 360
          }, {
            "x": 880,
            "y": 680,
            "width": 140,
            "height": 360
          }],
          "map": "MAP01"
        },
        "waves": [{
          "id": "ST02-W01",
          "label": "东岸来翼",
          "groups": [{
            "enemy": "EN01",
            "count": 6,
            "pattern": "east",
            "hpScale": 1,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 12
        }, {
          "id": "ST02-W02",
          "label": "西岸雾灯",
          "groups": [{
            "enemy": "EN02",
            "count": 5,
            "pattern": "west",
            "hpScale": 1,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 10
        }, {
          "id": "ST02-W03",
          "label": "岩后回锋",
          "groups": [{
            "enemy": "EN01",
            "count": 5,
            "pattern": "north",
            "hpScale": 1,
            "damageScale": 1
          }, {
            "enemy": "EN02",
            "count": 3,
            "pattern": "south",
            "delay": 3.0,
            "hpScale": 1,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 16
        }, {
          "id": "ST02-W04",
          "label": "空侧取珠",
          "groups": [{
            "enemy": "EN02",
            "count": 6,
            "pattern": "flank",
            "hpScale": 1,
            "damageScale": 1
          }, {
            "enemy": "EN01",
            "count": 4,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 20
        }, {
          "id": "ST02-W05",
          "label": "两岸合围",
          "groups": [{
            "enemy": "EN01",
            "count": 8,
            "pattern": "corners",
            "hpScale": 1,
            "damageScale": 1
          }, {
            "enemy": "EN02",
            "count": 4,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1,
            "damageScale": 1
          }],
          "rest": 0,
          "maxSeconds": 94,
          "authoredXp": 24
        }],
        "mechanics": [],
        "reward": {
          "coins": 140,
          "iron": 4,
          "firstCoins": 120,
          "firstIron": 8,
          "equipmentPool": ["EQ01"],
          "companionPool": [],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 82,
        "teaching": "双岩绕行与侧向收尾",
        "enemyHpScale": 1,
        "enemyDamageScale": 1,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST03",
        "number": 3,
        "name": "渡口飞刺",
        "chapter": "一·青溪启程",
        "description": "先识背棘预告再横切接近",
        "objective": "clear",
        "world": {
          "width": 1500,
          "height": 1900,
          "spawn": {
            "x": 750,
            "y": 1500
          },
          "obstacles": [{
            "x": 430,
            "y": 800,
            "width": 200,
            "height": 140
          }, {
            "x": 870,
            "y": 1100,
            "width": 200,
            "height": 140
          }],
          "map": "MAP01"
        },
        "waves": [{
          "id": "ST03-W01",
          "label": "独蜥瞄准",
          "groups": [{
            "enemy": "EN05",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN01",
            "count": 4,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 11
        }, {
          "id": "ST03-W02",
          "label": "侧岸飞刺",
          "groups": [{
            "enemy": "EN05",
            "count": 2,
            "pattern": "east",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN01",
            "count": 5,
            "pattern": "west",
            "delay": 3.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 16
        }, {
          "id": "ST03-W03",
          "label": "雾灯挡线",
          "groups": [{
            "enemy": "EN02",
            "count": 6,
            "pattern": "north",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN05",
            "count": 1,
            "pattern": "south",
            "delay": 3.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 15
        }, {
          "id": "ST03-W04",
          "label": "斜切拾取",
          "groups": [{
            "enemy": "EN01",
            "count": 8,
            "pattern": "flank",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 22
        }, {
          "id": "ST03-W05",
          "label": "背棘换边",
          "groups": [{
            "enemy": "EN05",
            "count": 3,
            "pattern": "west",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN02",
            "count": 4,
            "pattern": "east",
            "delay": 3.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 17
        }, {
          "id": "ST03-W06",
          "label": "渡口清线",
          "groups": [{
            "enemy": "EN01",
            "count": 8,
            "pattern": "ring",
            "hpScale": 1.04,
            "damageScale": 1
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.04,
            "damageScale": 1
          }],
          "rest": 0,
          "maxSeconds": 90,
          "authoredXp": 22
        }],
        "mechanics": [],
        "reward": {
          "coins": 160,
          "iron": 5,
          "firstCoins": 140,
          "firstIron": 8,
          "equipmentPool": ["EQ01"],
          "companionPool": ["CO01"],
          "firstShards": {
            "CO01": 6
          },
          "unlockSkills": ["SK09"],
          "unlockItems": ["CO01"]
        },
        "authoredXp": 103,
        "teaching": "先识背棘预告再横切接近",
        "enemyHpScale": 1.04,
        "enemyDamageScale": 1,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST04",
        "number": 4,
        "name": "守灯归途",
        "chapter": "一·青溪启程",
        "description": "累计驻圈8秒仍须清全部波",
        "objective": "beacon",
        "world": {
          "width": 1600,
          "height": 1900,
          "spawn": {
            "x": 800,
            "y": 1500
          },
          "obstacles": [{
            "x": 300,
            "y": 650,
            "width": 180,
            "height": 420
          }],
          "map": "MAP01"
        },
        "waves": [{
          "id": "ST04-W01",
          "label": "照灯来翼",
          "groups": [{
            "enemy": "EN01",
            "count": 8,
            "pattern": "north",
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 16
        }, {
          "id": "ST04-W02",
          "label": "离圈引雾",
          "groups": [{
            "enemy": "EN02",
            "count": 7,
            "pattern": "south",
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 14
        }, {
          "id": "ST04-W03",
          "label": "横切灯外",
          "groups": [{
            "enemy": "EN05",
            "count": 2,
            "pattern": "east",
            "hpScale": 1.08,
            "damageScale": 1
          }, {
            "enemy": "EN01",
            "count": 5,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 16
        }, {
          "id": "ST04-W04",
          "label": "驻圈换侧",
          "groups": [{
            "enemy": "EN02",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.08,
            "damageScale": 1
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "north",
            "delay": 3.0,
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 16
        }, {
          "id": "ST04-W05",
          "label": "留门不堵",
          "groups": [{
            "enemy": "EN01",
            "count": 8,
            "pattern": "corners",
            "hpScale": 1.08,
            "damageScale": 1
          }, {
            "enemy": "EN02",
            "count": 3,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 22
        }, {
          "id": "ST04-W06",
          "label": "灯前归路",
          "groups": [{
            "enemy": "EN05",
            "count": 3,
            "pattern": "west",
            "hpScale": 1.08,
            "damageScale": 1
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "east",
            "delay": 3.0,
            "hpScale": 1.08,
            "damageScale": 1
          }],
          "rest": 0,
          "maxSeconds": 88,
          "authoredXp": 21
        }],
        "mechanics": [{
          "kind": "beacon",
          "id": "ST04-BEACON",
          "x": 1100,
          "y": 800,
          "radius": 110,
          "holdSeconds": 8
        }],
        "reward": {
          "coins": 180,
          "iron": 5,
          "firstCoins": 160,
          "firstIron": 9,
          "equipmentPool": ["EQ01"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 105,
        "teaching": "累计驻圈8秒仍须清全部波",
        "enemyHpScale": 1.08,
        "enemyDamageScale": 1,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST05",
        "number": 5,
        "name": "石隙破阵",
        "chapter": "一·青溪启程",
        "description": "慢重甲首遇，集中而非四处刮伤",
        "objective": "clear",
        "world": {
          "width": 1600,
          "height": 1900,
          "spawn": {
            "x": 800,
            "y": 1500
          },
          "obstacles": [{
            "x": 400,
            "y": 600,
            "width": 300,
            "height": 140
          }, {
            "x": 900,
            "y": 1000,
            "width": 300,
            "height": 140
          }],
          "map": "MAP01"
        },
        "waves": [{
          "id": "ST05-W01",
          "label": "独甲来路",
          "groups": [{
            "enemy": "EN03",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.12,
            "damageScale": 1.02
          }, {
            "enemy": "EN01",
            "count": 4,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 11
        }, {
          "id": "ST05-W02",
          "label": "窄口成列",
          "groups": [{
            "enemy": "EN03",
            "count": 3,
            "pattern": "line",
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 9
        }, {
          "id": "ST05-W03",
          "label": "两侧雾灯",
          "groups": [{
            "enemy": "EN02",
            "count": 8,
            "pattern": "flank",
            "hpScale": 1.12,
            "damageScale": 1.02
          }, {
            "enemy": "EN01",
            "count": 4,
            "pattern": "north",
            "delay": 3.0,
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 24
        }, {
          "id": "ST05-W04",
          "label": "甲后弩蜥",
          "groups": [{
            "enemy": "EN03",
            "count": 2,
            "pattern": "north",
            "hpScale": 1.12,
            "damageScale": 1.02
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 12
        }, {
          "id": "ST05-W05",
          "label": "环侧击破",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "corners",
            "hpScale": 1.12,
            "damageScale": 1.02
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST05-W06",
          "label": "石隙收阵",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "line",
            "hpScale": 1.12,
            "damageScale": 1.02
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "west",
            "delay": 3.0,
            "hpScale": 1.12,
            "damageScale": 1.02
          }],
          "rest": 0,
          "maxSeconds": 90,
          "authoredXp": 24
        }],
        "mechanics": [],
        "reward": {
          "coins": 200,
          "iron": 6,
          "firstCoins": 180,
          "firstIron": 9,
          "equipmentPool": ["EQ01"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": ["SK03"],
          "unlockItems": []
        },
        "authoredXp": 104,
        "teaching": "慢重甲首遇，集中而非四处刮伤",
        "enemyHpScale": 1.12,
        "enemyDamageScale": 1.02,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST06",
        "number": 6,
        "name": "古渡守夜",
        "chapter": "二·古渡试炼",
        "description": "存活120秒不能清场提前结束",
        "objective": "survive",
        "world": {
          "width": 1600,
          "height": 1900,
          "spawn": {
            "x": 800,
            "y": 1500
          },
          "obstacles": [{
            "x": 400,
            "y": 700,
            "width": 160,
            "height": 300
          }, {
            "x": 1050,
            "y": 900,
            "width": 160,
            "height": 300
          }],
          "map": "MAP02"
        },
        "waves": [{
          "id": "ST06-W01",
          "label": "夜翼压境",
          "groups": [{
            "enemy": "EN01",
            "count": 10,
            "pattern": "north",
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 20
        }, {
          "id": "ST06-W02",
          "label": "雾墙开口",
          "groups": [{
            "enemy": "EN02",
            "count": 8,
            "pattern": "west",
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 16
        }, {
          "id": "ST06-W03",
          "label": "背刺渡水",
          "groups": [{
            "enemy": "EN05",
            "count": 3,
            "pattern": "east",
            "hpScale": 1.16,
            "damageScale": 1.04
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 3.0,
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 21
        }, {
          "id": "ST06-W04",
          "label": "甲列留缝",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "line",
            "hpScale": 1.16,
            "damageScale": 1.04
          }, {
            "enemy": "EN02",
            "count": 4,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 20
        }, {
          "id": "ST06-W05",
          "label": "两翼换阵",
          "groups": [{
            "enemy": "EN01",
            "count": 10,
            "pattern": "flank",
            "hpScale": 1.16,
            "damageScale": 1.04
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 96,
          "authoredXp": 29
        }, {
          "id": "ST06-W06",
          "label": "獠兽撤圈",
          "groups": [{
            "enemy": "BO02",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 16
        }, {
          "id": "ST06-W07",
          "label": "守至破晓",
          "groups": [{
            "enemy": "EN02",
            "count": 8,
            "pattern": "corners",
            "hpScale": 1.16,
            "damageScale": 1.04
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.16,
            "damageScale": 1.04
          }],
          "rest": 0,
          "maxSeconds": 92,
          "authoredXp": 25
        }],
        "mechanics": [],
        "reward": {
          "coins": 225,
          "iron": 6,
          "firstCoins": 200,
          "firstIron": 9,
          "equipmentPool": ["EQ01"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 147,
        "teaching": "存活120秒不能清场提前结束",
        "enemyHpScale": 1.16,
        "enemyDamageScale": 1.04,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。",
        "surviveSeconds": 120
      }, {
        "id": "ST07",
        "number": 7,
        "name": "浅滩封线",
        "chapter": "二·古渡试炼",
        "description": "预警地线与锁向冲锋分别横切",
        "objective": "clear",
        "world": {
          "width": 1700,
          "height": 2000,
          "spawn": {
            "x": 850,
            "y": 1600
          },
          "obstacles": [{
            "x": 550,
            "y": 1050,
            "width": 500,
            "height": 100
          }],
          "map": "MAP02"
        },
        "waves": [{
          "id": "ST07-W01",
          "label": "折镰首遇",
          "groups": [{
            "enemy": "EN04",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.2,
            "damageScale": 1.06
          }, {
            "enemy": "EN01",
            "count": 5,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 13
        }, {
          "id": "ST07-W02",
          "label": "浅滩红线",
          "groups": [{
            "enemy": "EN02",
            "count": 8,
            "pattern": "east",
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 16
        }, {
          "id": "ST07-W03",
          "label": "侧锋错开",
          "groups": [{
            "enemy": "EN04",
            "count": 3,
            "pattern": "flank",
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 9
        }, {
          "id": "ST07-W04",
          "label": "甲列封线",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "north",
            "hpScale": 1.2,
            "damageScale": 1.06
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 18
        }, {
          "id": "ST07-W05",
          "label": "穿线取珠",
          "groups": [{
            "enemy": "EN04",
            "count": 3,
            "pattern": "east",
            "hpScale": 1.2,
            "damageScale": 1.06
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 25
        }, {
          "id": "ST07-W06",
          "label": "浅滩收锋",
          "groups": [{
            "enemy": "EN04",
            "count": 4,
            "pattern": "corners",
            "hpScale": 1.2,
            "damageScale": 1.06
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.2,
            "damageScale": 1.06
          }],
          "rest": 0,
          "maxSeconds": 84,
          "authoredXp": 21
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST07-L1",
          "shape": "line",
          "x": 850,
          "y": 800,
          "period": 9,
          "warning": 1.5,
          "active": 0.7,
          "damage": 8,
          "offset": 0,
          "width": 1100,
          "height": 70
        }],
        "reward": {
          "coins": 245,
          "iron": 7,
          "firstCoins": 220,
          "firstIron": 10,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {
            "EQ02": 6
          },
          "unlockSkills": [],
          "unlockItems": ["EQ02"]
        },
        "authoredXp": 102,
        "teaching": "预警地线与锁向冲锋分别横切",
        "enemyHpScale": 1.2,
        "enemyDamageScale": 1.06,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST08",
        "number": 8,
        "name": "芦洲转锋",
        "chapter": "二·古渡试炼",
        "description": "重甲牵引与远程侧翼，学习破列",
        "objective": "clear",
        "world": {
          "width": 1700,
          "height": 1900,
          "spawn": {
            "x": 850,
            "y": 1500
          },
          "obstacles": [{
            "x": 450,
            "y": 650,
            "width": 180,
            "height": 500
          }, {
            "x": 1050,
            "y": 650,
            "width": 180,
            "height": 500
          }],
          "map": "MAP02"
        },
        "waves": [{
          "id": "ST08-W01",
          "label": "甲前翼后",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "north",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST08-W02",
          "label": "芦影背棘",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "flank",
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 12
        }, {
          "id": "ST08-W03",
          "label": "侧路重击",
          "groups": [{
            "enemy": "EN03",
            "count": 5,
            "pattern": "line",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN02",
            "count": 4,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 23
        }, {
          "id": "ST08-W04",
          "label": "两岸折镰",
          "groups": [{
            "enemy": "EN04",
            "count": 4,
            "pattern": "flank",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "north",
            "delay": 3.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 28
        }, {
          "id": "ST08-W05",
          "label": "远近轮换",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "west",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN03",
            "count": 3,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST08-W06",
          "label": "回身拾取",
          "groups": [{
            "enemy": "EN02",
            "count": 10,
            "pattern": "ring",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN04",
            "count": 2,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 26
        }, {
          "id": "ST08-W07",
          "label": "芦洲破列",
          "groups": [{
            "enemy": "EN03",
            "count": 6,
            "pattern": "line",
            "hpScale": 1.26,
            "damageScale": 1.08
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.26,
            "damageScale": 1.08
          }],
          "rest": 0,
          "maxSeconds": 88,
          "authoredXp": 27
        }],
        "mechanics": [],
        "reward": {
          "coins": 265,
          "iron": 7,
          "firstCoins": 240,
          "firstIron": 10,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": ["SK02"],
          "unlockItems": []
        },
        "authoredXp": 161,
        "teaching": "重甲牵引与远程侧翼，学习破列",
        "enemyHpScale": 1.26,
        "enemyDamageScale": 1.08,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST09",
        "number": 9,
        "name": "护灯过渡",
        "chapter": "二·古渡试炼",
        "description": "护送沿折线路径，抵达后仍清余敌",
        "objective": "escort",
        "world": {
          "width": 1700,
          "height": 2100,
          "spawn": {
            "x": 400,
            "y": 1700
          },
          "obstacles": [{
            "x": 650,
            "y": 1500,
            "width": 400,
            "height": 120
          }, {
            "x": 1050,
            "y": 850,
            "width": 160,
            "height": 250
          }],
          "map": "MAP02"
        },
        "waves": [{
          "id": "ST09-W01",
          "label": "起行开路",
          "groups": [{
            "enemy": "EN01",
            "count": 10,
            "pattern": "north",
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 20
        }, {
          "id": "ST09-W02",
          "label": "首折迎雾",
          "groups": [{
            "enemy": "EN02",
            "count": 8,
            "pattern": "east",
            "hpScale": 1.32,
            "damageScale": 1.1
          }, {
            "enemy": "EN05",
            "count": 2,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 22
        }, {
          "id": "ST09-W03",
          "label": "桥边折镰",
          "groups": [{
            "enemy": "EN04",
            "count": 3,
            "pattern": "flank",
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 9
        }, {
          "id": "ST09-W04",
          "label": "背棘封渡",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "hpScale": 1.32,
            "damageScale": 1.1
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 28
        }, {
          "id": "ST09-W05",
          "label": "慢甲挡路",
          "groups": [{
            "enemy": "EN03",
            "count": 5,
            "pattern": "line",
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST09-W06",
          "label": "灯后追袭",
          "groups": [{
            "enemy": "EN04",
            "count": 4,
            "pattern": "south",
            "hpScale": 1.32,
            "damageScale": 1.1
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST09-W07",
          "label": "渡尽清路",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "corners",
            "hpScale": 1.32,
            "damageScale": 1.1
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.32,
            "damageScale": 1.1
          }],
          "rest": 0,
          "maxSeconds": 98,
          "authoredXp": 32
        }],
        "mechanics": [{
          "kind": "escort",
          "id": "ST09-ESCORT",
          "path": [{
            "x": 350,
            "y": 1700
          }, {
            "x": 350,
            "y": 1300
          }, {
            "x": 850,
            "y": 1300
          }, {
            "x": 850,
            "y": 600
          }, {
            "x": 1350,
            "y": 600
          }],
          "speed": 42,
          "hp": 200,
          "radius": 26
        }],
        "reward": {
          "coins": 285,
          "iron": 8,
          "firstCoins": 260,
          "firstIron": 10,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 150,
        "teaching": "护送沿折线路径，抵达后仍清余敌",
        "enemyHpScale": 1.32,
        "enemyDamageScale": 1.1,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST10",
        "number": 10,
        "name": "渡口星落",
        "chapter": "二·古渡试炼",
        "description": "错峰地圈与星核十字射线，避告后回击",
        "objective": "clear",
        "world": {
          "width": 1700,
          "height": 2000,
          "spawn": {
            "x": 850,
            "y": 1600
          },
          "obstacles": [{
            "x": 430,
            "y": 800,
            "width": 180,
            "height": 180
          }, {
            "x": 1050,
            "y": 1050,
            "width": 180,
            "height": 180
          }],
          "map": "MAP02"
        },
        "waves": [{
          "id": "ST10-W01",
          "label": "双岸清哨",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "flank",
            "hpScale": 1.38,
            "damageScale": 1.12
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "north",
            "delay": 3.0,
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST10-W02",
          "label": "错峰过圈",
          "groups": [{
            "enemy": "EN02",
            "count": 10,
            "pattern": "ring",
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 20
        }, {
          "id": "ST10-W03",
          "label": "甲列逼近",
          "groups": [{
            "enemy": "EN03",
            "count": 5,
            "pattern": "line",
            "hpScale": 1.38,
            "damageScale": 1.12
          }, {
            "enemy": "EN04",
            "count": 2,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST10-W04",
          "label": "落点换侧",
          "groups": [{
            "enemy": "EN05",
            "count": 4,
            "pattern": "west",
            "hpScale": 1.38,
            "damageScale": 1.12
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST10-W05",
          "label": "镰锋横切",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST10-W06",
          "label": "星核前哨",
          "groups": [{
            "enemy": "EN03",
            "count": 4,
            "pattern": "north",
            "hpScale": 1.38,
            "damageScale": 1.12
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST10-W07",
          "label": "玄龟·十字留隙",
          "groups": [{
            "enemy": "BO03",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.38,
            "damageScale": 1.12
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "east",
            "delay": 8.0,
            "hpScale": 1.38,
            "damageScale": 1.12
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 30
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST10-C1",
          "shape": "circle",
          "x": 700,
          "y": 800,
          "period": 10,
          "warning": 1.5,
          "active": 0.7,
          "damage": 8,
          "offset": 0,
          "radius": 120
        }, {
          "kind": "hazard",
          "id": "ST10-C2",
          "shape": "circle",
          "x": 1100,
          "y": 1150,
          "period": 10,
          "warning": 1.5,
          "active": 0.7,
          "damage": 8,
          "offset": 5,
          "radius": 120
        }],
        "reward": {
          "coins": 305,
          "iron": 8,
          "firstCoins": 280,
          "firstIron": 11,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 158,
        "teaching": "错峰地圈与星核十字射线，避告后回击",
        "enemyHpScale": 1.38,
        "enemyDamageScale": 1.12,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST11",
        "number": 11,
        "name": "竹径留隙",
        "chapter": "三·竹影进阶",
        "description": "聚核冲锋首遇，固定锁线后转身",
        "objective": "clear",
        "world": {
          "width": 1700,
          "height": 2200,
          "spawn": {
            "x": 850,
            "y": 1750
          },
          "obstacles": [{
            "x": 500,
            "y": 700,
            "width": 140,
            "height": 500
          }, {
            "x": 1050,
            "y": 1050,
            "width": 140,
            "height": 500
          }],
          "map": "MAP03"
        },
        "waves": [{
          "id": "ST11-W01",
          "label": "空壳聚核",
          "groups": [{
            "enemy": "EN06",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.44,
            "damageScale": 1.14
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 16
        }, {
          "id": "ST11-W02",
          "label": "竹径追雾",
          "groups": [{
            "enemy": "EN02",
            "count": 10,
            "pattern": "west",
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 20
        }, {
          "id": "ST11-W03",
          "label": "交错推核",
          "groups": [{
            "enemy": "EN06",
            "count": 3,
            "pattern": "flank",
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 12
        }, {
          "id": "ST11-W04",
          "label": "甲壳让路",
          "groups": [{
            "enemy": "EN03",
            "count": 5,
            "pattern": "north",
            "hpScale": 1.44,
            "damageScale": 1.14
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST11-W05",
          "label": "背棘夹道",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.44,
            "damageScale": 1.14
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 27
        }, {
          "id": "ST11-W06",
          "label": "折镰空核",
          "groups": [{
            "enemy": "EN04",
            "count": 4,
            "pattern": "west",
            "hpScale": 1.44,
            "damageScale": 1.14
          }, {
            "enemy": "EN06",
            "count": 3,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 24
        }, {
          "id": "ST11-W07",
          "label": "竹径回身",
          "groups": [{
            "enemy": "EN06",
            "count": 4,
            "pattern": "north",
            "hpScale": 1.44,
            "damageScale": 1.14
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.44,
            "damageScale": 1.14
          }],
          "rest": 0,
          "maxSeconds": 94,
          "authoredXp": 32
        }],
        "mechanics": [],
        "reward": {
          "coins": 330,
          "iron": 9,
          "firstCoins": 300,
          "firstIron": 11,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": ["SK05"],
          "unlockItems": []
        },
        "authoredXp": 155,
        "teaching": "聚核冲锋首遇，固定锁线后转身",
        "enemyHpScale": 1.44,
        "enemyDamageScale": 1.14,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST12",
        "number": 12,
        "name": "风口横切",
        "chapter": "三·竹影进阶",
        "description": "两条错相地线中存活135秒，保留安全侧",
        "objective": "survive",
        "world": {
          "width": 1800,
          "height": 2100,
          "spawn": {
            "x": 900,
            "y": 1700
          },
          "obstacles": [{
            "x": 750,
            "y": 800,
            "width": 300,
            "height": 420
          }],
          "map": "MAP03"
        },
        "waves": [{
          "id": "ST12-W01",
          "label": "风口集翼",
          "groups": [{
            "enemy": "EN01",
            "count": 12,
            "pattern": "north",
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 24
        }, {
          "id": "ST12-W02",
          "label": "竹影射线",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST12-W03",
          "label": "两线换位",
          "groups": [{
            "enemy": "EN04",
            "count": 4,
            "pattern": "east",
            "hpScale": 1.5,
            "damageScale": 1.16
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 24
        }, {
          "id": "ST12-W04",
          "label": "重甲慢潮",
          "groups": [{
            "enemy": "EN03",
            "count": 6,
            "pattern": "line",
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 18
        }, {
          "id": "ST12-W05",
          "label": "空核截路",
          "groups": [{
            "enemy": "EN06",
            "count": 4,
            "pattern": "corners",
            "hpScale": 1.5,
            "damageScale": 1.16
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 32
        }, {
          "id": "ST12-W06",
          "label": "追射换侧",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "south",
            "hpScale": 1.5,
            "damageScale": 1.16
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST12-W07",
          "label": "风息仍守",
          "groups": [{
            "enemy": "EN02",
            "count": 12,
            "pattern": "ring",
            "hpScale": 1.5,
            "damageScale": 1.16
          }, {
            "enemy": "EN06",
            "count": 3,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 1.5,
            "damageScale": 1.16
          }],
          "rest": 0,
          "maxSeconds": 100,
          "authoredXp": 36
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST12-L1",
          "shape": "line",
          "x": 900,
          "y": 600,
          "period": 10,
          "warning": 1.5,
          "active": 0.7,
          "damage": 8,
          "offset": 0,
          "width": 1400,
          "height": 70
        }, {
          "kind": "hazard",
          "id": "ST12-L2",
          "shape": "line",
          "x": 900,
          "y": 1400,
          "period": 10,
          "warning": 1.5,
          "active": 0.7,
          "damage": 8,
          "offset": 5,
          "width": 1400,
          "height": 70
        }],
        "reward": {
          "coins": 350,
          "iron": 9,
          "firstCoins": 320,
          "firstIron": 11,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 173,
        "teaching": "两条错相地线中存活135秒，保留安全侧",
        "enemyHpScale": 1.5,
        "enemyDamageScale": 1.16,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。",
        "surviveSeconds": 135
      }, {
        "id": "ST13",
        "number": 13,
        "name": "阵前结伴",
        "chapter": "三·竹影进阶",
        "description": "犀卫精英首遇：集中击破重甲后归营激活新伙伴",
        "objective": "clear",
        "world": {
          "width": 1800,
          "height": 2100,
          "spawn": {
            "x": 900,
            "y": 1700
          },
          "obstacles": [{
            "x": 400,
            "y": 750,
            "width": 200,
            "height": 250
          }, {
            "x": 1200,
            "y": 1050,
            "width": 200,
            "height": 250
          }],
          "map": "MAP03"
        },
        "waves": [{
          "id": "ST13-W01",
          "label": "犀卫独行",
          "groups": [{
            "enemy": "EL01",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 6.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 22
        }, {
          "id": "ST13-W02",
          "label": "甲阵护卫",
          "groups": [{
            "enemy": "EN03",
            "count": 6,
            "pattern": "line",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 30
        }, {
          "id": "ST13-W03",
          "label": "转身破锋",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST13-W04",
          "label": "外圈清蜥",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 100,
          "authoredXp": 35
        }, {
          "id": "ST13-W05",
          "label": "双卫有序",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "flank",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN02",
            "count": 4,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 28
        }, {
          "id": "ST13-W06",
          "label": "空核截尾",
          "groups": [{
            "enemy": "EN06",
            "count": 5,
            "pattern": "west",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 29
        }, {
          "id": "ST13-W07",
          "label": "阵前清障",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 1.58,
            "damageScale": 1.18
          }, {
            "enemy": "EN03",
            "count": 5,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.58,
            "damageScale": 1.18
          }],
          "rest": 0,
          "maxSeconds": 84,
          "authoredXp": 35
        }],
        "mechanics": [],
        "reward": {
          "coins": 370,
          "iron": 10,
          "firstCoins": 340,
          "firstIron": 12,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {
            "CO02": 6
          },
          "unlockSkills": [],
          "unlockItems": ["CO02"]
        },
        "authoredXp": 194,
        "teaching": "犀卫精英首遇：集中击破重甲后归营激活新伙伴",
        "enemyHpScale": 1.58,
        "enemyDamageScale": 1.18,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST14",
        "number": 14,
        "name": "回廊试雷",
        "chapter": "三·竹影进阶",
        "description": "蜘蛛远射首遇，驻圈12秒与优先清侧哨",
        "objective": "beacon",
        "world": {
          "width": 1800,
          "height": 2200,
          "spawn": {
            "x": 900,
            "y": 1800
          },
          "obstacles": [{
            "x": 450,
            "y": 650,
            "width": 180,
            "height": 650
          }, {
            "x": 1170,
            "y": 650,
            "width": 180,
            "height": 650
          }],
          "map": "MAP03"
        },
        "waves": [{
          "id": "ST14-W01",
          "label": "蛛猎蓄射",
          "groups": [{
            "enemy": "EL02",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 6.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 22
        }, {
          "id": "ST14-W02",
          "label": "回廊换边",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 96,
          "authoredXp": 31
        }, {
          "id": "ST14-W03",
          "label": "灯外折镰",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "east",
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST14-W04",
          "label": "重甲压圈",
          "groups": [{
            "enemy": "EN03",
            "count": 6,
            "pattern": "north",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN06",
            "count": 3,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 30
        }, {
          "id": "ST14-W05",
          "label": "远射双哨",
          "groups": [{
            "enemy": "EL02",
            "count": 2,
            "pattern": "flank",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 36
        }, {
          "id": "ST14-W06",
          "label": "离圈引锋",
          "groups": [{
            "enemy": "EN06",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 29
        }, {
          "id": "ST14-W07",
          "label": "驻圈收雷",
          "groups": [{
            "enemy": "EL01",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EL02",
            "count": 1,
            "pattern": "south",
            "hpScale": 1.66,
            "damageScale": 1.2
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 1.66,
            "damageScale": 1.2
          }],
          "rest": 0,
          "maxSeconds": 86,
          "authoredXp": 32
        }],
        "mechanics": [{
          "kind": "beacon",
          "id": "ST14-BEACON",
          "x": 900,
          "y": 900,
          "radius": 110,
          "holdSeconds": 12
        }],
        "reward": {
          "coins": 390,
          "iron": 10,
          "firstCoins": 360,
          "firstIron": 12,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": ["SK10"],
          "unlockItems": []
        },
        "authoredXp": 195,
        "teaching": "蜘蛛远射首遇，驻圈12秒与优先清侧哨",
        "enemyHpScale": 1.66,
        "enemyDamageScale": 1.2,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST15",
        "number": 15,
        "name": "林心羽阵",
        "chapter": "三·竹影进阶",
        "description": "鸦皇猎射首遇，侧切扇面再进入恢复窗",
        "objective": "clear",
        "world": {
          "width": 1900,
          "height": 2200,
          "spawn": {
            "x": 950,
            "y": 1750
          },
          "obstacles": [{
            "x": 500,
            "y": 800,
            "width": 180,
            "height": 180
          }, {
            "x": 1220,
            "y": 1000,
            "width": 180,
            "height": 180
          }],
          "map": "MAP03"
        },
        "waves": [{
          "id": "ST15-W01",
          "label": "林心环翼",
          "groups": [{
            "enemy": "EN01",
            "count": 14,
            "pattern": "ring",
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 28
        }, {
          "id": "ST15-W02",
          "label": "侧哨压线",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST15-W03",
          "label": "甲列换侧",
          "groups": [{
            "enemy": "EN03",
            "count": 7,
            "pattern": "line",
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST15-W04",
          "label": "空核断路",
          "groups": [{
            "enemy": "EN06",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 96,
          "authoredXp": 36
        }, {
          "id": "ST15-W05",
          "label": "蛛猎警戒",
          "groups": [{
            "enemy": "EL02",
            "count": 2,
            "pattern": "north",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 36
        }, {
          "id": "ST15-W06",
          "label": "犀卫开路",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "flank",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 29
        }, {
          "id": "ST15-W07",
          "label": "羽阵前沿",
          "groups": [{
            "enemy": "EN05",
            "count": 5,
            "pattern": "north",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 31
        }, {
          "id": "ST15-W08",
          "label": "鸦皇·斜切猎射",
          "groups": [{
            "enemy": "BO04",
            "count": 1,
            "pattern": "north",
            "hpScale": 1.74,
            "damageScale": 1.23
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "east",
            "delay": 8.0,
            "hpScale": 1.74,
            "damageScale": 1.23
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 36
        }],
        "mechanics": [],
        "reward": {
          "coins": 410,
          "iron": 11,
          "firstCoins": 380,
          "firstIron": 12,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 241,
        "teaching": "鸦皇猎射首遇，侧切扇面再进入恢复窗",
        "enemyHpScale": 1.74,
        "enemyDamageScale": 1.23,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST16",
        "number": 16,
        "name": "粮车穿垒",
        "chapter": "四·残垒交锋",
        "description": "长护送穿双折口，不能只顾追杀",
        "objective": "escort",
        "world": {
          "width": 1900,
          "height": 2300,
          "spawn": {
            "x": 350,
            "y": 1950
          },
          "obstacles": [{
            "x": 900,
            "y": 1700,
            "width": 250,
            "height": 120
          }, {
            "x": 950,
            "y": 900,
            "width": 160,
            "height": 300
          }],
          "map": "MAP04"
        },
        "waves": [{
          "id": "ST16-W01",
          "label": "出垒开路",
          "groups": [{
            "enemy": "EN02",
            "count": 12,
            "pattern": "north",
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 24
        }, {
          "id": "ST16-W02",
          "label": "左口折镰",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "west",
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 15
        }, {
          "id": "ST16-W03",
          "label": "右口背棘",
          "groups": [{
            "enemy": "EN05",
            "count": 6,
            "pattern": "east",
            "hpScale": 1.82,
            "damageScale": 1.26
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 34
        }, {
          "id": "ST16-W04",
          "label": "中途重卫",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 1.82,
            "damageScale": 1.26
          }, {
            "enemy": "EN03",
            "count": 4,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 32
        }, {
          "id": "ST16-W05",
          "label": "空核追车",
          "groups": [{
            "enemy": "EN06",
            "count": 5,
            "pattern": "south",
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 20
        }, {
          "id": "ST16-W06",
          "label": "外侧蛛哨",
          "groups": [{
            "enemy": "EL02",
            "count": 2,
            "pattern": "flank",
            "hpScale": 1.82,
            "damageScale": 1.26
          }, {
            "enemy": "EN02",
            "count": 6,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 32
        }, {
          "id": "ST16-W07",
          "label": "回身解围",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "corners",
            "hpScale": 1.82,
            "damageScale": 1.26
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 4,
          "maxSeconds": 100,
          "authoredXp": 35
        }, {
          "id": "ST16-W08",
          "label": "粮车归垒",
          "groups": [{
            "enemy": "EN03",
            "count": 7,
            "pattern": "line",
            "hpScale": 1.82,
            "damageScale": 1.26
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.82,
            "damageScale": 1.26
          }],
          "rest": 0,
          "maxSeconds": 92,
          "authoredXp": 33
        }],
        "mechanics": [{
          "kind": "escort",
          "id": "ST16-ESCORT",
          "path": [{
            "x": 300,
            "y": 1950
          }, {
            "x": 700,
            "y": 1950
          }, {
            "x": 700,
            "y": 1500
          }, {
            "x": 1250,
            "y": 1500
          }, {
            "x": 1250,
            "y": 700
          }, {
            "x": 1600,
            "y": 700
          }],
          "speed": 44,
          "hp": 240,
          "radius": 26
        }],
        "reward": {
          "coins": 435,
          "iron": 11,
          "firstCoins": 400,
          "firstIron": 13,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 225,
        "teaching": "长护送穿双折口，不能只顾追杀",
        "enemyHpScale": 1.82,
        "enemyDamageScale": 1.26,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST17",
        "number": 17,
        "name": "残墙墨线",
        "chapter": "四·残垒交锋",
        "description": "固定地圈与直线交错，清出可返回的空间",
        "objective": "clear",
        "world": {
          "width": 1800,
          "height": 2200,
          "spawn": {
            "x": 900,
            "y": 1800
          },
          "obstacles": [{
            "x": 350,
            "y": 850,
            "width": 400,
            "height": 140
          }, {
            "x": 1050,
            "y": 1250,
            "width": 400,
            "height": 140
          }],
          "map": "MAP04"
        },
        "waves": [{
          "id": "ST17-W01",
          "label": "残墙集翼",
          "groups": [{
            "enemy": "EN01",
            "count": 14,
            "pattern": "corners",
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 28
        }, {
          "id": "ST17-W02",
          "label": "墨线取侧",
          "groups": [{
            "enemy": "EN04",
            "count": 5,
            "pattern": "flank",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST17-W03",
          "label": "甲后空核",
          "groups": [{
            "enemy": "EN03",
            "count": 6,
            "pattern": "east",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 34
        }, {
          "id": "ST17-W04",
          "label": "侧哨迁阵",
          "groups": [{
            "enemy": "EL02",
            "count": 2,
            "pattern": "south",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 36
        }, {
          "id": "ST17-W05",
          "label": "犀卫临墙",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "west",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 40
        }, {
          "id": "ST17-W06",
          "label": "空核再推",
          "groups": [{
            "enemy": "EN06",
            "count": 6,
            "pattern": "flank",
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 24
        }, {
          "id": "ST17-W07",
          "label": "折镰清场",
          "groups": [{
            "enemy": "EN04",
            "count": 6,
            "pattern": "corners",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST17-W08",
          "label": "墨线留口",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 1.9,
            "damageScale": 1.29
          }, {
            "enemy": "EL02",
            "count": 2,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 1.9,
            "damageScale": 1.29
          }],
          "rest": 0,
          "maxSeconds": 78,
          "authoredXp": 40
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST17-C1",
          "shape": "circle",
          "x": 900,
          "y": 850,
          "period": 11,
          "warning": 1.5,
          "active": 0.7,
          "damage": 9,
          "offset": 0,
          "radius": 125
        }, {
          "kind": "hazard",
          "id": "ST17-L1",
          "shape": "line",
          "x": 900,
          "y": 1150,
          "period": 11,
          "warning": 1.5,
          "active": 0.7,
          "damage": 9,
          "offset": 5.5,
          "width": 1000,
          "height": 75
        }],
        "reward": {
          "coins": 455,
          "iron": 12,
          "firstCoins": 420,
          "firstIron": 13,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": ["SK06"],
          "unlockItems": []
        },
        "authoredXp": 259,
        "teaching": "固定地圈与直线交错，清出可返回的空间",
        "enemyHpScale": 1.9,
        "enemyDamageScale": 1.29,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST18",
        "number": 18,
        "name": "双门裂锋",
        "chapter": "四·残垒交锋",
        "description": "两门错向冲锋与螳王，避免沿预警同向退",
        "objective": "clear",
        "world": {
          "width": 1900,
          "height": 2300,
          "spawn": {
            "x": 950,
            "y": 1900
          },
          "obstacles": [{
            "x": 450,
            "y": 650,
            "width": 180,
            "height": 700
          }, {
            "x": 1270,
            "y": 950,
            "width": 180,
            "height": 700
          }],
          "map": "MAP04"
        },
        "waves": [{
          "id": "ST18-W01",
          "label": "双门慢甲",
          "groups": [{
            "enemy": "EN03",
            "count": 7,
            "pattern": "flank",
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST18-W02",
          "label": "左门来镰",
          "groups": [{
            "enemy": "EN04",
            "count": 6,
            "pattern": "west",
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 18
        }, {
          "id": "ST18-W03",
          "label": "右门飞刺",
          "groups": [{
            "enemy": "EN05",
            "count": 6,
            "pattern": "east",
            "hpScale": 2,
            "damageScale": 1.32
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 102,
          "authoredXp": 38
        }, {
          "id": "ST18-W04",
          "label": "灯核追身",
          "groups": [{
            "enemy": "EN02",
            "count": 14,
            "pattern": "ring",
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 28
        }, {
          "id": "ST18-W05",
          "label": "门前犀卫",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2,
            "damageScale": 1.32
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 36
        }, {
          "id": "ST18-W06",
          "label": "蛛猎卡侧",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "corners",
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 30
        }, {
          "id": "ST18-W07",
          "label": "双门清锋",
          "groups": [{
            "enemy": "EN04",
            "count": 6,
            "pattern": "flank",
            "hpScale": 2,
            "damageScale": 1.32
          }, {
            "enemy": "EN03",
            "count": 4,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST18-W08",
          "label": "螳王·双门扇隙",
          "groups": [{
            "enemy": "BO01",
            "count": 1,
            "pattern": "north",
            "hpScale": 2,
            "damageScale": 1.32
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "south",
            "delay": 8.0,
            "hpScale": 2,
            "damageScale": 1.32
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 21
        }],
        "mechanics": [],
        "reward": {
          "coins": 475,
          "iron": 12,
          "firstCoins": 440,
          "firstIron": 13,
          "equipmentPool": ["EQ01", "EQ02"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 222,
        "teaching": "两门错向冲锋与螳王，避免沿预警同向退",
        "enemyHpScale": 2,
        "enemyDamageScale": 1.32,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST19",
        "number": 19,
        "name": "铁门取玉",
        "chapter": "四·残垒交锋",
        "description": "重甲逼圈14秒驻守，先转场清远射",
        "objective": "beacon",
        "world": {
          "width": 1900,
          "height": 2300,
          "spawn": {
            "x": 950,
            "y": 1900
          },
          "obstacles": [{
            "x": 450,
            "y": 900,
            "width": 280,
            "height": 180
          }, {
            "x": 1170,
            "y": 900,
            "width": 280,
            "height": 180
          }],
          "map": "MAP04"
        },
        "waves": [{
          "id": "ST19-W01",
          "label": "铁门成列",
          "groups": [{
            "enemy": "EN03",
            "count": 8,
            "pattern": "line",
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST19-W02",
          "label": "圈外来翼",
          "groups": [{
            "enemy": "EN01",
            "count": 16,
            "pattern": "corners",
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 102,
          "authoredXp": 32
        }, {
          "id": "ST19-W03",
          "label": "侧哨卡位",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "flank",
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 76,
          "authoredXp": 30
        }, {
          "id": "ST19-W04",
          "label": "犀卫压圈",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.1,
            "damageScale": 1.35
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 36
        }, {
          "id": "ST19-W05",
          "label": "折镰离圈",
          "groups": [{
            "enemy": "EN04",
            "count": 6,
            "pattern": "east",
            "hpScale": 2.1,
            "damageScale": 1.35
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST19-W06",
          "label": "空核扰阵",
          "groups": [{
            "enemy": "EN06",
            "count": 6,
            "pattern": "ring",
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 24
        }, {
          "id": "ST19-W07",
          "label": "铁门再开",
          "groups": [{
            "enemy": "EN03",
            "count": 8,
            "pattern": "line",
            "hpScale": 2.1,
            "damageScale": 1.35
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 4.0,
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 36
        }, {
          "id": "ST19-W08",
          "label": "取玉收灯",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "corners",
            "hpScale": 2.1,
            "damageScale": 1.35
          }, {
            "enemy": "EN04",
            "count": 4,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 2.1,
            "damageScale": 1.35
          }],
          "rest": 0,
          "maxSeconds": 84,
          "authoredXp": 42
        }],
        "mechanics": [{
          "kind": "beacon",
          "id": "ST19-BEACON",
          "x": 950,
          "y": 900,
          "radius": 110,
          "holdSeconds": 14
        }],
        "reward": {
          "coins": 495,
          "iron": 13,
          "firstCoins": 460,
          "firstIron": 14,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {
            "EQ03": 6
          },
          "unlockSkills": [],
          "unlockItems": ["EQ03"]
        },
        "authoredXp": 254,
        "teaching": "重甲逼圈14秒驻守，先转场清远射",
        "enemyHpScale": 2.1,
        "enemyDamageScale": 1.35,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST20",
        "number": 20,
        "name": "余烬长守",
        "chapter": "四·残垒交锋",
        "description": "存活150秒，错峰地圈不能重占旧阵地",
        "objective": "survive",
        "world": {
          "width": 1900,
          "height": 2400,
          "spawn": {
            "x": 950,
            "y": 1950
          },
          "obstacles": [{
            "x": 450,
            "y": 700,
            "width": 240,
            "height": 240
          }, {
            "x": 1210,
            "y": 1200,
            "width": 240,
            "height": 240
          }],
          "map": "MAP04"
        },
        "waves": [{
          "id": "ST20-W01",
          "label": "余烬追影",
          "groups": [{
            "enemy": "EN02",
            "count": 14,
            "pattern": "north",
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 28
        }, {
          "id": "ST20-W02",
          "label": "弩蜥两翼",
          "groups": [{
            "enemy": "EN05",
            "count": 7,
            "pattern": "flank",
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST20-W03",
          "label": "聚核迁阵",
          "groups": [{
            "enemy": "EN06",
            "count": 6,
            "pattern": "corners",
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 24
        }, {
          "id": "ST20-W04",
          "label": "犀卫慢压",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "line",
            "hpScale": 2.2,
            "damageScale": 1.38
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 96,
          "authoredXp": 50
        }, {
          "id": "ST20-W05",
          "label": "蛛哨截侧",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "flank",
            "hpScale": 2.2,
            "damageScale": 1.38
          }, {
            "enemy": "EN04",
            "count": 4,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 42
        }, {
          "id": "ST20-W06",
          "label": "铁背围场",
          "groups": [{
            "enemy": "EN03",
            "count": 9,
            "pattern": "ring",
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST20-W07",
          "label": "折镰成阵",
          "groups": [{
            "enemy": "EN04",
            "count": 7,
            "pattern": "corners",
            "hpScale": 2.2,
            "damageScale": 1.38
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST20-W08",
          "label": "守至烬息",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.2,
            "damageScale": 1.38
          }, {
            "enemy": "EL02",
            "count": 2,
            "pattern": "south",
            "hpScale": 2.2,
            "damageScale": 1.38
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 2.2,
            "damageScale": 1.38
          }],
          "rest": 0,
          "maxSeconds": 86,
          "authoredXp": 56
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST20-C1",
          "shape": "circle",
          "x": 650,
          "y": 900,
          "period": 12,
          "warning": 1.5,
          "active": 0.7,
          "damage": 10,
          "offset": 0,
          "radius": 140
        }, {
          "kind": "hazard",
          "id": "ST20-C2",
          "shape": "circle",
          "x": 1250,
          "y": 1200,
          "period": 12,
          "warning": 1.5,
          "active": 0.7,
          "damage": 10,
          "offset": 4,
          "radius": 140
        }, {
          "kind": "hazard",
          "id": "ST20-C3",
          "shape": "circle",
          "x": 950,
          "y": 1550,
          "period": 12,
          "warning": 1.5,
          "active": 0.7,
          "damage": 10,
          "offset": 8,
          "radius": 140
        }],
        "reward": {
          "coins": 515,
          "iron": 13,
          "firstCoins": 480,
          "firstIron": 14,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 281,
        "teaching": "存活150秒，错峰地圈不能重占旧阵地",
        "enemyHpScale": 2.2,
        "enemyDamageScale": 1.38,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。",
        "surviveSeconds": 150
      }, {
        "id": "ST21",
        "number": 21,
        "name": "孤城破围",
        "chapter": "五·孤城破围",
        "description": "近圈撤出与远哨切侧组合，避免躲一招吃另一招",
        "objective": "clear",
        "world": {
          "width": 1900,
          "height": 2300,
          "spawn": {
            "x": 950,
            "y": 1900
          },
          "obstacles": [{
            "x": 400,
            "y": 650,
            "width": 160,
            "height": 600
          }, {
            "x": 1340,
            "y": 1050,
            "width": 160,
            "height": 600
          }],
          "map": "MAP05"
        },
        "waves": [{
          "id": "ST21-W01",
          "label": "城外环翼",
          "groups": [{
            "enemy": "EN01",
            "count": 18,
            "pattern": "ring",
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 106,
          "authoredXp": 36
        }, {
          "id": "ST21-W02",
          "label": "重甲进巷",
          "groups": [{
            "enemy": "EN03",
            "count": 9,
            "pattern": "line",
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST21-W03",
          "label": "双哨换侧",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "flank",
            "hpScale": 2.3,
            "damageScale": 1.42
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 42
        }, {
          "id": "ST21-W04",
          "label": "聚核追尾",
          "groups": [{
            "enemy": "EN06",
            "count": 7,
            "pattern": "south",
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 28
        }, {
          "id": "ST21-W05",
          "label": "犀卫压门",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 2.3,
            "damageScale": 1.42
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 46
        }, {
          "id": "ST21-W06",
          "label": "折镰开隙",
          "groups": [{
            "enemy": "EN04",
            "count": 7,
            "pattern": "corners",
            "hpScale": 2.3,
            "damageScale": 1.42
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 100,
          "authoredXp": 37
        }, {
          "id": "ST21-W07",
          "label": "城门净路",
          "groups": [{
            "enemy": "EN05",
            "count": 6,
            "pattern": "flank",
            "hpScale": 2.3,
            "damageScale": 1.42
          }, {
            "enemy": "EN03",
            "count": 5,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST21-W08",
          "label": "獠兽·圈外回身",
          "groups": [{
            "enemy": "BO02",
            "count": 1,
            "pattern": "north",
            "hpScale": 2.3,
            "damageScale": 1.42
          }, {
            "enemy": "EL02",
            "count": 1,
            "pattern": "south",
            "delay": 8.0,
            "hpScale": 2.3,
            "damageScale": 1.42
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 26
        }],
        "mechanics": [],
        "reward": {
          "coins": 540,
          "iron": 14,
          "firstCoins": 500,
          "firstIron": 14,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": ["SK11"],
          "unlockItems": []
        },
        "authoredXp": 275,
        "teaching": "近圈撤出与远哨切侧组合，避免躲一招吃另一招",
        "enemyHpScale": 2.3,
        "enemyDamageScale": 1.42,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST22",
        "number": 22,
        "name": "巷尾取势",
        "chapter": "五·孤城破围",
        "description": "16秒驻圈考核，狭巷留两条逃路",
        "objective": "beacon",
        "world": {
          "width": 1800,
          "height": 2200,
          "spawn": {
            "x": 900,
            "y": 1800
          },
          "obstacles": [{
            "x": 350,
            "y": 600,
            "width": 240,
            "height": 850
          }, {
            "x": 1210,
            "y": 600,
            "width": 240,
            "height": 850
          }],
          "map": "MAP05"
        },
        "waves": [{
          "id": "ST22-W01",
          "label": "巷口轻翼",
          "groups": [{
            "enemy": "EN01",
            "count": 18,
            "pattern": "north",
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 106,
          "authoredXp": 36
        }, {
          "id": "ST22-W02",
          "label": "左巷蛛猎",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "west",
            "hpScale": 2.4,
            "damageScale": 1.46
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "east",
            "delay": 4.0,
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 46
        }, {
          "id": "ST22-W03",
          "label": "右巷折镰",
          "groups": [{
            "enemy": "EN04",
            "count": 7,
            "pattern": "east",
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 21
        }, {
          "id": "ST22-W04",
          "label": "灯前犀卫",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 2.4,
            "damageScale": 1.46
          }, {
            "enemy": "EN03",
            "count": 5,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 45
        }, {
          "id": "ST22-W05",
          "label": "巷尾聚核",
          "groups": [{
            "enemy": "EN06",
            "count": 7,
            "pattern": "flank",
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 28
        }, {
          "id": "ST22-W06",
          "label": "弩蜥封侧",
          "groups": [{
            "enemy": "EN05",
            "count": 8,
            "pattern": "corners",
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST22-W07",
          "label": "两巷换路",
          "groups": [{
            "enemy": "EN04",
            "count": 6,
            "pattern": "west",
            "hpScale": 2.4,
            "damageScale": 1.46
          }, {
            "enemy": "EN05",
            "count": 5,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST22-W08",
          "label": "取势收阵",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.4,
            "damageScale": 1.46
          }, {
            "enemy": "EL02",
            "count": 3,
            "pattern": "south",
            "hpScale": 2.4,
            "damageScale": 1.46
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 2.4,
            "damageScale": 1.46
          }],
          "rest": 0,
          "maxSeconds": 96,
          "authoredXp": 66
        }],
        "mechanics": [{
          "kind": "beacon",
          "id": "ST22-BEACON",
          "x": 900,
          "y": 900,
          "radius": 110,
          "holdSeconds": 16
        }],
        "reward": {
          "coins": 560,
          "iron": 14,
          "firstCoins": 520,
          "firstIron": 15,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 299,
        "teaching": "16秒驻圈考核，狭巷留两条逃路",
        "enemyHpScale": 2.4,
        "enemyDamageScale": 1.46,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST23",
        "number": 23,
        "name": "护碑出城",
        "chapter": "五·孤城破围",
        "description": "长路径护送与双远哨，先清威胁而非只追最近",
        "objective": "escort",
        "world": {
          "width": 2000,
          "height": 2500,
          "spawn": {
            "x": 400,
            "y": 2100
          },
          "obstacles": [{
            "x": 650,
            "y": 1100,
            "width": 160,
            "height": 300
          }, {
            "x": 1300,
            "y": 1200,
            "width": 160,
            "height": 300
          }],
          "map": "MAP05"
        },
        "waves": [{
          "id": "ST23-W01",
          "label": "出城迎翼",
          "groups": [{
            "enemy": "EN01",
            "count": 18,
            "pattern": "north",
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 106,
          "authoredXp": 36
        }, {
          "id": "ST23-W02",
          "label": "碑前慢甲",
          "groups": [{
            "enemy": "EN03",
            "count": 9,
            "pattern": "line",
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST23-W03",
          "label": "侧岸飞刺",
          "groups": [{
            "enemy": "EN05",
            "count": 7,
            "pattern": "flank",
            "hpScale": 2.52,
            "damageScale": 1.5
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "south",
            "delay": 4.0,
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 100,
          "authoredXp": 37
        }, {
          "id": "ST23-W04",
          "label": "碑后聚核",
          "groups": [{
            "enemy": "EN06",
            "count": 7,
            "pattern": "south",
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 28
        }, {
          "id": "ST23-W05",
          "label": "守门犀卫",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 2.52,
            "damageScale": 1.5
          }, {
            "enemy": "EN04",
            "count": 4,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 42
        }, {
          "id": "ST23-W06",
          "label": "城外蛛哨",
          "groups": [{
            "enemy": "EL02",
            "count": 4,
            "pattern": "corners",
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 40
        }, {
          "id": "ST23-W07",
          "label": "回身护碑",
          "groups": [{
            "enemy": "EN04",
            "count": 7,
            "pattern": "south",
            "hpScale": 2.52,
            "damageScale": 1.5
          }, {
            "enemy": "EN01",
            "count": 10,
            "pattern": "west",
            "delay": 4.0,
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 4,
          "maxSeconds": 104,
          "authoredXp": 41
        }, {
          "id": "ST23-W08",
          "label": "归路清空",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.52,
            "damageScale": 1.5
          }, {
            "enemy": "EN05",
            "count": 6,
            "pattern": "flank",
            "delay": 5.0,
            "hpScale": 2.52,
            "damageScale": 1.5
          }],
          "rest": 0,
          "maxSeconds": 86,
          "authoredXp": 38
        }],
        "mechanics": [{
          "kind": "escort",
          "id": "ST23-ESCORT",
          "path": [{
            "x": 350,
            "y": 2100
          }, {
            "x": 350,
            "y": 1600
          }, {
            "x": 1000,
            "y": 1600
          }, {
            "x": 1000,
            "y": 850
          }, {
            "x": 1650,
            "y": 850
          }],
          "speed": 44,
          "hp": 280,
          "radius": 26
        }],
        "reward": {
          "coins": 580,
          "iron": 15,
          "firstCoins": 540,
          "firstIron": 15,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 289,
        "teaching": "长路径护送与双远哨，先清威胁而非只追最近",
        "enemyHpScale": 2.52,
        "enemyDamageScale": 1.5,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST24",
        "number": 24,
        "name": "城门星核",
        "chapter": "五·孤城破围",
        "description": "星核十字与定点地圈同场，先识固定落点",
        "objective": "clear",
        "world": {
          "width": 2000,
          "height": 2400,
          "spawn": {
            "x": 1000,
            "y": 2000
          },
          "obstacles": [{
            "x": 500,
            "y": 800,
            "width": 200,
            "height": 200
          }, {
            "x": 1300,
            "y": 1200,
            "width": 200,
            "height": 200
          }],
          "map": "MAP05"
        },
        "waves": [{
          "id": "ST24-W01",
          "label": "城门飞翼",
          "groups": [{
            "enemy": "EN01",
            "count": 20,
            "pattern": "ring",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 40
        }, {
          "id": "ST24-W02",
          "label": "铁甲前阵",
          "groups": [{
            "enemy": "EN03",
            "count": 10,
            "pattern": "line",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST24-W03",
          "label": "三瞳探侧",
          "groups": [{
            "enemy": "EL02",
            "count": 4,
            "pattern": "flank",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 40
        }, {
          "id": "ST24-W04",
          "label": "折镰回身",
          "groups": [{
            "enemy": "EN04",
            "count": 8,
            "pattern": "corners",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST24-W05",
          "label": "弩蜥封路",
          "groups": [{
            "enemy": "EN05",
            "count": 8,
            "pattern": "north",
            "hpScale": 2.64,
            "damageScale": 1.54
          }, {
            "enemy": "EN02",
            "count": 8,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 102,
          "authoredXp": 40
        }, {
          "id": "ST24-W06",
          "label": "空核断尾",
          "groups": [{
            "enemy": "EN06",
            "count": 8,
            "pattern": "flank",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 32
        }, {
          "id": "ST24-W07",
          "label": "犀卫临门",
          "groups": [{
            "enemy": "EL01",
            "count": 4,
            "pattern": "north",
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 40
        }, {
          "id": "ST24-W08",
          "label": "星前换位",
          "groups": [{
            "enemy": "EL02",
            "count": 2,
            "pattern": "east",
            "hpScale": 2.64,
            "damageScale": 1.54
          }, {
            "enemy": "EN04",
            "count": 5,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 35
        }, {
          "id": "ST24-W09",
          "label": "玄龟·城门十字",
          "groups": [{
            "enemy": "BO03",
            "count": 1,
            "pattern": "north",
            "hpScale": 2.64,
            "damageScale": 1.54
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "south",
            "delay": 9.0,
            "hpScale": 2.64,
            "damageScale": 1.54
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 27
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST24-C1",
          "shape": "circle",
          "x": 1000,
          "y": 800,
          "period": 11,
          "warning": 1.5,
          "active": 0.7,
          "damage": 10,
          "offset": 0,
          "radius": 150
        }, {
          "kind": "hazard",
          "id": "ST24-C2",
          "shape": "circle",
          "x": 1000,
          "y": 1400,
          "period": 11,
          "warning": 1.5,
          "active": 0.7,
          "damage": 10,
          "offset": 5.5,
          "radius": 150
        }],
        "reward": {
          "coins": 600,
          "iron": 15,
          "firstCoins": 560,
          "firstIron": 15,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 308,
        "teaching": "星核十字与定点地圈同场，先识固定落点",
        "enemyHpScale": 2.64,
        "enemyDamageScale": 1.54,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST25",
        "number": 25,
        "name": "四路青刺",
        "chapter": "五·孤城破围",
        "description": "四向来敌中做优先级，收齐最后账号技能池",
        "objective": "clear",
        "world": {
          "width": 2000,
          "height": 2400,
          "spawn": {
            "x": 1000,
            "y": 2000
          },
          "obstacles": [{
            "x": 400,
            "y": 800,
            "width": 150,
            "height": 150
          }, {
            "x": 1450,
            "y": 800,
            "width": 150,
            "height": 150
          }, {
            "x": 400,
            "y": 1600,
            "width": 150,
            "height": 150
          }, {
            "x": 1450,
            "y": 1600,
            "width": 150,
            "height": 150
          }],
          "map": "MAP05"
        },
        "waves": [{
          "id": "ST25-W01",
          "label": "四路展翼",
          "groups": [{
            "enemy": "EN01",
            "count": 20,
            "pattern": "corners",
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 40
        }, {
          "id": "ST25-W02",
          "label": "雾灯缓压",
          "groups": [{
            "enemy": "EN02",
            "count": 18,
            "pattern": "ring",
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 106,
          "authoredXp": 36
        }, {
          "id": "ST25-W03",
          "label": "左右弩阵",
          "groups": [{
            "enemy": "EN05",
            "count": 8,
            "pattern": "flank",
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST25-W04",
          "label": "重甲中路",
          "groups": [{
            "enemy": "EN03",
            "count": 10,
            "pattern": "line",
            "hpScale": 2.76,
            "damageScale": 1.58
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 102,
          "authoredXp": 42
        }, {
          "id": "ST25-W05",
          "label": "聚核切背",
          "groups": [{
            "enemy": "EN06",
            "count": 8,
            "pattern": "south",
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 32
        }, {
          "id": "ST25-W06",
          "label": "镰锋换位",
          "groups": [{
            "enemy": "EN04",
            "count": 8,
            "pattern": "corners",
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 24
        }, {
          "id": "ST25-W07",
          "label": "双精英分责",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.76,
            "damageScale": 1.58
          }, {
            "enemy": "EL02",
            "count": 3,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 50
        }, {
          "id": "ST25-W08",
          "label": "远近追珠",
          "groups": [{
            "enemy": "EN05",
            "count": 6,
            "pattern": "east",
            "hpScale": 2.76,
            "damageScale": 1.58
          }, {
            "enemy": "EN04",
            "count": 6,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 36
        }, {
          "id": "ST25-W09",
          "label": "四路合考",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "corners",
            "hpScale": 2.76,
            "damageScale": 1.58
          }, {
            "enemy": "EN06",
            "count": 5,
            "pattern": "north",
            "hpScale": 2.76,
            "damageScale": 1.58
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 6.0,
            "hpScale": 2.76,
            "damageScale": 1.58
          }],
          "rest": 0,
          "maxSeconds": 102,
          "authoredXp": 66
        }],
        "mechanics": [],
        "reward": {
          "coins": 620,
          "iron": 16,
          "firstCoins": 580,
          "firstIron": 16,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": ["SK12"],
          "unlockItems": []
        },
        "authoredXp": 350,
        "teaching": "四向来敌中做优先级，收齐最后账号技能池",
        "enemyHpScale": 2.76,
        "enemyDamageScale": 1.58,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST26",
        "number": 26,
        "name": "归墟逆流",
        "chapter": "六·归墟终阵",
        "description": "存活165秒，三条错相危险区逐次让路",
        "objective": "survive",
        "world": {
          "width": 2000,
          "height": 2500,
          "spawn": {
            "x": 1000,
            "y": 2100
          },
          "obstacles": [{
            "x": 500,
            "y": 1000,
            "width": 220,
            "height": 220
          }, {
            "x": 1280,
            "y": 1450,
            "width": 220,
            "height": 220
          }],
          "map": "MAP06"
        },
        "waves": [{
          "id": "ST26-W01",
          "label": "逆流追翼",
          "groups": [{
            "enemy": "EN01",
            "count": 22,
            "pattern": "north",
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 114,
          "authoredXp": 44
        }, {
          "id": "ST26-W02",
          "label": "铁甲推潮",
          "groups": [{
            "enemy": "EN03",
            "count": 11,
            "pattern": "line",
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST26-W03",
          "label": "侧岸蛛猎",
          "groups": [{
            "enemy": "EL02",
            "count": 4,
            "pattern": "flank",
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 40
        }, {
          "id": "ST26-W04",
          "label": "空核断流",
          "groups": [{
            "enemy": "EN06",
            "count": 8,
            "pattern": "corners",
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 32
        }, {
          "id": "ST26-W05",
          "label": "雾灯遮侧",
          "groups": [{
            "enemy": "EN02",
            "count": 18,
            "pattern": "south",
            "hpScale": 2.9,
            "damageScale": 1.63
          }, {
            "enemy": "EN05",
            "count": 5,
            "pattern": "north",
            "delay": 5.0,
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 116,
          "authoredXp": 51
        }, {
          "id": "ST26-W06",
          "label": "镰锋迁阵",
          "groups": [{
            "enemy": "EN04",
            "count": 9,
            "pattern": "flank",
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST26-W07",
          "label": "犀卫临渊",
          "groups": [{
            "enemy": "EL01",
            "count": 4,
            "pattern": "north",
            "hpScale": 2.9,
            "damageScale": 1.63
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 6.0,
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 56
        }, {
          "id": "ST26-W08",
          "label": "追射换路",
          "groups": [{
            "enemy": "EN05",
            "count": 8,
            "pattern": "corners",
            "hpScale": 2.9,
            "damageScale": 1.63
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 40
        }, {
          "id": "ST26-W09",
          "label": "逆流终守",
          "groups": [{
            "enemy": "EL01",
            "count": 2,
            "pattern": "north",
            "hpScale": 2.9,
            "damageScale": 1.63
          }, {
            "enemy": "EL02",
            "count": 3,
            "pattern": "south",
            "hpScale": 2.9,
            "damageScale": 1.63
          }, {
            "enemy": "EN04",
            "count": 5,
            "pattern": "west",
            "delay": 6.0,
            "hpScale": 2.9,
            "damageScale": 1.63
          }],
          "rest": 0,
          "maxSeconds": 90,
          "authoredXp": 65
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST26-L1",
          "shape": "line",
          "x": 1000,
          "y": 800,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 11,
          "offset": 0,
          "width": 1500,
          "height": 80
        }, {
          "kind": "hazard",
          "id": "ST26-L2",
          "shape": "line",
          "x": 1000,
          "y": 1200,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 11,
          "offset": 5,
          "width": 1500,
          "height": 80
        }, {
          "kind": "hazard",
          "id": "ST26-L3",
          "shape": "line",
          "x": 1000,
          "y": 1600,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 11,
          "offset": 10,
          "width": 1500,
          "height": 80
        }],
        "reward": {
          "coins": 645,
          "iron": 16,
          "firstCoins": 600,
          "firstIron": 16,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 388,
        "teaching": "存活165秒，三条错相危险区逐次让路",
        "enemyHpScale": 2.9,
        "enemyDamageScale": 1.63,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。",
        "surviveSeconds": 165
      }, {
        "id": "ST27",
        "number": 27,
        "name": "双环逐鸦",
        "chapter": "六·归墟终阵",
        "description": "交错圆区留出口，鸦皇猎射时继续侧切",
        "objective": "clear",
        "world": {
          "width": 2000,
          "height": 2500,
          "spawn": {
            "x": 1000,
            "y": 2100
          },
          "obstacles": [{
            "x": 450,
            "y": 900,
            "width": 180,
            "height": 500
          }, {
            "x": 1370,
            "y": 1300,
            "width": 180,
            "height": 500
          }],
          "map": "MAP06"
        },
        "waves": [{
          "id": "ST27-W01",
          "label": "环外来翼",
          "groups": [{
            "enemy": "EN01",
            "count": 22,
            "pattern": "ring",
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 114,
          "authoredXp": 44
        }, {
          "id": "ST27-W02",
          "label": "雾灯占环",
          "groups": [{
            "enemy": "EN02",
            "count": 20,
            "pattern": "flank",
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 40
        }, {
          "id": "ST27-W03",
          "label": "弩蜥两岸",
          "groups": [{
            "enemy": "EN05",
            "count": 9,
            "pattern": "corners",
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST27-W04",
          "label": "铁甲缓进",
          "groups": [{
            "enemy": "EN03",
            "count": 11,
            "pattern": "line",
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST27-W05",
          "label": "聚核跨环",
          "groups": [{
            "enemy": "EN06",
            "count": 9,
            "pattern": "flank",
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 36
        }, {
          "id": "ST27-W06",
          "label": "蛛猎远压",
          "groups": [{
            "enemy": "EL02",
            "count": 4,
            "pattern": "north",
            "hpScale": 3.04,
            "damageScale": 1.68
          }, {
            "enemy": "EN04",
            "count": 4,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 52
        }, {
          "id": "ST27-W07",
          "label": "犀卫推线",
          "groups": [{
            "enemy": "EL01",
            "count": 4,
            "pattern": "east",
            "hpScale": 3.04,
            "damageScale": 1.68
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 56
        }, {
          "id": "ST27-W08",
          "label": "环前清哨",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "west",
            "hpScale": 3.04,
            "damageScale": 1.68
          }, {
            "enemy": "EN05",
            "count": 5,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 45
        }, {
          "id": "ST27-W09",
          "label": "鸦皇·环隙猎射",
          "groups": [{
            "enemy": "BO04",
            "count": 1,
            "pattern": "north",
            "hpScale": 3.04,
            "damageScale": 1.68
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "south",
            "delay": 9.0,
            "hpScale": 3.04,
            "damageScale": 1.68
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 29
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST27-C1",
          "shape": "circle",
          "x": 850,
          "y": 1100,
          "period": 12,
          "warning": 1.5,
          "active": 0.7,
          "damage": 11,
          "offset": 0,
          "radius": 170
        }, {
          "kind": "hazard",
          "id": "ST27-C2",
          "shape": "circle",
          "x": 1150,
          "y": 1500,
          "period": 12,
          "warning": 1.5,
          "active": 0.7,
          "damage": 11,
          "offset": 6,
          "radius": 170
        }],
        "reward": {
          "coins": 665,
          "iron": 17,
          "firstCoins": 620,
          "firstIron": 16,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 362,
        "teaching": "交错圆区留出口，鸦皇猎射时继续侧切",
        "enemyHpScale": 3.04,
        "enemyDamageScale": 1.68,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST28",
        "number": 28,
        "name": "归碑远行",
        "chapter": "六·归墟终阵",
        "description": "终段护送，来敌换侧时保持碑周安全",
        "objective": "escort",
        "world": {
          "width": 2100,
          "height": 2600,
          "spawn": {
            "x": 400,
            "y": 2200
          },
          "obstacles": [{
            "x": 700,
            "y": 1100,
            "width": 160,
            "height": 300
          }, {
            "x": 1400,
            "y": 1850,
            "width": 160,
            "height": 300
          }],
          "map": "MAP06"
        },
        "waves": [{
          "id": "ST28-W01",
          "label": "启程归碑",
          "groups": [{
            "enemy": "EN02",
            "count": 20,
            "pattern": "north",
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 40
        }, {
          "id": "ST28-W02",
          "label": "铁甲门列",
          "groups": [{
            "enemy": "EN03",
            "count": 11,
            "pattern": "line",
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 92,
          "authoredXp": 33
        }, {
          "id": "ST28-W03",
          "label": "蛛哨侧射",
          "groups": [{
            "enemy": "EL02",
            "count": 4,
            "pattern": "flank",
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 78,
          "authoredXp": 40
        }, {
          "id": "ST28-W04",
          "label": "聚核追碑",
          "groups": [{
            "enemy": "EN06",
            "count": 9,
            "pattern": "south",
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 36
        }, {
          "id": "ST28-W05",
          "label": "折镰围行",
          "groups": [{
            "enemy": "EN04",
            "count": 9,
            "pattern": "corners",
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 88,
          "authoredXp": 27
        }, {
          "id": "ST28-W06",
          "label": "飞刺换岸",
          "groups": [{
            "enemy": "EN05",
            "count": 9,
            "pattern": "east",
            "hpScale": 3.18,
            "damageScale": 1.73
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "west",
            "delay": 5.0,
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 104,
          "authoredXp": 43
        }, {
          "id": "ST28-W07",
          "label": "犀卫拦程",
          "groups": [{
            "enemy": "EL01",
            "count": 4,
            "pattern": "north",
            "hpScale": 3.18,
            "damageScale": 1.73
          }, {
            "enemy": "EN06",
            "count": 3,
            "pattern": "south",
            "delay": 6.0,
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 84,
          "authoredXp": 52
        }, {
          "id": "ST28-W08",
          "label": "回身清哨",
          "groups": [{
            "enemy": "EL02",
            "count": 3,
            "pattern": "west",
            "hpScale": 3.18,
            "damageScale": 1.73
          }, {
            "enemy": "EN04",
            "count": 5,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 4,
          "maxSeconds": 86,
          "authoredXp": 45
        }, {
          "id": "ST28-W09",
          "label": "碑归净路",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 3.18,
            "damageScale": 1.73
          }, {
            "enemy": "EN05",
            "count": 6,
            "pattern": "south",
            "hpScale": 3.18,
            "damageScale": 1.73
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "east",
            "delay": 6.0,
            "hpScale": 3.18,
            "damageScale": 1.73
          }],
          "rest": 0,
          "maxSeconds": 104,
          "authoredXp": 64
        }],
        "mechanics": [{
          "kind": "escort",
          "id": "ST28-ESCORT",
          "path": [{
            "x": 350,
            "y": 2200
          }, {
            "x": 350,
            "y": 1700
          }, {
            "x": 1050,
            "y": 1700
          }, {
            "x": 1050,
            "y": 1000
          }, {
            "x": 1750,
            "y": 1000
          }, {
            "x": 1750,
            "y": 500
          }],
          "speed": 46,
          "hp": 320,
          "radius": 26
        }],
        "reward": {
          "coins": 685,
          "iron": 17,
          "firstCoins": 640,
          "firstIron": 17,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 380,
        "teaching": "终段护送，来敌换侧时保持碑周安全",
        "enemyHpScale": 3.18,
        "enemyDamageScale": 1.73,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST29",
        "number": 29,
        "name": "终阵守炬",
        "chapter": "六·归墟终阵",
        "description": "驻圈20秒与三段错相预警，不以强站吃伤完成",
        "objective": "beacon",
        "world": {
          "width": 2100,
          "height": 2600,
          "spawn": {
            "x": 1050,
            "y": 2200
          },
          "obstacles": [{
            "x": 450,
            "y": 850,
            "width": 200,
            "height": 650
          }, {
            "x": 1450,
            "y": 850,
            "width": 200,
            "height": 650
          }],
          "map": "MAP06"
        },
        "waves": [{
          "id": "ST29-W01",
          "label": "炬外集翼",
          "groups": [{
            "enemy": "EN01",
            "count": 24,
            "pattern": "ring",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 118,
          "authoredXp": 48
        }, {
          "id": "ST29-W02",
          "label": "雾墙转场",
          "groups": [{
            "enemy": "EN02",
            "count": 20,
            "pattern": "flank",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 40
        }, {
          "id": "ST29-W03",
          "label": "折镰断路",
          "groups": [{
            "enemy": "EN04",
            "count": 10,
            "pattern": "corners",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST29-W04",
          "label": "铁背长列",
          "groups": [{
            "enemy": "EN03",
            "count": 12,
            "pattern": "line",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 36
        }, {
          "id": "ST29-W05",
          "label": "弩蜥封边",
          "groups": [{
            "enemy": "EN05",
            "count": 10,
            "pattern": "flank",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST29-W06",
          "label": "聚核推阵",
          "groups": [{
            "enemy": "EN06",
            "count": 10,
            "pattern": "south",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 40
        }, {
          "id": "ST29-W07",
          "label": "犀卫临炬",
          "groups": [{
            "enemy": "EL01",
            "count": 4,
            "pattern": "north",
            "hpScale": 3.34,
            "damageScale": 1.79
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "east",
            "delay": 6.0,
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 56
        }, {
          "id": "ST29-W08",
          "label": "蛛猎卡口",
          "groups": [{
            "enemy": "EL02",
            "count": 5,
            "pattern": "corners",
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 80,
          "authoredXp": 50
        }, {
          "id": "ST29-W09",
          "label": "远近交锋",
          "groups": [{
            "enemy": "EN04",
            "count": 7,
            "pattern": "west",
            "hpScale": 3.34,
            "damageScale": 1.79
          }, {
            "enemy": "EN05",
            "count": 7,
            "pattern": "east",
            "delay": 5.0,
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 4,
          "maxSeconds": 98,
          "authoredXp": 42
        }, {
          "id": "ST29-W10",
          "label": "终阵归灯",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 3.34,
            "damageScale": 1.79
          }, {
            "enemy": "EL02",
            "count": 3,
            "pattern": "south",
            "hpScale": 3.34,
            "damageScale": 1.79
          }, {
            "enemy": "EN06",
            "count": 4,
            "pattern": "west",
            "delay": 6.0,
            "hpScale": 3.34,
            "damageScale": 1.79
          }],
          "rest": 0,
          "maxSeconds": 90,
          "authoredXp": 76
        }],
        "mechanics": [{
          "kind": "beacon",
          "id": "ST29-BEACON",
          "x": 1050,
          "y": 1200,
          "radius": 110,
          "holdSeconds": 20
        }, {
          "kind": "hazard",
          "id": "ST29-C1",
          "shape": "circle",
          "x": 1050,
          "y": 700,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 12,
          "offset": 0,
          "radius": 150
        }, {
          "kind": "hazard",
          "id": "ST29-L1",
          "shape": "line",
          "x": 1050,
          "y": 1600,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 12,
          "offset": 5,
          "width": 1500,
          "height": 80
        }, {
          "kind": "hazard",
          "id": "ST29-C2",
          "shape": "circle",
          "x": 1050,
          "y": 1200,
          "period": 15,
          "warning": 1.5,
          "active": 0.7,
          "damage": 12,
          "offset": 10,
          "radius": 160
        }],
        "reward": {
          "coins": 705,
          "iron": 18,
          "firstCoins": 660,
          "firstIron": 17,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 448,
        "teaching": "驻圈20秒与三段错相预警，不以强站吃伤完成",
        "enemyHpScale": 3.34,
        "enemyDamageScale": 1.79,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }, {
        "id": "ST30",
        "number": 30,
        "name": "墨尽天明",
        "chapter": "六·归墟终阵",
        "description": "四Boss逐波接力，各自可读的撤离与回身窗口",
        "objective": "clear",
        "world": {
          "width": 2200,
          "height": 2700,
          "spawn": {
            "x": 1100,
            "y": 2200
          },
          "obstacles": [{
            "x": 500,
            "y": 900,
            "width": 200,
            "height": 260
          }, {
            "x": 1500,
            "y": 1500,
            "width": 200,
            "height": 260
          }],
          "map": "MAP06"
        },
        "waves": [{
          "id": "ST30-W01",
          "label": "天明试翼",
          "groups": [{
            "enemy": "EN01",
            "count": 24,
            "pattern": "corners",
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 118,
          "authoredXp": 48
        }, {
          "id": "ST30-W02",
          "label": "雾潮留路",
          "groups": [{
            "enemy": "EN02",
            "count": 20,
            "pattern": "ring",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EN05",
            "count": 4,
            "pattern": "north",
            "delay": 6.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 118,
          "authoredXp": 52
        }, {
          "id": "ST30-W03",
          "label": "铁背清排",
          "groups": [{
            "enemy": "EN03",
            "count": 12,
            "pattern": "line",
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 94,
          "authoredXp": 36
        }, {
          "id": "ST30-W04",
          "label": "镰锋错向",
          "groups": [{
            "enemy": "EN04",
            "count": 10,
            "pattern": "flank",
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 30
        }, {
          "id": "ST30-W05",
          "label": "空核迁阵",
          "groups": [{
            "enemy": "EN06",
            "count": 10,
            "pattern": "corners",
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 90,
          "authoredXp": 40
        }, {
          "id": "ST30-W06",
          "label": "双卫前阵",
          "groups": [{
            "enemy": "EL01",
            "count": 3,
            "pattern": "north",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EL02",
            "count": 3,
            "pattern": "south",
            "delay": 5.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 82,
          "authoredXp": 60
        }, {
          "id": "ST30-W07",
          "label": "裂锋·横切",
          "groups": [{
            "enemy": "BO01",
            "count": 1,
            "pattern": "north",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EN01",
            "count": 6,
            "pattern": "east",
            "delay": 9.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 24
        }, {
          "id": "ST30-W08",
          "label": "裂地·离圈",
          "groups": [{
            "enemy": "BO02",
            "count": 1,
            "pattern": "south",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EN05",
            "count": 3,
            "pattern": "west",
            "delay": 9.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 25
        }, {
          "id": "ST30-W09",
          "label": "星核·固定十字",
          "groups": [{
            "enemy": "BO03",
            "count": 1,
            "pattern": "north",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EN04",
            "count": 3,
            "pattern": "east",
            "delay": 9.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 4,
          "maxSeconds": 110,
          "authoredXp": 27
        }, {
          "id": "ST30-W10",
          "label": "鸦皇·斜切终局",
          "groups": [{
            "enemy": "BO04",
            "count": 1,
            "pattern": "north",
            "hpScale": 3.5,
            "damageScale": 1.85
          }, {
            "enemy": "EN01",
            "count": 8,
            "pattern": "south",
            "delay": 10.0,
            "hpScale": 3.5,
            "damageScale": 1.85
          }],
          "rest": 0,
          "maxSeconds": 110,
          "authoredXp": 36
        }],
        "mechanics": [{
          "kind": "hazard",
          "id": "ST30-C1",
          "shape": "circle",
          "x": 1100,
          "y": 1100,
          "period": 13,
          "warning": 1.5,
          "active": 0.7,
          "damage": 12,
          "offset": 0,
          "radius": 155
        }, {
          "kind": "hazard",
          "id": "ST30-L1",
          "shape": "line",
          "x": 1100,
          "y": 1700,
          "period": 13,
          "warning": 1.5,
          "active": 0.7,
          "damage": 12,
          "offset": 6.5,
          "width": 1500,
          "height": 85
        }],
        "reward": {
          "coins": 725,
          "iron": 18,
          "firstCoins": 680,
          "firstIron": 17,
          "equipmentPool": ["EQ01", "EQ02", "EQ03"],
          "companionPool": ["CO01", "CO02"],
          "firstShards": {},
          "unlockSkills": [],
          "unlockItems": []
        },
        "authoredXp": 378,
        "teaching": "四Boss逐波接力，各自可读的撤离与回身窗口",
        "enemyHpScale": 3.5,
        "enemyDamageScale": 1.85,
        "xpBudgetMeaning": "明确群组全部击杀的潜在掉落；必须实际拾取。survive按时结束可能少杀/少生成。终局余XP只入统计不弹无用卡。"
      }]);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './account.ts'], function (exports) {
  var _inheritsLoose, _wrapNativeSuper, _asyncToGenerator, _regeneratorRuntime, cclegacy, validateAccount, newAccount, clone;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _wrapNativeSuper = module.wrapNativeSuper;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      validateAccount = module.validateAccount;
      newAccount = module.newAccount;
      clone = module.clone;
    }],
    execute: function () {
      exports({
        decode: decode,
        freshAccountSeed: freshAccountSeed,
        newDocument: newDocument,
        platformStorage: platformStorage
      });
      cclegacy._RF.push({}, "0c147KsaOpE05jhheiNrjHE", "storage", undefined);
      var SAVE_KEY = 'inkblade30.save.v1';
      function freshAccountSeed() {
        var crypto = globalThis.crypto;
        return (crypto ? crypto.getRandomValues(new Uint32Array(1))[0] : Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0 || 1;
      }
      function freeze(value) {
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
          for (var _i = 0, _Object$values = Object.values(value); _i < _Object$values.length; _i++) {
            var v = _Object$values[_i];
            freeze(v);
          }
          Object.freeze(value);
        }
        return value;
      }
      function platformStorage() {
        var _g$tt, _g$navigator;
        var g = globalThis;
        var mini = (_g$tt = g.tt) != null ? _g$tt : g.wx;
        if (mini) return {
          read: function read() {
            var value = mini.getStorageSync(SAVE_KEY);
            if (value === undefined || value === null || value === '') return null;
            if (typeof value !== 'string') throw new Error('平台存档类型无效');
            return value;
          },
          write: function write(text) {
            return mini.setStorageSync(SAVE_KEY, text);
          }
        };
        if (!g.localStorage) throw new Error('当前宿主没有可用的持久存储');
        if (!((_g$navigator = g.navigator) != null && _g$navigator.locks)) throw new Error('此宿主缺少存档互斥锁，已保留原档并停止写入');
        return {
          read: function read() {
            return g.localStorage.getItem(SAVE_KEY);
          },
          write: function write(text) {
            return g.localStorage.setItem(SAVE_KEY, text);
          },
          exclusive: function exclusive(fn) {
            return g.navigator.locks.request(SAVE_KEY, fn);
          }
        };
      }
      var SaveConflict = exports('SaveConflict', /*#__PURE__*/function (_Error) {
        _inheritsLoose(SaveConflict, _Error);
        function SaveConflict() {
          return _Error.call(this, '另一窗口已更新存档，请重新核对后继续') || this;
        }
        return SaveConflict;
      }( /*#__PURE__*/_wrapNativeSuper(Error)));
      var SaveUnknown = exports('SaveUnknown', /*#__PURE__*/function (_Error2) {
        _inheritsLoose(SaveUnknown, _Error2);
        function SaveUnknown(message) {
          return _Error2.call(this, "\u4FDD\u5B58\u7ED3\u679C\u5F85\u6838\u5BF9\uFF1A" + message) || this;
        }
        return SaveUnknown;
      }( /*#__PURE__*/_wrapNativeSuper(Error)));
      function decode(text) {
        if (text === null) return null;
        var d;
        try {
          d = JSON.parse(text);
        } catch (_unused) {
          throw new Error('存档无法解析，保留原内容并停止写入');
        }
        if (!d || d.schema !== 1 || !Number.isSafeInteger(d.revision) || d.revision < 0 || typeof d.lastWriteId !== 'string' || !Number.isSafeInteger(d.nextRun) || d.nextRun < 1 || !['camp', 'stages', 'training', 'equipment', 'companions', 'battle', 'settlement'].includes(d.screen) || typeof d.soundEnabled !== 'boolean') throw new Error('存档版本或文档字段无效，已停止写入');
        validateAccount(d.account);
        if (d.run !== null && (!d.run || typeof d.run.runId !== 'string' || typeof d.run.stageId !== 'string' || typeof d.run.snapshot !== 'string')) throw new Error('进行中游戏存档无效');
        return d;
      }
      function newDocument(seed) {
        return {
          schema: 1,
          revision: 0,
          lastWriteId: 'initial',
          nextRun: 1,
          account: newAccount(seed),
          run: null,
          receipt: null,
          screen: 'camp',
          soundEnabled: true
        };
      }

      /** One complete candidate in one durable key. Read back before resolving unknown writes. */
      var SaveStore = exports('SaveStore', /*#__PURE__*/function () {
        function SaveStore(port, seed) {
          var _decode;
          this.document = void 0;
          this.pending = null;
          this.queue = Promise.resolve();
          this.port = port;
          this.document = freeze((_decode = decode(port.read())) != null ? _decode : newDocument(seed));
        }
        var _proto = SaveStore.prototype;
        _proto.locked = function locked(fn) {
          return this.port.exclusive ? this.port.exclusive(fn) : fn();
        };
        _proto.writePending = /*#__PURE__*/function () {
          var _writePending = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _this = this;
            var p;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (this.pending) {
                    _context2.next = 2;
                    break;
                  }
                  return _context2.abrupt("return", this.document);
                case 2:
                  p = this.pending;
                  return _context2.abrupt("return", this.locked( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                    var _current$revision, _current$lastWriteId;
                    var raw, current, problem, checked;
                    return _regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) switch (_context.prev = _context.next) {
                        case 0:
                          raw = _this.port.read(), current = decode(raw);
                          if (!(raw === p.encoded)) {
                            _context.next = 5;
                            break;
                          }
                          _this.document = freeze(clone(p.candidate));
                          _this.pending = null;
                          return _context.abrupt("return", _this.document);
                        case 5:
                          if (!(((_current$revision = current == null ? void 0 : current.revision) != null ? _current$revision : 0) !== p.expected || ((_current$lastWriteId = current == null ? void 0 : current.lastWriteId) != null ? _current$lastWriteId : 'initial') !== _this.document.lastWriteId)) {
                            _context.next = 7;
                            break;
                          }
                          throw new SaveConflict();
                        case 7:
                          try {
                            _this.port.write(p.encoded);
                          } catch (e) {
                            problem = e;
                          }
                          _context.prev = 8;
                          checked = _this.port.read();
                          _context.next = 15;
                          break;
                        case 12:
                          _context.prev = 12;
                          _context.t0 = _context["catch"](8);
                          throw new SaveUnknown(String(_context.t0));
                        case 15:
                          if (!(checked === p.encoded)) {
                            _context.next = 19;
                            break;
                          }
                          _this.document = freeze(clone(p.candidate));
                          _this.pending = null;
                          return _context.abrupt("return", _this.document);
                        case 19:
                          if (!(checked !== raw)) {
                            _context.next = 21;
                            break;
                          }
                          throw new SaveConflict();
                        case 21:
                          throw new SaveUnknown(problem ? String(problem) : '未读取到刚才的完整候选');
                        case 22:
                        case "end":
                          return _context.stop();
                      }
                    }, _callee, null, [[8, 12]]);
                  }))));
                case 4:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function writePending() {
            return _writePending.apply(this, arguments);
          }
          return writePending;
        }();
        _proto.transact = function transact(id, change) {
          var _this2 = this;
          var run = /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
              var candidate;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!_this2.pending) {
                      _context3.next = 2;
                      break;
                    }
                    throw new SaveUnknown('已有候选尚待核对，请先重试保存');
                  case 2:
                    candidate = clone(_this2.document);
                    change(candidate);
                    candidate.revision = _this2.document.revision + 1;
                    candidate.lastWriteId = id;
                    validateAccount(candidate.account);
                    _this2.pending = {
                      candidate: candidate,
                      expected: _this2.document.revision,
                      encoded: JSON.stringify(candidate)
                    };
                    return _context3.abrupt("return", _this2.writePending());
                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function run() {
              return _ref2.apply(this, arguments);
            };
          }();
          var promise = this.queue.then(run, run);
          this.queue = promise["catch"](function () {});
          return promise;
        };
        _proto.retry = function retry() {
          var _this3 = this;
          var promise = this.queue.then(function () {
            return _this3.writePending();
          });
          this.queue = promise["catch"](function () {});
          return promise;
        };
        _proto.reload = function reload() {
          var latest = decode(this.port.read());
          if (!latest) throw new Error('存档暂时不可读，保留当前版本');
          this.document = freeze(latest);
          this.pending = null;
          return clone(latest);
        };
        return SaveStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
