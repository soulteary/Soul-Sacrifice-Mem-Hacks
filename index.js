// const data = {
//   global: [
//     {
//       name: '眼泪',             // 注释
//       value: 1000,              // 数值
//       valueDelta: -11,          // optional，数值偏移，10进制，可写正负
//       address: '0x83A9FF24',    // 地址，必写
//       addressType: 0,           // 地址类型，默认普通
//       offsetAddress: '11',      // optional, 偏移地址数量，十六进制，可写正负
//       repeat: '11',             // optional, 重复次数
//       repeatOffset: '',         // optional, 不写或留空默认0
//       size: 4,                  // optional, 默认4字节
//     }
//   ]
// };

const data = require('./data.json')

function fillAddress(srcAddr) {
  const defaultAddr = '0x00000000';
  return srcAddr ? defaultAddr.slice(0, -1 * srcAddr.length) + srcAddr : defaultAddr;
}

function makeCode(params) {
  params = params || {};

  switch (params.codeType) {
    case 1:// 循环代码
      params.codeType = 1;
      params.codeLabel = '循环';
      break;
    case 0:// 普通代码
    default:
      params.codeType = 0;
      params.codeLabel = '普通';
      break;
  }

  switch (params.addressType) {
    case 1:// 指针地址
      params.addressType = 1;
      params.codeLabel += '指针';
      break;
    case 0:// 普通地址
    default:
      params.addressType = 0;
      params.codeLabel += '';
      break;
  }

  if (params.offsetAddress) {
    if (params.offsetAddress.slice(0, 1) === '-') {
      // 逆向偏移
      params.offsetDirect = 0;
      params.offsetAddress = params.offsetAddress.slice(1, params.offsetAddress.length);
    } else {
      params.offsetDirect = 1;
    }
    params.offsetAddress = fillAddress(params.offsetAddress);
  } else {
    params.offsetDirect = 0;
    params.offsetAddress = fillAddress();
  }

  switch (params.repeat) {
    case 0:// 不重复
      params.repeat = 0;
      params.repeatDirect = 0;
      break;
    default:
      var repeatValue = Number(params.repeat);
      if (isNaN(repeatValue)) {
        params.repeat = 0;
      } else {
        params.repeat = repeatValue;
      }
      params.repeatDirect = params.repeat > 0 ? 1 : 0;
      break;
  }

  if (params.repeatOffset) {
    params.repeatOffset = fillAddress(params.repeatOffset);
  } else {
    params.repeatOffset = fillAddress();
  }

  switch (params.size) {
    case 1:
    case 2:
    case 3:
    case 4:
      params.size = Number(params.size);
      break;
    default:
      params.size = 4;
      break;
  }

  switch (params.value) {
    default:
      var modValue = Number(params.value);
      if (isNaN(modValue)) {
        params.value = 0;
      } else {
        params.value = modValue;
      }
      break;
  }

  if (params.valueDelta) {
    params.valueOffsetDirect = valueDelta > 0 ? 1 : 0;
    params.valueDelta = Number(params.valueDelta);
  } else {
    params.valueOffsetDirect = 0;
    params.valueDelta = 0;
  }

  return `
#${[params.codeLabel + '代码', params.name].join('_')}
@${[params.codeType, params.addressType, fillAddress(params.address),
    params.offsetDirect, params.offsetAddress,
    params.repeat, params.repeatDirect, params.repeatOffset,
    params.size, params.value,
    params.valueOffsetDirect, params.valueDelta].join(',')}`;
}


Object.keys(data).map(function(label) {
  data[label].map(function(item) {
    console.log(makeCode(item).replace('循环代码','LC').replace('普通代码','SC'))
  });
});


