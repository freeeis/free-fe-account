/*
* chang the string into the bit array
*
* return bit array(it's length % 64 = 0)
*/
function getKeyBytes(key) {
  const keyBytes = [];
  const leng = key.length;
  const iterator = parseInt(leng / 4, 10);
  const remainder = leng % 4;
  let i = 0;
  for (i = 0; i < iterator; i += 1) {
    keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
  }
  if (remainder > 0) {
    keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng));
  }
  return keyBytes;
}

/*
* decrypt the encrypted string to the original string
*
* return  the original string
*/
function strDec(data, firstKey, secondKey, thirdKey) {
  const leng = data.length;
  let decStr = '';
  let firstKeyBt; let secondKeyBt; let thirdKeyBt; let firstLength; let secondLength; let
    thirdLength;
  if (firstKey !== null && firstKey !== '') {
    firstKeyBt = getKeyBytes(firstKey);
    firstLength = firstKeyBt.length;
  }
  if (secondKey !== null && secondKey !== '') {
    secondKeyBt = getKeyBytes(secondKey);
    secondLength = secondKeyBt.length;
  }
  if (thirdKey !== null && thirdKey !== '') {
    thirdKeyBt = getKeyBytes(thirdKey);
    thirdLength = thirdKeyBt.length;
  }

  const iterator = parseInt(leng / 16, 10);
  let i = 0;
  for (i = 0; i < iterator; i += 1) {
    const tempData = data.substring(i * 16 + 0, i * 16 + 16);
    const strByte = hexToBt64(tempData);
    const intByte = new Array(64);
    let j = 0;
    for (j = 0; j < 64; j += 1) {
      intByte[j] = parseInt(strByte.substring(j, j + 1), 10);
    }
    let decByte;
    if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '' && thirdKey !== null && thirdKey !== '') {
      let tempBt;
      let x; let y; let
        z;
      tempBt = intByte;
      for (x = thirdLength - 1; x >= 0; x -= 1) {
        tempBt = dec(tempBt, thirdKeyBt[x]);
      }
      for (y = secondLength - 1; y >= 0; y -= 1) {
        tempBt = dec(tempBt, secondKeyBt[y]);
      }
      for (z = firstLength - 1; z >= 0; z -= 1) {
        tempBt = dec(tempBt, firstKeyBt[z]);
      }
      decByte = tempBt;
    } else if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '') {
      let tempBt;
      let x; let
        y;
      tempBt = intByte;
      for (x = secondLength - 1; x >= 0; x -= 1) {
        tempBt = dec(tempBt, secondKeyBt[x]);
      }
      for (y = firstLength - 1; y >= 0; y -= 1) {
        tempBt = dec(tempBt, firstKeyBt[y]);
      }
      decByte = tempBt;
    } else if (firstKey !== null && firstKey !== '') {
      let tempBt;
      let x;
      tempBt = intByte;
      for (x = firstLength - 1; x >= 0; x -= 1) {
        tempBt = dec(tempBt, firstKeyBt[x]);
      }
      decByte = tempBt;
    }
    decStr += byteToString(decByte);
  }
  return decStr;
}
/*
* chang the string(it's length <= 4) into the bit array
*
* return bit array(it's length = 64)
*/
function strToBt(str) {
  const leng = str.length;
  const bt = new Array(64);
  if (leng < 4) {
    let i = 0; let j = 0; let p = 0; let
      q = 0;
    for (i = 0; i < leng; i += 1) {
      const k = str.charCodeAt(i);
      for (j = 0; j < 16; j += 1) {
        let pow = 1; let
          m = 0;
        for (m = 15; m > j; m -= 1) {
          pow *= 2;
        }
        bt[16 * i + j] = parseInt(k / pow, 10) % 2;
      }
    }
    for (p = leng; p < 4; p += 1) {
      const k = 0;
      for (q = 0; q < 16; q += 1) {
        let pow = 1; let
          m = 0;
        for (m = 15; m > q; m -= 1) {
          pow *= 2;
        }
        bt[16 * p + q] = parseInt(k / pow, 10) % 2;
      }
    }
  } else {
    for (let i = 0; i < 4; i += 1) {
      const k = str.charCodeAt(i);
      for (let j = 0; j < 16; j += 1) {
        let pow = 1;
        for (let m = 15; m > j; m -= 1) {
          pow *= 2;
        }
        bt[16 * i + j] = parseInt(k / pow, 10) % 2;
      }
    }
  }
  return bt;
}

