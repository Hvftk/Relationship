/*
 * 模式数据
*/
import _input from './data/input.js';
import _sort from './data/sort.js';
import $map from './map.js';
import { objectToMap, mergeMap } from './utils.js';

let modeHash = {};             // 模式增量数据缓存
let $mode = new Map($map);     // 模式数据: id -> name
let $reverse = new Map();      // 模式反向数据: name -> id

// 反向数据处理
const transformReverse = function(){
    let $key = mergeMap($mode, objectToMap(_input));
    $key = mergeMap($key, objectToMap(_sort));
    $reverse = new Map();
    $key.forEach((names, key) => {
        names.forEach((name) => {
            const list = $reverse.get(name) || [];
            list.push(key);
            $reverse.set(name, list);
        });
    });
}

transformReverse();

// 设置模式数据
export function setModeData(sign, data) {
    const modeMap = modeHash[sign] || new Map();
    modeHash[sign] = mergeMap(modeMap,objectToMap(data));
};

// 获取模式数据
export function switchMode(sign) {
    $mode = new Map($map);
    if (sign && modeHash[sign]) {   
        const mode = modeHash[sign];
        mode.forEach((modeValue, key) => {
            const originalValue = $map.get(key) || [];
            $mode.set(key, [...modeValue, ...originalValue]);
        });
        transformReverse();
    }
};

export { $mode, $reverse };