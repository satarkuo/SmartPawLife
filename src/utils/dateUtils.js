//日期時間顯示格式
const formatDate = (timestamp) => {
  //new Date(需放毫秒ms) -> 將timestamp秒 * 1000 轉變為毫秒ms
  const date = new Date(timestamp * 1000);
  // 取得 4 位數年份
  const year = date.getFullYear();
  // getMonth：取得月份 0~11 再 +1
  // padStart：補上 0 確保 2位數 顯示
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  // getDate：取得當月日期
  // padStart：補上 0 確保 2位數 顯示
  const day = date.getDate().toString().padStart(2, '0');
  // 取得時分秒（12 小時制，顯示上午/下午）
  const timeString = date.toLocaleTimeString('zh-TW', { hour12: false });
  return `${year}/${month}/${day} \n ${timeString}`;
};

export { formatDate };