/*
* chang the bit(it's length = 4) into the hex
*
* return hex
*/
function bt4ToHex(binary) {
  let hex;
  switch (binary) {
    case '0000': hex = '0'; break;
    case '0001': hex = '1'; break;
    case '0010': hex = '2'; break;
    case '0011': hex = '3'; break;
    case '0100': hex = '4'; break;
    case '0101': hex = '5'; break;
    case '0110': hex = '6'; break;
    case '0111': hex = '7'; break;
    case '1000': hex = '8'; break;
    case '1001': hex = '9'; break;
    case '1010': hex = 'A'; break;
    case '1011': hex = 'B'; break;
    case '1100': hex = 'C'; break;
    case '1101': hex = 'D'; break;
    case '1110': hex = 'E'; break;
    case '1111': hex = 'F'; break;
    default: break;
  }
  return hex;
}

/*
* chang the hex into the bit(it's length = 4)
*
* return the bit(it's length = 4)
*/
function hexToBt4(hex) {
  let binary;
  switch (hex) {
    case '0': binary = '0000'; break;
    case '1': binary = '0001'; break;
    case '2': binary = '0010'; break;
    case '3': binary = '0011'; break;
    case '4': binary = '0100'; break;
    case '5': binary = '0101'; break;
    case '6': binary = '0110'; break;
    case '7': binary = '0111'; break;
    case '8': binary = '1000'; break;
    case '9': binary = '1001'; break;
    case 'A': binary = '1010'; break;
    case 'B': binary = '1011'; break;
    case 'C': binary = '1100'; break;
    case 'D': binary = '1101'; break;
    case 'E': binary = '1110'; break;
    case 'F': binary = '1111'; break;
    default: break;
  }
  return binary;
}

/*
* chang the bit(it's length = 64) into the string
*
* return string
*/
function byteToString(byteData) {
  let str = '';
  for (let i = 0; i < 4; i += 1) {
    let count = 0;
    for (let j = 0; j < 16; j += 1) {
      let pow = 1;
      for (let m = 15; m > j; m -= 1) {
        pow *= 2;
      }
      count += byteData[16 * i + j] * pow;
    }
    if (count !== 0) {
      str += String.fromCharCode(count);
    }
  }
  return str;
}

function bt64ToHex(byteData) {
  let hex = '';
  for (let i = 0; i < 16; i += 1) {
    let bt = '';
    for (let j = 0; j < 4; j += 1) {
      bt += byteData[i * 4 + j];
    }
    hex += bt4ToHex(bt);
  }
  return hex;
}

function hexToBt64(hex) {
  let binary = '';
  for (let i = 0; i < 16; i += 1) {
    binary += hexToBt4(hex.substring(i, i + 1));
  }
  return binary;
}

/*
* the 64 bit des core arithmetic
*/

function enc(dataByte, keyByte) {
  const keys = generateKeys(keyByte);
  const ipByte = initPermute(dataByte);
  const ipLeft = new Array(32);
  const ipRight = new Array(32);
  const tempLeft = new Array(32);
  let i = 0; let j = 0; let k = 0; let m = 0; let
    n = 0;
  for (k = 0; k < 32; k += 1) {
    ipLeft[k] = ipByte[k];
    ipRight[k] = ipByte[32 + k];
  }
  for (i = 0; i < 16; i += 1) {
    for (j = 0; j < 32; j += 1) {
      tempLeft[j] = ipLeft[j];
      ipLeft[j] = ipRight[j];
    }
    const key = new Array(48);
    for (m = 0; m < 48; m += 1) {
      key[m] = keys[i][m];
    }
    const tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
    for (n = 0; n < 32; n += 1) {
      ipRight[n] = tempRight[n];
    }
  }

  const finalData = new Array(64);
  for (i = 0; i < 32; i += 1) {
    finalData[i] = ipRight[i];
    finalData[32 + i] = ipLeft[i];
  }
  return finallyPermute(finalData);
}

function dec(dataByte, keyByte) {
  const keys = generateKeys(keyByte);
  const ipByte = initPermute(dataByte);
  const ipLeft = new Array(32);
  const ipRight = new Array(32);
  const tempLeft = new Array(32);
  let i = 0; let j = 0; let k = 0; let m = 0; let
    n = 0;
  for (k = 0; k < 32; k += 1) {
    ipLeft[k] = ipByte[k];
    ipRight[k] = ipByte[32 + k];
  }
  for (i = 15; i >= 0; i -= 1) {
    for (j = 0; j < 32; j += 1) {
      tempLeft[j] = ipLeft[j];
      ipLeft[j] = ipRight[j];
    }
    const key = new Array(48);
    for (m = 0; m < 48; m += 1) {
      key[m] = keys[i][m];
    }

    const tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
    for (n = 0; n < 32; n += 1) {
      ipRight[n] = tempRight[n];
    }
  }

  const finalData = new Array(64);
  for (i = 0; i < 32; i += 1) {
    finalData[i] = ipRight[i];
    finalData[32 + i] = ipLeft[i];
  }
  return finallyPermute(finalData);
}

function initPermute(originalData) {
  const ipByte = new Array(64);
  for (let i = 0, m = 1, n = 0; i < 4; i += 1, m += 2, n += 2) {
    for (let j = 7, k = 0; j >= 0; j -= 1, k += 1) {
      ipByte[i * 8 + k] = originalData[j * 8 + m];
      ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
    }
  }
  return ipByte;
}

function expandPermute(rightData) {
  const epByte = new Array(48);
  for (let i = 0; i < 8; i += 1) {
    if (i === 0) {
      epByte[i * 6 + 0] = rightData[31];
    } else {
      epByte[i * 6 + 0] = rightData[i * 4 - 1];
    }
    epByte[i * 6 + 1] = rightData[i * 4 + 0];
    epByte[i * 6 + 2] = rightData[i * 4 + 1];
    epByte[i * 6 + 3] = rightData[i * 4 + 2];
    epByte[i * 6 + 4] = rightData[i * 4 + 3];
    if (i === 7) {
      epByte[i * 6 + 5] = rightData[0];
    } else {
      epByte[i * 6 + 5] = rightData[i * 4 + 4];
    }
  }
  return epByte;
}

function xor(byteOne, byteTwo) {
  const xorByte = new Array(byteOne.length);
  for (let i = 0; i < byteOne.length; i += 1) {
    xorByte[i] = byteOne[i] ^ byteTwo[i];
  }
  return xorByte;
}

function sBoxPermute(expandByte) {
  const sBoxByte = new Array(32);
  let binary = '';
  const s1 = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]];

  /* Table - s2 */
  const s2 = [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]];

  /* Table - s3 */
  const s3 = [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]];
  /* Table - s4 */
  const s4 = [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]];

  /* Table - s5 */
  const s5 = [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]];

  /* Table - s6 */
  const s6 = [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]];

  /* Table - s7 */
  const s7 = [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]];

  /* Table - s8 */
  const s8 = [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]];

  for (let m = 0; m < 8; m += 1) {
    let i = 0; let
      j = 0;
    i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
    j = expandByte[m * 6 + 1] * 2 * 2 * 2
      + expandByte[m * 6 + 2] * 2 * 2
      + expandByte[m * 6 + 3] * 2
      + expandByte[m * 6 + 4];
    switch (m) {
      case 0:
        binary = getBoxBinary(s1[i][j]);
        break;
      case 1:
        binary = getBoxBinary(s2[i][j]);
        break;
      case 2:
        binary = getBoxBinary(s3[i][j]);
        break;
      case 3:
        binary = getBoxBinary(s4[i][j]);
        break;
      case 4:
        binary = getBoxBinary(s5[i][j]);
        break;
      case 5:
        binary = getBoxBinary(s6[i][j]);
        break;
      case 6:
        binary = getBoxBinary(s7[i][j]);
        break;
      case 7:
        binary = getBoxBinary(s8[i][j]);
        break;
      default:
        break;
    }
    sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1), 10);
    sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2), 10);
    sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3), 10);
    sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4), 10);
  }
  return sBoxByte;
}

function pPermute(sBoxByte) {
  const pBoxPermute = new Array(32);
  pBoxPermute[0] = sBoxByte[15];
  pBoxPermute[1] = sBoxByte[6];
  pBoxPermute[2] = sBoxByte[19];
  pBoxPermute[3] = sBoxByte[20];
  pBoxPermute[4] = sBoxByte[28];
  pBoxPermute[5] = sBoxByte[11];
  pBoxPermute[6] = sBoxByte[27];
  pBoxPermute[7] = sBoxByte[16];
  pBoxPermute[8] = sBoxByte[0];
  pBoxPermute[9] = sBoxByte[14];
  pBoxPermute[10] = sBoxByte[22];
  pBoxPermute[11] = sBoxByte[25];
  pBoxPermute[12] = sBoxByte[4];
  pBoxPermute[13] = sBoxByte[17];
  pBoxPermute[14] = sBoxByte[30];
  pBoxPermute[15] = sBoxByte[9];
  pBoxPermute[16] = sBoxByte[1];
  pBoxPermute[17] = sBoxByte[7];
  pBoxPermute[18] = sBoxByte[23];
  pBoxPermute[19] = sBoxByte[13];
  pBoxPermute[20] = sBoxByte[31];
  pBoxPermute[21] = sBoxByte[26];
  pBoxPermute[22] = sBoxByte[2];
  pBoxPermute[23] = sBoxByte[8];
  pBoxPermute[24] = sBoxByte[18];
  pBoxPermute[25] = sBoxByte[12];
  pBoxPermute[26] = sBoxByte[29];
  pBoxPermute[27] = sBoxByte[5];
  pBoxPermute[28] = sBoxByte[21];
  pBoxPermute[29] = sBoxByte[10];
  pBoxPermute[30] = sBoxByte[3];
  pBoxPermute[31] = sBoxByte[24];
  return pBoxPermute;
}

function finallyPermute(endByte) {
  const fpByte = new Array(64);
  fpByte[0] = endByte[39];
  fpByte[1] = endByte[7];
  fpByte[2] = endByte[47];
  fpByte[3] = endByte[15];
  fpByte[4] = endByte[55];
  fpByte[5] = endByte[23];
  fpByte[6] = endByte[63];
  fpByte[7] = endByte[31];
  fpByte[8] = endByte[38];
  fpByte[9] = endByte[6];
  fpByte[10] = endByte[46];
  fpByte[11] = endByte[14];
  fpByte[12] = endByte[54];
  fpByte[13] = endByte[22];
  fpByte[14] = endByte[62];
  fpByte[15] = endByte[30];
  fpByte[16] = endByte[37];
  fpByte[17] = endByte[5];
  fpByte[18] = endByte[45];
  fpByte[19] = endByte[13];
  fpByte[20] = endByte[53];
  fpByte[21] = endByte[21];
  fpByte[22] = endByte[61];
  fpByte[23] = endByte[29];
  fpByte[24] = endByte[36];
  fpByte[25] = endByte[4];
  fpByte[26] = endByte[44];
  fpByte[27] = endByte[12];
  fpByte[28] = endByte[52];
  fpByte[29] = endByte[20];
  fpByte[30] = endByte[60];
  fpByte[31] = endByte[28];
  fpByte[32] = endByte[35];
  fpByte[33] = endByte[3];
  fpByte[34] = endByte[43];
  fpByte[35] = endByte[11];
  fpByte[36] = endByte[51];
  fpByte[37] = endByte[19];
  fpByte[38] = endByte[59];
  fpByte[39] = endByte[27];
  fpByte[40] = endByte[34];
  fpByte[41] = endByte[2];
  fpByte[42] = endByte[42];
  fpByte[43] = endByte[10];
  fpByte[44] = endByte[50];
  fpByte[45] = endByte[18];
  fpByte[46] = endByte[58];
  fpByte[47] = endByte[26];
  fpByte[48] = endByte[33];
  fpByte[49] = endByte[1];
  fpByte[50] = endByte[41];
  fpByte[51] = endByte[9];
  fpByte[52] = endByte[49];
  fpByte[53] = endByte[17];
  fpByte[54] = endByte[57];
  fpByte[55] = endByte[25];
  fpByte[56] = endByte[32];
  fpByte[57] = endByte[0];
  fpByte[58] = endByte[40];
  fpByte[59] = endByte[8];
  fpByte[60] = endByte[48];
  fpByte[61] = endByte[16];
  fpByte[62] = endByte[56];
  fpByte[63] = endByte[24];
  return fpByte;
}

function getBoxBinary(i) {
  let binary = '';
  switch (i) {
    case 0: binary = '0000'; break;
    case 1: binary = '0001'; break;
    case 2: binary = '0010'; break;
    case 3: binary = '0011'; break;
    case 4: binary = '0100'; break;
    case 5: binary = '0101'; break;
    case 6: binary = '0110'; break;
    case 7: binary = '0111'; break;
    case 8: binary = '1000'; break;
    case 9: binary = '1001'; break;
    case 10: binary = '1010'; break;
    case 11: binary = '1011'; break;
    case 12: binary = '1100'; break;
    case 13: binary = '1101'; break;
    case 14: binary = '1110'; break;
    case 15: binary = '1111'; break;
    default:
      break;
  }
  return binary;
}
/*
* generate 16 keys for xor
*
*/
function generateKeys(keyByte) {
  const key = new Array(56);
  const keys = [];

  keys[0] = [];
  keys[1] = [];
  keys[2] = [];
  keys[3] = [];
  keys[4] = [];
  keys[5] = [];
  keys[6] = [];
  keys[7] = [];
  keys[8] = [];
  keys[9] = [];
  keys[10] = [];
  keys[11] = [];
  keys[12] = [];
  keys[13] = [];
  keys[14] = [];
  keys[15] = [];
  const loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  for (let i = 0; i < 7; i += 1) {
    for (let j = 0, k = 7; j < 8; j += 1, k -= 1) {
      key[i * 8 + j] = keyByte[8 * k + i];
    }
  }

  let i = 0;
  for (i = 0; i < 16; i += 1) {
    let tempLeft = 0;
    let tempRight = 0;
    for (let j = 0; j < loop[i]; j += 1) {
      tempLeft = key[0];
      tempRight = key[28];
      for (let k = 0; k < 27; k += 1) {
        key[k] = key[k + 1];
        key[28 + k] = key[29 + k];
      }
      key[27] = tempLeft;
      key[55] = tempRight;
    }
    const tempKey = new Array(48);
    tempKey[0] = key[13];
    tempKey[1] = key[16];
    tempKey[2] = key[10];
    tempKey[3] = key[23];
    tempKey[4] = key[0];
    tempKey[5] = key[4];
    tempKey[6] = key[2];
    tempKey[7] = key[27];
    tempKey[8] = key[14];
    tempKey[9] = key[5];
    tempKey[10] = key[20];
    tempKey[11] = key[9];
    tempKey[12] = key[22];
    tempKey[13] = key[18];
    tempKey[14] = key[11];
    tempKey[15] = key[3];
    tempKey[16] = key[25];
    tempKey[17] = key[7];
    tempKey[18] = key[15];
    tempKey[19] = key[6];
    tempKey[20] = key[26];
    tempKey[21] = key[19];
    tempKey[22] = key[12];
    tempKey[23] = key[1];
    tempKey[24] = key[40];
    tempKey[25] = key[51];
    tempKey[26] = key[30];
    tempKey[27] = key[36];
    tempKey[28] = key[46];
    tempKey[29] = key[54];
    tempKey[30] = key[29];
    tempKey[31] = key[39];
    tempKey[32] = key[50];
    tempKey[33] = key[44];
    tempKey[34] = key[32];
    tempKey[35] = key[47];
    tempKey[36] = key[43];
    tempKey[37] = key[48];
    tempKey[38] = key[38];
    tempKey[39] = key[55];
    tempKey[40] = key[33];
    tempKey[41] = key[52];
    tempKey[42] = key[45];
    tempKey[43] = key[41];
    tempKey[44] = key[49];
    tempKey[45] = key[35];
    tempKey[46] = key[28];
    tempKey[47] = key[31];
    switch (i) {
      case 0: for (let m = 0; m < 48; m += 1) { keys[0][m] = tempKey[m]; } break;
      case 1: for (let m = 0; m < 48; m += 1) { keys[1][m] = tempKey[m]; } break;
      case 2: for (let m = 0; m < 48; m += 1) { keys[2][m] = tempKey[m]; } break;
      case 3: for (let m = 0; m < 48; m += 1) { keys[3][m] = tempKey[m]; } break;
      case 4: for (let m = 0; m < 48; m += 1) { keys[4][m] = tempKey[m]; } break;
      case 5: for (let m = 0; m < 48; m += 1) { keys[5][m] = tempKey[m]; } break;
      case 6: for (let m = 0; m < 48; m += 1) { keys[6][m] = tempKey[m]; } break;
      case 7: for (let m = 0; m < 48; m += 1) { keys[7][m] = tempKey[m]; } break;
      case 8: for (let m = 0; m < 48; m += 1) { keys[8][m] = tempKey[m]; } break;
      case 9: for (let m = 0; m < 48; m += 1) { keys[9][m] = tempKey[m]; } break;
      case 10: for (let m = 0; m < 48; m += 1) { keys[10][m] = tempKey[m]; } break;
      case 11: for (let m = 0; m < 48; m += 1) { keys[11][m] = tempKey[m]; } break;
      case 12: for (let m = 0; m < 48; m += 1) { keys[12][m] = tempKey[m]; } break;
      case 13: for (let m = 0; m < 48; m += 1) { keys[13][m] = tempKey[m]; } break;
      case 14: for (let m = 0; m < 48; m += 1) { keys[14][m] = tempKey[m]; } break;
      case 15: for (let m = 0; m < 48; m += 1) { keys[15][m] = tempKey[m]; } break;
      default: break;
    }
  }
  return keys;
}

/*
 * encrypt the string to string made up of hex
 * return the encrypted string
 */
function strEnc(data, firstKey, secondKey, thirdKey) {
  const leng = data.length;
  let encData = '';
  let firstKeyBt; let secondKeyBt; let thirdKeyBt; let firstLength; let secondLength; let
    thirdLength;
  if (firstKey !== null && firstKey !== '') {
    firstKeyBt = getKeyBytes(firstKey);
    firstLength = firstKeyBt.length;
  }
  if (secondKey !== null && secondKey !== '') {
    secondKeyBt = getKeyBytes(secondKey);
    secondLength = secondKeyBt.length;
  }
  if (thirdKey !== null && thirdKey !== '') {
    thirdKeyBt = getKeyBytes(thirdKey);
    thirdLength = thirdKeyBt.length;
  }

  if (leng > 0) {
    if (leng < 4) {
      const bt = strToBt(data);
      let encByte;
      if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '' && thirdKey !== null && thirdKey !== '') {
        let tempBt;
        let x; let y; let
          z;
        tempBt = bt;
        for (x = 0; x < firstLength; x += 1) {
          tempBt = enc(tempBt, firstKeyBt[x]);
        }
        for (y = 0; y < secondLength; y += 1) {
          tempBt = enc(tempBt, secondKeyBt[y]);
        }
        for (z = 0; z < thirdLength; z += 1) {
          tempBt = enc(tempBt, thirdKeyBt[z]);
        }
        encByte = tempBt;
      } else if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '') {
        let tempBt;
        let x; let
          y;
        tempBt = bt;
        for (x = 0; x < firstLength; x += 1) {
          tempBt = enc(tempBt, firstKeyBt[x]);
        }
        for (y = 0; y < secondLength; y += 1) {
          tempBt = enc(tempBt, secondKeyBt[y]);
        }
        encByte = tempBt;
      } else if (firstKey !== null && firstKey !== '') {
        let tempBt;
        let x = 0;
        tempBt = bt;
        for (x = 0; x < firstLength; x += 1) {
          tempBt = enc(tempBt, firstKeyBt[x]);
        }
        encByte = tempBt;
      }
      encData = bt64ToHex(encByte);
    } else {
      const iterator = parseInt(leng / 4, 10);
      const remainder = leng % 4;
      let i = 0;
      for (i = 0; i < iterator; i += 1) {
        const tempData = data.substring(i * 4 + 0, i * 4 + 4);
        const tempByte = strToBt(tempData);
        let encByte;
        if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '' && thirdKey !== null && thirdKey !== '') {
          let tempBt;
          let x; let y; let
            z;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          for (y = 0; y < secondLength; y += 1) {
            tempBt = enc(tempBt, secondKeyBt[y]);
          }
          for (z = 0; z < thirdLength; z += 1) {
            tempBt = enc(tempBt, thirdKeyBt[z]);
          }
          encByte = tempBt;
        } else if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '') {
          let tempBt;
          let x; let
            y;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          for (y = 0; y < secondLength; y += 1) {
            tempBt = enc(tempBt, secondKeyBt[y]);
          }
          encByte = tempBt;
        } else if (firstKey !== null && firstKey !== '') {
          let tempBt;
          let x;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          encByte = tempBt;
        }
        encData += bt64ToHex(encByte);
      }
      if (remainder > 0) {
        const remainderData = data.substring(iterator * 4 + 0, leng);
        const tempByte = strToBt(remainderData);
        let encByte;
        if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '' && thirdKey !== null && thirdKey !== '') {
          let tempBt;
          let x; let y; let
            z;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          for (y = 0; y < secondLength; y += 1) {
            tempBt = enc(tempBt, secondKeyBt[y]);
          }
          for (z = 0; z < thirdLength; z += 1) {
            tempBt = enc(tempBt, thirdKeyBt[z]);
          }
          encByte = tempBt;
        } else if (firstKey !== null && firstKey !== '' && secondKey !== null && secondKey !== '') {
          let tempBt;
          let x; let
            y;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          for (y = 0; y < secondLength; y += 1) {
            tempBt = enc(tempBt, secondKeyBt[y]);
          }
          encByte = tempBt;
        } else if (firstKey !== null && firstKey !== '') {
          let tempBt;
          let x;
          tempBt = tempByte;
          for (x = 0; x < firstLength; x += 1) {
            tempBt = enc(tempBt, firstKeyBt[x]);
          }
          encByte = tempBt;
        }
        encData += bt64ToHex(encByte);
      }
    }
  }
  return encData;
}

const algorithm = {
  // /**
  //  * 生成MD5。全小写。
  //  *
  //  * @return {string}
  //  */
  // MD5(data) {
  //   function M(d) { for (let _, m = '0123456789ABCDEF', f = '', r = 0; r < d.length; r += 1)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f; }
  //   function X(d) { for (let _ = Array(d.length >> 2), m = 0; m < _.length; m += 1)_[m] = 0; for (let m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _; }
  //   function V(d) { for (let _ = '', m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _; }
  //   function Y(d, _) {
  //     d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (let m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
  //       const h = m; const t = f; const g = r; const
  //         e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e);
  //     } return Array(m, f, r, i);
  //   }
  //   function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m); }
  //   function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n); }
  //   function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n); }
  //   function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n); }
  //   function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n); }
  //   function safe_add(d, _) { const m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m; }
  //   function bit_rol(d, _) { return d << _ | d >>> 32 - _; }
  //   return M(V(Y(X(data), 8 * d.length))).toLowerCase();
  // },
  encoder: {
    desEncode(data, secretKey) {
      if (data && secretKey) {
        const ks = secretKey.split(',');
        if (ks.length >= 3) {
          return strEnc(data, ks[0], ks[1], ks[2]);
        }
        return strEnc(data, secretKey, '', '');
      }
      return '';
    },
    desDecode(data, secretKey) {
      if (data && secretKey) {
        const ks = secretKey.split(',');
        if (ks.length >= 3) {
          return strDec(data, ks[0], ks[1], ks[2]);
        }
        return strDec(data, secretKey, '', '');
      }
      return '';
    },
  },
};

export default algorithm;
